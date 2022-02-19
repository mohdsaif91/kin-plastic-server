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
          subject: `New Inquery for Kin Industries`,
          html: `
          <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body {
        margin: 0;
        font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
          "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
      }
      .container {
        padding: 32px;
      }
      .heading-hero {
        text-align: center;
        margin: 24px 0;
        font-size: 32px;
        padding-bottom: 8px;
        border-bottom: 1px solid #333;
      }
      .footer-container {
        padding-top: 8px;
        border-top: 1px solid #333;
      }
      .message-container {
        margin: 32px 0;
      }
      .user-data {
        font-size: 20px;
        padding: 8px 16px 8px 8px;
      }
      @media (max-width: 430px) {
        .container {
          padding: 8px;
        }
      }
      .hero-img {
        height: 250px;
        background-position: center center;
        background-size: contain;
        background-image: url("http://localhost/src/newMail.png");
        background-repeat: no-repeat;
      }
      a {
        text-decoration: none;
        color: black;
      }
      .messag-data {
        font-size: 20px;
        padding: 8px 16px 8px 8px;
      }
      .underline {
        text-decoration: underline;
        margin-right: 8px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="hero-img"></div>
      <div class="contact-container">
        <div class="heading-hero">Contact details</div>
        <div class="user-data"><span class="underline">Name:</span> ${req.body.senderName}</div>
        <div class="user-data">
          <span class="underline">Email:</span> ${req.body.email}
        </div>
        <div class="user-data">
          <span class="underline"> Phone Number: </span>
          <a className="phone" href="tel:+91${req.body.phone}"> ${req.body.phone} </a>
        </div>
      </div>
      <div class="message-container">
        <div class="messag-data">
          <span class="underline">Messsage:</span>
          ${req.body.message}
        </div>
      </div>
      <div class="footer-container"></div>
    </div>
  </body>
</html>`,
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
