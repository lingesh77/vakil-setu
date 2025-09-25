const express = require("express");
const router = express.Router();

app.post('/userdetails', async (req, res) => {
  const { userData } = req.body;
  const{ state, fullName, district, dob, email, phone, address }= userData;
})