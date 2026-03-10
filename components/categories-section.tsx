"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

const categories = [
  { id: "sarees", name: "Sarees", image: "/images/saree.jpg" },
  { id: "lehengas", name: "Lehengas", image: "/images/lehengas.jpg" },
  { id: "poshaks", name: "Poshaks", image: "/images/poshaks.jpg" },
  { id: "kurtis", name: "Kurtis", image: "/images/kurtis.jpg" },
  { id: "accessories", name: "Accessories", image: "/images/accessories.jpg" },
]

export function CategoriesSection() {

  const [counts,setCounts] = useState<Record<string,number>>({})

  const supabase = createClient()

  useEffect(()=>{

    const fetchCounts = async ()=>{

      const { data } = await supabase
        .from("products")
        .select("category")

      if(!data) return

      const categoryCounts:Record<string,number> = {}

      data.forEach((product:{category:string})=>{
        categoryCounts[product.category] =
          (categoryCounts[product.category] || 0) + 1
      })

      setCounts(categoryCounts)

    }

    fetchCounts()

  },[])



  return (

    <section className="py-20">

      <div className="container mx-auto px-4">

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">

          {categories.map((category) => {
            const count = counts[category.id] || 0

            return (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                className="group block"
              >

                {/* Image Frame */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl">

                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width:768px) 50vw, 20vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-4 text-white">

                    <h3 className="text-lg font-serif font-semibold">
                      {category.name}
                    </h3>

                    <p className="text-sm opacity-80">
                      {count > 0
                        ? `${count} Products`
                        : "New collection coming soon"}
                    </p>

                  </div>

                </div>

              </Link>
            )
          })}

        </div>

      </div>

    </section>

  )

}