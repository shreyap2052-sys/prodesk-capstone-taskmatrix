
const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
} = require("../controllers/invoiceController");

const router = express.Router();

router.use(protect);

router.get("/", getInvoices);
router.get("/:id", getInvoiceById);

router.post("/", authorizeRoles("admin"), createInvoice);
router.put("/:id", authorizeRoles("admin"), updateInvoice);
router.delete("/:id", authorizeRoles("admin"), deleteInvoice);

module.exports = router;
