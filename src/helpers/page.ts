import CryptoJS from "crypto-js"
import { secretkey } from "../config/baseurlconfig"
import { NextRequest,NextResponse } from "next/server"
import  Jwt  from "jsonwebtoken"
require("dotenv").config()
import Cookie from "js-cookie"
import toast from "react-hot-toast"
import axios from "axios"
import {baseUrl} from "../config/baseurlconfig"

export const registerAndLoginService = async(endpoint:string,type:string,body:object)=>{
try{
    const response = await axios({
        baseURL:baseUrl,
        url:endpoint,
        method:type,
        data:body,
        headers:{
            "Content-Type":"application/json"
        }

    })
    return response

}
catch(error:any){
    console.log(error)
    // toast.error(error?.response?.data?.message)
  throw error;
    
}
}
export const commonService =async (endpoint:string,type:string,body?:object):Promise<any>=>{
  
    try{
      
        const accessToken = Cookie.get("accessToken")
        const response = await axios({
            baseURL:baseUrl,
            url:endpoint,
            method:type,
            data:body,
            headers:{
                "Content-Type":"application/json",
                ...(accessToken && {Authorization:`Bearer ${accessToken}`})
            },
            withCredentials:true
        })
        return response
    }
    
    catch(error:any){
        console.log(error);
    
        const message = error?.response?.data?.message || "Unexpected error";
    
        if (error.response?.status === 500) {
          throw new Error("Internal server error: " + message);
        }
         else if (error.response?.status === 401) {
          toast.error("Unauthorized: " + message);
          window.location.href = "/"
    }
    else{
        toast.error(message)
    }
    }
}



export const getDataFromToken = async (request:NextRequest)=>{
    try{
      const token = await  request.cookies.get("accessToken")?.value || "";

      if(!token){
          return NextResponse.json({message:"UnAuthorized user"},{status:401})
      }
      let decrypttoken
      if(token){
        decrypttoken =  Jwt.verify(token,process.env.TOKEN_SECRET!)
      }
  
    return decrypttoken
            
    }
    catch(error){
        console.log(error)
        throw new Error ("Internal server error"+error)
    }
}


export const encryptdata = (data:string):string =>{
    try{
      const encryptdata =   CryptoJS.AES.encrypt(data,secretkey).toString()
      return encryptdata

    }
    catch(error:any){
        console.log(error)
        return `${error.message}`
    }
}

export const decryptdata = async(data:string):Promise<string>=>{
try{
 const byte = CryptoJS.AES.decrypt(data,secretkey)
 const decryptdata = byte.toString(CryptoJS.enc.Utf8)
 return decryptdata

}
catch(error:any){
    console.log(error)
     return `${error.message}`

}
}