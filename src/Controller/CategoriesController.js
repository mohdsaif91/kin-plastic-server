const categoryModal = require("../Modal/CategoryModal");

const addCategories = async (req, res) => {
  try {
    await categoryModal.insertMany({ text: req.body.text }, (err, data) => {
      if (err) {
        throw err;
      }
      res.status(201).json(data);
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await categoryModal.find({});
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateCategories = async (req, res) => {
  try {
    await categoryModal.findByIdAndUpdate(
      { _id: req.body.id },
      req.body,
      (err, data) => {
        if (err) {
          throw err;
        }
        res.status(201).json("updated");
      }
    );
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const deleteID = req.query.deleteId;
    if (deleteID) {
      await categoryModal.findByIdAndDelete({ _id: deleteID }, (err, data) => {
        if (err) {
          throw err;
        }
        res.status(201).json("deleted");
      });
    } else {
      throw "plz provide id for deleting";
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  addCategories,
  deleteCategory,
  getCategories,
  updateCategories,
};
