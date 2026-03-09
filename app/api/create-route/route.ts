import { NextResponse } from "next/server"
import Razorpay from "razorpay"

export async function POST(req: Request) {

  try {

    const body = await req.json()
    const { amount } = body

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!
    })

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `order_${Date.now()}`
    })

    return NextResponse.json(order)

  } catch (error) {

    console.error("Razorpay order error:", error)

    return NextResponse.json(
      { error: "Order creation failed" },
      { status: 500 }
    )
  }

}