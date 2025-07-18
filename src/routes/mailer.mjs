import { Router } from "express";
import nodemailer from 'nodemailer';
import multer from "multer";
import fs from 'fs';

const router = Router();
const upload = multer({ dest: "uploads/" });


router.post("/api/contact", upload.single("attachment"), async (request, response) => {
    try {
        const { name, phone, message,email } = request.body;
        const attachment = request.file; // Get the uploaded file from multer

        if (!phone) {
            return response.status(400).send({ error: 'All fields are required' });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "adeniranquwam001@gmail.com",
                pass: `${process.env.GmailPassword}`

            }
        });

        const mailOptions = {
            from: email,
            to: "adeniranquwam001@gmail.com",
            replyTo: email,
            subject: `New message from ${name}`,
            html: `<h3>New message from your website</h3>
                 <p><strong>From:</strong> ${name} (${email})</p>
                <p><strong>Phone:</strong> ${phone}</p>

                 <p><strong>Message:</strong></p>
                 <p>${message.replace(/\n/g, '<br>')}</p>`,
            attachments: []
        };

        // Only add attachment if it exists
        if (attachment) {
            mailOptions.attachments.push({
                filename: attachment.originalname,
                path: attachment.path,
                contentType: attachment.mimetype
            });
        }

        await transporter.sendMail(mailOptions);
        
        // Clean up file if it exists
        if (attachment) {
            fs.unlinkSync(attachment.path);
        }

        return response.send({ message: 'Message sent successfully' });

    } catch (error) {
        console.error('Email error:', error);
        
        // Clean up file if error occurred
        if (request.file) {
            fs.unlinkSync(request.file.path);
        }
        
        response.status(500).json({ 
            error: 'Failed to send message',
            details: error.message // Better to send just the message
        });
    }
});

export default router;