"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

export default function AccountPage(){

  const supabase = createClient()
  const router = useRouter()

  const [user,setUser] = useState<any>(null)

  useEffect(()=>{

    const getUser = async ()=>{

      const { data } = await supabase.auth.getUser()

      if(!data.user){
        router.push("/login")
      }else{
        setUser(data.user)
      }

    }

    getUser()

  },[])



  const handleLogout = async () => {

    await supabase.auth.signOut()
    router.push("/")

  }



  if(!user) return null



  return(

    <main className="min-h-screen bg-background">

      <Navbar/>

      <section className="container mx-auto px-4 py-16">

        <h1 className="text-3xl font-serif mb-10">
          My Account
        </h1>



        <div className="grid md:grid-cols-4 gap-10">


          {/* Sidebar */}

          <div className="space-y-4">

            <button className="block w-full text-left">
              Profile
            </button>

            <button
              onClick={()=>router.push("/orders")}
              className="block w-full text-left"
            >
              My Orders
            </button>

            <button
              onClick={()=>router.push("/wishlist")}
              className="block w-full text-left"
            >
              Wishlist
            </button>

            <button
              onClick={()=>router.push("/cart")}
              className="block w-full text-left"
            >
              Cart
            </button>

            <button
              onClick={handleLogout}
              className="text-red-600"
            >
              Logout
            </button>

          </div>



          {/* Profile Section */}

          <div className="md:col-span-3">

            <div className="border rounded-lg p-6">

              <h2 className="text-xl font-medium mb-6">
                Profile Information
              </h2>

              <div className="space-y-4">

                <div>
                  <p className="text-sm text-muted-foreground">
                    Email
                  </p>

                  <p className="font-medium">
                    {user.email}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    User ID
                  </p>

                  <p className="font-medium">
                    {user.id}
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      <Footer/>

    </main>

  )

}