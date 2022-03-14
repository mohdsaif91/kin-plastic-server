const auth = require("../Modal/AuthModa");

const loginAuth = async (req, res) => {
  try {
    const { userName, password } = req.body;

    const user = await auth.findOne({ userName });
    if (!user) {
      throw { msg: "No user found", status: 400 };
    }
    const passwordDB = await auth.findOne({ password });
    if (!passwordDB) {
      throw { msg: "No user found", status: 400 };
    }
    res.status(200).json("login sucessFull");
  } catch (error) {
    res.status(400).send(error);
  }
};

const signUp = async (req, res) => {
  try {
    auth.create(req.body, (err, data) => {
      if (err) {
        throw err;
      }
      res.status(200).send(data);
    });
  } catch (error) {}
};

module.exports = {
  loginAuth,
  signUp,
};
