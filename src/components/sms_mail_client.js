
require('dotenv').config();
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const userInfo = require('./assignedUser');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    process.env.OAUTH_CLIENT_ID, // ClientID
    process.env.OAUTH_SECRET_KEY, // Client Secret
    "https://developers.google.com/oauthplayground" // Redirect URL
);
oauth2Client.setCredentials({
    refresh_token: process.env.OAUTH_REFRESH_TOKEN
});
const accessToken = oauth2Client.getAccessToken();

var accountSid = process.env.TWILIO_SID; // Your Account SID from www.twilio.com/console
var authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console
console.log("I M... ",accountSid);

var client = new twilio(accountSid, authToken);


console.log("hello......... ",userInfo.name);

var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        type: "OAuth2",
        user: 'msantiago2222@yahoo.com',
        clientId: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_SECRET_KEY,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
        accessToken: accessToken
    }
});

function sendMsg(name, phone, email, tasks) {
    return new Promise((resolve, reject) => {
        var msgStr = `Hello ${name}, Welcome to Scatter!\n`;
        var taskStr = "";
        for (let i = 0; i < tasks.length; i++) {
            taskStr = taskStr + `${tasks[i]}\n`;
        }
        var msgObj = {
            body: msgStr + taskStr,
            to: phone,
            from: process.env.TWILIO_PHONENUMBER
        }
        var emailObj = {
            from: 'msantiago2222@yahoo.com',
            to: email,
            subject: msgStr,
            text: taskStr
        }
        resolve([msgObj, emailObj]);
    })
}

sendMsg(userInfo.name, userInfo.phoneNumber, userInfo.email, userInfo.tasklist).then(function (result) {
/*
    client.messages.create(result[0])
    .then((message) => console.log(message.sid));
*/
    transporter.sendMail(result[1], function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
})

