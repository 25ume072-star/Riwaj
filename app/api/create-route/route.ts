import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {

    const supabase = await createClient()
    const body = await req.json()

    const { items, total, shipping } = body

    /* VALIDATION */

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      )
    }

    /* GET USER */

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    /* CREATE ORDER */

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        subtotal: total,
        shipping: shipping,
        total: total + shipping,
        status: "pending"
      })
      .select()
      .single()

    if (orderError || !order) {
      console.error("Order creation error:", orderError)
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      )
    }

    /* CREATE ORDER ITEMS */

    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.productId,   // MUST be UUID from products table
      quantity: item.quantity,
      price: item.price,
      size: item.size || null,
      color: item.color || null
    }))

    const { error: itemError } = await supabase
      .from("order_items")
      .insert(orderItems)

    if (itemError) {
      console.error("Order items error:", itemError)

      return NextResponse.json(
        { error: "Failed to create order items" },
        { status: 500 }
      )
    }

    /* SUCCESS */

    return NextResponse.json({
      success: true,
      orderId: order.id
    })

  } catch (err) {
    console.error("Checkout error:", err)

    return NextResponse.json(
      { error: "Checkout failed" },
      { status: 500 }
    )
  }
}