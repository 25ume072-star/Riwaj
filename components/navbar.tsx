"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Heart,
  LogOut
} from "lucide-react"

import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"

import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

import { createClient } from "@/lib/supabase/client"


const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/account", label: "Account" },
  { href: "/orders", label: "Orders" },
  { href: "/products?category=sarees", label: "Sarees" },
  { href: "/products?category=lehengas", label: "Lehengas" },
  { href: "/products?category=poshaks", label: "Poshaks" },
  { href: "/products?category=kurtis", label: "Kurtis" },
  { href: "/products?category=accessories", label: "Accessories" }
]


export function Navbar() {

  const router = useRouter()

  const [isSearchOpen,setIsSearchOpen] = useState(false)
  const [searchQuery,setSearchQuery] = useState("")

  const { totalItems, user } = useCart()

  const supabase = createClient()



  const handleSearch = (e:React.FormEvent) => {

    e.preventDefault()

    if(!searchQuery.trim()) return

    router.push(`/products?search=${searchQuery}`)
    setIsSearchOpen(false)

  }



  const handleSignOut = async () => {

    await supabase.auth.signOut()

    router.push("/")
    router.refresh()

  }



  return (

    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur">

      {/* Top Bar */}

      <div className="bg-primary text-primary-foreground py-2 text-center text-xs md:text-sm">

        Free Shipping on Orders Above ₹2,999 • Use Code: RIWAJ10

      </div>



      <div className="container mx-auto px-4">

        <div className="flex h-16 items-center justify-between">


          {/* Mobile Menu */}

          <Sheet>

            <SheetTrigger asChild className="lg:hidden">

              <Button variant="ghost" size="icon">

                <Menu className="h-5 w-5" />

              </Button>

            </SheetTrigger>



            <SheetContent side="left" className="w-[280px]">

              <nav className="flex flex-col gap-6 mt-10">

                {navLinks.map((link)=>(
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}

              </nav>

            </SheetContent>

          </Sheet>



          {/* Logo */}

          <Link href="/" className="flex items-center">

            <h1 className="text-2xl md:text-3xl font-serif font-semibold tracking-wider text-primary">

              RIWAJ

            </h1>

          </Link>



          {/* Desktop Navigation */}

          <nav className="hidden lg:flex items-center gap-8">

            {navLinks.map((link)=>(
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium uppercase tracking-wide text-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}

          </nav>



          {/* Actions */}

          <div className="flex items-center gap-1 md:gap-2">


            {/* Search */}

            {isSearchOpen ? (

              <form
                onSubmit={handleSearch}
                className="flex items-center gap-2"
              >

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e)=>setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-36 md:w-56 px-3 py-1.5 text-sm border rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  autoFocus
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={()=>setIsSearchOpen(false)}
                >
                  <X className="h-4 w-4"/>
                </Button>

              </form>

            ) : (

              <Button
                variant="ghost"
                size="icon"
                onClick={()=>setIsSearchOpen(true)}
              >

                <Search className="h-5 w-5"/>

              </Button>

            )}



            <Link href="/wishlist">
  <Button variant="ghost" size="icon">
    <Heart className="h-5 w-5"/>
  </Button>
</Link>


            {/* User Menu */}

            {user ? (

              <DropdownMenu>

                <DropdownMenuTrigger asChild>

                  <Button variant="ghost" size="icon">

                    <User className="h-5 w-5"/>

                  </Button>

                </DropdownMenuTrigger>



                <DropdownMenuContent align="end" className="w-52">

                  <DropdownMenuItem className="text-xs text-muted-foreground">

                    {user.email}

                  </DropdownMenuItem>

                  <DropdownMenuSeparator/>

                  <DropdownMenuItem asChild>

                    <Link href="/account">My Account</Link>

                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>

                    <Link href="/orders">My Orders</Link>

                  </DropdownMenuItem>

                  <DropdownMenuSeparator/>

                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-destructive"
                  >

                    <LogOut className="h-4 w-4 mr-2"/>

                    Sign Out

                  </DropdownMenuItem>

                </DropdownMenuContent>

              </DropdownMenu>

            ) : (

              <Link href="/login">

                <Button variant="ghost" size="icon">

                  <User className="h-5 w-5"/>

                </Button>

              </Link>

            )}



            {/* Cart */}

            <Link href="/cart" className="relative">

              <Button variant="ghost" size="icon">

                <ShoppingBag className="h-5 w-5"/>

                {totalItems > 0 && (

                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">

                    {totalItems}

                  </span>

                )}

              </Button>

            </Link>

          </div>

        </div>

      </div>

    </header>

  )

}