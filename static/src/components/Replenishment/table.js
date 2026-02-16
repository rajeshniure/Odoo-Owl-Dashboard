/** @odoo-module **/
import { Component, useState, onWillStart } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

export class ReplenishmentTable extends Component {
  setup() {
    this.orm = useService("orm");
    this.action = useService("action");
    
    // Initialize state with an empty array
    this.state = useState({
      items: [],
    });

    onWillStart(async () => {
      await this.fetchReplenishmentData();
    });
  }

  async fetchReplenishmentData() {
    try {
      const data = await this.orm.call(
        "stock.warehouse",
        "get_replenishment_data",
        []
      );
      this.state.items = data;
    } catch (error) {
      console.error("Replenishment fetch failed", error);
    }
  }

  _onOrder(item) {
    // Redirect user to the actual Reordering Rule form to confirm the order
    this.action.doAction({
        type: "ir.actions.act_window",
        res_model: "stock.warehouse.orderpoint",
        res_id: item.id,
        views: [[false, "form"]],
        target: "new",
    });
  }
}

ReplenishmentTable.template = "owl.ReplenishmentTable";