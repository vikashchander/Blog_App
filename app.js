const bodyParser = require("body-parser"),
      expressSanitizer = require("express-sanitizer"),
      methodOverride = require("method-override"),
      mongoose    = require("mongoose"),
      express   = require("express"),
      app  = express();
      
mongoose.connect('mongodb://localhost/blog_app',{useNewUrlParser:true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride('_method'));
//create schema
var blogSchema =new mongoose.Schema({
    title:String,
    img:String,
    description:String,
    created:{type:Date, default:Date.now()}
    
});

//create model
var Blog = mongoose.model("blogApp",blogSchema);

//create table
// Blog.create({
//     title:"vikash",
//     img:"https://cdn.pixabay.com/photo/2014/11/27/18/36/tent-548022__340.jpg",
//     description:"this is a most beautiful place"
// },(err,blog)=>{
//     if(err){
//         console.log("error is"+err);
//     }else{
//         console.log("show blog"+blog);
//     }
// });

app.get("/",(req,res)=>{
    res.redirect("/blogs");
    
});

app.get("/blogs",(req,res)=>{
    Blog.find({},(err,blogs)=>{
        if(err){
            console.log("error is"+err);
        }else{
            res.render("index",{blog:blogs});
        }
    });
    
});


app.get("/blogs/new",(req,res)=>{
 res.render("new");
 
});
//create routes
app.post("/blogs",(req,res)=>{
    console.log("req.body"+req.body);
    req.body.blog.description=req.sanitizer(req.body.blog.description);
   Blog.create(req.body.blog,(err,newBlog)=>{
     if(err){
         res.render("new");
     }else{
         console.log("req.body.blog"+req.body.blog);
         res.redirect("/blogs")
     }
 }); 
});

app.get("/blogs/:id",(req,res)=>{
    req.body.blog.description=req.sanitizer(req.body.blog.description);
    Blog.findById(req.params.id,(err,foundBlog)=>{
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show",{getBlog:foundBlog});
        }
    })
});

//edit route
app.get("/blogs/:id/edit",(req,res)=>{
    Blog.findById(req.params.id,(err,editBlog)=>{
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit",{getBlog:editBlog});
        }
    });
});


//update route
app.put("/blogs/:id",(req,res)=>{
    Blog.findByIdAndUpdate(req.params.id,req.body.getBlog,(err,editBlog)=>{
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

//delete route
app.get("/blogs/:id/delete",(req,res)=>{
   Blog.findById(req.params.id,(err,editBlog)=>{
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("delete",{getBlog:editBlog});
        }
    });
})
//delete
app.delete("/blogs/:id",(req,res)=>{
    Blog.findByIdAndRemove(req.params.id,req.body.getBlog,(err,editBlog)=>{
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
});
app.listen(process.env.PORT ||process.env.IP,(err)=>{
  if(err){
      console.log("error is "+err);
  }else{
      console.log("server start ...");
  }
});     