
const crypto = require("crypto");
const mongoose = require("mongoose");
const Invoice = require("../models/Invoice");
const User = require("../models/User");

// ADMIN: Create an invoice for an existing client.
const createInvoice = async (req, res) => {
  try {
    const { clientEmail, items, dueDate } = req.body;

    if (!clientEmail || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Client email and at least one invoice item are required",
      });
    }

    const client = await User.findOne({
      email: clientEmail.trim().toLowerCase(),
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client account not found. Ask the client to register first.",
      });
    }

    const cleanItems = [];
    let totalCents = 0;

    for (const item of items) {
      const description = String(item.description || "").trim();
      const quantity = Number(item.quantity);
      const unitPrice = Number(item.unitPrice);

      if (
        !description ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        !Number.isFinite(unitPrice) ||
        unitPrice < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Each item needs a description, valid quantity and valid unit price",
        });
      }

      const unitPriceCents = Math.round(unitPrice * 100);
      totalCents += quantity * unitPriceCents;

      cleanItems.push({
        description,
        quantity,
        unitPrice: unitPriceCents / 100,
      });
    }

    if (!Number.isSafeInteger(totalCents) || totalCents <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invoice total must be greater than zero",
      });
    }

    const invoice = await Invoice.create({
      invoiceNumber: `INV-${Date.now()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`,
      clientId: client._id,
      createdBy: req.user._id,
      items: cleanItems,
      totalAmount: totalCents / 100,
      currency: "usd",
      dueDate: dueDate || undefined,
    });

    return res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      invoice,
    });
  } catch (error) {
    console.error("Create invoice error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to create invoice",
    });
  }
};

// ADMIN: View all invoices. CLIENT: View only their own invoices.
const getInvoices = async (req, res) => {
  try {
    const filter =
      req.user.role === "admin" ? {} : { clientId: req.user._id };

    const invoices = await Invoice.find(filter)
      .populate("clientId", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: invoices.length,
      invoices,
    });
  } catch (error) {
    console.error("Get invoices error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve invoices",
    });
  }
};

// ADMIN: View any invoice. CLIENT: View only their own invoice.
const getInvoiceById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid invoice ID",
      });
    }

    const invoice = await Invoice.findById(req.params.id)
      .populate("clientId", "name email")
      .populate("createdBy", "name email");

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    const isAdmin = req.user.role === "admin";
    const isOwner =
      invoice.clientId &&
      invoice.clientId._id.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: This invoice does not belong to your account",
      });
    }

    return res.json({ success: true, invoice });
  } catch (error) {
    console.error("Get invoice error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve invoice",
    });
  }
};

// ADMIN ONLY: Update a pending invoice.
const updateInvoice = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid invoice ID",
      });
    }

    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    if (invoice.status === "Paid") {
      return res.status(400).json({
        success: false,
        message: "Paid invoices cannot be edited",
      });
    }

    if (Array.isArray(req.body.items)) {
      if (req.body.items.length === 0) {
        return res.status(400).json({
          success: false,
          message: "An invoice must contain at least one item",
        });
      }

      let totalCents = 0;
      const cleanItems = [];

      for (const item of req.body.items) {
        const description = String(item.description || "").trim();
        const quantity = Number(item.quantity);
        const unitPrice = Number(item.unitPrice);

        if (
          !description ||
          !Number.isInteger(quantity) ||
          quantity < 1 ||
          !Number.isFinite(unitPrice) ||
          unitPrice < 0
        ) {
          return res.status(400).json({
            success: false,
            message: "Invalid invoice item",
          });
        }

        const cents = Math.round(unitPrice * 100);
        totalCents += quantity * cents;

        cleanItems.push({
          description,
          quantity,
          unitPrice: cents / 100,
        });
      }

      if (!Number.isSafeInteger(totalCents) || totalCents <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invoice total must be greater than zero",
        });
      }

      invoice.items = cleanItems;
      invoice.totalAmount = totalCents / 100;
    }

    if (req.body.dueDate !== undefined) {
      invoice.dueDate = req.body.dueDate || undefined;
    }

    await invoice.save();

    return res.json({
      success: true,
      message: "Invoice updated successfully",
      invoice,
    });
  } catch (error) {
    console.error("Update invoice error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to update invoice",
    });
  }
};

// ADMIN ONLY: Delete a pending invoice.
const deleteInvoice = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid invoice ID",
      });
    }

    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    if (invoice.status === "Paid") {
      return res.status(400).json({
        success: false,
        message: "Paid invoices cannot be deleted",
      });
    }

    await invoice.deleteOne();

    return res.json({
      success: true,
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    console.error("Delete invoice error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to delete invoice",
    });
  }
};

module.exports = {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
};
