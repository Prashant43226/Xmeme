const express=require('express');
const app=express();
const mongoose=require('mongoose');
const dbConfig=require('./config/database.config.js');
const bodyParser=require('body-parser');
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors=require('cors');
require("dotenv").config();
mongoose.Promise=global.Promise
const connection = process.env.MONGO_DB_URI||"mongodb+srv://Prashant43226:123@cluster0.l2xpy.mongodb.net/Xmeme?retryWrites=true&w=majority";

//database connection
mongoose.connect(connection,{
 useNewUrlParser: true ,
 useUnifiedTopology: true, 
 useFindAndModify:false
}).then(()=>{
    console.log("Successfully connected to the database")
}).catch(err=>{
    console.log('Could not connect to database.Exit')
    process.exit();
})

app.use(cors());
app.use(express.static("./views"));
app.use(express.json())
app.use(bodyParser.json())

const Meme_model=require('./models/meme')
app.use(express.urlencoded());

app.set('view engine', 'ejs');
app.set('views', './views');

const swaggerOptions = {
    swaggerDefinition: {
      info: {
        version: "1.0.0",
        title: "Xmeme",
        description: "Xmeme Information",
        contact: {
          name: "R.Prashant"
        },
        servers: ["http://localhost:8081"]
      }
    },
    // ['.routes/*.js']
    apis: ["app.js"]
  };

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//Routes
app.get('/',function(req,res){
    Meme_model.find({},function(err,memes){
        if(err){
            console.log('Error in fetching task from db');
            return;
        }
        return res.render('memes',{
            title:'xmeme',
            memes:memes
        });
    }).sort({_id:-1}).limit(100)
});


const {check,validationResult}=require('express-validator')
const urlencodedParser=bodyParser.urlencoded({extended:false})

function isURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return pattern.test(str);
  }

app.post('/create-memes',urlencodedParser,[
    check('name','Username is empty')
        .exists(),
    check('url','url is not valid')
        .exists(),
    check('caption','caption is empty')
        .exists()
],function(req,res){
    Meme_model.create({
        name: req.body.name,
        url: req.body.url,
        caption: req.body.caption
    },function(err,newmemes){
        if(err){
            console.log('error in creating task',err);
            return;
        }
        return res.redirect('/');
    });
});

app.get("/edit/:id",(req,res)=>{
    console.log(req.params.id);
    Meme_model.findOneAndUpdate({_id:req.params.id},req.body,{new:true},(err,docs)=>{
        if(err){
            console.log('Error');
        }
        else{
            res.render('edit',{i:docs});
        }})
    });
//Edit Put request
app.post("/edit/:id",(req, res)=>{
    Meme_model.findByIdAndUpdate({_id:req.params.id},req.body,(err)=>{
        if(err){
            console.log(err);
            res.redirect("/");
        }else{
            res.redirect("/");
        }
    })
})

require('./routes/routes')(app);


app.post('/memes',(req,res)=>{
    res.send(memes.create);
});



app.get('/memes',(req,res)=>{
    res.send(memes.findAll);
});

//Start server
app.listen(process.env.PORT||8081,function(req,res){
    console.log("Server is listening on port 8081")
});