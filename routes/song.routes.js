const router = require('express').Router();
const {UserModel}= require('../model/User.model');
const {SongModel,validate}= require("../model/Song.model");
const Authmiddleware = require('../middleware/auth');
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

//
