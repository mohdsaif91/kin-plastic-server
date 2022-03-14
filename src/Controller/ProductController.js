const AWS = require("aws-sdk");
const { v4: uuidV4 } = require("uuid");
const ObjectId = require("mongodb").ObjectID;

const ProductModal = require("../Modal/ProductModal");
const settingHomeModal = require("../Modal/SettingHomeModal");

const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_KEY,
});

const updateProduct = async (req, res) => {
  try {
    if (req.file?.buffer) {
      const fileName = req.file.originalname.split(".");
      const fileType = fileName[fileName.length - 1];
      const newImageName = `${uuidV4()}.${fileType}`;
      req.body.productImage = newImageName;
      const removeKey = `product/${req.body.productImageId}`;
      const Key = `product/${req.body.productImage}`;
      const updatedParams = {
        Bucket: process.env.BUCKET,
        Key,
        Body: req.file.buffer,
        ACL: "public-read-write",
      };
      s3.deleteObject(
        {
          Bucket: process.env.BUCKET,
          Key: removeKey,
        },
        (err, deleteData) => {
          if (err) throw err;
          s3.upload(updatedParams, (err, updateData) => {
            if (err) throw err;
          });
        }
      );
    }
    const { productImageId, ...restProps } = req.body;
    await ProductModal.findByIdAndUpdate(
      {
        _id: new ObjectId(req.body._id),
      },
      { ...restProps },
      { new: true },
      (err, data) => {
        if (err) throw err;
        res.status(201).send(data);
      }
    );
  } catch (error) {
    res.status(500).send(error);
  }
};

const addController = async (req, res) => {
  try {
    if (req.body._id) {
      updateProduct(req, res);
    } else {
      const fileName = req.file.originalname.split(".");
      const fileType = fileName[fileName.length - 1];
      if (req.file) {
        const imageName = `${uuidV4()}.${fileType}`;
        const Key = `product/${imageName}`;
        req.body.productImage = imageName;
        const params = {
          Bucket: process.env.BUCKET,
          Key,
          Body: req.file.buffer,
          ACL: "public-read",
        };

        await ProductModal.insertMany(req.body, (err, createdData) => {
          if (err) {
            throw err;
          }
          s3.upload(params, (err, data) => {
            if (err) {
              throw err;
            }
            res.status(201).send(createdData);
          });
        });
      } else {
        res.status(400).send("no Image Provided");
      }
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const getProduct = async (req, res) => {
  try {
    const products = await ProductModal.find({});
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteProduct = (req, res) => {
  try {
    const { deleteId, productImage } = req.params;
    const removeKey = `product/${productImage}`;
    s3.deleteObject(
      {
        Bucket: process.env.BUCKET,
        Key: removeKey,
      },
      async (err, data) => {
        if (err) throw err;
        await ProductModal.findByIdAndDelete(deleteId, (err, data) => {
          if (err) throw err;
          res.status(200).send(deleteId);
        });
      }
    );
  } catch (error) {
    res.status(500).send(error);
  }
};

const getProductByCategory = async (req, res) => {
  try {
    if (!req.params.catName)
      res.status(404).send("please provide the category name");
    const products = await ProductModal.find({
      categoryName: req.params.catName,
    });
    if (!products) throw err;
    res.status(200).send({ categoryName: req.params.catName, products });
  } catch (error) {
    res.status(500).send(error);
  }
};

const getAllProducts = async (req, res) => {
  try {
    const allProduct = await ProductModal.find({});
    if (!allProduct) {
      throw "something went wrong";
    }
    res.status(200).send(allProduct);
  } catch (error) {
    res.status(500).send(error);
  }
};

const addBestProduct = async (req, res) => {
  try {
    await ProductModal.findByIdAndUpdate(
      { _id: new ObjectId(req.body.id) },
      { $set: { bestProduct: true } },
      (err, data) => {
        if (err) throw err;
        res.status(200).send(req.body.id);
      }
    );
  } catch (error) {
    res.status(500).send(error);
  }
};

const getBestProduct = async (req, res) => {
  try {
    const setting = await settingHomeModal.find({
      _id: "614776bc04d0615fdc17335b",
    });
    if (!setting) {
      throw "something went wrong";
    }
    const bestProductId = setting[0].bestProduct;
    const bestProductData = await ProductModal.find({
      _id: { $in: [...bestProductId] },
    });
    if (!bestProductData) {
      throw "something went wrong";
    }
    res.status(200).send(bestProductData);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deletebestProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await ProductModal.findByIdAndUpdate(
      { _id: id },
      { $set: { bestProduct: false } },
      (err, data) => {
        if (err) throw err;
        res.status(201).send(id);
      }
    );
  } catch (error) {
    res.status(500).send(error);
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).send("Id is not defined !");
    }
    const foundProduct = await ProductModal.findById(id);
    if (!foundProduct) {
      res.status(400).send("no product found !");
    }
    res.status(200).send(foundProduct);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  addBestProduct,
  addController,
  deleteProduct,
  deletebestProduct,
  getAllProducts,
  getBestProduct,
  getProduct,
  getProductByCategory,
  getProductById,
};
