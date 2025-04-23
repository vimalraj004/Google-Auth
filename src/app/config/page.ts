import {z} from "zod"

const result = z.string().url()
 const parsed = result.safeParse("http://localhost:4001")
if(parsed.error){
    throw new Error ("Invalid Base Url")
}
export const baseUrl = parsed.data

