import { createClient as createServerClient } from "@/lib/supabase/server"
import type { Product } from "@/lib/database.types"
import { ProductsPageClient } from "@/components/products-page-client"

interface ProductsPageProps {
  searchParams?: {
    [key: string]: string | string[] | undefined
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {

  const params = await searchParams
  const category = params?.category

  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Failed to load products:", error.message)
  }

  const products = (data as Product[]) || []

  const searchParam = typeof params?.search === "string"
    ? params.search
    : null

  const categoryParam = typeof params?.category === "string"
    ? params.category
    : null

  return (
    <ProductsPageClient
      products={products}
      initialCategory={categoryParam}
      initialSearch={searchParam}
    />
  )
}
