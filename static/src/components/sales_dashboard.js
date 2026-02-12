/** @odoo-module */

import { registry } from "@web/core/registry"
import { KpiCard } from "./kpi_card/kpi_card"
import { OverviewCard } from "./kpi_card/kpi_card"
import { BarRenderer, ChartRenderer } from "./chart_renderer/chart_renderer"
import { loadJS } from "@web/core/assets"
const { Component, onWillStart, useRef, onMounted } = owl

export class OwlSalesDashboard extends Component {
    setup(){

    }
}

OwlSalesDashboard.template = "owl.OwlSalesDashboard"
OwlSalesDashboard.components = { KpiCard, OverviewCard, ChartRenderer, BarRenderer }

registry.category("actions").add("owl.sales_dashboard", OwlSalesDashboard)