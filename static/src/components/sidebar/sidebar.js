/** @odoo-module **/
import { Component, useState } from "@odoo/owl";

export class DashboardSidebar extends Component {
    setup() {
        this.state = useState({
            activeMenu: 'Dashboard'
        });

        this.menuItems = [
            { id: 'dashboard', label: 'Dashboard', icon: 'fa-th-large' },
            { id: 'products', label: 'Products', icon: 'fa-cube' },
            { id: 'warehouses', label: 'Warehouses', icon: 'fa-building' },
            { id: 'operations', label: 'Operations', icon: 'fa-exchange' },
            { id: 'replenishment', label: 'Replenishment', icon: 'fa-refresh' },
            { id: 'barcode', label: 'Barcode', icon: 'fa-barcode' },
            { id: 'reporting', label: 'Reporting', icon: 'fa-bar-chart' },
            { id: 'configuration', label: 'Configuration', icon: 'fa-cog' },
        ];
    }

    _onMenuClick(menu) {
        this.state.activeMenu = menu.label;
        // Logic for navigation or triggering parent events goes here
    }
}

DashboardSidebar.template = "owl.DashboardSidebar";