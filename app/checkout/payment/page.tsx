"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CheckoutProgress } from "@/components/checkout-progress"
import { useCheckout } from "@/context/checkout-context"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import type { Address, Order, OrderItem } from "@/lib/database.types"

export default function PaymentPage() {
  const router = useRouter()
  const { address, setAddress } = useCheckout()
  const { items, totalPrice, clearCart, user } = useCart()
  const supabase = createClient()

  const [placing, setPlacing] = useState(false)

  useEffect(() => {
    if (!address) {
      router.replace("/checkout/address")
    }
  }, [address, router])

  const shipping = totalPrice >= 2999 ? 0 : 199
  const finalTotal = totalPrice + shipping

  const formatPrice = (price: number) =>
    price.toLocaleString("en-IN")

  const handlePlaceOrder = async () => {
    if (!address) {
      router.replace("/checkout/address")
      return
    }

    if (!user) {
      router.push("/login?redirect=/checkout/payment")
      return
    }

    if (items.length === 0) {
      router.push("/cart")
      return
    }

    setPlacing(true)

    try {
      const { data: addressRow, error: addressError } = await supabase
        .from("addresses")
        .insert({
          user_id: user.id,
          name: address.fullName,
          address_line1: address.street,
          address_line2: null,
          city: address.city,
          state: address.state,
          pincode: address.postalCode,
          phone: address.phone,
          is_default: false
        })
        .select()
        .single()

      if (addressError || !addressRow) {
        console.error(addressError)
        alert("Could not save address. Please try again.")
        setPlacing(false)
        return
      }

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          address_id: addressRow.id,
          subtotal: totalPrice,
          shipping,
          discount: 0,
          total: finalTotal,
          promo_code: null,
          payment_method: "cod",
          payment_status: "pending",
          status: "pending"
        })
        .select()
        .single()

      if (orderError || !order) {
        console.error(orderError)
        alert("Could not create order. Please try again.")
        setPlacing(false)
        return
      }

      const orderItems: Omit<OrderItem, "id" | "created_at">[] = items.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
        size: item.size ?? null,
        color: item.color ?? null
      }))

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems as any)

      if (itemsError) {
        console.error(itemsError)
        alert("Order created but items could not be saved. Please contact support.")
        setPlacing(false)
        return
      }

      await clearCart()
      setAddress(null)

      router.push(`/checkout/confirmation?orderId=${order.id}`)
    } catch (err) {
      console.error(err)
      alert("Something went wrong while placing your order.")
      setPlacing(false)
    }
  }

  if (!address) {
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <CheckoutProgress current="payment" />

        <h1 className="text-2xl md:text-3xl font-serif font-semibold mb-6">
          Payment
        </h1>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Shipping Address</h2>
            <div className="rounded-sm border bg-card p-4 text-sm space-y-1">
              <p className="font-medium">{address.fullName}</p>
              <p className="text-muted-foreground">{address.phone}</p>
              <p>{address.street}</p>
              <p>{address.city}, {address.state}</p>
              <p>{address.postalCode}, {address.country}</p>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => router.push("/checkout/address")}
            >
              Edit Address
            </Button>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <div className="rounded-sm border bg-card p-4 text-sm space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? "FREE" : `₹${formatPrice(shipping)}`}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <Button
              className="w-full mt-4"
              size="lg"
              disabled={placing}
              onClick={handlePlaceOrder}
            >
              {placing ? "Placing Order..." : "Place Order (Cash on Delivery)"}
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

