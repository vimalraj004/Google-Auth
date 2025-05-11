import {z} from "zod"
require("dotenv").config()
console.log(process.env.MONGO_URL)

const result = z.string().url()
const parsed = result.safeParse(process.env.MONGO_URL)
if(!parsed.success){
    throw new Error ("Invalid MONGO_URL")
}
export const MONGO_URL = parsed.data