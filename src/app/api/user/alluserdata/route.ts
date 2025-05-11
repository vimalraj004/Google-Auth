import { NextRequest,NextResponse } from "next/server";
import User from "@/models/userModel";
import { dbConnect } from "@/dbconnect/page";
import { withAuth } from "@/serverSideMiddleware";
dbConnect()

async function GETHandler(request:NextRequest){
    try{
        const alluser = await User.find().select("-password -__v")
        if(alluser){
            return  NextResponse.json({message:"successfully fetched",data:alluser},{status:200})
        }else{
            return  NextResponse.json({message:"failed to fetch alluserdatas"},{status:400})
        }

    }
    catch(error){
        console.log(error)
        return NextResponse.json({message:"Internal Serer Error"},{status:500})
    }
}

 async function PUTHandler(request:NextRequest){
    try{
       const reqbody = await request.json()
       const {name,email,_id}=reqbody
       if(!name || !email || !_id){
        return NextResponse.json({message:"Invalid Inputs"},{status:400})
       }
       const result = await User.findByIdAndUpdate({_id},{$set:{name,email}},{new:true})
       if(!result){
            return NextResponse.json({message:"Failed to update the data"},{status:400})
       }else{
        return NextResponse.json({message:"Updated successfully"},{status:200})
       }
      


    }
    catch(error){
        console.log(error)
        return NextResponse.json({message:"Internal Serer Error"},{status:500})

    }
}

 async function DELETEHandler (request:NextRequest){
    try{
        const reqbody = await request.json()
        const {name,email,_id}=reqbody
        if(!name || !email || !_id){
         return NextResponse.json({message:"Invalid Inputs"},{status:400})
        }
       const result = await User.findByIdAndDelete({_id})
        if(!result){
             return NextResponse.json({message:"Failed to delete the data"},{status:400})
        }else{
         return NextResponse.json({message:"Deleted successfully"},{status:200})
        }
       

    }
    catch(error){
        console.log(error)
        return NextResponse.json({message:"Internal Serer Error"},{status:500})

    }
}
export const GET = withAuth(GETHandler);
export const PUT = withAuth(PUTHandler)
export const DELETE = withAuth(DELETEHandler)