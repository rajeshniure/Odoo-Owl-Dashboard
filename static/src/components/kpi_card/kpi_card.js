/** @odoo-module */

const { Component } = owl;
import { useService } from "@web/core/utils/hooks";

export class KpiCard extends Component {
setup() {
        this.action = useService("action");
    }

    onKpiClick() {
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
KpiCard.template = "owl.KpiCard";

export class OverviewCard extends Component {
setup() {
        this.action = useService("action");
    }

    onOverviewClick() {
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
OverviewCard.template = "owl.OverviewCard";
