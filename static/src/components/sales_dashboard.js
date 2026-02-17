/** @odoo-module */

import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { KpiCard, OverviewCard } from "./kpi_card/kpi_card";
import { BarRenderer, ChartRenderer } from "./chart_renderer/chart_renderer";
import { WarehouseProgressBar } from "./progress_bar/progress_bar";
import { ReplenishmentTable } from "./Replenishment/table";
import { DashboardSidebar } from "./sidebar/sidebar";

const { Component, onWillStart, useState } = owl;

export class OwlSalesDashboard extends Component {
    setup() {
        this.orm = useService("orm");
        this.state = useState({
            kpiData: {}, // Start empty, will be populated by fetch
            period: 0,
        });

        onWillStart(() => this.fetchKpiData());
    }

    // Combined logic: handles period changes and initial load
    async fetchKpiData() {
        let dateLimit = null;
        const days = parseInt(this.state.period);

        if (days > 0) {
            dateLimit = luxon.DateTime.now().minus({ days }).toISODate();
        }

        try {
            this.state.kpiData = await this.orm.call("stock.warehouse", "get_kpi_stats", [], {
                date_limit: dateLimit,
            });
        } catch (error) {
            console.error("Dashboard Fetch Error:", error);
        }
    }

    // Triggered by the UI (e.g., a select dropdown)
    async onChangePeriod() {
        await this.fetchKpiData();
    }
}

OwlSalesDashboard.template = "owl.OwlSalesDashboard";
OwlSalesDashboard.components = {
    DashboardSidebar, KpiCard, OverviewCard, 
    ChartRenderer, BarRenderer, WarehouseProgressBar, ReplenishmentTable 
};

registry.category("actions").add("owl.sales_dashboard", OwlSalesDashboard);