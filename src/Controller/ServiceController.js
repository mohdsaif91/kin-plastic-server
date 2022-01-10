const AWS = require("aws-sdk");
const { v4: uuidV4 } = require("uuid");
const ObjectId = require("mongodb").ObjectID;

const ServiceModal = require("../Modal/ServiceModel");

const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_KEY,
});

const addService = async (req, res) => {
  try {
    if (req.file?.buffer) {
      const fileName = req.file.originalname.split(".");
      const fileType = fileName[fileName.length - 1];
      const newServiceImageName = `${uuidV4()}.${fileType}`;
      const Key = `service/${newServiceImageName}`;
      req.body.serviceImage = newServiceImageName;
      const updatedParams = {
        Bucket: process.env.BUCKET,
        Key,
        Body: req.file.buffer,
        ACL: "public-read-write",
      };
      s3.upload(updatedParams, (err, data) => {
        if (err) throw err;
      });
      await ServiceModal.insertMany(req.body, (err, createdData) => {
        if (err) throw err;
        res.status(201).send(createdData);
      });
    } else {
      res.status(500).send("Image is not there");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const getServices = async (req, res) => {
  try {
    const service = await ServiceModal.find({});
    res.status(200).send(service);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  addService,
  getServices,
};
