// server.js
require('dotenv').config();

const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files (HTML, CSS, JS)

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Change this to your email service provider if necessary
    auth: {
        user: process.env.EMAIL_USER, // Use the environment variable
        pass: process.env.EMAIL_PASS   // Use the environment variable
    }
});

// POST route for sending email
app.post('/send', (req, res) => {
    const { from_name, reply_to, message } = req.body;

    const mailOptions = {
        from: from_name,
        to: process.env.EMAIL_USER, // Use the environment variable for the recipient's email
        subject: `Message from ${from_name}`,
        text: message,
        replyTo: reply_to
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Error sending email: ' + error.toString());
        }
        res.status(200).send('Email sent: ' + info.response);
    });
}); // <-- Closing brace added here

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
