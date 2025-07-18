import { Doctor } from "../mongoose/schema/doctorShema.js";
import { Appointment } from "../mongoose/schema/appointmentSchema.js";
import { Review } from "../mongoose/schema/reviewSchema.js";
import upload from "../cloudinary/cloudinary.js"
import { Router } from "express";
import nodemailer from 'nodemailer';

const router=Router()

router.get('/api/test2',async(request,response)=>{
    return response.status(200).send({
        message: 'hello',
        apiKey: process.env.CLOUD_API_KEY
      });
      
})
router.post('/api/create-appointment',async(request,response)=>{
const {body}=request


try {
    const { name ,email, message, diagnosis,date,phone,doctorId} = request.body;
    console.log(name)
    const doctor = await Doctor.findById(doctorId);
      

    if (!doctor || !doctor.email) {
      return response.status(404).send({ msg: "Doctor not found or missing email." });
    }
  const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "adeniranquwam001@gmail.com",
                pass: `${process.env.GmailPassword}`
            }
        });

        // automatic message that would be sent to the appointed doctor
        const mailDoctor= {
            from: 'Medicare <no-reply@medicare.com>',
            to: doctor.email,
            replyTo: email,
            subject: `New appointment booked with you,  ${doctor.name}`,
html: `<h3>New Appointment Notification</h3>
       <p><strong>Dear  ${doctor.name},</strong></p>
       <p>You have a new appointment booked through Medicare.</p>
       <p><strong>Patient Details:</strong></p>
       <ul>
         <li><strong>Name:</strong> ${name}</li>
         <li><strong>Email:</strong> ${email}</li>
         <li><strong>Phone:</strong> ${phone}</li>
         <li><strong>Diagnosis:</strong> ${diagnosis}</li>
         <li><strong>Date:</strong> ${date}</li>
       </ul>
       <p><strong>Message from the patient:</strong></p>
       <p>${message.replace(/\n/g, '<br>')}</p>
       <hr>
       <p>This is an automated message from Medicare. Please log in to your dashboard to view or manage this appointment.</p>`
        };

       



        await Promise.all([
            transporter.sendMail(mailDoctor),
        ]);
        


    const newAppointment=new Appointment( {...body, user: request.user?._id || undefined})
    console.log('creating appointment',newAppointment)
    const savedAppointment=await newAppointment.save()
console.log("User saved:", savedAppointment)
return response.status(201).send({msg:"Appointment created successfully", appointment: savedAppointment})

} catch (error) {
    return response.status(400).send({ msg: "Error creating appointment", error: error.message });
}
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
 const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "adeniranquwam001@gmail.com",
                pass: `${process.env.GmailPassword}`
            }
        });

        // automatic message that would be sent to the appointed doctor
       const mailDoctor = {
  from: 'Mediplus <no-reply@medicare.com>',
  to: createdDoctor.email,
  subject: `Welcome to Mediplus, Dr. ${createdDoctor.name}! Your profile is live.`,
  html: `
    <h3>🎉 Your Mediplus Profile is Now Live!</h3>
    <p><strong>Dear Dr. ${createdDoctor.name},</strong></p>

    <p>We’re excited to let you know that your <strong>${createdDoctor.specialty}</strong> profile has been successfully created on <strong>Mediplus</strong>.</p>

    <p>Patients can now find your profile and book appointments with you directly on our platform.</p>

    <h4>🔔 What You Should Know:</h4>
    <ul>
      <li>If you’re unavailable at any time, kindly inform the admin so your profile can be temporarily hidden from booking.</li>
    </ul>

    <p>If you have any questions or need to update your details, feel free to contact the admin.</p>

    <hr>
    <p style="color:#777;">This is an automated message from Mediplus. Please do not reply directly to this email.</p>
  `
};

         await Promise.all([
            transporter.sendMail(mailDoctor),
        ]);
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



// DELETE doctor by ID
router.delete('/api/delete-doctor/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if ID is valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid doctor ID format' });
    }

    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
     if (doctor.isDemo) {
      return res.status(403).json({ message: "You can't delete a demo doctor" });
    }
    const deletedDoctor = await Doctor.findByIdAndDelete(id);

    res.status(200).json({ message: 'Doctor deleted successfully', doctor: deletedDoctor });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({ message: 'Server error while deleting doctor' });
  }
});



export default router