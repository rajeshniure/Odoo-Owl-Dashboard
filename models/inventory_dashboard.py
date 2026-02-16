from odoo import models, api

class StockWarehouse(models.Model):
    _inherit = "stock.warehouse"

    @api.model
    def get_kpi_stats(self, date_limit=None):
        # Base domain for pending moves
        # We use 'date' or 'scheduled_date' for filtering the period
        flow_domain = [("state", "in", ("waiting", "confirmed", "assigned"))]
        if date_limit:
            flow_domain.append(("date", ">=", date_limit))

        # 1. Stock On Hand (Current state - usually not filtered by date)
        stock_quants = self.env["stock.quant"].search(
            [("location_id.usage", "=", "internal")]
        )
        total_on_hand = sum(stock_quants.mapped("quantity"))

        # 2. Incoming Moves
        incoming = self.env["stock.move"].search(
            flow_domain + [("picking_code", "=", "incoming")]
        )
        receipts_qty = sum(incoming.mapped("product_uom_qty"))

        # 3. Outgoing Moves
        outgoing = self.env["stock.move"].search(
            flow_domain + [("picking_code", "=", "outgoing")]
        )
        deliveries_qty = sum(outgoing.mapped("product_uom_qty"))

        # 4. Internal Transfers
        internal_transfers = self.env["stock.move"].search(
            flow_domain + [("picking_code", "=", "internal")]
        )
        internal_transfers_qty = sum(internal_transfers.mapped("product_uom_qty"))

        # 5. Backorders 
        # Fix: Search through picking_id to find the backorder reference
        backorders = self.env["stock.move"].search(
            flow_domain + [("picking_id.backorder_id", "!=", False)]
        )
        backorders_qty = sum(backorders.mapped("product_uom_qty"))

        # 6. Stock Value
        total_value = sum(
            q.quantity * q.product_id.standard_price for q in stock_quants
        )

        return {
            "stock_on_hand": total_on_hand,
            "incoming": receipts_qty,
            "outgoing": deliveries_qty,
            "stock_value": (
                f"{total_value / 1000:.1f}K" if total_value >= 1000 else f"{total_value:.2f}"
            ),
            "forecasted_stock": total_on_hand + receipts_qty - deliveries_qty,
            "low_stock_count": self.env["product.product"].search_count(
                [("qty_available", "<", 50)]
            ),
            "receipts": receipts_qty,
            "deliveries": deliveries_qty,
            "internal_transfers": internal_transfers_qty,
            "backorders": backorders_qty,
        }

    
    @api.model
    def get_replenishment_data(self):
        orderpoints = self.env['stock.warehouse.orderpoint'].search([
            ('qty_to_order', '>', 0)
        ], limit=10)

        res = []
        if orderpoints:
            for op in orderpoints:
                vendor = op.product_id.seller_ids[0].partner_id.name if op.product_id.seller_ids else "No Vendor"
                res.append({
                    "id": op.id,
                    "product": op.product_id.display_name,
                    "stock": op.qty_on_hand,
                    "min": op.product_min_qty,
                    "qty": f"+{op.qty_to_order}",
                    "vendor": vendor,
                })
        else:
            # FALLBACK: If no orderpoints are found, let's find products with low stock 
            # specifically to see if the table works
            low_stock_products = self.env['product.product'].search([
                ('type', '=', 'consu'), # or 'product' for storable
                ('qty_available', '<', 10)
            ], limit=5)

            for product in low_stock_products:
                res.append({
                    "id": 0,
                    "product": product.display_name,
                    "stock": product.qty_available,
                    "min": 10,
                    "qty": "+25",
                    "vendor": "Manual Check Required",
                })
                
        return res