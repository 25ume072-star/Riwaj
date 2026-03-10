"use client"

import { useSearchParams } from "next/navigation"

export default function PaymentContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")

  return (
    <div>
      <h1>Payment</h1>
      <p>Order ID: {orderId}</p>
    </div>
  )
}