import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { CategoriesSection } from "@/components/categories-section"
import { FeaturedProducts } from "@/components/featured-products"
import { PromoBanner } from "@/components/promo-banner"
import { ReviewsSection } from "@/components/reviews-section"
import { NewsletterSection } from "@/components/newsletter-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section aria-label="Hero">
        <HeroSection />
      </section>

      <section aria-label="Shop by Category">
        <CategoriesSection />
      </section>

      <section aria-label="Featured Products">
        <FeaturedProducts />
      </section>

      <section aria-label="Promotional Banner">
        <PromoBanner />
      </section>

      <section aria-label="Customer Reviews">
        <ReviewsSection />
      </section>

      <section aria-label="Newsletter Signup">
        <NewsletterSection />
      </section>

      <Footer />
    </main>
  )
}