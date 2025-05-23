import mongoose from "mongoose";

const appointmentSchema=new mongoose.Schema(
  {
   
    date:{

    type: String, 
    default:new Date()
    
    },
   name:{
        type:String,
        required:true,
    },
   email:{
    type:String,
    required:true,
   },
   message:{ 
    type:String,
   },
   diagnosis:{
    type:String,
    required:true,
   },
   
   doctorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Doctor', // Links to Doctor model
    required: true 

  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

}
)
export const  Appointment=mongoose.model('appointment',appointmentSchema)