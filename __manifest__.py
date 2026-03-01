# -*- coding: utf-8 -*-
{
    "name": "Inventory Dashboard",
    "version": "1.0",
    "summary": "Custom Inventory Dashboard using OWL",
    "sequence": -5,
    "description": """Custom Inventory Dashboard using OWL""",
    "category": "OWL",
    "depends": ["base", "web", "stock"],
    "data": [
        "views/inventory_dashboard.xml",
    ],
    "demo": [],
    "installable": True,
    "application": True,
    "assets": {
        "web.assets_backend": [
            "odoo_custom_dashboard/static/src/components/**/*.js",
            "odoo_custom_dashboard/static/src/components/**/*.xml",
            "odoo_custom_dashboard/static/src/components/**/*.scss",
        ],
    },
}
