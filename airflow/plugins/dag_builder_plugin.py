"""
Plugin that adds a "Mozilla" entry to the top bar with some useful links.

Based on an example at
https://github.com/airflow-plugins/Getting-Started/blob/master/Tutorial/creating-ui-modification.md
"""
import json

from airflow.utils.log.logging_mixin import LoggingMixin
from flask import Response
from flask_appbuilder import BaseView as AppBuilderBaseView
from flask_appbuilder import expose
from airflow.security import permissions
from airflow.www import auth
from airflow.www.app import csrf
from airflow.plugins_manager import AirflowPlugin

from dag_builder.operators import OperatorDefinitionCatalog


RESOURCE_DAG_BUILDER = "Dag Builder"


class DagBuilder(AppBuilderBaseView):
    resource_name = "dag_builder"
    default_view = "status"
    csrf_exempt = False
    class_permission_name = RESOURCE_DAG_BUILDER
    base_permissions = ["can_list", "can_read", "can_edit", "can_create", "menu_access"]
    allow_browser_login = True

    def __init__(self):
        super().__init__()
        self.operator_catalog = OperatorDefinitionCatalog()

    @expose("/api/health", methods=["GET"])
    @csrf.exempt
    def status(self):
        response = Response(
            json.dumps({"DagBuilderPlugin": "version 0.1.0"}),
            status=200,
            mimetype="application/json"
        )
        return response

    @expose("/api/definitions", methods=["GET"])
    @auth.has_access([(permissions.ACTION_CAN_READ, RESOURCE_DAG_BUILDER)])
    @csrf.exempt
    def definitions(self):
        response = Response(
            json.dumps(self.operator_catalog.get_all_operators()),
            status=200,
            mimetype="application/json"
        )
        return response


class DagBuilderPlugin(LoggingMixin, AirflowPlugin):
    name = "Dag Builder"
    operators = []
    flask_blueprints = []
    hooks = []
    executors = []
    appbuilder_views = [{
        "name": "API",
        "view": DagBuilder(),
        "category": "Dag Builder",
    }]
    appbuilder_menu_items = []

    def __init__(self):
        super().__init__()
        self.operator_catalog = OperatorDefinitionCatalog()

    def on_load(self):
        self._load_operator_catalog()
        self._warmup_api()

    def _load_operator_catalog(self) -> None:
        """Initialize the OperatorDefinitionCatalog singleton and load all
        the operators available to this Airflow instance.
        """
        self.operator_catalog.load_all_operators()
        self.log.info("Loaded %s operators", len(self.operator_catalog))

    def _warmup_api(self) -> None:
        self.operator_catalog.get_all_operators()
