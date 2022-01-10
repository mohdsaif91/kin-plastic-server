const nodemailer = require("nodemailer");

const EmailModal = require("../Modal/EmailModal");
const AboutUsOrganisation = require("../Modal/AboutUsOrganisation");

const sendInquery = async (req, res) => {
  try {
    let count = 0;
    const aboutUsData = await AboutUsOrganisation.findById(
      "61c704a6716cfe041c612648"
    );
    if (!aboutUsData) {
      throw "DB fetch failed !";
    }

    await EmailModal.insertMany(req.body, (err, data) => {
      if (err) throw err;
      const transporter = nodemailer.createTransport({
        host: "smtpout.secureserver.net",
        secure: true,
        secureConnection: false, // TLS requires secureConnection to be false
        requireTLS: true,
        port: 465,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAILPASSWORD,
        },
      });

      aboutUsData.emailIds.map((m) => {
        const mailOptions = {
          from: process.env.EMAIL, //replace with your email
          to: m, //replace with your email
          subject: `New Inquery for Supports360 `,
          html: `<h1>Contact details</h1>
                 <h2> name:${req.body.senderName}</h2><br>
                 <h2> email:${req.body.email}</h2><br>
                 <h2> phonenumber:${req.body.phone}</h2><br>
                 <h2> message:${req.body.message}</h2>
                 <br>`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            throw error;
          } else {
            count++;
            console.log("Email sent: " + info.response);
          }
        });
      });
      if (count === aboutUsData.emailIds.length) {
        res.status(200).send("mail Send To all");
      } else {
        res.status(200).send("mail Send To Error");
      }
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

const getEmail = async (req, res) => {
  try {
    const inqueryEmail = await EmailModal.find({});
    if (!inqueryEmail) {
      throw "DB retrival failed !";
    }
    res.status(200).send(inqueryEmail);
  } catch (error) {
    res.status(500).send(error);
  }
};

const sendEmailCorrectly = () => {
  try {
  } catch (error) {}
};

module.exports = {
  sendInquery,
  getEmail,
};
