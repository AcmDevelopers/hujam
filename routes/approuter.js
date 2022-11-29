"use strict";
const path = require("path");
const express = require("express");
const nodemailer = require("nodemailer");
const sanitizer = require("sanitizer");
const dotenv = require("dotenv");

const router = express.Router();


dotenv.config();

const emailUser = process.env.USER_ID;
const emailPassword = process.env.USER_KEY;
const emailUserToBeSent = "acmgamejam@gmail.com";

function sendMessage (req, res) {
    const mailData = {
        mailName: req.body.userName,
        mailEmail: req.body.userEmail,
        mailSubject: req.body.subjectMail,
        mailContent: req.body.contentMail
    }
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: emailUser,
            pass: emailPassword
        }
    });
    transporter.verify(function (error) {
        if (error) {
            res.status(500).sendFile(path.join(__dirname, '../assets/', '500.html'));
            console.error(error);
        } else {
          console.log("Server is ready to take our messages");
        }
    });
    const message = {
        from: sanitizer.escape(mailData.mailEmail),
        to: emailUserToBeSent,
        replyTo: sanitizer.escape(mailData.mailEmail),
        subject: sanitizer.escape(mailData.mailSubject),
        text: sanitizer.escape(mailData.mailContent),
        html: "<p style='white-space: pre-wrap;'>" + sanitizer.escape(mailData.mailContent) + "</p><br> <p>" + sanitizer.escape(mailData.mailName) + "</p>"
    }
    return transporter.sendMail(message);
}

router
    .route("/")
    .get((req,res) => {
        res.sendFile(path.join(__dirname, '../assets/', 'index.html'));
    })
    .post(async function(req,res) {
        try {
            await sendMessage(req, res);
            return res.sendStatus(200);
        } catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    });

module.exports = router;