// services/emailService.mjs

/**
 * Email Service
 * ---------------
 * This module provides a utility function to send emails with PDF attachments 
 * using the Nodemailer library and Gmail SMTP.
 *
 * Function:
 * - sendEmailWithAttachment(to, subject, text, filePath):
 *   Sends an email with the provided subject and text to the recipient, attaching 
 *   a PDF file (e.g., a receipt) located at the specified file path.
 *
 * Configuration:
 * - Uses Gmail as the email service
 * - Credentials (EMAIL and EMAIL_PASSWORD) must be set in environment variables
 * Notes:
 * - Make sure to allow "Less secure apps" access for the Gmail account if using basic auth
 * - Consider switching to OAuth2 for better security in production environments
 */


import nodemailer from "nodemailer";

export async function sendEmailWithAttachment(to, subject, text, filePath) {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to,
        subject,
        text,
        attachments: [
            {
                filename: `receipt.pdf`,
                path: filePath,
            },
        ],
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error.message);
        throw new Error("Failed to send email");
    }
}
