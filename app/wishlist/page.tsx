"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useCart } from "@/context/cart-context"
import { ProductCard } from "@/components/product-card"
import type { Product } from "@/lib/database.types"

export default function WishlistPage() {

  const { user } = useCart()
  const supabase = createClient()

  const [products,setProducts] = useState<Product[]>([])
  const [loading,setLoading] = useState(true)

  useEffect(()=>{

    const fetchWishlist = async ()=>{

      if(!user) return

      const { data } = await supabase
        .from("wishlists")
        .select("products(*)")
        .eq("user_id", user.id)

      if(data){

        const items = data.map((item:any)=> item.products)

        setProducts(items)

      }

      setLoading(false)

    }

    fetchWishlist()

  },[user])



  if(loading){
    return (
      <div className="py-20 text-center">
        Loading wishlist...
      </div>
    )
  }

  return (

    <main className="container mx-auto px-4 py-16">

      <h1 className="text-3xl font-serif mb-10">
        My Wishlist
      </h1>

      {products.length === 0 ? (
        <p className="text-muted-foreground">
          Your wishlist is empty.
        </p>
      ) : (

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {products.map((product)=>(
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}

        </div>

      )}

    </main>

  )

}