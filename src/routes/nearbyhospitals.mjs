
import { NearbyHospitals } from "../mongoose/schema/nearbyhospitals.js";
import {   Router } from "express";


const router=Router()

router.get('/api/hospitals/nearby',async(request,response)=>{
    const {lat,lng}=request.query

    try {
    const hospitals= await NearbyHospitals.find({
            location: {
                $near: {
                  $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
                  $maxDistance: 10000 // Optional: 10 km max radius
                }
              }
        })

        return response.status(200).send(hospitals)
        
    } catch (error) {
        console.log(error)
    }
})

export default router