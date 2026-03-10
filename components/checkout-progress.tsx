"use client"

import { cn } from "@/lib/utils"

type Step = "cart" | "address" | "payment" | "confirmation"

const steps: { id: Step; label: string }[] = [
  { id: "cart",          label: "Cart" },
  { id: "address",       label: "Address" },
  { id: "payment",       label: "Payment" },
  { id: "confirmation",  label: "Confirmation" }
]

export function CheckoutProgress({ current }: { current: Step }) {
  const currentIndex = steps.findIndex(s => s.id === current)

  return (
    <nav aria-label="Checkout progress" className="mb-6">
      <ol className="flex items-center justify-center gap-4 text-xs md:text-sm">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex
          const isActive = index === currentIndex

          return (
            <li key={step.id} className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-medium",
                  isCompleted && "bg-primary text-primary-foreground border-primary",
                  isActive && !isCompleted && "border-primary text-primary",
                  !isCompleted && !isActive && "border-muted-foreground/40 text-muted-foreground"
                )}
              >
                {index + 1}
              </div>
              <span
                className={cn(
                  "hidden md:inline-block",
                  isCompleted && "text-primary",
                  isActive && "text-foreground",
                  !isCompleted && !isActive && "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <span className="hidden md:inline-block w-8 h-px bg-border" />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

