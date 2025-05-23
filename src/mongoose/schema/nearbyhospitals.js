
import mongoose from "mongoose";

const nearbrSchema= new mongoose.Schema(
    {
        name: String,
        location: {
          type: { type: String, enum: ['Point'], default: 'Point' },
          coordinates: { type: [Number], required: true } // [longitude, latitude]
        },
    }
)
nearbrSchema.index({ location: '2dsphere' }); // Important for geospatial queries

export const NearbyHospitals=mongoose.model('nearbyHospital',nearbrSchema)
