/** @odoo-module */

import { registry } from "@web/core/registry"
import { KpiCard } from "./kpi_card/kpi_card"
import { OverviewCard } from "./kpi_card/kpi_card"
import { BarRenderer, ChartRenderer } from "./chart_renderer/chart_renderer"
import { WarehouseProgressBar } from "./progress_bar/progress_bar"
import { loadJS } from "@web/core/assets"
import { ReplenishmentTable } from "./Replenishment/table"
import { DashboardSidebar } from "./sidebar/sidebar"
const { Component, onWillStart, useRef, onMounted } = owl

export class OwlSalesDashboard extends Component {
    setup(){

    }
}

OwlSalesDashboard.template = "owl.OwlSalesDashboard"
OwlSalesDashboard.components = { DashboardSidebar, KpiCard, OverviewCard, ChartRenderer, BarRenderer, WarehouseProgressBar,ReplenishmentTable }

registry.category("actions").add("owl.sales_dashboard", OwlSalesDashboard)