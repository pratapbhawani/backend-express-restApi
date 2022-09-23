const jwt=require("jsonwebtoken");
const register=require("../models/registers");

const auth=async(req,res,next)=>{
    try {
        const token=req.cookies.jwt;
        const verifyUser=await jwt.verify(token,process.env.SECRET_KEY);
        console.log(verifyUser);
        next();
    } catch (error) {
        res.status(401).send(error);
        console.log(error);
    }
}

module.exports=auth;