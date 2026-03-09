"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1920&h=1080&fit=crop",
    title: "Bridal Collection",
    subtitle: "Elegance Redefined",
    description:
      "Discover our exquisite bridal collection crafted with heritage, elegance, and timeless tradition.",
    cta: "Explore Bridal",
    link: "/products?category=lehengas",
  },
  {
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1920&h=1080&fit=crop",
    title: "Silk Sarees",
    subtitle: "Timeless Beauty",
    description:
      "Banarasi, Chanderi, and Kanjivaram sarees that celebrate India's rich textile heritage.",
    cta: "Shop Sarees",
    link: "/products?category=sarees",
  },
  {
    image:
      "https://images.unsplash.com/photo-1593030103066-0093718efeb9?w=1920&h=1080&fit=crop",
    title: "Accessories",
    subtitle: "Royal Heritage",
    description:
      "Handcrafted jewelry and royal accessories designed for every special moment.",
    cta: "View Collection",
    link: "/products?category=accessories",
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)

    return () => clearInterval(timer)
  }, [])

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % slides.length)

  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  const activeSlide = slides[currentSlide]

  return (
    <section className="relative h-[75vh] md:h-[85vh] overflow-hidden">

      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
          />

          {/* Luxury Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex items-center">

        <div className="max-w-xl">

          <p className="text-secondary font-medium tracking-[0.35em] text-xs md:text-sm mb-4 uppercase">
            {activeSlide.subtitle}
          </p>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-semibold text-white mb-6 leading-tight">
            {activeSlide.title}
          </h1>

          <p className="text-white/90 text-base md:text-lg lg:text-xl mb-8 max-w-md leading-relaxed">
            {activeSlide.description}
          </p>

          <Link href={activeSlide.link}>
            <Button
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2 px-8"
            >
              {activeSlide.cta}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

        </div>

      </div>

      {/* Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">

        <button
          onClick={prevSlide}
          className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Indicators */}
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "w-8 bg-secondary"
                  : "w-2 bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

      </div>
    </section>
  )
}