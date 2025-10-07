const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// ✅ PayFast notify_url endpoint
app.post("/notify", (req, res) => {
  const paymentData = req.body;

  console.log("🔔 Payment Notification Received:", paymentData);

  // Example validation (you can also send back to PayFast for verification)
  if (paymentData.payment_status === "COMPLETE") {
    console.log("✅ Payment Successful:", paymentData);
    // Save to database or mark order as paid
  } else {
    console.log("❌ Payment Failed or Pending");
  }

  // Must reply with HTTP 200 so PayFast knows we received it
  res.status(200).send("OK");
});

// ✅ Test route
app.get("/", (req, res) => {
  res.send("PayFast Backend Running ✅");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
