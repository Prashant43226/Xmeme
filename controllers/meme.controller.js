const Meme=require('../models/meme.js');
const mongoose = require('mongoose');

//Create and Save a new Meme
exports.create=(req,res)=>{
    
    //Create a meme
    const meme=new Meme({
        name:req.body.name,
        url:req.body.url,
        caption:req.body.caption
    });

    //Save meme data in database

    var memesProjection={
        __v:false,
        name:false,
        caption:false,
        url:false,
        createdAt:false,
        updatedAt:false
    };

    var urlregex=/(http(s?):)|([/|.|\w|\s])*\.(?:jpg|gif|png)/g;
    meme.save()
    .then(data=>{
        Meme.find({_id:data._id},memesProjection,function(err,memes){
            if(err) res.status(500).send({
                message:err.message||"Some error occured while retrieving the memes"
            }) ;
            res.send(memes[0]);
        })
    }).catch(err=>{
        res.status(500).send({
            message:err.message||"Some error occurred while storing in database"
        });
    });
};

exports.getUsers = function(req, res, next) {

    var usersProjection = { 
        __v: false,
        _id: false
    };

    User.find({}, usersProjection, function (err, users) {
        if (err) return next(err);
        res.json(users);
    });    
}
//Retrieve and return all memes from the database.
exports.findAll=function(req,res){
    var memesProjection={
        __v:false,
        createdAt:false,
        updatedAt:false
    };
    Meme.find({},memesProjection,function(err,memes){
        if(err) res.status(500).send({
            message:err.message||"Some error occured while retrieving the memes"
        }) ;
        res.send(memes);
    })
};

//Find a particular meme with a particular id
exports.findOne=(req,res)=>{
    var memesProjection={
        __v:false,
        createdAt:false,
        updatedAt:false
    };


    Meme.find({_id:req.params.id},memesProjection,function(err,memes){
        if(err) res.status(500).send({
            message:err.message||"Some error occured while retrieving the memes"
        }) ;
        res.send(memes[0]);
    })
};

//Update a particular meme
exports.update=(req,res)=>{
    //Find meme and update it with the request body
    Meme.findByIdAndUpdate(req.params.id,{
        url:req.body.url,
        caption:req.body.caption
    }//,{new:true}
    )
    .then(meme=>{
        if(!meme){
            return res.status(404).send({
                message:"Meme not found with id"+req.params.id
            });
        }
        res.send(meme)
    }).catch(err=>{
        if(err.kind==='ObjectId'){
            return res.status(404).send({
                message:"Meme not found with id"+req.params.id
            });
        }
        return res.status(500).send({
            message:"Error updating meme with id"+req.params.id
        });
    });
};