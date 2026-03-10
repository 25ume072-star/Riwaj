"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Search, ChevronDown } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import type { Product } from "@/lib/database.types"

const priceRanges = [
  { label: "Under ₹5,000", min: 0, max: 5000 },
  { label: "₹5,000 - ₹15,000", min: 5000, max: 15000 },
  { label: "₹15,000 - ₹30,000", min: 15000, max: 30000 },
  { label: "Above ₹30,000", min: 30000, max: Infinity }
]

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Rating", value: "rating" },
  { label: "Newest", value: "newest" }
]

const formatCategoryLabel = (value: string) =>
  value
    .split("-")
    .map((word) =>
      word.length ? word.charAt(0).toUpperCase() + word.slice(1) : ""
    )
    .join(" ")

interface ProductsPageClientProps {
  products: Product[]
  initialCategory?: string | null
  initialSearch?: string | null
}

export function ProductsPageClient({
  products,
  initialCategory,
  initialSearch
}: ProductsPageClientProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearch ?? "")
  const [selectedCategory, setSelectedCategory] = useState(initialCategory ?? "")
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState("featured")
  const [showOnlyNew, setShowOnlyNew] = useState(false)
  const [showOnlySale, setShowOnlySale] = useState(false)

  const categories = useMemo(() => {
    const counts: Record<string, number> = {}

    products.forEach(p => {
      const key = p.category.toLowerCase()
      counts[key] = (counts[key] || 0) + 1
    })

    return Object.entries(counts).map(([id, count]) => ({
      id,
      name: id.charAt(0).toUpperCase() + id.slice(1),
      count
    }))
  }, [products])

  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()

      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      )
    }

    if (selectedCategory) {
      result = result.filter(p =>
        p.category.toLowerCase() === selectedCategory.toLowerCase()
      )
    }

    if (selectedPriceRange !== null) {
      const range = priceRanges[selectedPriceRange]

      result = result.filter(p =>
        p.price >= range.min && p.price < range.max
      )
    }

    if (showOnlyNew) {
      result = result.filter(p => p.is_new)
    }

    if (showOnlySale) {
      result = result.filter(p => p.is_on_sale)
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price)
        break

      case "price-desc":
        result.sort((a, b) => b.price - a.price)
        break

      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break

      case "newest":
        result.sort((a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
        )
        break

      default:
        result.sort((a, b) => b.rating - a.rating)
    }

    return result
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedPriceRange,
    sortBy,
    showOnlyNew,
    showOnlySale
  ])

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("")
    setSelectedPriceRange(null)
    setShowOnlyNew(false)
    setShowOnlySale(false)
    setSortBy("featured")
  }

  const hasActiveFilters =
    !!searchQuery ||
    !!selectedCategory ||
    selectedPriceRange !== null ||
    showOnlyNew ||
    showOnlySale

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">
          Categories
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => setSelectedCategory("")}
            className={`block w-full text-left px-3 py-2 rounded-sm text-sm ${
              !selectedCategory
                ? "bg-primary text-white"
                : "hover:bg-muted"
            }`}
          >
            All Categories
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`block w-full text-left px-3 py-2 rounded-sm text-sm ${
                selectedCategory === cat.id
                  ? "bg-primary text-white"
                  : "hover:bg-muted"
              }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">
          Price Range
        </h3>
        <div className="space-y-2">
          {priceRanges.map((range, index) => (
            <label key={index} className="flex gap-2 text-sm">
              <input
                type="radio"
                checked={selectedPriceRange === index}
                onChange={() => setSelectedPriceRange(index)}
                className="accent-primary"
              />
              {range.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">
          Quick Filters
        </h3>
        <label className="flex gap-2 text-sm">
          <input
            type="checkbox"
            checked={showOnlyNew}
            onChange={(e) => setShowOnlyNew(e.target.checked)}
          />
          New Arrivals
        </label>
        <label className="flex gap-2 text-sm">
          <input
            type="checkbox"
            checked={showOnlySale}
            onChange={(e) => setShowOnlySale(e.target.checked)}
          />
          On Sale
        </label>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" onClick={clearFilters}>
          Clear Filters
        </Button>
      )}
    </div>
  )

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="bg-muted py-12">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-serif">
            {selectedCategory
              ? formatCategoryLabel(selectedCategory)
              : "Shop All"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {filteredProducts.length > 0
              ? `${filteredProducts.length} products`
              : products.length === 0
                ? "Our first collection is coming soon."
                : "No products match your filters yet."}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border rounded-sm"
            />
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none px-4 py-2 border rounded-sm"
            >
              {sortOptions.map(o => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2" />
          </div>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex gap-8">
          <aside className="hidden md:block w-64">
            <FilterContent />
          </aside>

          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 space-y-4">
                <p className="text-lg font-medium">
                  {products.length === 0
                    ? "Our first collection is coming soon."
                    : "No products match your current filters."}
                </p>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {products.length === 0
                    ? "We’re curating timeless pieces for this category. Please check back soon."
                    : "Try adjusting or clearing filters to see more styles that might suit your occasion."}
                </p>

                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                  >
                    Clear filters
                  </Button>
                )}

                <Button
                  asChild
                  variant="outline"
                  className="mt-2"
                >
                  <Link href="/">
                    Back to home
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

