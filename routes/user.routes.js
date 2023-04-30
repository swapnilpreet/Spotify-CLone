const router = require('express').Router();
const bcrypt = require('bcrypt');
const { validate, UserModel } = require('../model/User.model');
const auth = require("../middleware/auth");
const admin = require("../middleware/Admin")
const validObjectId = require("../middleware/validObjectId")

router.post('/', async(req,res)=>{
    const {error} = validate(req.body);

    if(error) return res.status(400).send({message:error.details[0].message})

    const user =await UserModel.findOne({email:req.body.email});

    if(user){
        return res.status(403).send({message:"User with this email  already exits!"});
    }
    const salt= await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password,salt);
    let newUser =await new UserModel({
        ...req.body,
        password: hashPassword
    }).save();

    newUser.password=undefined;
    newUser._v=undefined;

    res.status(200).send({data: newUser, message:"Account Created Successfully"});
})

//get all users

router.get('/',admin,async(req,res)=>{
    const users=await UserModel.find().select("-password-_v");
    res.status(200).send({data:users});
});

// get user by id

router.get('/:id',[validObjectId,auth],async(req,res)=>{
    const user = await UserModel.findById(req.params.id);
    res.status(200).send({data:user})
})
// updated user by id

router.put('/:id',[validObjectId,auth],async(req,res)=>{
    const user = await UserModel.findByIdAndUpdate(
        req.params.id,
        {$set:req.body},
        {new:true}
    ).select("-password -_v");
    res.status(200).send({data:user})
})

// deleted user by id

router.delete('/:id',[validObjectId,admin],async(req,res)=>{
    await UserModel.findByIdAndDelete(req.params.id);
    res.status(200).send({message:'successfully deleted user'})
});
module.exports=router;