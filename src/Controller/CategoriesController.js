const AWS = require("aws-sdk");

const categoryModal = require("../Modal/CategoryModal");
const ProductModal = require("../Modal/ProductModal");

const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_KEY,
});

const addCategories = async (req, res) => {
  try {
    const insertedData = await categoryModal.insertMany({
      text: req.body.text,
    });
    if (!insertedData) {
      throw "insert operation failed ! ";
    }
    res.status(201).json(insertedData[0]);
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
    if (req.body._id) {
      await categoryModal.findByIdAndUpdate(
        { _id: req.body._id },
        req.body,
        async (err, data) => {
          if (err) {
            throw err;
          }
          const allProduct1 = await ProductModal.updateMany(
            { categoryName: req.body.previousValue },
            { $set: { categoryName: req.body.text } }
          );
          if (!allProduct1) {
            throw "Updating category name failed !";
          }
          const { previousValue, ...restData } = req.body;
          res.status(201).send(restData);
        }
      );
    } else {
      res.status(400).send("Please provide the ID");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { deleteId, cateName } = req.query;
    if (deleteId) {
      const categoryData = await ProductModal.find({ categoryName: cateName });
      if (categoryData.length !== 0) {
        let imageArray = [];
        categoryData.map((option) => {
          if (option.categoryName === cateName) {
            imageArray.push(option.productImage);
          }
        });
        await ProductModal.remove({ categoryName: cateName }, async (err) => {
          if (err) {
            throw "Removing product failed !";
          }
          imageArray.map((m) => {
            s3.deleteObject(
              {
                Bucket: process.env.BUCKET,
                Key: `product/${m}`,
              },
              (err) => {
                if (err) throw err;
              }
            );
          });
          await categoryModal.findByIdAndDelete(
            { _id: deleteId },
            (err, data) => {
              if (err) {
                throw err;
              }
              res.status(201).json(data);
            }
          );
        });
      } else {
        await categoryModal.findByIdAndDelete(
          { _id: deleteId },
          (err, data) => {
            if (err) {
              throw err;
            }
            res.status(201).json(data);
          }
        );
      }
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
