const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");

const employeSchema=new mongoose.Schema({
    firstname:{
        type:String,
        require:true
    },
    lastname:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    gender:{
        type:String,
        require:true
    },
    phone:{
        type:Number,
        require:true,
        unique:true
    },
    age:{
        type:Number,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    confirmpassword:{
        type:String,
        require:true
    },
    tokens:[{
        token:{
            type:String,
            require:true
        }
    }]
});


//FUNCTION TO CREATE TOKEN AND CALLED FROM APP.JS
employeSchema.methods.generateAuthToken=async function(){
    try {
        console.log(this._id);
        const token=jwt.sign({_id:this._id},process.env.SECRET_KEY);
        console.log(token);
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        console.log(this.tokens);
        return token;

    } catch (error) {
        console.log("the error part in token creation function"+error);
        res.send("the error part in token creation function"+error);
    }
}

//FUNCTION AUTO CALLED BEFORE SAVE FUNCTION CALL INN APP.JS
employeSchema.pre("save",async function(next){
    if(this.isModified("password")){
        // console.log(`the current password is ${this.password}`);
        this.password=await bcrypt.hash(this.password,10);
        // console.log(`the current password is ${this.password}`);
        this.confirmpassword=await bcrypt.hash(this.password,10);
    }
    next();
})

//CREATING COLLENCTION AND EXPORTING IT
const Register=new mongoose.model("Register",employeSchema);
module.exports=Register;












