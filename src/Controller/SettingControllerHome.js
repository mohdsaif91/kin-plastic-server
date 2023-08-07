const AWS = require("aws-sdk");
const { v4: uuidV4 } = require("uuid");

const ProductModal = require("../Modal/ProductModal");
const settingHomeModal = require("../Modal/SettingHomeModal");
const ClientModal = require("../Modal/ClientModal");
const HeroImageModal = require("../Modal/HeroImageModal");

const AWS_ACCESS_KEY = process.env.ACCESS_KEY_ID;
const AWS_SECRET_KEY = process.env.SECRET_ACCESS_KEY;

const s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_KEY,
});

const createSettingHome = async (req, res) => {
  try {
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
    res.status(500).send(error);
  }
};

const getSettinghomePage = async (req, res) => {
  try {
    const settingData = await settingHomeModal.find({});
    if (!settingData) {
      throw "something went wrong";
    }
    const bestProductData = await ProductModal.find({
      bestProduct: true,
    });
    if (!bestProductData) {
      throw "something went wrong";
    }
    const ClientData = await ClientModal.find({});
    if (!ClientData) {
      throw "something went wrong";
    }
    const ProductData = await ProductModal.find({});
    if (!ProductData) {
      throw "something went wrong";
    }

    const heroImage = await HeroImageModal.distinct("heroImage");
    if (!heroImage) {
      throw "something went wrong";
    }
    const settingParent = {
      setting: settingData[0],
      bestProductData,
      client: ClientData,
      product: ProductData,
      heroImage: heroImage,
    };
    res.status(200).json(settingParent);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getSettingHome = async (req, res) => {
  try {
    const settingData = await settingHomeModal.find({});
    res.status(200).json(settingData);
  } catch (error) {
    res.status(500).send("something went wrong");
  }
};

const addHeroImage = async (req, res) => {
  let heroImage = [];
  try {
    if (!req.file) {
      throw "no image provided";
    }
    const fileName = req.file.originalname.split(".");
    const fileType = fileName[fileName.length - 1];
    const imageName = `${uuidV4()}.${fileType}`;
    const Key = `heroImage/${imageName}`;
    const params = {
      Bucket: process.env.BUCKET,
      Key,
      Body: req.file.buffer,
      ACL: "public-read",
    };
    const existingHero = await HeroImageModal.findById(
      "6245f5047b90f5393c1ed220"
    );

    if (!existingHero) {
      heroImage = {
        heroImage: [imageName],
      };
    } else {
      heroImage = {
        heroImage: [...existingHero.heroImage, imageName],
      };
    }
    await HeroImageModal.findByIdAndUpdate(
      { _id: "6245f5047b90f5393c1ed220" },
      heroImage,
      (err, data) => {
        if (err) {
          throw "insert DB failed";
        }
        s3.upload(params, (err, data) => {
          if (err) {
            throw "Image upload failed !";
          }
          res.status(200).send("Image Uploaded !");
        });
      }
    );
  } catch (error) {
    res.status(500).send(error);
  }
};

const removeHeroImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    if (!imageId) {
      throw "no image Provided";
    }
    const removeKey = `heroImage/${imageId}`;
    const existingHero = await HeroImageModal.findById(
      "6245f5047b90f5393c1ed220"
    );
    const removedImageName = existingHero.heroImage.filter(
      (f) => f !== imageId
    );
    s3.deleteObject(
      {
        Bucket: process.env.BUCKET,
        Key: removeKey,
      },
      async (err, data) => {
        if (err) {
          throw "ProductImage delete Failed";
        }
        await HeroImageModal.findByIdAndUpdate(
          { _id: "6245f5047b90f5393c1ed220" },
          { heroImage: removedImageName },
          (err, data) => {
            if (err) {
              throw "Image delete failed in MongoDB";
            }
            res.status(200).send(imageId);
          }
        );
      }
    );
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  addHeroImage,
  createSettingHome,
  getSettingHome,
  getSettinghomePage,
  removeHeroImage,
};
