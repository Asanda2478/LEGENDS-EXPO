const express = require("express");
const crypto = require("crypto");
const querystring = require("querystring");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// ✅ Create PayFast Payment Endpoint
app.post("/create-payment", (req, res) => {
  const { amount, itemName, email } = req.body;

  const pfData = {
    merchant_id: "19412722", // PayFast Sandbox ID
    merchant_key: "46ihfsjvbdhpw", // PayFast Sandbox Key
    return_url: "https://your-app.com/success",
    cancel_url: "https://your-app.com/cancel",
    notify_url: "https://legends-fmzi.onrender.com/notify", // Change after deploy
    amount: amount,
    item_name: itemName,
    email_address: email,
  };

  // 🔑 Build signature
  let signatureString = querystring.stringify(pfData).replace(/%20/g, "+");
  signatureString += "&passphrase=YOUR_PASSPHRASE"; // Replace with your passphrase

  const signature = crypto.createHash("md5").update(signatureString).digest("hex");
  pfData.signature = signature;

  const paymentUrl =
    "https://sandbox.payfast.co.za/eng/process?" + querystring.stringify(pfData);

  res.json({ paymentUrl });
});

// ✅ Handle PayFast Notify (IPN)
app.post("/notify", (req, res) => {
  console.log("PayFast Notification:", req.body);
  // TODO: verify signature + store in DB
  res.sendStatus(200);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
