const mongoose = require("mongoose")
const schema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
    },
    googleid:{
        type:String
    },
    googleimg:{
        type:String
    }

})
const User = mongoose.model("users",schema)
export default User