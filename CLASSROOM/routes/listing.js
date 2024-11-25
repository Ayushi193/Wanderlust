const express=require("express");
const router=express.Router();
const ExpressError=require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {listingSchema}=require("../schema.js");
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
  router.get("/new",(req,res)=>{
      res.render("listings/new.ejs");
  });
  //show route
  router.get("/:id",async(req,res)=>{
      let {id}=req.params;
  
   const listing= await Listing.findById(id).populate("reviews");
   res.render("listings/show.ejs",{listing});
  });
  //create route
  router.post("/",validateListing,async (req,res,next)=>{
    
      const newListing= new Listing(req.body.listing);
     await newListing.save();
      res.redirect("/listings");
  
  })
  ;
  //edit route
  router.get("/:id/edit",async (req,res)=>{
      let  { id }=req.params;
   const listing= await Listing.findById(id);
   res.render("listings/edit.ejs",{ listing });
  });
  //update route
  router.put("/:id",async(req,res)=>{
      let {id}=req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
   res.redirect(`/listings/${id}`);
  });
  //delete route
  router.delete("/:id",async(req,res)=>{
      let {id}=req.params;
    let deleteListing=await Listing.findByIdAndDelete(id);
   res.redirect("/listings")
  });
  module.exports=router;