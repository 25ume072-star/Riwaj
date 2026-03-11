"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Heart, ShoppingBag, Star, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import type { Product } from "@/lib/database.types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {

  const [isWishlisted, setIsWishlisted] = useState(false)

  const router = useRouter()
  const { addItem, user } = useCart()

  const supabase = createClient()

  const handleAddToCart = async (e:React.MouseEvent) => {
    e.preventDefault()

    await addItem(product)

    toast.success("Added to cart", {
      description: product.name,
      action: {
        label: "View cart",
        onClick: () => router.push("/cart")
      }
    })
  }

  const discount =
    product.original_price
      ? Math.round(
          ((product.original_price - product.price) /
            product.original_price) * 100
        )
      : null

  const imageUrl =
    product.image_url ||
    product.images?.[0] ||
    "/placeholder.jpg"



  /* ---------- WISHLIST CHECK ---------- */

  useEffect(() => {

    const checkWishlist = async () => {

      if(!user) return

      const { data } = await supabase
        .from("wishlists")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", product.id)
        .maybeSingle()

      if(data){
        setIsWishlisted(true)
      }

    }

    checkWishlist()

  }, [user, product.id, supabase])



  /* ---------- TOGGLE WISHLIST ---------- */

  const toggleWishlist = async (e:React.MouseEvent) => {

    e.preventDefault()

    if(!user){
      toast("Login required", {
        description: "Sign in to save items to your wishlist.",
        action: {
          label: "Login",
          onClick: () => router.push("/login")
        }
      })
      return
    }

    if(isWishlisted){

      await supabase
        .from("wishlists")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", product.id)

      setIsWishlisted(false)
      toast("Removed from wishlist", { description: product.name })

    } else {

      await supabase
        .from("wishlists")
        .insert({
          user_id: user.id,
          product_id: product.id
        })

      setIsWishlisted(true)
      toast("Saved to wishlist", { description: product.name })

    }

  }



  return (

    <div
      className="group relative bg-card rounded-md overflow-hidden border border-border hover:shadow-xl transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/30"
    >

      {/* Image */}

      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <Link
          href={`/products/${product.id}`}
          className="absolute inset-0 block"
          aria-label={`View ${product.name}`}
        >
          <span className="sr-only">
            View {product.name}
          </span>
        </Link>

        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />


        {/* Badges */}

        <div className="absolute top-3 left-3 flex flex-col gap-2">

          {product.is_new && (
            <span className="px-2 py-1 text-xs font-medium bg-primary text-primary-foreground">
              NEW
            </span>
          )}

          {discount && (
            <span className="px-2 py-1 text-xs font-medium bg-destructive text-destructive-foreground">
              -{discount}%
            </span>
          )}

        </div>



        {/* Wishlist */}

        <button
          onClick={toggleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/85 hover:bg-white transition shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        >

          <Heart
            className={`h-4 w-4 ${
              isWishlisted
                ? "fill-primary text-primary"
                : "text-foreground"
            }`}
          />

        </button>



        {/* Quick Actions */}

        <div
          className="
            absolute bottom-0 left-0 right-0 z-10
            p-3 flex gap-2
            transition-all duration-300
            opacity-100 translate-y-0
            md:opacity-0 md:translate-y-4
            md:group-hover:opacity-100 md:group-hover:translate-y-0
          "
        >

          <Button
            onClick={handleAddToCart}
            className="flex-1 gap-2"
            size="sm"
          >

            <ShoppingBag className="h-4 w-4"/>

            Add to Cart

          </Button>


          <Button
            variant="secondary"
            size="icon"
            onClick={(e) => {
              e.preventDefault()
              router.push(`/products/${product.id}`)
            }}
            aria-label="Quick view"
          >
            <Eye className="h-4 w-4"/>

          </Button>

        </div>

        {/* Subtle overlay for contrast on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>



      {/* Product Info */}

      <div className="p-4 space-y-2">

        <Link href={`/products/${product.id}`}>

          <h3 className="text-sm font-medium text-foreground line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>

        </Link>


        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          {product.category}
        </p>



        {/* Rating */}

        <div className="flex items-center gap-1">

          <Star className="h-3.5 w-3.5 fill-secondary text-secondary"/>

          <span className="text-xs font-medium">
            {Number.isFinite(product.rating) ? product.rating : 0}
          </span>

          <span className="text-xs text-muted-foreground">
            ({product.reviews_count})
          </span>

        </div>



        {/* Price */}

        <div className="flex items-center gap-2">

          <span className="font-semibold text-foreground">
            ₹{product.price.toLocaleString()}
          </span>

          {product.original_price && (
            <span className="text-sm text-muted-foreground line-through">
              ₹{product.original_price.toLocaleString()}
            </span>
          )}

        </div>

      </div>

    </div>

  )

}