import {  Router } from "express";
import { Appointment } from "../mongoose/schema/appointmentSchema.js";
import nodemailer from 'nodemailer';
import { Doctor } from "../mongoose/schema/doctorShema.js";
const router=Router()



// create appointment
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
        


    const newAppointment=new Appointment(body)
    console.log('creating appointment',newAppointment)

    const savedAppointment=await newAppointment.save()
console.log("User saved:", savedAppointment)
return response.status(201).send({msg:"Appointment created successfully", appointment: savedAppointment})

} catch (error) {
    return response.status(400).send({ msg: "Error creating appointment", error: error.message });
}
})



// get all appointments
router.get('/api/all-appointment',async(request,response)=>{
    
    if(!request.user){
        return response.status(401).send('un authorized')
    }
if(!request.user.role=="admin"){
    return response.status(401).send("un-authorized")
}

try {
    const appointments = await Appointment.find();
    return response.status(201).send(appointments)
    
} catch (error) {
    return response.status(500).send({msg:error.message})
    
}
})

export default router