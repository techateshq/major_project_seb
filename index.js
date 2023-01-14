const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const url = require('url');





const Advertisement = require('./models/Advertisement');
const Movie = require('./models/Movie');


const app = express();


// login start
const collection=require("./mongodb")

app.use(express.json())
app.set("view engine","ejs")

app.use(express.urlencoded({extended:false}))

// login end

app.use("/assets", express.static('assets'))
app.set("view engine","ejs")


// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
const imageMimeTypes = ["image/jpeg", "image/png", "images/gif"];


// DATABASE CONNECTION
mongoose.connect('mongodb://127.0.0.1:27017/Fitlane_Sorts');
const db = mongoose.connection;
db.once('error', (err)=>{
    console.log(err);    
});
db.on("open", ()=>{
    console.log("database connection success");
})


// page rendar code
app.get('/',async(req,res)=>{
  try{
    var movie = '';
    var result = '';
    app.post('/srch',async(req,res)=>{
      var names = req.body.search_bar;
      result = {name : names};
      if (names == ''){
        movie  = await Movie.find();
        res.render("Home", {
        movie
    });
        
      }
      else{
        movie = await Movie.find(result);
        res.render('Home',{
          movie
        })
      }
      
      console.log(movie)
      // console.log(names)
    });

    movie  = await Movie.find();
    const ad  = await Advertisement.find();
    res.render("Home", {
      movie,ad
    });
  }catch (err){
    console.log("err: "+ err); 
  }

})

// logi & signup

app.get('/Login',async(req,res)=>{
  res.render("login2",)})


app.get("/signup",(req,res)=>{
    res.render("signup")
  })

// signup form
app.post("/signup", async(req,res)=>{
  const data={
    name:req.body.name,
    password:req.body.password
  }  
  console.log(data)
  await collection.insertMany([data])
  const movie  = await Movie.find();

  res.render("Home", {
    movie
  }) 
    
})
// signup form end 

// login form
app.post("/login", async(req,res)=>{

  try{
   const check =await collection.findOne({name:req.body.name})
   if(check.password===req.body.password){
    const movie  = await Movie.find();
     
   res.render("Home", {
    movie
  })
  }
  else{
   res.send("wrong password")
  }
 
 }
  catch{
   res.send("wrong details")
  }
 
  
 })
// login form end


// logi & signup end
  
app.get('/Products',async(req,res)=>{
  try{
    var movie = '';
    app.post('/product',async(req,res)=>{
      var names = req.body.search_bar;
      const result = {name : names};
      if (names == ''){
        movie  = await Movie.find();
        res.render("Products", {
        movie
    });
        
      }
      else{
        movie = await Movie.find(result);
        res.render("Products",{
          movie
        })
      }
      
      console.log(movie)
    });

    movie  = await Movie.find();
    res.render("Products", {
      movie
    });
    }catch (err){
        console.log("err: "+ err); 
      }
      
      movie  = await Movie.find();
      res.render("Products",{
        movie
  })})

app.get('/product-details',async(req,res)=>{
    const queryObject = url.parse(req.url,true).query;
    const ProductId = queryObject.id
    const movie  = await Movie.findById(ProductId);
    res.render("product_detail",{
      movie
    })
  })

app.get('/Viewcart',async(req,res)=>{
  const movie  = await Movie.find();
  res.render("Cart",{
    movie
  })
})


app.get('/Buys',async(req,res)=>{
  const queryObject = url.parse(req.url,true).query;
  const ProductId = queryObject.id
  const movie  = await Movie.findById(ProductId);
  res.render("Buy",{
    movie
  })
})

app.get('/Advertisement', async (req, res, next)=>{
  try{
    const advertisement = await Advertisement.find();
    res.render("Advertisement", {
      advertisement
    });
  }catch (err){
    console.log("err: "+ err); 
  }
  
})


app.post('/advert', async ( req, res, next)=>{
  const {name, Description,Collection, AdvertismentBanner, img} = req.body;
  const advertisement = new Advertisement({
    name,
    Description,
    Collection,
    AdvertismentBanner
  });

  // SETTING IMAGE AND IMAGE TYPES
  saveImage(advertisement, img);
  try{
    const newAdvertisement = await advertisement.save();
    console.log(newAdvertisement);  
    res.redirect("/Advertisement");
  }catch (err){
    console.log(err);    
  }
});


function saveImage(advertisement, imgEncoded) {
  // CHECKING FOR IMAGE IS ALREADY ENCODED OR NOT
  if (imgEncoded == null) return;

  // ENCODING IMAGE BY JSON PARSE
  // The JSON.parse() method parses a JSON string, constructing the JavaScript value or object described by the string
  const img = JSON.parse(imgEncoded);
  console.log( "JSON parse: "+ img);
  
  // CHECKING FOR JSON ENCODED IMAGE NOT NULL 
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
  // AND HAVE VALID IMAGE TYPES WITH IMAGE MIME TYPES
  if (img != null && imageMimeTypes.includes(img.type)) {

    // https://nodejs.org/api/buffer.html
    // The Buffer class in Node.js is designed to handle raw binary data. 
    // SETTING IMAGE AS BINARY DATA
    advertisement.img = new Buffer.from(img.data, "base64");
    advertisement.imgType = img.type;
  }
}

// end


// MIDDLEWARE
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));

// ROUTES
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));

// ROUTES
app.get("/Product_upload", async (req, res, next) => {
  try{
    const movie  = await Movie.find();
    res.render("Product_upload", {
      movie
    });
  }catch (err){
    console.log("err: "+ err); 
  }
});




app.post('/add', async ( req, res, next)=>{
  const {name, Price,Description,Category, type, img} = req.body;
  const movie = new Movie({
    name,
    Price,
    Description,
    Category,
    type
  });

  // SETTING IMAGE AND IMAGE TYPES
  saveImage(movie, img);
  try{
    const newMovie = await movie.save();
    console.log(newMovie);  
    res.redirect('/Product_upload')  ;
  }catch (err){
    console.log(err);    
  }
});








function saveImage(movie, imgEncoded) {
  // CHECKING FOR IMAGE IS ALREADY ENCODED OR NOT
  if (imgEncoded == null) return;

  // ENCODING IMAGE BY JSON PARSE
  // The JSON.parse() method parses a JSON string, constructing the JavaScript value or object described by the string
  const img = JSON.parse(imgEncoded);
  console.log( "JSON parse: "+ img);
  
  // CHECKING FOR JSON ENCODED IMAGE NOT NULL 
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
  // AND HAVE VALID IMAGE TYPES WITH IMAGE MIME TYPES
  if (img != null && imageMimeTypes.includes(img.type)) {

    // https://nodejs.org/api/buffer.html
    // The Buffer class in Node.js is designed to handle raw binary data. 
    // SETTING IMAGE AS BINARY DATA
    movie.img = new Buffer.from(img.data, "base64");
    movie.imgType = img.type;
  }
}







const port = process.env.PORT || 4000;
app.listen(port, () => console.log("Server is running on : " + port));
