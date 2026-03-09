"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  Check,
  AlertCircle
} from "lucide-react"

import { createClient } from "@/lib/supabase/client"

export default function SignupPage() {

  const router = useRouter()
  const supabase = createClient()

  const [showPassword,setShowPassword] = useState(false)
  const [isLoading,setIsLoading] = useState(false)
  const [agreeTerms,setAgreeTerms] = useState(false)
  const [error,setError] = useState("")
  const [success,setSuccess] = useState(false)

  const [formData,setFormData] = useState({
    firstName:"",
    lastName:"",
    email:"",
    phone:"",
    password:""
  })


  const passwordRequirements = [
    { label:"At least 8 characters", met:formData.password.length >= 8 },
    { label:"Contains number", met:/\d/.test(formData.password) },
    { label:"Contains uppercase", met:/[A-Z]/.test(formData.password) }
  ]


  const validateForm = ()=>{

    if(!formData.firstName || !formData.lastName){
      setError("Please enter your full name")
      return false
    }

    if(!formData.email.includes("@")){
      setError("Please enter a valid email")
      return false
    }

    if(formData.password.length < 8){
      setError("Password must be at least 8 characters")
      return false
    }

    if(!agreeTerms){
      setError("Please accept the terms and conditions")
      return false
    }

    return true
  }



  const handleSubmit = async (e:React.FormEvent)=>{

    e.preventDefault()

    setError("")

    if(!validateForm()) return

    setIsLoading(true)

    try{

      const { error } = await supabase.auth.signUp({

        email: formData.email,

        password: formData.password,

        options:{
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
            `${window.location.origin}/auth/callback`,

          data:{
            first_name:formData.firstName,
            last_name:formData.lastName,
            phone:formData.phone
          }

        }

      })

      if(error){
        setError(error.message)
        setIsLoading(false)
        return
      }

      setSuccess(true)

    }catch(err){

      console.error(err)
      setError("Unexpected error occurred")

    }

    setIsLoading(false)

  }



  const handleGoogleSignup = async ()=>{

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
      setError("Google signup failed")
    }

  }



  if(success){

    return(

      <main className="min-h-screen flex items-center justify-center bg-background p-8">

        <div className="max-w-md text-center">

          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="h-8 w-8 text-green-600"/>
          </div>

          <h1 className="text-2xl font-serif font-semibold mb-4">
            Check Your Email
          </h1>

          <p className="text-muted-foreground mb-8">
            We've sent a confirmation link to <strong>{formData.email}</strong>.
          </p>

          <Link href="/login">
            <Button>Back to Login</Button>
          </Link>

        </div>

      </main>

    )

  }



  return(

    <main className="min-h-screen flex">

      {/* LEFT FORM */}

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">

        <div className="w-full max-w-md">

          <div className="text-center mb-8">

            <Link href="/">
              <h1 className="text-4xl font-serif text-primary">
                RIWAJ
              </h1>
            </Link>

            <p className="text-muted-foreground mt-2">
              Create your account
            </p>

          </div>


          {error && (

            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-sm flex gap-3">
              <AlertCircle className="h-5 w-5 text-destructive"/>
              <p className="text-sm">{error}</p>
            </div>

          )}


          <form onSubmit={handleSubmit} className="space-y-5">

            {/* NAME */}

            <div className="grid grid-cols-2 gap-4">

              <input
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e)=>setFormData({...formData,firstName:e.target.value})}
                className="border rounded-sm px-4 py-3"
              />

              <input
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e)=>setFormData({...formData,lastName:e.target.value})}
                className="border rounded-sm px-4 py-3"
              />

            </div>


            {/* EMAIL */}

            <div className="relative">

              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5"/>

              <input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e)=>setFormData({...formData,email:e.target.value})}
                className="w-full pl-10 py-3 border rounded-sm"
              />

            </div>



            {/* PHONE */}

            <div className="relative">

              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5"/>

              <input
                placeholder="Phone (optional)"
                value={formData.phone}
                onChange={(e)=>setFormData({...formData,phone:e.target.value.replace(/[^\d+]/g,"")})}
                className="w-full pl-10 py-3 border rounded-sm"
              />

            </div>



            {/* PASSWORD */}

            <div className="relative">

              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5"/>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e)=>setFormData({...formData,password:e.target.value})}
                className="w-full pl-10 pr-12 py-3 border rounded-sm"
              />

              <button
                type="button"
                onClick={()=>setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
              </button>

            </div>



            {/* PASSWORD RULES */}

            {formData.password && (

              <div className="text-sm space-y-1">

                {passwordRequirements.map((r,i)=>(
                  <div key={i} className={`flex gap-2 ${r.met ? "text-green-600":"text-muted-foreground"}`}>
                    <Check size={16}/>
                    {r.label}
                  </div>
                ))}

              </div>

            )}



            {/* TERMS */}

            <label className="flex gap-2 text-sm">

              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e)=>setAgreeTerms(e.target.checked)}
              />

              I agree to the Terms and Privacy Policy

            </label>



            <Button
              type="submit"
              disabled={isLoading}
              className="w-full gap-2"
            >

              {isLoading ? "Creating..." : "Create Account"}

              {!isLoading && <ArrowRight size={16}/>}

            </Button>

          </form>



          <div className="my-6 text-center text-sm text-muted-foreground">
            OR
          </div>



          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignup}
          >
            Continue with Google
          </Button>



          <p className="text-center mt-6 text-sm">

            Already have an account?{" "}

            <Link href="/login" className="text-primary">
              Sign In
            </Link>

          </p>

        </div>

      </div>



      {/* RIGHT IMAGE */}

      <div className="hidden lg:block lg:w-1/2 relative">

        <Image
          src="https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=1200&h=1600&fit=crop"
          alt="Ethnic wear"
          fill
          className="object-cover"
          priority
        />

      </div>

    </main>

  )

}