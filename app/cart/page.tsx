"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  ChevronRight,
  Truck,
  Shield,
  Tag
} from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { createClient } from "@/lib/supabase/client"
import type { Order, OrderItem } from "@/lib/database.types"

export default function CartPage() {

  const { items, removeItem, updateQuantity, totalItems, totalPrice, clearCart, isLoading, user } = useCart()

  const [promoCode, setPromoCode] = useState("")
  const [checkingOut, setCheckingOut] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  const shipping = totalPrice >= 2999 ? 0 : 199
  const finalTotal = totalPrice + shipping

  const formatPrice = (price:number)=>{
    return price.toLocaleString("en-IN")
  }

  const handleCheckout = async () => {

    if(items.length === 0) return

    if(!user){
      router.push("/login?redirect=/cart")
      return
    }

    setCheckingOut(true)

    try{

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          subtotal: totalPrice,
          shipping,
          discount: 0,
          total: finalTotal,
          promo_code: promoCode || null,
          payment_method: "cod",
          payment_status: "pending",
          status: "pending"
        })
        .select()
        .single()

      if(orderError || !order){
        console.error(orderError)
        alert("Could not create order. Please try again.")
        setCheckingOut(false)
        return
      }

      const orderItems: Omit<OrderItem,"id" | "created_at">[] = items.map(item=>({
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

      if(itemsError){
        console.error(itemsError)
        alert("Order created but items could not be saved. Please contact support.")
        setCheckingOut(false)
        return
      }

      await clearCart()

      alert("Order placed successfully!")
      router.push("/")

    }catch(err){
      console.error(err)
      alert("Something went wrong while placing your order.")
    }

    setCheckingOut(false)

  }


  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Spinner className="h-8 w-8 text-primary" />
        </div>
        <Footer />
      </main>
    )
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>

            <h1 className="text-2xl font-serif font-semibold text-foreground mb-4">
              Your Cart is Empty
            </h1>

            <p className="text-muted-foreground mb-8">
              Looks like you haven’t added anything yet.
            </p>

            <Link href="/products">
              <Button size="lg" className="gap-2">
                Continue Shopping
                <ArrowRight className="h-4 w-4"/>
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    )
  }


  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/">Home</Link>
          <ChevronRight className="h-4 w-4"/>
          <span className="text-foreground">Cart</span>
        </nav>
      </div>


      <div className="container mx-auto px-4 py-8">

        <h1 className="text-2xl md:text-3xl font-serif font-semibold mb-8">
          Shopping Cart ({totalItems})
        </h1>


        <div className="grid lg:grid-cols-3 gap-8">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">

            {items.map(item => (

              <div
                key={item.id}
                className="flex gap-4 p-4 bg-card border border-border rounded-sm"
              >

                  <Link
                    href={`/products/${item.productId}`}
                    className="relative w-24 h-32 flex-shrink-0 bg-muted rounded-sm overflow-hidden"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </Link>


                  <div className="flex-1 flex flex-col">

                    <div className="flex-1">

                      <Link href={`/products/${item.productId}`}>
                        <h3 className="font-medium hover:text-primary">
                          {item.name}
                        </h3>
                      </Link>

                      <div className="flex gap-3 mt-1 text-sm text-muted-foreground">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.color && <span>Color: {item.color}</span>}
                      </div>

                      <p className="font-semibold mt-2">
                        ₹{formatPrice(item.price)}
                      </p>

                    </div>


                    <div className="flex items-center justify-between mt-4">

                      <div className="flex items-center gap-2">

                        <button
                          onClick={()=>updateQuantity(item.id,Math.max(1,item.quantity-1))}
                          className="w-8 h-8 border rounded-sm flex items-center justify-center"
                        >
                          <Minus className="h-3 w-3"/>
                        </button>

                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>

                        <button
                          onClick={()=>updateQuantity(item.id,item.quantity+1)}
                          className="w-8 h-8 border rounded-sm flex items-center justify-center"
                        >
                          <Plus className="h-3 w-3"/>
                        </button>

                      </div>


                      <button
                        onClick={()=>removeItem(item.id)}
                        className="flex items-center gap-1 text-sm hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4"/>
                        Remove
                      </button>

                    </div>

                  </div>

              </div>

            ))}


            <div className="flex justify-between pt-4">

              <Link href="/products">
                <Button variant="outline">
                  Continue Shopping
                </Button>
              </Link>

              <Button
                variant="ghost"
                onClick={clearCart}
                className="hover:text-destructive"
              >
                Clear Cart
              </Button>

            </div>

          </div>


          {/* Order Summary */}
          <div className="lg:col-span-1">

            <div className="bg-card border border-border rounded-sm p-6 sticky top-24">

              <h2 className="text-lg font-semibold mb-4">
                Order Summary
              </h2>


              <div className="flex gap-2 mb-6">

                <div className="relative flex-1">

                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>

                  <input
                    value={promoCode}
                    onChange={(e)=>setPromoCode(e.target.value)}
                    placeholder="Promo code"
                    className="w-full pl-10 pr-4 py-2 text-sm border rounded-sm"
                  />

                </div>

                <Button size="sm" variant="outline">
                  Apply
                </Button>

              </div>


              <div className="space-y-3 text-sm">

                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{formatPrice(totalPrice)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {shipping===0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>

                {totalPrice < 2999 && (
                  <p className="text-xs text-muted-foreground">
                    Add ₹{formatPrice(2999-totalPrice)} more for free shipping
                  </p>
                )}

                <div className="border-t pt-3 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{formatPrice(finalTotal)}</span>
                </div>

              </div>


              <Button
                size="lg"
                className="w-full mt-6 gap-2"
                disabled={checkingOut}
                onClick={handleCheckout}
              >
                {checkingOut ? "Processing..." : "Proceed to Checkout"}
                <ArrowRight className="h-4 w-4"/>
              </Button>


              <div className="flex justify-center gap-6 mt-6 pt-6 border-t">

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Truck className="h-4 w-4"/>
                  Free Shipping
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-4 w-4"/>
                  Secure Pay
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      <Footer />
    </main>
  )
}