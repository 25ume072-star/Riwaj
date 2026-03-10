"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

export default function ConfirmationPage() {

  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = createClient()

  const orderId = searchParams.get("orderId")

  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const formatPrice = (price: number) =>
    price?.toLocaleString("en-IN")

  useEffect(() => {

    const fetchOrder = async () => {

      if (!orderId) {
        router.push("/")
        return
      }

      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            *,
            products (
              name,
              price,
              images
            )
          )
        `)
        .eq("id", orderId)
        .single()

      if (error) {
        console.error(error)
        setError("Unable to load order details.")
        setLoading(false)
        return
      }

      setOrder(data)
      setLoading(false)

    }

    fetchOrder()

  }, [orderId, router, supabase])

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-lg">Loading your order...</p>
      </main>
    )
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg font-semibold">Order not found</p>
          <Button onClick={() => router.push("/")}>
            Go to Home
          </Button>
        </div>
      </main>
    )
  }

  return (

    <main className="min-h-screen bg-background">

      <Navbar />

      <div className="container mx-auto px-4 py-12 max-w-4xl">

        <div className="text-center mb-10">

          <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-3">
            🎉 Order Confirmed
          </h1>

          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been successfully placed.
          </p>

        </div>

        {/* Order Info */}

        <div className="border rounded-md p-6 mb-8 space-y-2 text-sm">

          <div className="flex justify-between">
            <span className="text-muted-foreground">Order ID</span>
            <span className="font-medium">{order.id}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Order Status</span>
            <span className="font-medium capitalize">{order.status}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Payment Status</span>
            <span className="font-medium capitalize">{order.payment_status}</span>
          </div>

        </div>

        {/* Order Items */}

        <div className="border rounded-md p-6 mb-8">

          <h2 className="text-lg font-semibold mb-4">
            Items in your order
          </h2>

          <div className="space-y-4">

            {order.order_items?.map((item: any) => {

              const product = item.products

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 border-b pb-4"
                >

                  {product?.images?.[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}

                  <div className="flex-1">

                    <p className="font-medium">
                      {product?.name}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity}
                    </p>

                    {item.size && (
                      <p className="text-sm text-muted-foreground">
                        Size: {item.size}
                      </p>
                    )}

                  </div>

                  <div className="font-medium">
                    ₹{formatPrice(item.price * item.quantity)}
                  </div>

                </div>
              )

            })}

          </div>

        </div>

        {/* Order Total */}

        <div className="border rounded-md p-6 mb-10 space-y-3 text-sm">

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{formatPrice(order.subtotal)}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>
              {order.shipping === 0
                ? "FREE"
                : `₹${formatPrice(order.shipping)}`}
            </span>
          </div>

          <div className="border-t pt-3 flex justify-between font-semibold text-base">
            <span>Total Paid</span>
            <span>₹{formatPrice(order.total)}</span>
          </div>

        </div>

        {/* Buttons */}

        <div className="flex gap-4 justify-center flex-wrap">

          <Button
            onClick={() => router.push("/")}
          >
            Continue Shopping
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push("/account/orders")}
          >
            View My Orders
          </Button>

        </div>

      </div>

      <Footer />

    </main>

  )

}