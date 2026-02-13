/** @odoo-module **/
import { Component } from "@odoo/owl";

export class ReplenishmentTable extends Component {
    setup() {
        // Example data structure matching your image
        this.items = [
            { id: 1, product: "Office Chair Model X", stock: 12, min: 20, qty: "+50", vendor: "ChairsRus Inc." },
            { id: 2, product: "Ergo Mouse Pad", stock: 5, min: 50, qty: "+100", vendor: "TechSupply Co." },
            { id: 3, product: "Monitor Stand", stock: 0, min: 15, qty: "+30", vendor: "Office Depot" },
            { id: 4, product: "USB-C Cable 6ft", stock: 24, min: 100, qty: "+200", vendor: "CableMasters" },
        ];
    }

    _onOrder(item) {
        console.log("Ordering for:", item.product);
        // Logic to trigger Odoo action or RPC call goes here
    }
}

ReplenishmentTable.template = "owl.ReplenishmentTable";