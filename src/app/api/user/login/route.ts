import mongoose from "mongoose"
import User from "@/models/userModel"
import {z} from "zod"
import CryptoJS from "crypto-js"
import { decryptdata } from "@/helpers/page"
import { dbConnect } from "@/dbconnect/page"
import { NextRequest,NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { secretkey } from "@/config/baseurlconfig"
import jwt from "jsonwebtoken"
require("dotenv").config()
dbConnect()

export async function POST (request:NextRequest){
    try{
      const reqbody = await request.json()
      const {email,password}= reqbody
      if( !email || !password){
        return NextResponse.json({message:"Required data is missing"},{status:400})
    }
      const decryptpass =await decryptdata(password)
      const uservalidation = z.object({
        email:z.string()
        .email({message:"Invalid email address"}),
        password:z.string()
        .min(6,{message:"password length should be at least 6 char long"})
        .regex(/[a-z]/,{message:"Password should contain at least one lower case"})
        .regex(/[A-Z]/,{message:"Password should contain at least one upper case"})
        .regex(/[0-9]/,{message:"Password should contain at least one Number"})
        .regex(/[^a-zA-Z0-9]/,{message:"Password should contain at least one special char"})
    })
  const result = await uservalidation.safeParse({email,password:decryptpass})
  if(!result.success){
    return NextResponse.json({message:result.error.issues},{status:400})
  }else{
  const checkemail =   await User.findOne({email})
  if(checkemail){
    const checkpass = await bcrypt.compare(decryptpass,checkemail.password)
    if(checkpass){
      let payload ={
        userId:checkemail._id,
        userName:checkemail.name,
        userEmail:checkemail.email
      }
      const accessToken =  jwt.sign(payload,process.env.TOKEN_SECRET!,{expiresIn:"2m"})
      const refreshToken = jwt.sign(payload, process.env.TOKEN_SECRET!, { expiresIn: "3m" })
 
        const response =  NextResponse.json({message:"Loggedin Successfully"},{status:200})
        response.cookies.set("accessToken",accessToken,{
        httpOnly:true,
        secure:false,
        sameSite:"strict",
        path:"/",
        maxAge:120})
        response.cookies.set("refreshToken",refreshToken,{
        httpOnly:true,
        secure:false,
        sameSite:"strict",
        path:"/",
        maxAge:180})

        return response;
    }else{
        return NextResponse.json({message:"Incorrect password"},{status:401})
    }
  }else{
    return NextResponse.json({message:"User not Exist"},{status:401})
  }
  }

    }catch(error:any){
        console.log(error)
        return NextResponse.json({message:"Internal Server Error"},{status:500})
    }

}