import { Doctor } from "../mongoose/schema/doctorShema.js";
import {  Router } from "express";
import { Appointment } from "../mongoose/schema/appointmentSchema.js";
import { Review } from "../mongoose/schema/reviewSchema.js";
import upload from "../cloudinary/cloudinary.js"

const router=Router()

router.get('/api/test2',async(request,response)=>{
    return response.status(200).send({
        message: 'hello',
        apiKey: process.env.CLOUD_API_KEY
      });
      
})

// create doctor
router.post('/api/create-doctor',upload.single('image'),async(request,response)=>{
const {body}=request

    if(!request.user){
        return response.status(401).send('un authorized')
    }
if(!request.user.role=="admin"){
    return response.status(401).send("un-authorized")
}

try {
    const image = request.file?.path;
    const newDoctor=new Doctor({...body,image})


    const createdDoctor= await newDoctor.save()
    console.log("doctor created succesfully",createdDoctor)

    return response.status(201).send(createdDoctor)
    
} catch (error) {
 
        if (error.code === 11000 && error.keyPattern?.email) {
            return response.status(400).json({msg: "Email already exists." });
          }
    return response.status(500).send({msg:error.message})
    
}
})

// get all doctors
router.get('/api/all-doctors',async(request,response)=>{
    // if (!request.user) {
    //     return response.status(401).send('Unauthorized: Login required');
    //   }
    //   if (request.user.role !== 'admin') {
    //     return response.status(403).send('Forbidden: Admin access only');
    //   }

try {
    const doctors = await Doctor.find();
    
  

    return response.status(201).send(doctors)
    
} catch (error) {

    return response.status(500).send({msg:error.message})
    
}
})

// get doctor appointmets/reviews by id from admin
router.get('/api/doctor/:doctorId/records/admin',async(request,response)=>{
    if (!request.user) {
        return response.status(401).send('Unauthorized: Login required');
      }
      if (request.user.role !== 'admin') {
        return response.status(403).send('Forbidden: Admin access only');
      }

try {
    
    const [appointments,reviews,doctor]=await Promise.all([
         // Get appointments for this doctor
      Appointment.find({ doctorId: request.params.doctorId }),
      
      // Get reviews for this doctor (assuming you have a Review model)
      Review.find({ doctorId: request.params.doctorId }) ,
    //   Doctor.find({ doctorId: request.params.doctorId }) ,
    Doctor.find({ _id: request.params.doctorId }) // returns an array with 1 item




    ])
   return response.status(200).send({appointment:appointments,review:reviews,doctor:doctor});
    
} catch (error) {
  return  response.status(500).send({ error: error.message });

}


})

// doctor records
router.get('/api/doctor/:doctorId/records', async (request, response) => {
    try {
        const [ reviews, doctor] = await Promise.all([
            // Appointment.find({ doctorId: request.params.doctorId }),
            Review.find({ doctorId: request.params.doctorId }),
            Doctor.findById(request.params.doctorId) // Add this line to fetch doctor data
        ]);

        return response.status(200).send({
            review: reviews,
            doctor: doctor // Include doctor data in response
        });
    } catch (error) {
        return response.status(500).send({ error: error.message });
    }
});

//create review
router.post('/api/create-review',async(request,response)=>{
const {body}=request

try {
    
    const newReview=new Review(body)
    console.log('creating review',newReview)

    const savedReview=await newReview.save()
console.log("User saved:", savedReview)
return response.status(201).send({msg:"review sent successfully", review: savedReview})

} catch (error) {
    return response.status(400).send({ msg: "Error ccreating review", error: error.message });
}
})

// get all reviews
router.get('/api/reviews', async (request, response) => {
    if(!request.user){
        return response.status(401).send('un authorized')
    }
if(!request.user.role=="admin"){
    return response.status(401).send("un-authorized")
}
    try {
        const [ reviews] = await Promise.all([
            // Appointment.find({ doctorId: request.params.doctorId }),
            Review.find(),
        ]);

        return response.status(200).send({
           reviews,
        });
    } catch (error) {
        return response.status(500).send({ error: error.message });
    }
});

// edit doctor profile
router.patch('/api/edit-doctor/:doctorId',upload.single('image'),async(request,response)=>{
    const {body}=request
    if (!request.user) {
        return response.status(401).send('Unauthorized: Login required');
      }
      if (request.user.role !== 'admin') {
        return response.status(403).send('Forbidden: Admin access only');
      }
    try {
        const doctorId = request.params.doctorId;
        const image = request.file?.path; // Get the image path from the request

        // Update the doctor with the new data
        const updatedDoctor = await Doctor.findByIdAndUpdate(
            doctorId,
            { ...body, image }, // Include the image path in the update
            { new: true } // Return the updated document
        );

        if (!updatedDoctor) {
            return response.status(404).send({ msg: "Doctor not found" });
        }

        return response.status(200).send({
            message: 'Doctor profile updated successfully!',
            doctor: updatedDoctor
        });
            } catch (error) {
               
        return response.status(500).send({ msg: error.message });
    }
});


export default router