"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  RefreshCcw,
  Shield,
  Minus,
  Plus,
  ChevronRight
} from "lucide-react"
import type { Product } from "@/lib/database.types"

interface ProductDetailClientProps {
  product: Product
  relatedProducts: Product[]
}

export function ProductDetailClient({
  product,
  relatedProducts
}: ProductDetailClientProps) {
  const [selectedImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const { addItem } = useCart()

  const images = product.image_url
    ? [product.image_url]
    : ["/placeholder.jpg"]

  const discount =
    product.original_price
      ? Math.round(
          ((product.original_price - product.price) /
            product.original_price) *
            100
        )
      : null

  const handleAddToCart = async () => {
    if (product.sizes?.length && !selectedSize) {
      alert("Please select a size")
      return
    }

    if (product.colors?.length && !selectedColor) {
      alert("Please select a color")
      return
    }

    await addItem(
      product,
      selectedSize || undefined,
      selectedColor || undefined,
      quantity
    )

    /* ---- POPUP ADDED HERE ---- */

    toast.success("Added to cart 🛍️", {
      description: product.name
    })
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/products">Shop</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{product.name}</span>
        </nav>
      </div>

      <section className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <div className="relative aspect-[3/4] bg-muted rounded-sm overflow-hidden">
              <Image
                src={images[selectedImageIndex]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />

              {product.is_new && (
                <span className="absolute top-4 left-4 px-3 py-1 text-xs bg-primary text-primary-foreground">
                  NEW
                </span>
              )}

              {discount && (
                <span className="absolute top-4 right-4 px-3 py-1 text-xs bg-destructive text-white">
                  -{discount}%
                </span>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase text-secondary mb-2">
                {product.category}
              </p>

              <h1 className="text-3xl font-serif font-semibold">
                {product.name}
              </h1>

              <div className="flex items-center gap-2 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-secondary text-secondary"
                        : "text-muted"
                    }`}
                  />
                ))}
                <span className="text-sm">
                  ({product.reviews_count})
                </span>
              </div>

              <div className="flex gap-3 mt-4 items-center">
                <span className="text-2xl font-semibold">
                  ₹{product.price.toLocaleString()}
                </span>

                {product.original_price && (
                  <span className="line-through text-muted-foreground">
                    ₹{product.original_price.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {product.description && (
              <p className="text-muted-foreground">
                {product.description}
              </p>
            )}

            <div>
              <span className="font-medium block mb-3">
                Quantity
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border rounded-sm flex items-center justify-center"
                >
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border rounded-sm flex items-center justify-center"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="flex-1 gap-2"
              >
                <ShoppingBag size={18} />
                Add to Cart
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart
                  className={`h-5 w-5 ${
                    isWishlisted ? "fill-primary text-primary" : ""
                  }`}
                />
              </Button>
            </div>

            <div className="grid grid-cols-3 pt-6 border-t">
              <div className="flex flex-col items-center text-xs gap-2">
                <Truck size={18} />
                Free Shipping
              </div>
              <div className="flex flex-col items-center text-xs gap-2">
                <RefreshCcw size={18} />
                Easy Returns
              </div>
              <div className="flex flex-col items-center text-xs gap-2">
                <Shield size={18} />
                Secure Payment
              </div>
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-serif text-center mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}