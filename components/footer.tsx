import Link from "next/link"
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {

  const quickLinks = [
    { name: "Shop All", href: "/products" },
    { name: "Sarees", href: "/products?category=sarees" },
    { name: "Lehengas", href: "/products?category=lehengas" },
    { name: "Poshaks", href: "/products?category=poshaks" },
    { name: "Kurtis", href: "/products?category=kurtis" },
    { name: "Accessories", href: "/products?category=accessories" }
  ]

  const serviceLinks = [
    { name: "Track Order", href: "#" },
    { name: "Returns & Exchange", href: "#" },
    { name: "Shipping Info", href: "#" },
    { name: "Size Guide", href: "#" },
    { name: "FAQs", href: "#" }
  ]

  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" }
  ]

  return (
    <footer className="bg-primary text-primary-foreground">

      <div className="container mx-auto px-4 py-16">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="space-y-5">

            <h2 className="text-3xl font-serif font-semibold tracking-wider">
              RIWAJ
            </h2>

            <p className="text-primary-foreground/80 text-sm leading-relaxed max-w-xs">
              The Grace of Rajasthan. Discover timeless ethnic wear inspired by
              royal heritage and handcrafted traditions.
            </p>

            <div className="flex gap-4 pt-2">

              {socialLinks.map(({ icon: Icon, href, label }, index) => (
                <a
                  key={index}
                  href={href}
                  aria-label={label}
                  className="p-2 rounded-md bg-primary-foreground/10 hover:bg-secondary hover:text-primary transition-all"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}

            </div>

          </div>



          {/* Quick Links */}
          <div>

            <h3 className="font-semibold text-lg mb-5">
              Shop
            </h3>

            <ul className="space-y-3 text-sm">

              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}

            </ul>

          </div>



          {/* Customer Service */}
          <div>

            <h3 className="font-semibold text-lg mb-5">
              Customer Service
            </h3>

            <ul className="space-y-3 text-sm">

              {serviceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}

            </ul>

          </div>



          {/* Contact */}
          <div>

            <h3 className="font-semibold text-lg mb-5">
              Contact
            </h3>

            <ul className="space-y-4 text-sm">

              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span className="text-primary-foreground/80">
                  Jaipur, Rajasthan 302001
                </span>
              </li>

              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span className="text-primary-foreground/80">
                  +91 98765 43210
                </span>
              </li>

              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <span className="text-primary-foreground/80">
                  contact@riwaj.com
                </span>
              </li>

            </ul>

          </div>

        </div>



        {/* Bottom Bar */}

        <div className="border-t border-primary-foreground/20 mt-14 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/60">

          <p>
            © {new Date().getFullYear()} RIWAJ. All rights reserved.
          </p>

          <div className="flex gap-6">

            <Link
              href="#"
              className="hover:text-primary-foreground transition-colors"
            >
              Privacy Policy
            </Link>

            <Link
              href="#"
              className="hover:text-primary-foreground transition-colors"
            >
              Terms of Service
            </Link>

          </div>

        </div>

      </div>

    </footer>
  )
}