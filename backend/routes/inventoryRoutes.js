
const express = require("express");
const validate = require("../middleware/validate");
const protect = require("../middleware/authMiddleware");

const {
  createProductSchema,
  updateProductSchema,
} = require("../validators/inventorySchemas");

const {
  getInventory,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/inventoryController");

const router = express.Router();

// All inventory endpoints require authentication.
router.use(protect);

router.get("/", getInventory);
router.post("/", validate(createProductSchema), createProduct);
router.put("/:id", validate(updateProductSchema), updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
