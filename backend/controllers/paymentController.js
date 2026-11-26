
const Stripe = require("stripe");
const mongoose = require("mongoose");
const Invoice = require("../models/Invoice");

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

const createCheckoutSession = async (req, res) => {
  try {
    const { invoiceId } = req.params;

    if (!mongoose.isValidObjectId(invoiceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid invoice ID",
      });
    }

    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    const isOwner =
      invoice.clientId.toString() === req.user._id.toString();

    if (req.user.role !== "admin" && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "You cannot pay another client's invoice",
      });
    }

    if (req.user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Administrators cannot pay client invoices",
      });
    }

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: "Invoice ownership verification failed",
      });
    }

    if (invoice.status === "Paid") {
      return res.status(400).json({
        success: false,
        message: "This invoice has already been paid",
      });
    }

    const frontendUrl = process.env.FRONTEND_URL;

    if (!frontendUrl) {
      throw new Error("FRONTEND_URL is not configured");
    }

    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: invoice.items.map((item) => ({
        price_data: {
          currency: invoice.currency || "usd",
          product_data: {
            name: item.description,
          },
          unit_amount: Math.round(item.unitPrice * 100),
        },
        quantity: item.quantity,
      })),
      metadata: {
        invoiceId: invoice._id.toString(),
        clientId: req.user._id.toString(),
      },
      success_url: `${frontendUrl}/invoices?payment=success`,
      cancel_url: `${frontendUrl}/invoices?payment=cancelled`,
    });

    invoice.stripeCheckoutSessionId = session.id;
    await invoice.save();

    return res.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Checkout creation error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to create payment session",
    });
  }
};

module.exports = { createCheckoutSession };
