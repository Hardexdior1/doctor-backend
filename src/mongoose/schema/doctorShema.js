import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  // Basic Info
  name: { 
    type: String, 
    required: true 
  },
  specialty: { 
    type: String, 
    required: true,
  },
  bio: { 
    type: String, 
    maxlength: 200 
  },
isDemo:{
type:Boolean,
default:false,
},
  email: { 
    type: String, 
    unique: true,
    match: /^\S+@\S+\.\S+$/ // Simple email validation
  },
  bio:{
    type:String,
    default:"Child health fanatic by day, exhausted toy-finder by night. Simple soul."
  },
  phone: { 
    type: String 
  },

  // Image (Stored as URL or file path)
  image: { 
    type: String,
    // default: "/doc-1.jpg.webp", // Placeholder if no image uploaded
    required:true,
  },

  // Availability
  availableDays: [{ 
    type: String, 
    enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] 
  }],
  availableSlots: [{ 
    type: String // e.g., ["09:00", "10:00"]
  }],

  // Metadata
  isActive: { 
    type: Boolean, 
    default: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  

});

export const Doctor = mongoose.model("Doctor", doctorSchema);