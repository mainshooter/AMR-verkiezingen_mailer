const nodemailer = require("nodemailer");
const config = require("./config");



module.exports = async function(mail, subject, messageParam) {
  let transporter = nodemailer.createTransport(config.mail);
  transporter.verify((error, succes) => {
    if (error) {
      console.error(error);
    }
    else {
      let message = {
        form: config.mail.auth.user,
        to: mail,
        subject: subject,
        html: messageParam,
        envelope: {
          from: config.mail.auth.user,
          to: mail,
        }
      };

      transporter.sendMail(message).then(info => {
          console.log(info);
      });
    }
  });
}
