const express = require("express");
const CatgoriesController = require("../Controller/CategoriesController");

const router = express.Router();

router.post("/", CatgoriesController.addCategories);
router.get("/", CatgoriesController.getCategories);
router.put("/", CatgoriesController.updateCategories);
router.delete("/", CatgoriesController.deleteCategory);

module.exports = router;
