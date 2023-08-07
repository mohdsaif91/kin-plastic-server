const AWS = require("aws-sdk");
const { v4: uuidV4 } = require("uuid");
const ObjectId = require("mongodb").ObjectID;

const ClientModal = require("../Modal/ClientModal");

const AWS_ACCESS_KEY = process.env.ACCESS_KEY_ID;
const AWS_SECRET_KEY = process.env.SECRET_ACCESS_KEY;

const s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_KEY,
});

const addClient = async (req, res) => {
  try {
    if (req.file) {
      const fileName = req.file.originalname.split(".");
      const fileType = fileName[fileName.length - 1];
      const imageName = `${uuidV4()}.${fileType}`;
      const Key = `client/${imageName}`;
      req.body.clientImage = imageName;
      const params = {
        Bucket: process.env.BUCKET,
        Key,
        Body: req.file.buffer,
        ACL: "public-read",
      };
      await ClientModal.insertMany(req.body, (err, createdData) => {
        if (err) {
          throw err;
        }
        s3.upload(params, (err, data) => {
          if (err) {
            throw err;
          }
          res.status(201).send(req.body);
        });
      });
    } else {
      res.status(400).send("Image in required !");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const getClient = async (req, res) => {
  try {
    const clientData = await ClientModal.find({});
    if (!clientData) {
      throw "cannot get Client data !";
    }
    res.status(200).send(clientData);
  } catch (error) {
    res.status(500).send(error);
  }
};

const editClient = async (req, res) => {
  try {
    if (req.file?.buffer) {
      const fileName = req.file.originalname.split(".");
      const fileType = fileName[fileName.length - 1];
      const newClientImageName = `${uuidV4()}.${fileType}`;
      req.body.clientImage = newClientImageName;
      const removekey = `client/${req.body.oldImageName}`;
      const Key = `client/${req.body.clientImage}`;
      const updateParams = {
        Bucket: process.env.BUCKET,
        Key,
        Body: req.file.buffer,
        ACL: "public-read-write",
      };
      s3.deleteObject(
        {
          Bucket: process.env.BUCKET,
          Key: removekey,
        },
        (err, data) => {
          if (err) throw err;
          s3.upload(updateParams, (err, data) => {
            if (err) throw err;
          });
        }
      );
    }

    const { edit, _v, oldImageName, ...rest } = req.body;
    await ClientModal.findByIdAndUpdate(
      { _id: new ObjectId(req.body._id) },
      rest,
      (err, data) => {
        if (err) throw err;
        res.status(200).send(rest);
      }
    );
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteClient = async (req, res) => {
  try {
    await ClientModal.findByIdAndDelete(
      { _id: new ObjectId(req.params.id) },
      (err, data) => {
        if (err) throw err;
        s3.deleteObject(
          {
            Bucket: process.env.BUCKET,
            Key: `client/${req.params.imageName}`,
          },
          (err, data) => {
            if (err) throw err;
            res.status(201).send(req.params.id);
          }
        );
      }
    );
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  addClient,
  deleteClient,
  editClient,
  getClient,
};
