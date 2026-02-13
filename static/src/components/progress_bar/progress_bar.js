/** @odoo-module **/
import { Component } from "@odoo/owl";

export class WarehouseProgressBar extends Component {

    get barColorClass() {
        const percent = this.props.percentage || 0;
        if (this.props.color) return this.props.color; 
        
        if (percent > 80) return "bg-danger";  
        if (percent > 50) return "bg-warning"; 
        return "bg-success";                   
    }
}

WarehouseProgressBar.template = "owl.WarehouseProgressBar";
WarehouseProgressBar.props = {
    label: String,
    items: Number,
    percentage: Number,
    color: { type: String, optional: true },
};