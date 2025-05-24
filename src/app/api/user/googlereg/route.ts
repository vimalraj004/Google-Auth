import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { dbConnect } from "@/dbconnect/page";
import jwt from "jsonwebtoken"
dbConnect()

export async function POST(request:NextRequest){
    try{
       const reqbody = await request.json()
       const{name,email,googleid,googleimg} = reqbody
       if(!name|| !email || !googleid || !googleimg){
        return NextResponse.json({message:"Required data is missing"},{status:400})
       }
      const existinguser =  await User.findOne({email})
      if(existinguser){
        return NextResponse.json({message:"User email is Already registered"},{status:409})
      }else{
        const result = await new User(reqbody).save()
         if(!result){
            return NextResponse.json({message:"Failed to Store the data"},{status:400})
         }else{
                 let payload ={
                    userId:result._id,
                    userName:result.name,
                    userEmail:result.email,
                    userImg:result.googleimg
                  }
                  const accessToken =  jwt.sign(payload,process.env.TOKEN_SECRET!,{expiresIn:"1m"})
                  const refreshToken = jwt.sign(payload, process.env.TOKEN_SECRET!, { expiresIn: "2m" })
             
                    const response =  NextResponse.json({message:"Loggedin Successfully"},{status:200})
                    response.cookies.set("accessToken",accessToken,{
                    httpOnly:true,
                    secure:false,
                    sameSite:"strict",
                    path:"/",
                    maxAge:60})
                    response.cookies.set("refreshToken",refreshToken,{
                    httpOnly:true,
                    secure:false,
                    sameSite:"strict",
                    path:"/",
                    maxAge:120})
            
                    return response;
         }


      }


    }
    catch(error){
        console.log(error)
     return NextResponse.json({message:"Internal Server Error"},{status:500})
    }
}