import { NextRequest,NextResponse } from "next/server";
import { dbConnect } from "@/dbconnect/page"
import { withAuth } from "@/serverSideMiddleware";
dbConnect()

 async function GETHandler(request:NextRequest){
    try{
      const response = NextResponse.json({message:"User Logout successfully"},{status:200})
      response.cookies.set("accessToken","",{httpOnly:true,secure:false,sameSite:"strict",path:"/",maxAge:0,expires: new Date(0)})
      response.cookies.set("refreshToken","",{httpOnly:true,secure:false,sameSite:"strict",path:"/",maxAge:0,expires: new Date(0)})
      return response

    }
    catch(error:any){
        console.log(error)
        return NextResponse.json({message:"Unable to Logout the user"},{status:400})
    }
}

export const GET = withAuth(GETHandler)