-- Remove public INSERT policies on orders and order_items
-- The edge function uses the service role key so it bypasses RLS
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can create order items" ON public.order_items;

-- Add database constraints for price validation
ALTER TABLE public.orders ADD CONSTRAINT orders_total_non_negative CHECK (total >= 0);
ALTER TABLE public.orders ADD CONSTRAINT orders_subtotal_non_negative CHECK (subtotal >= 0);
ALTER TABLE public.orders ADD CONSTRAINT orders_discount_valid CHECK (discount_amount >= 0 AND discount_amount <= subtotal);
ALTER TABLE public.orders ADD CONSTRAINT orders_shipping_non_negative CHECK (shipping_cost >= 0);
ALTER TABLE public.orders ADD CONSTRAINT orders_tax_non_negative CHECK (tax >= 0);

-- Add stock non-negative constraint
ALTER TABLE public.products ADD CONSTRAINT products_stock_non_negative CHECK (stock_quantity >= 0);