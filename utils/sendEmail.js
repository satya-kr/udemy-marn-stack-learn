/* eslint-disable import/no-extraneous-dependencies */
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {

    try {

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'satyajit.kr.prajapati@gmail.com',
                pass: 'bouh ceet gwsx tywq'
            }
        });

        const mailOptions = {
            from: "Satyajit MERN Stack Project - Test Email <satyajit.kr.prajapati@gmail.com>",
            to: options.email,
            subject: options.subject,
            text: options.message,
        }

        await transporter.sendMail(mailOptions);

    }  catch (error) {
        // console.error('Error sending email:', error);
        throw new Error('Could not send email', error);
    }
}

module.exports = sendEmail;