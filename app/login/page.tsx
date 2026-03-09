"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {

  const router = useRouter()
  const supabase = createClient()

  const [showPassword,setShowPassword] = useState(false)
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [isLoading,setIsLoading] = useState(false)
  const [error,setError] = useState("")

  // Redirect if already logged in
  useEffect(()=>{
    const checkUser = async()=>{
      const { data } = await supabase.auth.getSession()
      if(data?.session){
        router.push("/")
      }
    }
    checkUser()
  },[])


  const handleSubmit = async (e:React.FormEvent)=>{
    e.preventDefault()

    if(!email || !password){
      setError("Please fill all fields")
      return
    }

    setIsLoading(true)
    setError("")

    try{

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if(error){
        setError(error.message)
        setIsLoading(false)
        return
      }

      router.push("/")
      router.refresh()

    }catch(err){
      setError("Unexpected error occurred")
      console.error(err)
    }

    setIsLoading(false)
  }


  const handleGoogleLogin = async ()=>{

    try{

      const { error } = await supabase.auth.signInWithOAuth({
        provider:"google",
        options:{
          redirectTo:`${window.location.origin}/auth/callback`
        }
      })

      if(error){
        setError(error.message)
      }

    }catch(err){
      setError("Google login failed")
      console.error(err)
    }

  }



  return (

    <main className="min-h-screen flex">

      {/* Left Image */}
      <div className="hidden lg:block lg:w-1/2 relative">

        <Image
          src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&h=1600&fit=crop"
          alt="Traditional ethnic wear"
          fill
          className="object-cover"
          priority
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />

        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center">

            <Link href="/">
              <h1 className="text-5xl font-serif font-semibold text-white tracking-wider mb-4">
                RIWAJ
              </h1>
            </Link>

            <p className="text-secondary text-lg tracking-widest uppercase">
              The Grace of Rajasthan
            </p>

          </div>
        </div>

      </div>



      {/* Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">

        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/">
              <h1 className="text-4xl font-serif font-semibold text-primary">
                RIWAJ
              </h1>
            </Link>
          </div>


          <div className="text-center mb-8">

            <h2 className="text-2xl font-serif font-semibold mb-2">
              Welcome Back
            </h2>

            <p className="text-muted-foreground">
              Sign in to your account
            </p>

          </div>



          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-sm flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive"/>
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}



          <form onSubmit={handleSubmit} className="space-y-6">


            {/* Email */}
            <div>

              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>

              <div className="relative">

                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"/>

                <input
                  type="email"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-sm bg-background focus:ring-2 focus:ring-primary outline-none"
                  required
                />

              </div>

            </div>



            {/* Password */}
            <div>

              <div className="flex justify-between mb-2">

                <label className="text-sm font-medium">
                  Password
                </label>

                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>

              </div>


              <div className="relative">

                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"/>

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-12 py-3 border border-border rounded-sm bg-background focus:ring-2 focus:ring-primary outline-none"
                  required
                />

                <button
                  type="button"
                  onClick={()=>setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                </button>

              </div>

            </div>



            {/* Submit */}
            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="w-full gap-2"
            >

              {isLoading ? "Signing in..." : "Sign In"}

              {!isLoading && <ArrowRight size={18}/>}

            </Button>

          </form>



          {/* Divider */}
          <div className="relative my-8">

            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"/>
            </div>

            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted-foreground">
                or continue with
              </span>
            </div>

          </div>



          {/* Google Login */}
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            Continue with Google
          </Button>



          {/* Signup */}
          <p className="text-center mt-8 text-muted-foreground">

            Don’t have an account?{" "}

            <Link href="/signup" className="text-primary font-medium hover:underline">
              Create Account
            </Link>

          </p>

        </div>

      </div>

    </main>

  )

}