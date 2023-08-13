import importlib
import inspect
from functools import cache
from types import ModuleType
from typing import List, Optional, Iterable

from airflow.providers_manager import ProvidersManager
from airflow.utils.log.logging_mixin import LoggingMixin
from airflow.utils.singleton import Singleton
from airflow.exceptions import AirflowOptionalProviderFeatureException

from dag_builder.operators.signature import OperatorDefinition


class OperatorDefinitionCatalog(LoggingMixin, metaclass=Singleton):
    _provider_manager = ProvidersManager()
    EXCLUDED_CLASSES = ("object", "AbstractOperator", "Templater", "LoggingMixin")

    def __init__(self):
        super().__init__()
        self._has_loaded: bool = False
        self._definitions: dict[str, OperatorDefinition] = {}

    @cache
    def __len__(self) -> int:
        return len(self._definitions)

    @cache
    def get_all_operators(self, include_children: bool = True) -> List[dict]:
        if include_children:
            return list(self._build_all_operators_definition_with_children())
        return self._build_all_operators_definition()

    def _build_all_operators_definition(self) -> List[dict]:
        return [
            definition.get_definition()
            for definition in self._definitions.values()
        ]

    def _build_all_operators_definition_with_children(self) -> Iterable[dict]:
        for operator in self._definitions.values():
            operator_definition = operator.get_definition()

            for child_operator_name in operator_definition['children']:
                if child_operator := self._definitions.get(child_operator_name):
                    operator_definition['parameters'].append(child_operator.ordered_parameters)
            yield operator_definition

    def add_operator(self, operator_class: type) -> None:
        operator_name: str = operator_class.__name__

        if (
                operator_name not in self.EXCLUDED_CLASSES and
                operator_name not in self._definitions.keys()
        ):
            child_classes = self._get_operator_child_classes(operator_class)
            self._definitions[operator_name] = OperatorDefinition(
                operator_class=operator_class,
                child_classes_names=[class_.__name__ for class_ in child_classes]
            )
            self.log.debug(f"Added operator '{operator_name}' to catalog")

            if child_classes:
                self.add_operator(child_classes[0])

    @staticmethod
    def _get_operator_child_classes(operator_class) -> List[type]:
        return list(operator_class.__bases__)

    def load_all_operators(self) -> None:
        if self._has_loaded:
            return

        for provider in self._provider_manager.providers.values():
            for operators in provider.data.get("operators", {}):
                for module_name in operators['python-modules']:

                    if module := self._import_provider_module(module_name):
                        for class_name, object_ in inspect.getmembers(module):
                            if inspect.isclass(object_) and class_name.endswith("Operator"):
                                self.add_operator(object_)
        self._has_loaded = True

    def _import_provider_module(self, module_name: str) -> Optional[ModuleType]:
        try:
            return importlib.import_module(module_name)
        except (ModuleNotFoundError, AirflowOptionalProviderFeatureException) as _:
            self.log.warning(
                f"Failed to import '{module_name}'. Related operator will be "
                f"skipped."
            )
