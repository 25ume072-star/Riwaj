import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function PromoBanner() {
  return (
    <section className="py-20 bg-background">

      <div className="container mx-auto px-4">

        <div className="relative overflow-hidden rounded-xl bg-primary shadow-xl">

          <div className="grid lg:grid-cols-2 items-stretch">

            {/* Content */}

            <div className="relative p-8 md:p-12 lg:p-16 flex flex-col justify-center z-10">

              <p className="text-secondary font-medium tracking-[0.35em] text-xs mb-4 uppercase">
                Limited Time Offer
              </p>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold text-primary-foreground mb-5 leading-tight">
                Wedding Season Sale
              </h2>

              <p className="text-primary-foreground/80 text-base md:text-lg mb-4 max-w-md leading-relaxed">
                Celebrate your special moments with timeless elegance. Enjoy
                up to <span className="font-semibold text-secondary">40% OFF</span> on our
                handcrafted bridal collection.
              </p>

              <p className="text-sm md:text-base text-primary-foreground/80 mb-8">
                Use code <span className="font-semibold">RIWAJ10</span> for an
                extra 10% off on orders above ₹9,999.{" "}
                <span className="font-medium underline underline-offset-4">
                  Sale ends soon.
                </span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4">

                <Link href="/products?category=lehengas">

                  <Button
                    size="lg"
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2 w-full sm:w-auto"
                  >

                    Shop Bridal

                    <ArrowRight className="h-4 w-4" />

                  </Button>

                </Link>

                <Link href="/products">

                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary w-full sm:w-auto"
                  >

                    Explore All

                  </Button>

                </Link>

              </div>

            </div>



            {/* Image */}

            <div className="relative h-64 md:h-80 lg:h-auto group">

              <Image
                src="https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=800&h=600&fit=crop"
                alt="Rajasthani bridal couple in traditional attire"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width:1024px) 100vw, 50vw"
              />

              {/* Gradient Overlay */}

              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-primary/30 to-primary/60 lg:block hidden" />

            </div>

          </div>



          {/* Decorative Elements */}

          <div className="absolute -top-10 -right-10 w-40 h-40 border border-secondary/20 rounded-full blur-sm" />

          <div className="absolute -bottom-12 -left-12 w-28 h-28 border border-secondary/20 rounded-full blur-sm" />

          <div className="absolute top-10 left-1/2 w-16 h-16 border border-secondary/10 rounded-full hidden lg:block" />

        </div>

      </div>

    </section>
  )
}