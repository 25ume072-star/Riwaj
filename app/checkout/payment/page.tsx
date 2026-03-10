"use client"

import { useEffect, useState } from "react"

export default function PaymentPage() {
  const [address, setAddress] = useState<any>(null)

  useEffect(() => {
    const savedAddress = localStorage.getItem("shipping_address")
    if (savedAddress) {
      setAddress(JSON.parse(savedAddress))
    }
  }, [])

  const handlePlaceOrder = async () => {
    try {
      const items = JSON.parse(localStorage.getItem("cart_items") || "[]")
      const total = localStorage.getItem("cart_total")

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          items,
          total,
          address
        })
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || "Order failed")
        return
      }

      alert("Order placed successfully 🎉")

    } catch (error) {
      console.error(error)
      alert("Something went wrong")
    }
  }

  if (!address) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-xl font-semibold">Loading address...</h1>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">

      <h1 className="text-2xl font-semibold">Payment</h1>

      <div className="border p-4 rounded-lg">
        <h2 className="font-medium mb-2">Shipping Address</h2>

        <p>{address.name}</p>
        <p>{address.phone}</p>
        <p>{address.street}</p>
        <p>{address.city}, {address.state}</p>
        <p>{address.pincode}</p>
      </div>

      <button
        onClick={handlePlaceOrder}
        className="w-full bg-black text-white py-3 rounded-lg"
      >
        Place Order
      </button>

    </div>
  )
}