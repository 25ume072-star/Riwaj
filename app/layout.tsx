import type { Metadata } from "next"
import { Cormorant_Garamond, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { CartProvider } from "@/context/cart-context"
import { Toaster } from "sonner"
import "./globals.css"



/* Fonts */

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap"
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
})



/* Metadata (SEO + Social Sharing) */

export const metadata: Metadata = {
  title: {
    default: "RIWAJ - The Grace of Rajasthan",
    template: "%s | RIWAJ"
  },

  description:
    "Discover the finest collection of traditional Rajasthani ethnic wear. Shop sarees, lehengas, sherwanis, kurtas and royal outfits at RIWAJ.",

  keywords: [
    "Rajasthani fashion",
    "ethnic wear",
    "lehenga",
    "saree",
    "kurta",
    "poshak",
    "Indian traditional clothing",
    "Rajasthan clothing"
  ],

  authors: [{ name: "RIWAJ" }],

  creator: "RIWAJ",

  metadataBase: new URL("https://riwaj.vercel.app"),


  openGraph: {
    title: "RIWAJ - The Grace of Rajasthan",
    description:
      "Luxury Rajasthani ethnic wear inspired by royal heritage.",
    url: "https://riwaj.vercel.app",
    siteName: "RIWAJ",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RIWAJ Ethnic Wear"
      }
    ],
    locale: "en_IN",
    type: "website"
  },


  twitter: {
    card: "summary_large_image",
    title: "RIWAJ - The Grace of Rajasthan",
    description:
      "Luxury Rajasthani ethnic wear inspired by royal heritage.",
    images: ["/og-image.png"]
  },


  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)"
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)"
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml"
      }
    ],
    apple: "/apple-icon.png"
  },


  viewport: {
    width: "device-width",
    initialScale: 1
  },

  themeColor: "#7f1d1d"
}



export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body
        className={`
          ${cormorant.variable}
          ${inter.variable}
          font-sans
          antialiased
          bg-background
          text-foreground
        `}
      >

        <CartProvider>
          {children}
        </CartProvider>

        {/* Cart Popup Toast */}
        <Toaster position="top-right" richColors />

        <Analytics />

      </body>
    </html>
  )
}