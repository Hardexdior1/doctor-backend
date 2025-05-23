import mongoose from "mongoose";

const reviewSchema=new mongoose.Schema(
  {
   
    createdAt: { 
      type: Date,
      default: () => new Date() 
    },
   name:{
        type:String,
        required:true,
    },
   
   message:{
    type:String,
    required:true
   },
   rating: { type: Number, min: 1, max: 5 },

  
   doctorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Doctor', // Links to Doctor model
    required: true 


  }}
)
export const  Review=mongoose.model('review',reviewSchema)