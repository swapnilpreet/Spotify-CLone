const router = require('express').Router();
const {PlaylistModel,validate}= require('../model/Playlist.model');
const {SongModel} = require('../model/Song.model');
const {user, UserModel} = require('../model/User.model')
const auth = require("../middleware/auth");
const validObjectId= require('../middleware/validObjectId');
const Joi = require('joi');



// create a playlist

router.post("/",auth,async(req,res)=>{
    const {error}= validate(req.body);
    if(error) return res.status(400).send({message:error.details[0].message})

    const user = await UserModel.findById(req.user._id);
    const playlist = await PlaylistModel({...req.body,user:user._id}).save();
    user.playlists.push(playlist._id);
    await user.save();


    res.status(201).send({data:playlist})

})

// edit playlist by id

router.put('/edit/:id',[validObjectId,auth],async (req,res)=>{
    const schema = Joi.object({
        name:Joi.string().required(),
        desc:Joi.string().allow(""),
        img:Joi.string().allow(""),
    })
    const {error}= schema.validate(req.body);
    if(error) return res.status(400).send({message:error.details[0].message});
    
    const playlist = await PlaylistModel.findById(req.params.id);
	if (!playlist) return res.status(404).send({ message: "Playlist not found" });

    const user = await UserModel.findById(req.user._id);
    if(!user._id.equals(playlist.user)){
        return res.status(404).send({message:"you Dont have a access to edit this playlist"});
    }
    playlist.name= req.body.name;
    playlist.desc= req.body.desc;
    playlist.img= req.body.img;
    await playlist.save();


    res.status(200).send({message:"Updated Successfully"})

})

// add song to playlist 
router.put('/add/song',auth,async(req,res)=>{
    const schema = Joi.object({
        playlistId:Joi.string().required(),
        songId:Joi.string().required(),
    })
     
    const { error } = schema.validate(req.body);
	if (error) return res.status(400).send({ message: error.details[0].message });

    const user = await UserModel.findById(req.user._id);
	const playlist = await PlaylistModel.findById(req.body.playlistId);
    
    if (!user._id.equals(playlist.user))
		return res.status(403).send({ message: "User don't have access to add!" });

        if (playlist.song.indexOf(req.body.songId) === -1) {
            playlist.song.push(req.body.songId);
        }
	await playlist.save();
	res.status(200).send({ data: playlist, message: "Added to playlist" });


})

// remove song  from playlist

router.put('/remove/song',auth,async(req,res)=>{
    const schema = Joi.object({
        playlistId:Joi.string().required(),
        songId:Joi.string().required(),
    })

    const {error} = schema.validate(req.body)
    if(error)return res.send(400).send({message:error.details[0].message});
  
    const user = await UserModel.findById(req.user._id);
    const playlist = await PlaylistModel.findById(req.body.playlistId);

    if(!user._id.equals(playlist.user)){
        return res.status(403).send({message:"User dont have to access to remove song"})
    }
  
    const index =playlist.song.indexOf(req.body.songId);
    playlist.song.splice(index,1);
    await playlist.save();
    res.status(200).send({data:playlist,message:"Removed from playlist successfully"})
})

// user favourite playlist
router.get('/favourite',auth,async(req,res)=>{
    const user = await UserModel.findById(req.user._id);
    const playlists = await PlaylistModel.findById({_id:user.playlists});
    res.status(200).send({data:playlists});
})

// get random playlists
router.get('/random',auth,async(req,res)=>{
    const playlists=await PlaylistModel.aggregate([{$sample:{size:10}}]);
    res.status(200).send({data:playlists});

})

// get playlist by id and songs 

router.get('/:id',[validObjectId,auth],async(req,res)=>{
    const playlist = await PlaylistModel.findById(req.params.id);

    if(!playlist) return res.status(404).send("not found");

    const song = await SongModel.find({_id:playlist.song});
    res.status(200).send({data:{playlist,song}});
})


// get all playlists 
router.get('/',auth,async(req,res)=>{
    const playlists = await PlaylistModel.find();
    res.status(200).send({data:playlists});
})


// delete playlist by id
router.delete("/:id", [validObjectId, auth], async (req, res) => {
	const user = await UserModel.findById(req.user._id);
	const playlist = await PlaylistModel.findById(req.params.id);
	if (!user._id.equals(playlist.user))
		return res.status(403).send({ message: "User don't have access to delete!" });

	const index = user.playlists.indexOf(req.params.id);
	user.playlists.splice(index, 1);
	await user.save();
    console.log(playlist._id)
	await playlist.deleteOne();
	res.status(200).send({ message: "Removed from library" });
});

module.exports = router;
