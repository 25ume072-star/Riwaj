/** @type {import('next').NextConfig} */

const nextConfig = {
  images: { domains: [
      "images.unsplash.com",
      "afmrizevzptmcjbftdfb.supabase.co"
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "afmrizevzptmcjbftdfb.supabase.co",
        pathname: "/storage/v1/object/public/**"
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      }
    ]
  }
}

export default nextConfig
