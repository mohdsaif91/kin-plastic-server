const AWS = require("aws-sdk");
const { v4: uuidV4 } = require("uuid");
const ObjectId = require("mongoose").ObjectID;

const AboutUsmodal = require("../Modal/AboutUsModal");
const EmployeeModal = require("../Modal/EmployeeModal");
const AboutUsOrganisation = require("../Modal/AboutUsOrganisation");

const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_KEY,
});

const addUpdateOwner = async (req, res) => {
  try {
    if (req.file) {
      const fileName = req.file.originalname.split(".");
      const fileType = fileName[fileName.length - 1];
      const removeKey = `aboutus/${req.body.ownerImageName}`;
      const newImageName = `${uuidV4()}.${fileType}`;
      req.body.employeeImage = newImageName;
      const Key = `aboutus/${newImageName}`;
      const insertParams = {
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
        (err, data) => {
          if (err) throw err;
          s3.upload(insertParams, (err, data) => {
            if (err) throw err;
          });
        }
      );
    }
    await AboutUsmodal.findOneAndUpdate(
      { _id: "61a90f0f5f96173a2055399c" },
      { $set: req.body },
      { new: true },
      (err, dbData) => {
        if (err) throw err;
        res.status(201).send(dbData);
      }
    );
  } catch (error) {
    res.status(500).send(error);
  }
};

const getOwnerData = async (req, res) => {
  try {
    const aboutUs = await AboutUsmodal.find({});
    if (aboutUs) {
      res.status(200).send(aboutUs[0]);
    } else {
      res.status(400).send(aboutUs);
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const addEmployee = async (req, res) => {
  try {
    if (req.file) {
      const fileName = req.file.originalname.split(".");
      const fileType = fileName[fileName.length - 1];
      const newImageName = `${uuidV4()}.${fileType}`;
      req.body.employeeImage = newImageName;
      const Key = `aboutus/${newImageName}`;
      const insertParams = {
        Bucket: process.env.BUCKET,
        Key,
        Body: req.file.buffer,
        ACL: "public-read-write",
      };
      s3.upload(insertParams, async (err, data) => {
        if (err) throw err;
        await EmployeeModal.insertMany(req.body, (err, data) => {
          if (err) throw err;
          res.status(201).send(data);
        });
      });
    } else {
      res.status(401).send("Image is required");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const getEmployee = async (req, res) => {
  try {
    const employees = await EmployeeModal.find({});
    if (!employees) throw "DB down !!";
    res.status(200).send(employees);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateEmployee = async (req, res) => {
  try {
    if (req.file) {
      const fileName = req.file.originalname.split(".");
      const fileType = fileName[fileName.length - 1];
      const removeKey = `aboutus/${req.body.imageName}`;
      const newImageName = `${uuidV4()}.${fileType}`;
      const Key = `aboutus/${newImageName}`;
      req.body.employeeImage = newImageName;
      const insertParams = {
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
        async (err, data) => {
          if (err) throw err;
          s3.upload(insertParams, async (err, data) => {
            if (err) throw err;
          });
        }
      );
      const { addEdit, imageName, ...restProps } = req.body;
      await EmployeeModal.findByIdAndUpdate(
        req.body._id,
        restProps,
        (err, data) => {
          if (err) throw err;
          res.status(201).send(restProps);
        }
      );
    } else {
      await EmployeeModal.findByIdAndUpdate(
        req.body._id,
        req.body,
        (err, data) => {
          if (err) throw err;
          const { imageName, addEdit, ...restProps } = req.body;
          res.status(201).send(restProps);
        }
      );
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteEmployee = (req, res) => {
  try {
    const { id, imageName } = req.params;
    const removeKey = `aboutus/${imageName}`;
    s3.deleteObject(
      {
        Bucket: process.env.BUCKET,
        Key: removeKey,
      },
      async (err, data) => {
        if (err) throw err;
        await EmployeeModal.findByIdAndDelete(id, (err, data) => {
          if (err) throw err;
          res.status(201).send(id);
        });
      }
    );
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateOganisation = async (req, res) => {
  try {
    await AboutUsOrganisation.findByIdAndUpdate(
      req.body._id,
      req.body,
      (err, data) => {
        res.status(200).send(req.body);
      }
    );
  } catch (error) {
    res.status(500).send(error);
  }
};

const getOrganisationData = async (req, res) => {
  try {
    const abouUsData = await AboutUsOrganisation.findById(
      "61c704a6716cfe041c612648"
    );
    if (!abouUsData) {
      throw "something went wrong";
    }
    res.status(200).send(abouUsData);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getOrganisationOwner = async (req, res) => {
  try {
    const aboutUsData = await AboutUsOrganisation.findById(
      "61c704a6716cfe041c612648"
    );
    if (!aboutUsData) {
      throw "something went wrong";
    }
    const aboutUs = await AboutUsmodal.find({});
    if (!aboutUs) {
      throw "something went wrong";
    }
    const employeeData = await EmployeeModal.find({});
    if (!employeeData) {
      throw "something went wrong";
    }
    const aboutData = {
      owner: aboutUs[0],
      aboutUsPage: aboutUsData,
      employee: employeeData,
    };
    res.status(200).send(aboutData);
  } catch (error) {
    res.status(500).send(error);
  }
};

const addSocialMedia = async (req, res) => {
  try {
    await AboutUsOrganisation.findByIdAndUpdate(
      req.body._id,
      req.body,
      (err, data) => {
        if (err) throw err;
        res.status(200).send(req.body);
      }
    );
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  addEmployee,
  addSocialMedia,
  addUpdateOwner,
  deleteEmployee,
  getEmployee,
  getOrganisationData,
  getOrganisationOwner,
  getOwnerData,
  updateEmployee,
  updateOganisation,
};
