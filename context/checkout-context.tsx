"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

export type ShippingAddress = {
  fullName: string
  phone: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}

type CheckoutContextType = {
  address: ShippingAddress | null
  setAddress: (addr: ShippingAddress | null) => void
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined)

const STORAGE_KEY = "riwaj_shipping_address"

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [address, setAddressState] = useState<ShippingAddress | null>(null)

  useEffect(() => {
    try {
      const saved = typeof window !== "undefined"
        ? window.localStorage.getItem(STORAGE_KEY)
        : null
      if (saved) {
        setAddressState(JSON.parse(saved))
      }
    } catch {
      // ignore corrupt storage
    }
  }, [])

  const setAddress = (addr: ShippingAddress | null) => {
    setAddressState(addr)
    try {
      if (typeof window === "undefined") return
      if (addr) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(addr))
      } else {
        window.localStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      // ignore storage errors
    }
  }

  return (
    <CheckoutContext.Provider value={{ address, setAddress }}>
      {children}
    </CheckoutContext.Provider>
  )
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext)
  if (!ctx) {
    throw new Error("useCheckout must be used within CheckoutProvider")
  }
  return ctx
}

