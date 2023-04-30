const mongoose = require('mongoose');
const Joi = require("joi");

const objectId = mongoose.Schema.Types.ObjectId;


const playlistSchema = new mongoose.Schema({
    name:{type:String,required:true},
    user:{type:objectId,ref:"user",required:true},
    desc:{type:String},
    song:{type:Array,required:[]},
    img:{type:String},
})

const validate =(playlist)=>{
    const schema =Joi.object({
        name:Joi.string().required(),
        user:Joi.string().required(),
        desc:Joi.string().allow(""),
        songs:Joi.string().items(Joi.string()),
        img:Joi.string().allow(""),
    })
    return schema.validate(playlist);
};

const PlaylistModel=mongoose.model('playlist',playlistSchema);

module.exports={PlaylistModel,validate}