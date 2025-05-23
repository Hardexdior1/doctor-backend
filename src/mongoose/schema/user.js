
import mongoose from "mongoose"
const userSchema =new mongoose.Schema(
    {
        username:{
            type: String,

            required:true,
            unique:true
        },

        
        password:{
            
            type: String,

            required:true
        },
        role:{
            type: String,
            enum:['user','admin','agent'],
            default:'user'


        },
        // appoitmentHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'appointment' }],
        pastDoctors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }]

    }
  
)
export const User=mongoose.model('user',userSchema)