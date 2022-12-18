const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });

const nodeMailer = require("nodemailer");

const USER_EMAIL = process.env.USER_EMAIL;
const USER_PASSWORD = process.env.USER_PASSWORD;
const EMAIL_SERVICE = process.env.EMAIL_SERVICE;
const sendEmail = async (fileName, msg) => {
  if (process.env.MODE_ENV === "dev" && process.env.USER_EMAIL) {
    // send an email with the error with google smtp
    const transporter = nodeMailer.createTransport({
      service: EMAIL_SERVICE,
      auth: {
        user: USER_EMAIL,
        pass: USER_PASSWORD,
      },
    });

    const mailOptions = {
      from: USER_EMAIL,
      to: USER_EMAIL,
      subject: `Error in ${fileName}`,
      text: msg,
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
};

module.exports = sendEmail;
