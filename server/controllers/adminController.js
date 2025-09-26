import jwt from "jsonwebtoken";



export const adminLogin=async(req,res)=>{
    try{
        const  {email, password} = req.body;

    if(password === process.env.ADMIN_PASSWORD && email=== process.env.ADMIN_EMAIL){
        const token= jwt.sign({email}, process.env.JWT_SECRET, {expiresIn:"7d"});
        res.cookie('sellertoken' , token,{
           httpOnly:true,
           maxAge: 24*7*60*60*1000,
       });
        return res.json({success:true, message:'logged in'})
    }else{
         return res.json({success:false, message:'invalid credentials'})
    }
    }catch(error){  
        console.log(error.message);
        res.json({success:false, message:error.message});
    }
}

export const isAdminAuth=async(req,res)=>{
    try{
      return res.json({success: true});
    }catch(error){
       console.log(error.message);
       res.json({success:false, message:error.message});
    }
}
