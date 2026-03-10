"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AddressPage() {
  const router = useRouter()

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: ""
  })

  const handleChange = (e:any) => {
    setAddress({ ...address, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e:any) => {
    e.preventDefault()

    localStorage.setItem("shipping_address", JSON.stringify(address))

    router.push("/checkout/payment")
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Shipping Address</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input name="name" placeholder="Full Name" onChange={handleChange} required />

        <input name="phone" placeholder="Phone Number" onChange={handleChange} required />

        <input name="street" placeholder="Street Address" onChange={handleChange} required />

        <input name="city" placeholder="City" onChange={handleChange} required />

        <input name="state" placeholder="State" onChange={handleChange} required />

        <input name="pincode" placeholder="Pincode" onChange={handleChange} required />

        <button type="submit" className="bg-black text-white px-6 py-2">
          Continue to Payment
        </button>

      </form>
    </div>
  )
}