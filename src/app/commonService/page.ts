import axios from "axios"
import config from "../frontend.env/page"

const registerAndLoginService = async(url:string,type:string,body:object)=>{
try{
    const response = await axios({
        baseURL:config.baseUrl,
        url:url,
        method:type,
        data:body,
        headers:{
            "Content-Type":"application/json"
        }

    })
    console.log(response)
    return response

}
catch(error){
    console.log(error)
}
}
export default {registerAndLoginService}