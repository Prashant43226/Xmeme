
module.exports=(app)=>{
    const memes=require('../controllers/meme.controller.js');


//create new memes
app.post('/memes',memes.create)

//retrieve all memes
app.get('/memes',memes.findAll);

//retrieve memes with particular id
app.get('/memes/:id',memes.findOne);

//update memes with particular id
app.put('/memes/:id',memes.update);
}