const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const XmemeSchema=new Schema(
    {
        name: {
            type:String
        }, 
        url: { 
            type:String
        },
        caption: {
            type:String
        }
    }//, {
       // timestamps:true
    //}
    ,{
        versionKey:false
    }
);


XmemeSchema.method('toJSON', function () {
    const { __v, _id, name,url,caption,...object } = this.toObject();
    object.id = _id;
    object.name=name;
    object.url=url;
    object.caption=caption;
    return object;
 });

module.exports=mongoose.model('Meme',XmemeSchema);