"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

interface Order {
  id: string
  total: number
  created_at: string
}

export default function OrdersPage() {

  const supabase = createClient()

  const [orders,setOrders] = useState<Order[]>([])
  const [loading,setLoading] = useState(true)

  useEffect(()=>{

    const loadOrders = async ()=>{

      const { data: { user } } = await supabase.auth.getUser()

      if(!user){
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at",{ ascending:false })

      if(data){
        setOrders(data)
      }

      setLoading(false)
    }

    loadOrders()

  },[])

  return (
    <main className="min-h-screen bg-background">

      <Navbar/>

      <div className="container mx-auto px-4 py-16">

        <h1 className="text-3xl font-serif mb-10">
          My Orders
        </h1>

        {loading && (
          <p>Loading orders...</p>
        )}

        {!loading && orders.length === 0 && (
          <p>No orders yet.</p>
        )}

        <div className="space-y-4">

          {orders.map(order=>(
            <div
              key={order.id}
              className="border p-6 rounded-sm"
            >

              <p className="font-semibold">
                Order ID: {order.id}
              </p>

              <p>
                Total: ₹{order.total}
              </p>

              <p className="text-sm text-muted-foreground">
                {new Date(order.created_at).toLocaleDateString()}
              </p>

            </div>
          ))}

        </div>

      </div>

      <Footer/>

    </main>
  )
}