import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {

  try {

    const supabase = await createClient()
    const body = await req.json()

    const { items, total, shipping } = body

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
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

    if (orderError) {
      console.error(orderError)
      return NextResponse.json({ error: orderError.message })
    }

    /* CREATE ORDER ITEMS */

    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.productId,   // IMPORTANT (UUID)
      quantity: item.quantity,
      price: item.price,
      size: item.size || null,
      color: item.color || null
    }))

    const { error: itemError } = await supabase
      .from("order_items")
      .insert(orderItems)

    if (itemError) {
      console.error(itemError)
      return NextResponse.json({ error: itemError.message })
    }

    return NextResponse.json({
      success: true,
      orderId: order.id
    })

  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Checkout failed" })
  }

}