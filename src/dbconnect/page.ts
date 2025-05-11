const mongoose = require("mongoose")
import { MONGO_URL } from "@/config/dbconfig"

let isConnected = false

export const dbConnect = async()=>{
    try{
        if(isConnected) return;
      await  mongoose.connect(MONGO_URL)
        const connection = mongoose.connection
        connection.on("connected",()=>{
            isConnected = true
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
