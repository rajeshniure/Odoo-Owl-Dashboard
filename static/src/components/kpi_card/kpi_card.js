/** @odoo-module */

import { Component } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";

// Create a base class for shared logic
class BaseCard extends Component {
    setup() {
        this.action = useService("action");
    }

    onCardClick() {
        if (this.props.resModel) {
            this.action.doAction({
                type: "ir.actions.act_window",
                name: this.props.name,
                res_model: this.props.resModel,
                domain: this.props.domain || [],
                views: [[false, "list"], [false, "form"]],
                target: "current",
            });
        }
    }
}

// Just extend the base and assign the template
export class KpiCard extends BaseCard {}
KpiCard.template = "owl.KpiCard";

export class OverviewCard extends BaseCard {}
OverviewCard.template = "owl.OverviewCard";