import { request, response, Router} from "express"

import { Appointment } from "../mongoose/schema/appointmentSchema.js";
import nodemailer from 'nodemailer';
import { User } from "../mongoose/schema/user.js"
import { Doctor } from "../mongoose/schema/doctorShema.js";

const router=Router()



    // get all users
    router.get('/api/auth/all-users',async(request,response)=>{
        try{
            if(!request.user){
                return response.status(401).send({msg:"unauthorize"})
            }

            const allUsers= await User.find({},"-password")
           return response.status(200).send({users:allUsers})

        } catch (error){
            console.error(error);
            response.status(401).send({ message: error });

        }
    })


// edit user profile
router.patch ('/api/edit-profile', async (request, response) => {
    const {body}=request
    if (!request.user) {
        return response.status(401).send('Unauthorized: Login required');
      }

      try {
        const userId=request.user._id
        const updatedUserProfile= await User.findByIdAndUpdate(userId,{...body},{ new: true } )
        
        if (!updatedUserProfile) {
            return response.status(404).send({ msg: "User not found" });
        }
        return response.status(200).send({
            msg: 'Updating successful!',
           user: updatedUserProfile,
        })

      } catch (error) {
        return response.status(500).send({msg:error.message})

        
      }
  });
  
// create appointment
// router.post('/api/user-appointment',async(request,response)=>{
//     const userId=request.user._id
//     const {doctorId}=request.body

//     const user=await User.findById(userId)
//     if(!user.pastDoctors.includes(doctorId)){
//         user.pastDoctors.push(doctorId)
//         await user.save()
//     }

// return response.status(200).send({msg:"appointment has been successfully requested"})
// })
router.post('/api/create-appointment-user',async(request,response)=>{
const {body}=request

const userId=request.user._id
const { name ,email, message, diagnosis,date,phone,doctorId} = request.body;

try {
    console.log(name)
    const doctor = await Doctor.findById(doctorId);
    const user=await User.findById(userId)
    if(!user.pastDoctors.includes(doctorId)){
        user.pastDoctors.push(doctorId)
        await user.save()
    }
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
        const mailOptions = {
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

        // automatic email that would be sent to the patient
        const mailUser = {
            from: 'Medicare <no-reply@medicare.com>',
            to: email,
            replyTo: doctor.email,
            subject: `Your Appointment with  ${doctor.name} is Confirmed`,
            html: `<h3>You're Booked!</h3>
                   <p>Hi ${name},</p>
                   <p>Your appointment with <strong>Dr. ${doctor.name}</strong> has been successfully booked.</p>
                   <p><strong>Here are your appointment details:</strong></p>
                   <ul>
                     <li><strong>Date:</strong> ${date}</li>
                     <li><strong>Your Phone:</strong> ${phone}</li>
                     <li><strong>Your Email:</strong> ${email}</li>
                     <li><strong>Reason for Appointment:</strong> ${diagnosis}</li>
                   </ul>
                   <p><strong>Additional Notes You Shared:</strong></p>
                   <p>${message.replace(/\n/g, '<br>')}</p>
                   <hr>
                   <p>If you need to cancel or reschedule, you can do so from your dashboard.</p>
                   <p>Thank you for choosing Medicare.</p>
                   <p><strong>– The Medicare Team</strong></p>`
        };



        await Promise.all([
            transporter.sendMail(mailOptions),
            transporter.sendMail(mailUser)
        ]);
        


    const newAppointment=new Appointment({
        ...body,
        user:userId
    })
    console.log('creating appointment',newAppointment)

    const savedAppointment=await newAppointment.save()
console.log("User saved:", savedAppointment)
return response.status(201).send({msg:"Appointment created successfully", appointment: savedAppointment})

} catch (error) {
    return response.status(400).send({ msg: "Error creating appointment", error: error.message });
}
})


// get past doctors under a user
router.get('/api/user-past-doctors',async(request,response)=>{
    const userId=request.user._id
    try {
        const user=await User.findById(userId).populate("pastDoctors")

        if (!user) return response.status(404).json({ msg: 'User not found' });
        response.status(200).send(user.pastDoctors); 
        
    } catch (error) {
        return response.status(500).send({msg:"could not fetch past doctors"})
        
    }
})
// get appointment under a user
router.get('/api/user-past-appointment',async(request,response)=>{
//   if (!request.user) {
//     return response.status(401).send({ message: "not authenticated" })
//   }
    try {
        const pastappointment=await Appointment.find({user:request.user._id}).populate('doctorId')
        if (!pastappointment) return response.status(404).json({ msg: 'appointment not found' });
        response.status(200).send(pastappointment); 
        
    } catch (error) {
        return response.status(500).send({msg:"could not fetch past appointment"})
        
    }
})
// test session
router.get('/api/test-session', (request, response) => {
 if (!request.user) {
    return response.status(401).send({ message: "not authenticated" })
  }

  try {
    response.status(200).send({
      msg: "valid user",
      user: request.user,
      session:request.session
    })
  } catch (error) {
    return response.status(500).send(error.message)
  }
});
//   logout
router.post('/api/logout', (request, response) => {
    request.logout((error) => {
      if (error) return response.status(500).send({ msg: 'Logout failed' });
  
      request.session.destroy(() => {
        response.clearCookie('connect.sid'); // or your cookie name
        response.status(200).send({ msg: 'Logged out' });
      });
    });
  });

export default router