// const express = require("express")
// const app = express()
// const path= require("path")
// const hbs= require("ejs")
// const async = require("ejs")
const collection=require("./mongodb")



app.use(express.json())
app.set("view engine","ejs")

app.use(express.urlencoded({extended:false}))


app.get("/login",(req,res)=>{
    res.render("login.ejs")
})
app.get("/signup",(req,res)=>{
    res.render("signup")
})

app.post("/signup", async(req,res)=>{
  const data={
    name:req.body.name,
    password:req.body.password
  }  
  console.log(data)
await collection.insertMany([data])

  res.render("Home") 
    
})

app.post("/login", async(req,res)=>{

 try{
  const check =await collection.findOne({name:req.body.name})
  if(check.password===req.body.password){
    
  res.render("Home")
 }
 else{
  res.send("wrong password")
 }

}
 catch{
  res.send("wrong details")
 }

 
}) 

app.listen(3000,()=>{
    console.log(" 3000 port connected");
})