import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface OrderItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  addons?: { id: string; label: string; price: number }[];
}

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  zipCode?: string;
}

const VALID_PROMOS = [
  { code: "SAVE10", discount: 10 },
  { code: "SAVE20", discount: 20 },
  { code: "WELCOME", discount: 15 },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Extract user ID from auth header if present
    let userId: string | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const anonClient = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        { global: { headers: { Authorization: authHeader } } }
      );
      const { data } = await anonClient.auth.getUser();
      if (data?.user) {
        userId = data.user.id;
      }
    }

    const {
      items,
      promoCode,
      deliveryMethod,
      paymentMethod,
      customerInfo,
      pickupPointName,
      pickupPointAddress,
    } = (await req.json()) as {
      items: OrderItem[];
      promoCode?: string;
      deliveryMethod: "pickup" | "home";
      paymentMethod: "card" | "cod" | "bank";
      customerInfo: CustomerInfo;
      pickupPointName?: string;
      pickupPointAddress?: string;
    };

    // Validate required fields
    if (
      !items?.length ||
      !customerInfo?.firstName ||
      !customerInfo?.lastName ||
      !customerInfo?.email ||
      !customerInfo?.phone
    ) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerInfo.email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate delivery method
    if (!["pickup", "home"].includes(deliveryMethod)) {
      return new Response(
        JSON.stringify({ error: "Invalid delivery method" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (deliveryMethod === "pickup" && !pickupPointName) {
      return new Response(
        JSON.stringify({ error: "Pickup point is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (deliveryMethod === "home" && (!customerInfo.address || !customerInfo.city || !customerInfo.zipCode)) {
      return new Response(
        JSON.stringify({ error: "Address is required for home delivery" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate payment method
    if (!["card", "cod", "bank"].includes(paymentMethod)) {
      return new Response(
        JSON.stringify({ error: "Invalid payment method" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate quantities
    for (const item of items) {
      if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 100) {
        return new Response(
          JSON.stringify({ error: `Invalid quantity for ${item.name}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Look up product prices from database
    const productIds = items.map((i) => i.id);
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, price, stock_quantity, name, is_active")
      .in("id", productIds);

    if (productsError || !products) {
      return new Response(
        JSON.stringify({ error: "Failed to validate products" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate all products exist and are active
    for (const item of items) {
      const dbProduct = products.find((p: any) => p.id === item.id);
      if (!dbProduct) {
        return new Response(
          JSON.stringify({ error: `Product not found: ${item.name}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (!dbProduct.is_active) {
        return new Response(
          JSON.stringify({ error: `Product is no longer available: ${dbProduct.name}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (dbProduct.stock_quantity < item.quantity) {
        return new Response(
          JSON.stringify({ error: `Insufficient stock for ${dbProduct.name}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Calculate subtotal from DB prices (not client prices)
    let subtotal = 0;
    for (const item of items) {
      const dbProduct = products.find((p: any) => p.id === item.id)!;
      const addonsTotal = (item.addons || []).reduce((sum, a) => sum + a.price, 0);
      subtotal += (dbProduct.price + addonsTotal) * item.quantity;
    }

    // Validate promo code server-side
    let discountAmount = 0;
    let validPromoCode: string | null = null;
    if (promoCode) {
      const found = VALID_PROMOS.find(
        (p) => p.code.toLowerCase() === promoCode.trim().toLowerCase()
      );
      if (found) {
        discountAmount = subtotal * (found.discount / 100);
        validPromoCode = found.code;
      }
      // Silently ignore invalid promo codes
    }

    const finalPrice = subtotal - discountAmount;

    // Calculate shipping server-side
    const shippingBase = deliveryMethod === "pickup" ? 2 : 6;
    const freeThreshold = deliveryMethod === "pickup" ? 40 : 80;
    const shipping = finalPrice >= freeThreshold ? 0 : shippingBase;

    // Calculate fees
    const codFee = paymentMethod === "cod" ? 1 : 0;
    const tax = finalPrice * 0.08;
    const orderTotal = finalPrice + shipping + tax + codFee;

    // Generate order number
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;

    // Insert order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        first_name: customerInfo.firstName.trim().substring(0, 100),
        last_name: customerInfo.lastName.trim().substring(0, 100),
        email: customerInfo.email.trim().substring(0, 255),
        phone: customerInfo.phone.trim().substring(0, 30),
        delivery_method: deliveryMethod,
        pickup_point_name: pickupPointName || null,
        pickup_point_address: pickupPointAddress || null,
        address: customerInfo.address?.trim().substring(0, 255) || null,
        city: customerInfo.city?.trim().substring(0, 100) || null,
        zip_code: customerInfo.zipCode?.trim().substring(0, 20) || null,
        payment_method: paymentMethod,
        subtotal,
        discount_amount: discountAmount,
        promo_code: validPromoCode,
        shipping_cost: shipping,
        cod_fee: codFee,
        tax,
        total: orderTotal,
        status: "pending",
        user_id: userId,
      })
      .select("id")
      .single();

    if (orderError) {
      console.error("Order insert error:", orderError);
      return new Response(
        JSON.stringify({ error: "Failed to create order" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert order items with DB-validated prices
    const orderItems = items.map((item) => {
      const dbProduct = products.find((p: any) => p.id === item.id)!;
      return {
        order_id: order.id,
        product_name: item.name.substring(0, 255),
        product_image: item.image || null,
        quantity: item.quantity,
        price: dbProduct.price,
        addons: item.addons || [],
      };
    });

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Order items insert error:", itemsError);
      // Clean up the order
      await supabase.from("orders").delete().eq("id", order.id);
      return new Response(
        JSON.stringify({ error: "Failed to create order items" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Decrement stock
    for (const item of items) {
      const dbProduct = products.find((p: any) => p.id === item.id)!;
      await supabase
        .from("products")
        .update({ stock_quantity: dbProduct.stock_quantity - item.quantity })
        .eq("id", item.id);
    }

    return new Response(
      JSON.stringify({ success: true, orderNumber }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
