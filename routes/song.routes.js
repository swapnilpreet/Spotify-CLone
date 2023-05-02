const router = require('express').Router();
const {UserModel}= require('../model/User.model');
const {SongModel,validate}= require("../model/Song.model");
const auth = require('../middleware/auth');
// const auth = require("../middleware/auth");
const admin =require('../middleware/Admin');
const validObjectId = require('../middleware/validObjectId');


// create a song
router.post('/',admin,async(req,res)=>{
     const {error} = validate(req.body);
     if(error) return res.status(400).send({message:error.details[0].message})

     const song = await SongModel(req.body).save();
     res.status(201).send({data:song,message:"Song created Successfully"});

})

// get all songs 
router.get('/',async(req,res)=>{
    const songs = await SongModel.find();
    res.status(200).send({data:songs})
})

// updated song
router.put("/:id",[validObjectId,admin],async(req,res)=>{
    const song = await SongModel.findByIdAndUpdate(req.params.id,req.body,{new:true})
    res.status(200).send({data:song,message:"Updated SOng Sucessfully"})
})

// delete the song
router.delete('/:id',[validObjectId,admin],async(req,res)=>{
    await SongModel.findByIdAndDelete(req.params.id);
    res.status(200).send({message:"Song Deleted Successfully"});
});

// like a songs
router.put('/like/:id',[validObjectId,auth],async(req,res)=>{
    let resMessage ="";
    const song = await SongModel.findById(req.params.id);
    if(!song) return res.status(400).send({message:"Song not found"})

    const user = await UserModel.findById(req.user._id);
    const index = user.likedSongs.indexOf(song._id);
    if(index===-1){
        user.likedSongs.push(song._id);
        resMessage="Added to your Liked Songs"
    }else{
        user.likedSongs.splice(index,1)
        resMessage="Remove from your Liked Songs"
    }
    await user.save();
    res.status(200).send({message:resMessage})
});
// get all liked songs 
router.get('/like',auth,async(req,res)=>{
    const user = await UserModel.findById(req.user._id);
    const songs=await SongModel.find({_id:user.likedSongs});
    res.status(200).send({data:songs});
})

module.exports=router;
