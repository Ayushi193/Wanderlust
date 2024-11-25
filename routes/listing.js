const express=require("express");
const router=express.Router();
const ExpressError=require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn}=require("../middleware.js");
const {listingSchema}=require("../schema.js");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' });

const validateListing=(req,res,next)=>{
    let{error}=listingSchema.validate(req.body);
    if(error){
      let errMsg=error.details.map((el)=>el.message).join(",");
      throw new  ExpressError(400,errMsg);


      
    }else{
      next();
    }
  };
router.get("/",async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
  
  });
  router.get("/new",isLoggedIn,(req,res)=>{
    try{
    
      res.render("listings/new.ejs");
    }catch(e){
      console.log(e);
    }
  });
  //show route
  router.get("/:id",async(req,res)=>{
      let {id}=req.params;
  console.log(id);
   const listing= await Listing.findById(id).populate("reviews");
   res.render("listings/show.ejs",{listing});
  });
  //create route
  
  router.post("/",validateListing,async (req,res,next)=>{
    
      const {newListing}=new Listing(req.body.listing);
      console.log(newListing);
      await newListing.save();
    
     req.flash("success","New listing created!");
      res.redirect("/listings");
  
  });
  
  
  //edit route
  router.get("/:id/edit",async (req,res)=>{
      let  { id }=req.params;
   const listing= await Listing.findById(id);
   res.render("listings/edit.ejs",{ listing });
  });
  //update route
  router.put("/:id",isLoggedIn,async(req,res)=>{
      let {id}=req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
   res.redirect(`/listings/${id}`);
  });
  //delete route
  router.delete("/:id",isLoggedIn,async(req,res)=>{
      let {id}=req.params;
    let deleteListing=await Listing.findByIdAndDelete(id);
   res.redirect("/listings")
  });
  

  module.exports=router;