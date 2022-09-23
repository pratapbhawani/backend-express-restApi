const express=require("express");
const path=require("path");
const hbs=require("hbs");
const Register=require("./models/registers");
require("./db/conn");
const port=process.env.PORT || 3000;
const app=express();
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
require('dotenv').config();
const cookieParser=require("cookie-parser");
const auth=require("./middleware/auth");

const static_Path=path.join(__dirname,"../public");
const template_path=path.join(__dirname,"../templates/views");
const partials_path=path.join(__dirname,"../templates/partials");

app.use(express.static(static_Path));


app.set("view engine","hbs");
app.set("views",template_path);

hbs.registerPartials(partials_path);


app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
// console.log(process.env.SECRET_KEY);

app.get("/",(req,res)=>{
    res.render("index");
})


app.get("/register",(req,res)=>{
    res.render("register");
})

app.get("/login",(req,res)=>{
    res.render("login");
})

app.get("/secret",auth,(req,res)=>{
    console.log(`the value we got from cookie for token: ${req.cookies.jwt}`)
    res.render("secret");
})

app.post("/register",async(req,res)=>{
    try{
        const password=req.body.password;
        const cpassword=req.body.confirmpassword;
        // console.log(req.body);
        if(password===cpassword){
            // console.log(req.body);
            const registerEmployee=new Register({
                firstname:req.body.firstname,
                lastname:req.body.lastname,
                email:req.body.email,
                gender:req.body.gender,
                phone:req.body.phone,
                age:req.body.age,
                password:password,
                confirmpassword:cpassword,
            });
            console.log("the successful creation of document"+registerEmployee);

            const token=await registerEmployee.generateAuthToken();
            console.log("successfull creation of token"+token);

            res.cookie("jwt",token,{expires:new Date(Date.now()+50000),httpOnly:true});
            
            console.log("document after token creation"+registerEmployee);
            const registered=await registerEmployee.save();
            res.status(201).render("register");
        }
        else{
            res.send("Password is not matching");
        }
        
    }catch(e){
        res.status(400).send(e);
        console.log(e);
    }
})

app.post("/login",async(req,res)=>{
    try{
        const password=req.body.password;
        const email=req.body.email;
        const user=await Register.findOne({email:email});
        const isMatch=await bcrypt.compare(password,user.password);
        const token=await user.generateAuthToken();

        res.cookie("jwt",token,{expires:new Date(Date.now()+50000),httpOnly:true})
        if(isMatch){
            res.status(201).render("index");
            console.log("login successfully...")
        }
        else{
            res.send("Incorrent credentials...")
        }
    }
    catch(e){
        console.log(e);
        res.status(400).send("cathc part Incorrent credentials...");
    }
})

app.listen(port,()=>{
    console.log(`connection has been successfull..`);
})

