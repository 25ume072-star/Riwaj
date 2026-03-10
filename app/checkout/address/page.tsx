"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CheckoutProgress } from "@/components/checkout-progress"
import { useCheckout } from "@/context/checkout-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type FormState = {
  fullName: string
  phone: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}

export default function AddressPage() {
  const router = useRouter()
  const { address, setAddress } = useCheckout()

  const [form, setForm] = useState<FormState>({
    fullName: address?.fullName ?? "",
    phone: address?.phone ?? "",
    street: address?.street ?? "",
    city: address?.city ?? "",
    state: address?.state ?? "",
    postalCode: address?.postalCode ?? "",
    country: address?.country ?? "India"
  })

  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (field: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: "" }))
  }

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {}

    if (!form.fullName.trim()) nextErrors.fullName = "Full name is required"
    if (!form.phone.trim()) nextErrors.phone = "Phone number is required"
    if (!form.street.trim()) nextErrors.street = "Street address is required"
    if (!form.city.trim()) nextErrors.city = "City is required"
    if (!form.state.trim()) nextErrors.state = "State is required"
    if (!form.postalCode.trim()) nextErrors.postalCode = "Postal code is required"
    if (!form.country.trim()) nextErrors.country = "Country is required"

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setAddress({
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      street: form.street.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      postalCode: form.postalCode.trim(),
      country: form.country.trim()
    })
    router.push("/checkout/payment")
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <CheckoutProgress current="address" />

        <h1 className="text-2xl md:text-3xl font-serif font-semibold mb-6">
          Shipping Address
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={form.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-destructive">{errors.fullName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+91 9XXXXXXXXX"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-destructive">{errors.phone}</p>
              )}
            </div>

            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={form.country}
                onChange={(e) => handleChange("country", e.target.value)}
                placeholder="Country"
              />
              {errors.country && (
                <p className="mt-1 text-xs text-destructive">{errors.country}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="street">Street Address</Label>
            <Input
              id="street"
              value={form.street}
              onChange={(e) => handleChange("street", e.target.value)}
              placeholder="House number, street, area"
            />
            {errors.street && (
              <p className="mt-1 text-xs text-destructive">{errors.street}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={form.city}
                onChange={(e) => handleChange("city", e.target.value)}
              />
              {errors.city && (
                <p className="mt-1 text-xs text-destructive">{errors.city}</p>
              )}
            </div>

            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={form.state}
                onChange={(e) => handleChange("state", e.target.value)}
              />
              {errors.state && (
                <p className="mt-1 text-xs text-destructive">{errors.state}</p>
              )}
            </div>

            <div>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={form.postalCode}
                onChange={(e) => handleChange("postalCode", e.target.value)}
              />
              {errors.postalCode && (
                <p className="mt-1 text-xs text-destructive">{errors.postalCode}</p>
              )}
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/cart")}
            >
              Back to Cart
            </Button>

            <Button type="submit" disabled={submitting}>
              {submitting ? "Continuing..." : "Continue to Payment"}
            </Button>
          </div>
        </form>
      </div>

      <Footer />
    </main>
  )
}

