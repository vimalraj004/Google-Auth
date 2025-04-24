const mongoose = require("mongoose")
import { MONGO_URL } from "@/app/config/dbconfig/page"

export const connect = async()=>{
    try{
      await  mongoose.connect(MONGO_URL,{dbName:"GoogleAuth"})
        const connection = mongoose.connection
        connection.on("conncected",()=>{
            console.log("Server is connected to the database")
        })
        connection.on("error",(err:object)=>{
            console.log("Server failed to connect to the database",err)
        })
        connection.on("disconnect",()=>{
            console.log("DB is disconnected")
        })

    }
    catch(error){
        console.error("Database connection error:", error);
    }
}