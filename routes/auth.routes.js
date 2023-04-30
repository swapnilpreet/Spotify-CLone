const router = require('express').Router();
const bcrypt = require('bcrypt');
const { UserModel } = require('../model/User.model');


router.post('/',async (req,res)=>{
    const user = await UserModel.findOne({email:req.body.email});

    if(!user) return res.status(400).send({message:"Invalid email"});

    const validPassword = await bcrypt.compare(req.body.password,user.password); 

    if(!validPassword) return res.status(400).send({message:"Invalid  password"});

    const token=user.generateAuthToken();
    res.status(200).send({data:token,message:"signing in please wait..."});

})

module.exports=router;