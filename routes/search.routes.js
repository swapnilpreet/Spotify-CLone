const auth = require('../middleware/auth');
const { PlaylistModel } = require('../model/Playlist.model');
const { SongModel } = require('../model/Song.model');

const router = require('express').Router();



router.get('/',auth,async(req,res)=>{
    const search = req.query.search;
    if(search !== ""){
       const songs =await SongModel.find({
        name:{$regex:search, $options:"i"}
       }).limit(10);

       const playlist =await PlaylistModel.find({
        name:{$regex:search, $options:"i"}
       }).limit(10);

       const result ={songs,playlist}
       res.status(200).send({data:result});
    }else{
        res.status(200).send({})
    }
})

module.exports = router;