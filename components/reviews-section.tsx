import Image from "next/image"
import { reviews } from "@/lib/products"
import { Star, Quote } from "lucide-react"

export function ReviewsSection() {

  return (

    <section className="py-20 bg-muted">

      <div className="container mx-auto px-4">

        {/* Header */}

        <div className="text-center mb-14">

          <p className="text-secondary font-medium tracking-[0.35em] text-xs mb-3 uppercase">
            Testimonials
          </p>

          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground">
            What Our Customers Say
          </h2>

          <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-sm md:text-base">
            Thousands of happy customers trust RIWAJ for timeless elegance
            and premium craftsmanship.
          </p>

        </div>



        {/* Reviews Grid */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">

          {reviews.map((review)=> (

            <div
              key={review.id}
              className="
              group
              bg-card
              p-6 md:p-8
              rounded-lg
              border border-border
              relative
              hover:shadow-xl
              transition-all duration-300
              "
            >

              {/* Quote Icon */}

              <Quote className="absolute top-6 right-6 h-8 w-8 text-secondary/25" />



              {/* Rating */}

              <div className="flex gap-1 mb-4">

                {[...Array(5)].map((_,i)=> (

                  <Star
                    key={i}
                    className={`h-4 w-4 transition ${
                      i < review.rating
                        ? "fill-secondary text-secondary"
                        : "text-muted"
                    }`}
                  />

                ))}

              </div>



              {/* Comment */}

              <p className="text-foreground/80 leading-relaxed mb-6 text-sm md:text-base">
                “{review.comment}”
              </p>



              {/* Author */}

              <div className="flex items-center gap-3">

                <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-border">

                  <Image
                    src={review.avatar}
                    alt={review.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />

                </div>

                <div>

                  <p className="font-medium text-foreground text-sm">
                    {review.name}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {review.date}
                  </p>

                </div>

              </div>



              {/* Hover Accent Line */}

              <div className="absolute bottom-0 left-0 h-1 w-0 bg-secondary group-hover:w-full transition-all duration-300" />

            </div>

          ))}

        </div>

      </div>

    </section>

  )

}