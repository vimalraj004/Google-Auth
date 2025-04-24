import {z} from "zod"
require("dotenv").config()
console.log(process.env.NEXT_PUBLIC_BASE_URL)

const result = z.string().url()
 const parsed = result.safeParse(process.env.NEXT_PUBLIC_BASE_URL)
if(!parsed.success){
    throw new Error ("Invalid Base Url")
}
export const baseUrl = parsed.data

