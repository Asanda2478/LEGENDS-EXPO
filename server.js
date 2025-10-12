const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ✅ Your PayFast merchant details

const merchant_id = "10042700";
const merchant_key = "l8vjs8ugxtou0";

const passphrase = ""; // optional (only if you set one in your PayFast account)

// ✅ Utility function to generate the PayFast signature
function generateSignature(params, passphrase = "") {
  let pfOutput = "";
  Object.keys(params)
    .sort()
    .forEach(function (key) {
      if (params[key]) {
        pfOutput += `${key}=${encodeURIComponent(params[key].trim()).replace(/%20/g, "+")}&`;
      }
    });

  // Remove trailing '&'
  pfOutput = pfOutput.slice(0, -1);

  if (passphrase) {
    pfOutput += `&passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, "+")}`;
  }

  return crypto.createHash("md5").update(pfOutput).digest("hex");
}

// ✅ Endpoint to create a payment link
app.post("/create-payment", (req, res) => {
  const { amount, item_name, name_first, name_last, email_address, m_payment_id } = req.body;

  const paymentData = {

    merchant_id:"10042700" ,
    merchant_key:"l8vjs8ugxtou0" ,

    return_url: "https://yourdomain.com/success",
    cancel_url: "https://yourdomain.com/cancel",
    notify_url: "https://legends-fmzi.onrender.com/notify",
    m_payment_id,
    amount,
    item_name,
    name_first,
    name_last,
    email_address,
    email_confirmation: "1",
    confirmation_address: email_address,
  };

  // ✅ Generate signature
  const signature = generateSignature(paymentData, passphrase);
  paymentData.signature = signature;

  // ✅ Build PayFast payment URL
  const query = Object.keys(paymentData)
    .map(
      (key) => `${key}=${encodeURIComponent(paymentData[key].toString()).replace(/%20/g, "+")}`
    )
    .join("&");

  const payfastUrl = `https://sandbox.payfast.co.za/eng/process?${query}`;

  console.log("✅ Payment URL generated:", payfastUrl);

  // ✅ Send back to app
  res.json({ payfastUrl });
});

// ✅ PayFast notify_url endpoint
app.post("/notify", (req, res) => {
  const paymentData = req.body;

  console.log("🔔 Payment Notification Received:", paymentData);

  if (paymentData.payment_status === "COMPLETE") {
    console.log("✅ Payment Successful:", paymentData);
    // Save to your database or mark order as paid
  } else {
    console.log("❌ Payment Failed or Pending");
  }

  res.status(200).send("OK");
});

// ✅ Test route
app.get("/", (req, res) => {
  res.send("PayFast Backend Running ✅");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

