const express=require('express');
const app=express();
const mongoose=require('mongoose');
const dbConfig=require('./config/database.config.js');
const bodyParser=require('body-parser');
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

mongoose.Promise=global.Promise

//database connection
mongoose.connect(dbConfig.url,{
 useNewUrlParser: true ,
 useUnifiedTopology: true, 
}).then(()=>{
    console.log("Successfully connected to the database")
}).catch(err=>{
    console.log('Could not connect to database.Exit')
    process.exit();
})

//Middlewares
/*app.use('/posts',()=>{
    console.log("This is middleware running")
})
*/
app.use(express.static("./views"));


app.use(express.json())

app.use(bodyParser.json())

const Meme_model=require('./models/meme')
//Require meme routes
//require('./routes/routes')(app);

app.use(express.urlencoded());

app.set('view engine', 'ejs');
app.set('views', './views');


const swaggerOptions = {
    swaggerDefinition: {
      info: {
        version: "1.0.0",
        title: "Customer API",
        description: "Customer API Information",
        contact: {
          name: "Amazing Developer"
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


app.get('/',(req,res)=>{
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

app.post('/create-memes',function(req,res){
    Meme_model.create({
        name: req.body.name,
        url: req.body.url,
        caption: req.body.caption
    },function(err,newmemes){
        if(err){
            console.log('error in creating task',err);
            return;
        }
        console.log(newmemes);
        return res.redirect('back');
    });
});


app.get("/edit/:id",(req,res)=>{
    console.log(req.params.id);
    Meme_model.findOneAndUpdate({_id:req.params.id},req.body,{new:true},(err,docs)=>{
        if(err){
            console.log('Error');
        }
        else{
            console.log(docs);
            console.log(docs.name);
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
            console.log(req.params.id);
            res.redirect("/");
        }
    })
})

/*
app.get('/edit',(req,res)=>{
    Meme_model.findById(req.params.id,function(err,memes){
        if(err){
            console.log('Error ');
            res.redirect("/");
        }
        console.log(req.params.id);
        return res.render('edit',{
            memes:memes
        });
    })
});


app.put('/edit',(req,res)=>{
   Meme_model.findByIdAndUpdate(req.params._id,req.body.memes,function(err,updatedata){
    if(err){
        console.log(err);
        res.redirect("/");
    }
    else{
        console.log(req.body.memes);
        res.redirect('/');
    }
})
})
*/
/*
app.put('/show-memes',(req,res)=>{
    Meme_model.find({},function(err,memes){
        if(err){
            console.log('Error in fetching task from db');
            return;
        }
        return res.render('memes',{
            title:'xmeme',
            memes:memes
        });
    });
});
*/

require('./routes/routes')(app);

/**
 * @swagger
 * /memes:
 *  post:
 *    description: Use to request all memes
 *    responses:
 *      '200':
 *        title:xmeme
 */
app.post('/memes',(req,res)=>{
    res.send(memes.create);
});

/**
 * @swagger
 * /memes:
 *  get:
 *    description: Use to request all memes
 *    responses:
 *      '200':
 *        title:xmeme
 */

app.get('/memes',(req,res)=>{
    res.send(memes.findAll);
});

/*
app.get('/memes/:id',function(req,res){
    Meme_model.findById(req.params.id)
    .then(meme=>{
        if(!meme){
            return res.status(404).send({
                message:"Meme not found with id "+req.params.memeId
            });
        }
        res.send(meme._id);
    }).catch(err=>{
        if(err.kind==='ObjectId'){
            return res.status(404).send({
                message:"Meme not found with id"+req.params.memeId
            });
        }
        return res.status(500).send({
            message:"Error retrieving meme with id"+req.params.memeId
        });
    });
});
*/
/*
app.get('/memes/id',(req,res)=>{
    res.send(memes.findOne);
})

app.post('/memes/id',(req,res)=>{
    res.send(memes.create);
});
*/
//Start server
app.listen(8081,()=>{
    console.log("Server is listening on port 8081")
});