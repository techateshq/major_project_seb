const mongoose= require("mongoose")

// mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/Fitlane_Sorts")
.then(()=>{
    console.log("database connected")
})
.catch(()=>{
    console.log("failed to connect")
})

const LogInSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },

})

const collection =new mongoose.model("Login_Details",LogInSchema)

module.exports=collection