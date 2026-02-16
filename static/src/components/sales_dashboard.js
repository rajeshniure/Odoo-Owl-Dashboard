/** @odoo-module */

import { registry } from "@web/core/registry";
import { KpiCard } from "./kpi_card/kpi_card";
import { OverviewCard } from "./kpi_card/kpi_card";
import { BarRenderer, ChartRenderer } from "./chart_renderer/chart_renderer";
import { WarehouseProgressBar } from "./progress_bar/progress_bar";
import { loadJS } from "@web/core/assets";
import { ReplenishmentTable } from "./Replenishment/table";
import { DashboardSidebar } from "./sidebar/sidebar";
const { Component, onWillStart, useRef, onMounted, useState } = owl;
import { useService } from "@web/core/utils/hooks";
const { DateTime } = luxon;
export class OwlSalesDashboard extends Component {
  setup() {
    this.orm = useService("orm");
    this.state = useState({
      kpiData: {
        stock_on_hand: 0,
        incoming: 0,
        outgoing: 0,
        stock_value: 0,
        forecasted_stock: 0,
        low_stock_count: 0,
        receipts: 0,
        deliveries: 0,
        internal_transfers: 0,
        backorders: 0,
      },
      period: 0,
    });

    onWillStart(async () => {
      await this.fetchKpiData();
    });
  }

    async onChangePeriod() {
    // 1. Calculate the start date based on the selected period
        const days = parseInt(this.state.period);
        let dateLimit = null;
        
        if (days > 0) {
          dateLimit = luxon.DateTime.now().minus({ days: days }).toISODate();
        }

        // 2. Fetch data again with the new date filter
        await this.fetchKpiData(dateLimit);
      }

  async fetchKpiData(dateLimit = null) {
    try {
      // Use this.orm.call(model, method, args, kwargs)
      // Since it's @api.model, the first arg in the array should be empty []
      // because we aren't calling it on specific record IDs.
      const data = await this.orm.call(
        "stock.warehouse",
        "get_kpi_stats",
        [], 
        {date_limit: dateLimit},
      );

      if (data) {
        this.state.kpiData = data;
      }
    } catch (error) {
      console.error("Failed to fetch KPI data", error);
    }
  }
}

OwlSalesDashboard.template = "owl.OwlSalesDashboard";
OwlSalesDashboard.components = {
  DashboardSidebar,
  KpiCard,
  OverviewCard,
  ChartRenderer,
  BarRenderer,
  WarehouseProgressBar,
  ReplenishmentTable,
};

registry.category("actions").add("owl.sales_dashboard", OwlSalesDashboard);
