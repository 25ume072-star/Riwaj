"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CheckoutProgress } from "@/components/checkout-progress"
import { Button } from "@/components/ui/button"

function ConfirmationContent() {

  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")

  return (

    <main className="min-h-screen bg-background">

      <Navbar />

      <div className="container mx-auto px-4 py-12 max-w-2xl">

        <CheckoutProgress current="confirmation" />

        <div className="text-center space-y-4 mt-8">

          <h1 className="text-3xl md:text-4xl font-serif font-semibold">
            🎉 Order Confirmed
          </h1>

          <p className="text-muted-foreground max-w-md mx-auto">
            Thank you for shopping with us. Your order has been placed successfully and is now being processed.
          </p>

        </div>

        {/* Order Card */}

        <div className="mt-8 border rounded-lg p-6 bg-card shadow-sm">

          {orderId ? (

            <div className="space-y-4 text-center">

              <p className="text-sm text-muted-foreground">
                Order ID
              </p>

              <p className="font-mono text-lg font-semibold">
                {orderId}
              </p>

              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                Payment Successful
              </div>

              <p className="text-sm text-muted-foreground pt-2">
                You will receive order updates via email.
              </p>

            </div>

          ) : (

            <div className="text-center space-y-2">

              <p className="text-muted-foreground">
                Processing your order details...
              </p>

            </div>

          )}

        </div>

        {/* Actions */}

        <div className="flex justify-center gap-4 pt-8 flex-wrap">

          <Link href="/orders">
            <Button variant="outline">
              View My Orders
            </Button>
          </Link>

          <Link href="/products">
            <Button>
              Continue Shopping
            </Button>
          </Link>

        </div>

      </div>

      <Footer />

    </main>

  )

}

export default function ConfirmationPage() {

  return (

    <Suspense
      fallback={
        <main className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground text-lg">
            Loading order confirmation...
          </p>
        </main>
      }
    >

      <ConfirmationContent />

    </Suspense>

  )

}