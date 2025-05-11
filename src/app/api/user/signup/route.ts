 import User from "@/models/userModel";
 import { dbConnect } from "@/dbconnect/page";
 import { NextRequest,NextResponse } from "next/server";
 import {z} from "zod"
 import bcrypt from "bcryptjs"
 import { decryptdata } from "@/helpers/page";
 dbConnect()

 export async function POST (request:NextRequest){
    try{
        const reqbody = await request.json()
        const {name,email,password}= reqbody
        if(!name || !email || !password){
            return NextResponse.json({message:"Required data is missing"},{status:400})
        }
        const decryptpassword = await decryptdata(password)
        const uservalidation = z.object({
            name:z.string()
            .min(4,{message:"Name must be have 4 character long"})
            .regex(/^[A-Za-z]+$/,{message:"Name field should not contain special character"}),
            email:z.string()
            .email({message:"Invalid email address"}),
            password:z.string()
            .min(6,{message:"password length should be at least 6 char long"})
            .regex(/[a-z]/,{message:"Password should contain at least one lower case"})
            .regex(/[A-Z]/,{message:"Password should contain at least one upper case"})
            .regex(/[0-9]/,{message:"Password should contain at least one Number"})
            .regex(/[^a-zA-Z0-9]/,{message:"Password should contain at least one special char"})
        })
      const result = await uservalidation.safeParse({name,email,password:decryptpassword})
      if(!result.success){
        return NextResponse.json({message:result.error.issues},{status:400})
      }else{
       const response = await User.findOne({email})
       if(response){
        return NextResponse.json({message:"email already exist"},{status:409})
       }else{
        const salt = await bcrypt.genSalt(10)
       const encryptpass =  await bcrypt.hash(decryptpassword,salt)
       const newUser = {
        name,
        email,
        password:encryptpass
       }
       const savedData = await new User(newUser).save()
       if(savedData){
        return NextResponse.json({message:"Data saved successfully"},{status:201})
       }else{
        return NextResponse.json({message:"Failed to save the data"},{status:400})
       }

       }

      }

    }
    catch(error:any){
        console.log(error)
        return NextResponse.json({error:error.message},{status:500})
    }

 }
