"use client"

import {
createContext,
useContext,
useState,
useEffect,
useCallback,
useMemo,
ReactNode
} from "react"

import { createClient } from "@/lib/supabase/client"
import type { Product, CartItemWithProduct } from "@/lib/database.types"
import type { User, AuthChangeEvent, Session } from "@supabase/supabase-js"



export interface CartItem {
id: string
productId: string
name: string
price: number
image: string
quantity: number
size?: string
color?: string
}



interface CartContextType {
items: CartItem[]
addItem: (
product: Product,
size?: string,
color?: string,
quantity?: number
) => Promise<void>
removeItem: (id: string) => Promise<void>
updateQuantity: (id: string, quantity: number) => Promise<void>
clearCart: () => Promise<void>
totalItems: number
totalPrice: number
isLoading: boolean
user: User | null
}



const CartContext = createContext<CartContextType | undefined>(undefined)



export function CartProvider({ children }: { children: ReactNode }) {

const supabase = createClient()

const [items,setItems] = useState<CartItem[]>([])
const [user,setUser] = useState<User | null>(null)
const [isLoading,setIsLoading] = useState(true)



/* ------------------------------------------------ */
/* Helpers */
/* ------------------------------------------------ */

const mapCartItem = (item: CartItemWithProduct): CartItem => ({
id: item.id,
productId: item.product_id,
name: item.products.name,
price: item.products.price,
image: item.products.image_url || item.products.images?.[0] || "",
quantity: item.quantity,
size: item.size || undefined,
color: item.color || undefined
})



const loadGuestCart = () => {
try{
const saved = localStorage.getItem("riwaj_cart")
if(saved){
setItems(JSON.parse(saved))
}
}catch{
setItems([])
}
}



/* ------------------------------------------------ */
/* Initial Load */
/* ------------------------------------------------ */

useEffect(()=>{

const init = async () => {

const { data:{ user } } = await supabase.auth.getUser()

setUser(user)

if(user){

const { data } = await supabase
.from("cart_items")
.select("*, products(*)")
.eq("user_id", user.id)

if(data){
setItems(data.map(mapCartItem))
}

}else{

loadGuestCart()

}

setIsLoading(false)

}

init()



const { data:{ subscription } } =
supabase.auth.onAuthStateChange(
async (event: AuthChangeEvent, session: Session | null) => {

setUser(session?.user ?? null)



if(event === "SIGNED_IN" && session?.user){

const saved = localStorage.getItem("riwaj_cart")

if(saved){

const localItems = JSON.parse(saved) as CartItem[]

await Promise.all(
localItems.map(item =>
supabase.from("cart_items").upsert({
user_id: session.user.id,
product_id: item.productId,
quantity: item.quantity,
size: item.size ?? null,
color: item.color ?? null
},{
onConflict:"user_id,product_id,size,color"
})
)
)

localStorage.removeItem("riwaj_cart")

}

const { data } = await supabase
.from("cart_items")
.select("*, products(*)")
.eq("user_id", session.user.id)

if(data){
setItems(data.map(mapCartItem))
}

}



if(event === "SIGNED_OUT"){
setItems([])
}

})



return ()=> subscription.unsubscribe()

},[])



/* ------------------------------------------------ */
/* Save guest cart */
/* ------------------------------------------------ */

useEffect(()=>{

if(!user && !isLoading){

localStorage.setItem("riwaj_cart", JSON.stringify(items))

}

},[items,user,isLoading])



/* ------------------------------------------------ */
/* Add Item */
/* ------------------------------------------------ */

const addItem = useCallback(async(
product: Product,
size?: string,
color?: string,
quantity: number = 1
)=>{

const image =
product.image_url || product.images?.[0] || ""

if(user){

const { data } = await supabase
.from("cart_items")
.upsert({
user_id: user.id,
product_id: product.id,
quantity,
size: size ?? null,
color: color ?? null
},{
onConflict:"user_id,product_id,size,color"
})
.select("*, products(*)")
.single()

if(data){

setItems(prev => {

const existing = prev.find(i =>
i.productId === product.id &&
i.size === size &&
i.color === color
)

if(existing){

return prev.map(i =>
i.productId === product.id &&
i.size === size &&
i.color === color
? { ...i, quantity: i.quantity + quantity }
: i
)

}

return [...prev, mapCartItem(data)]

})

}

}else{

setItems(prev => {

const existing = prev.find(i =>
i.productId === product.id &&
i.size === size &&
i.color === color
)

if(existing){

return prev.map(i =>
i.productId === product.id &&
i.size === size &&
i.color === color
? { ...i, quantity: i.quantity + quantity }
: i
)

}

return [
...prev,
{
id:`local-${Date.now()}`,
productId: product.id,
name: product.name,
price: product.price,
image,
quantity,
size,
color
}
]

})

}

},[user])



/* ------------------------------------------------ */
/* Remove Item */
/* ------------------------------------------------ */

const removeItem = useCallback(async(id:string)=>{

if(user && !id.startsWith("local-")){
await supabase.from("cart_items").delete().eq("id",id)
}

setItems(prev => prev.filter(item => item.id !== id))

},[user])



/* ------------------------------------------------ */
/* Update Quantity */
/* ------------------------------------------------ */

const updateQuantity = useCallback(async(
id:string,
quantity:number
)=>{

if(quantity < 1){
await removeItem(id)
return
}

if(user && !id.startsWith("local-")){
await supabase
.from("cart_items")
.update({ quantity })
.eq("id", id)
}

setItems(prev =>
prev.map(item =>
item.id === id
? { ...item, quantity }
: item
)
)

},[user,removeItem])



/* ------------------------------------------------ */
/* Clear Cart */
/* ------------------------------------------------ */

const clearCart = useCallback(async()=>{

if(user){
await supabase
.from("cart_items")
.delete()
.eq("user_id", user.id)
}

setItems([])

},[user])



/* ------------------------------------------------ */
/* Totals */
/* ------------------------------------------------ */

const totalItems = useMemo(
()=> items.reduce((sum,i)=> sum + i.quantity,0),
[items]
)

const totalPrice = useMemo(
()=> items.reduce((sum,i)=> sum + i.price * i.quantity,0),
[items]
)



return (

<CartContext.Provider
value={{
items,
addItem,
removeItem,
updateQuantity,
clearCart,
totalItems,
totalPrice,
isLoading,
user
}}
>

{children}

</CartContext.Provider>

)

}



/* ------------------------------------------------ */
/* Hook */
/* ------------------------------------------------ */

export function useCart(){

const context = useContext(CartContext)

if(!context){
throw new Error("useCart must be used within CartProvider")
}

return context

}