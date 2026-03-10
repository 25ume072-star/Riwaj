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

      <div className="container mx-auto px-4 py-12 max-w-2xl text-center space-y-6">
        <CheckoutProgress current="confirmation" />

        <h1 className="text-3xl md:text-4xl font-serif font-semibold">
          Thank You for Your Order 🎉
        </h1>

        <p className="text-muted-foreground">
          Your order has been placed successfully. We'll send you an email with the details shortly.
        </p>

        {orderId ? (
          <p className="text-sm text-muted-foreground">
            Order ID: <span className="font-mono">{orderId}</span>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Processing your order details...
          </p>
        )}

        <div className="flex justify-center gap-4 pt-4">
          <Link href="/orders">
            <Button variant="outline">
              View Orders
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
    <Suspense fallback={<div className="p-10 text-center">Loading order confirmation...</div>}>
      <ConfirmationContent />
    </Suspense>
  )
}