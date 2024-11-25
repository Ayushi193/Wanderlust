const express=require("express");
const router=express.Router();
router.get("/posts",(req,res)=>{
    res.send("GET for users");
});
router.get("/posts/:id",(req,res)=>{
    res.send("GET for users id");
});
router.post("/posts",(req,res)=>{
    res.send("GET for users");
});
router.delete("/posts",(req,res)=>{
    res.send("Delete for users id");
});
module.exports=router;