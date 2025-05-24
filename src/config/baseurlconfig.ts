import {z} from "zod"
require("dotenv").config()




const check = z.string()
.regex(/[A-Z]/,{message:"secretkey must have atleast one upper case"})
.regex(/[a-z]/,{message:"secretkey must have atleast one lower case"})
.regex(/[0-9]/,{message:"secretkey must have atleast one Number"})
.regex(/[^A-Za-z0-9]/,{message:"secretkey must have atleast one special char"})

const valid = check.safeParse(process.env.NEXT_PUBLIC_SECRET_KEY)
if(!valid.success){
 throw new Error (valid.error.message)
}
export const secretkey = valid.data

