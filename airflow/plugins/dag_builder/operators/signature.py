import inspect
from inspect import Parameter
from functools import cached_property, cache
from typing import Any, List, Dict, Iterable, Optional, Tuple

try:
    from docstring_parser import parse, DocstringParam
    HAS_DOCSTRING_PARSER = True
except ImportError:
    parse = None
    DocstringParam = None
    HAS_DOCSTRING_PARSER = False


class ParameterSignature:

    def __init__(self, parameter: Parameter):
        self.parameter = parameter

    @property
    def is_optional(self) -> bool:
        return self.default is not None

    @property
    def name(self) -> Optional[str]:
        if self.parameter.name == Parameter.empty:
            return None
        return self.parameter.name

    @property
    def default(self) -> Optional[str]:
        if self.parameter.default == Parameter.empty:
            return None
        return str(self.parameter.default)

    @property
    def annotation(self) -> Optional[str]:
        if self.parameter.annotation == Parameter.empty:
            return None
        return str(self.parameter.annotation)

    def get_signature(self) -> dict:
        return {
            "name": self.name,
            "type": self.annotation,
            "is_optional": self.is_optional,
            "default": self.default
        }


class ParameterDocstring:

    def __init__(self, parameter: DocstringParam):
        self.parameter = parameter

    @property
    def name(self) -> str:
        return self.parameter.arg_name

    @property
    def description(self) -> str:
        return self.parameter.description

    def get_docstring(self) -> dict:
        return {
            "name": self.name,
            "description": self.description
        }


class OperatorDefinition:
    EXCLUDED_PARAMS = ["kwargs"]

    def __init__(
            self,
            operator_class: type,
            child_classes_names: List[str] = None
    ):
        self._operator_class = operator_class
        self._child_classes_names = child_classes_names

    @cached_property
    def raw_parameters(self) -> List[dict]:
        return list(self._create_parameters_definition())

    def _create_parameters_definition(self) -> Iterable[dict]:
        for param_name, signature in self._get_parameters_signature().items():
            if param_name not in self.EXCLUDED_PARAMS:
                yield {
                    **signature,
                    **self._get_parameters_docstring().get(param_name, {})
                }

    def _get_parameters_signature(self) -> Dict[str, dict]:
        raw_signature = inspect.signature(self._operator_class)
        return {
            key: ParameterSignature(parameter=value).get_signature()
            for key, value in raw_signature.parameters.items()
        }

    def _get_parameters_docstring(self) -> Dict[str, dict]:
        if HAS_DOCSTRING_PARSER:
            raw_docstring = parse(self._operator_class.__doc__)
            return {
                entry.arg_name: ParameterDocstring(parameter=entry).get_docstring()
                for entry in raw_docstring.params
            }
        return {}

    @cached_property
    def ordered_parameters(self) -> Tuple[dict, dict]:
        return self._create_ordered_required_optional_definition()

    def _create_ordered_required_optional_definition(self) -> Tuple[dict, dict]:
        required_params = {}
        optional_params = {}

        for parameter in self.raw_parameters:
            if parameter["is_optional"]:
                optional_params[parameter["name"]] = parameter
            else:
                required_params[parameter["name"]] = parameter

        return required_params, optional_params

    @cache
    def get_definition(self, ordered: bool = True, with_children: bool = True) -> Dict[str, Any]:
        definition = {
            "label": self._operator_class.__name__,
            "parameters": [self.ordered_parameters if ordered else self.raw_parameters],
            "children": self._child_classes_names
        }

        if with_children:
            definition["children"] = self._child_classes_names
        return definition
