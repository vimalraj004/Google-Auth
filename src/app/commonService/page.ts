import axios from "axios"
import {baseUrl} from "../config/baseurlconfig/page"

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
    console.log(response,"checkit")
    return response

}
catch(error){
    console.log(error)
    throw new Error ("Internal server error"+error)
}
}
