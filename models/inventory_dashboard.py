from odoo import models, api


class StockWarehouse(models.Model):
    _inherit = "stock.warehouse"

    @api.model
    def get_kpi_stats(self, date_limit=None):
        # 1. Setup Domains
        move_dom = [("state", "in", ("waiting", "confirmed", "assigned"))]
        if date_limit:
            move_dom.append(("date", ">=", date_limit))

        # 2. Get Stock Quants & Value
        quants = self.env["stock.quant"].search(
            [("location_id.usage", "=", "internal")]
        )
        on_hand = sum(quants.mapped("quantity"))
        value = sum(q.quantity * q.product_id.standard_price for q in quants)

        # 3. Get All Move Types in ONE query (Optimized)
        groups = self.env["stock.move"].read_group(
            move_dom, ["product_uom_qty", "picking_code"], ["picking_code"]
        )
        counts = {
            g["picking_code"]: g["product_uom_qty"] for g in groups if g["picking_code"]
        }

        # Get specific move quantities
        in_qty, out_qty, int_qty = (
            counts.get("incoming", 0),
            counts.get("outgoing", 0),
            counts.get("internal", 0),
        )

        # Backorders still need a separate search due to the picking_id join
        back_qty = sum(
            self.env["stock.move"]
            .search(move_dom + [("picking_id.backorder_id", "!=", False)])
            .mapped("product_uom_qty")
        )

        return {
            "stock_on_hand": on_hand,
            "incoming": in_qty,
            "outgoing": out_qty,
            "internal_transfers": int_qty,
            "backorders": back_qty,
            "receipts": in_qty,  # Kept for your data requirements
            "deliveries": out_qty,  # Kept for your data requirements
            "forecasted_stock": on_hand + in_qty - out_qty,
            "stock_value": f"{value / 1000:.1f}K" if value >= 1000 else f"{value:.2f}",
            "low_stock_count": self.env["product.product"].search_count(
                [("qty_available", "<", 50)]
            ),
        }

    @api.model
    def get_replenishment_data(self):
        # Check for orderpoints first
        ops = self.env["stock.warehouse.orderpoint"].search(
            [("qty_to_order", ">", 0)], limit=10
        )

        if ops:
            return [
                {
                    "id": op.id,
                    "product": op.product_id.display_name,
                    "stock": op.qty_on_hand,
                    "min": op.product_min_qty,
                    "qty": f"+{op.qty_to_order}",
                    "vendor": (
                        op.product_id.seller_ids[0].partner_id.name
                        if op.product_id.seller_ids
                        else "No Vendor"
                    ),
                }
                for op in ops
            ]

        # Fallback to low stock consumables
        low_prods = self.env["product.product"].search(
            [("type", "=", "consu"), ("qty_available", "<", 10)], limit=5
        )
        return [
            {
                "id": p.id,
                "product": p.display_name,
                "stock": p.qty_available,
                "min": 10,
                "qty": "+25",
                "vendor": "Manual Check Required",
            }
            for p in low_prods
        ]
