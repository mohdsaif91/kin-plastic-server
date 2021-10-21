const settingHomeModal = require("../Modal/SettingHomeModal");

const createSettingHome = async (req, res) => {
  try {
    console.log(req.body);
    await settingHomeModal.findOneAndUpdate(
      { _id: req.body._id },
      { $set: req.body },
      (err, data) => {
        if (err) {
          throw err;
        }
        res.status(201).json(data);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getSettingHome = async (req, res) => {
  try {
    const settingData = await settingHomeModal.find({});
    console.log(settingData[0], "<>?");
    res.status(200).json(settingData);
  } catch (error) {
    res.status(500).send("something went wrong");
  }
};

module.exports = {
  createSettingHome,
  getSettingHome,
};
