import { getDataFromToken } from "@/helpers/page";
import { NextRequest,NextResponse } from "next/server";
import { dbConnect } from "@/dbconnect/page"
import { withAuth } from "@/serverSideMiddleware";
dbConnect()

 async function GETHandler(request:NextRequest){
    try{
    const result = await getDataFromToken(request)
    if(typeof result !== "string"){
        return NextResponse.json({message:"successfully fetched the data",data:result},{status:200})
    }
    else{
        return NextResponse.json({message:"UnAuthorized user"},{status:401})
    }

    }
    catch(error:any){
        console.log(error)
        return NextResponse.json({message:"Internal Server Error"},{status:500})
    }

}

export const GET = withAuth(GETHandler)