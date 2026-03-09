"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check } from "lucide-react"

export function NewsletterSection() {

  const [email,setEmail] = useState("")
  const [isSubscribed,setIsSubscribed] = useState(false)
  const [isLoading,setIsLoading] = useState(false)
  const [error,setError] = useState("")



  const validateEmail = (value:string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }



  const handleSubmit = async (e:React.FormEvent) => {

    e.preventDefault()

    setError("")

    if(!validateEmail(email)){
      setError("Please enter a valid email address.")
      return
    }

    setIsLoading(true)

    // Simulated API call
    await new Promise((resolve)=>setTimeout(resolve,800))

    setIsSubscribed(true)
    setEmail("")
    setIsLoading(false)

  }



  return (

    <section className="py-20 bg-background">

      <div className="container mx-auto px-4">

        <div className="max-w-2xl mx-auto text-center">

          {/* Header */}

          <p className="text-secondary font-medium tracking-[0.35em] text-xs mb-3 uppercase">
            Stay Updated
          </p>

          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-4">
            Join the RIWAJ Family
          </h2>

          <p className="text-muted-foreground mb-10 text-sm md:text-base leading-relaxed">
            Subscribe to receive exclusive offers, new arrivals, and curated
            style inspiration directly in your inbox.
          </p>



          {/* Success State */}

          {isSubscribed ? (

            <div className="flex flex-col items-center gap-3 text-primary">

              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">

                <Check className="h-6 w-6" />

              </div>

              <p className="font-medium">
                Thank you for subscribing!
              </p>

            </div>

          ) : (


            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >

              <div className="flex flex-col flex-1">

                <input
                  type="email"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="px-4 py-3 border border-border rounded-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />

                {error && (
                  <span className="text-xs text-destructive mt-1 text-left">
                    {error}
                  </span>
                )}

              </div>


              <Button
                type="submit"
                disabled={isLoading}
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 px-6"
              >

                {isLoading ? "Subscribing..." : "Subscribe"}

                {!isLoading && (
                  <ArrowRight className="h-4 w-4"/>
                )}

              </Button>

            </form>

          )}

        </div>

      </div>

    </section>

  )

}