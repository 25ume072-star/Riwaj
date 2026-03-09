import Link from "next/link"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { createClient as createServerClient } from "@/lib/supabase/server"
import type { Product } from "@/lib/database.types"

export async function FeaturedProducts() {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("rating", { ascending: false })
    .limit(8)

  if (error) {
    console.error("Product fetch error:", error.message)
    return null
  }

  const products = (data as Product[]) || []

  if (!products.length) {
    return null
  }

  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <p className="text-secondary font-medium tracking-[0.35em] text-xs mb-3 uppercase">
              Curated Selection
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground">
              Featured Collection
            </h2>
            <p className="text-muted-foreground mt-2 max-w-lg text-sm md:text-base">
              Handpicked pieces representing the elegance and heritage of Rajasthan.
            </p>
          </div>

          <Link href="/products">
            <Button
              variant="outline"
              className="gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
            >
              View All Products
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
