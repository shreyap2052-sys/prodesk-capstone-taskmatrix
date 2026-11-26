
const Stripe = require("stripe");
const mongoose = require("mongoose");
const Invoice = require("../models/Invoice");

const handleStripeWebhook = async (req, res) => {
  let event;

  try {
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error("Stripe environment variables are missing");
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const signature = req.headers["stripe-signature"];

    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Stripe signature verification failed:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      if (session.payment_status !== "paid") {
        return res.json({ received: true, message: "Payment is not complete" });
      }

      const invoiceId = session.metadata?.invoiceId;
      const clientId = session.metadata?.clientId;

      if (!mongoose.isValidObjectId(invoiceId) ||
          !mongoose.isValidObjectId(clientId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid invoice metadata",
        });
      }

      const invoice = await Invoice.findById(invoiceId);

      if (!invoice) {
        return res.status(404).json({
          success: false,
          message: "Invoice not found",
        });
      }

      if (
        invoice.clientId.toString() !== clientId ||
        invoice.stripeCheckoutSessionId !== session.id ||
        session.currency !== invoice.currency ||
        session.amount_total !== Math.round(invoice.totalAmount * 100)
      ) {
        console.error("Stripe payment does not match invoice:", invoice.invoiceNumber);
        return res.status(400).json({
          success: false,
          message: "Payment verification did not match the invoice",
        });
      }

      if (invoice.status !== "Paid") {
        invoice.status = "Paid";
        invoice.paidAt = new Date();
        invoice.stripePaymentIntentId =
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id;

        await invoice.save();

        console.log(`Verified payment received for ${invoice.invoiceNumber}`);
      } else {
        console.log(`Duplicate payment event received for ${invoice.invoiceNumber}`);
      }
    }

    return res.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook processing error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Webhook processing failed",
    });
  }
};

module.exports = { handleStripeWebhook };
