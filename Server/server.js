const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const twilio = require('twilio');
const mongoose = require("mongoose");
const { connectDB, newclient } = require("./mongoddconnection");
const User = require('./Schema/Userschema'); // Assuming the schema
const nodemailer = require('nodemailer');
const Advocate  = require('./Schema/advocateschema');





dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
connectDB();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const otpTimestamps = {}; // memory store for phone => timestamp

// ✅ Send OTP
/*app.post('/send-otp', async (req, res) => {
  const { phone,email } = req.body;
  console.log("rcieved email:",email)
  if (!phone) return res.status(400).json({ error: 'Phone number is required' });

   try {
    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_ID)
      .verifications
      .create({ to: phone, channel: 'sms' });

    otpTimestamps[phone] = Date.now(); // Store time OTP was sent

    res.json({ success: true, sid: verification.sid });
  } catch (err) {
    console.error('OTP Send Error:', err);
    res.status(500).json({ error: err.message });
  } 
 if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Store OTP in memory
    otpStore[email] = { otp, expiresAt };

    // Send OTP email
    await transporter.sendMail({
      from: `"Vakil Setu" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`
    });

    res.json({ success: true, message: 'OTP sent to email' });
  } catch (err) {
    console.error('Error sending OTP:', err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});*/
const otpStorage = new Map();

// Configure Nodemailer for Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER, // your Gmail
        pass: process.env.SMTP_PASS  // app password
    }
});

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ✅ Send OTP
app.post('/send-otp', async (req, res) => {
    const { email, fullName } = req.body;

    if (!email || !fullName) {
        return res.status(400).json({ success: false, message: 'Email and fullName are required' });
    }

    const otp = generateOTP();
    const expiryTime = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStorage.set(email, { otp, expiryTime, attempts: 0 });

    const mailOptions = {
        from: `"Vakil Setu" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Vakil Setu - Email Verification Code',
        html: `
            <h2>Hello ${fullName}!</h2>
            <p>Your verification OTP for Vakil Setu is: <b>${otp}</b>.</p>
            <p>This OTP will expire in 10 minutes.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${email}: ${otp}`); // For testing only
        res.json({ success: true, message: 'OTP sent successfully' });
    } catch (err) {
        console.error('Error sending OTP:', err);
        res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
});

// ✅ Verify OTP
/* app.post('/verify-otp', async (req, res) => {
  const { phone, code } = req.body;

  // Check expiration
  const sentAt = otpTimestamps[phone];
  if (!sentAt || Date.now() - sentAt > 30000) {
    return res.status(400).json({ error: 'OTP expired' });
  }

  try {
    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_ID)
      .verificationChecks
      .create({ to: phone, code });

    res.json({ status: verificationCheck.status });
  } catch (error) {
    console.error('OTP Verify Error:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
}); */
app.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    console.log( email, otp)

    if (!email || !otp) {
        return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    const storedOtpData = otpStorage.get(email);

    if (!storedOtpData) {
        return res.status(400).json({ success: false, message: 'No OTP found for this email' });
    }

    // Check if OTP is expired
    if (Date.now() > storedOtpData.expiryTime) {
        otpStorage.delete(email);
        return res.status(400).json({ success: false, message: 'OTP has expired' });
    }

    // Check attempts limit (max 3 attempts)
    if (storedOtpData.attempts >= 3) {
        otpStorage.delete(email);
        return res.status(400).json({ success: false, message: 'Maximum attempts exceeded' });
    }

    // Verify OTP
    if (storedOtpData.otp === otp) {
        // OTP verified successfully
        otpStorage.delete(email);
        return res.json({ success: true, message: 'OTP verified successfully' });
    } else {
        // Incorrect OTP, increment attempts
        storedOtpData.attempts += 1;
        otpStorage.set(email, storedOtpData);
        return res.status(400).json({
            success: false,
            message: `Invalid OTP. ${3 - storedOtpData.attempts} attempts remaining`
        });
    }
});
app.post('/userdetails', async (req, res) => {
  const { user } = req.body;
  const{ state, fullName, district, dob, email, phone, address,user_id,userType }= user;
  console.log('Received user data:', user)
  try{
    const db = newclient.db('Vakil-setu');
    const collection = db.collection('User');
    const user = await new User({
      name: fullName,
      email: email,
      phone: phone,
      address: address,
      state: state,
      district: district,
      dob: dob,
      user_id:user_id,
      userType:userType
      

    });
    await collection.insertOne(user);
    res.status(200).json({ message: 'User details saved successfully' });

  }
  catch (error) {
    console.error('Error saving user details:', error);

  }
})

app.post('/getadvocates', async (req, res)=>{

   try{
    const db = newclient.db('Vakil-setu');
    const collection = db.collection('advocates');
    const advocates = await collection.find({}).toArray();
    console.log("advocates:",advocates)
    res.status(200).json({ advocates });



  }
  catch(error){
    console.error('Error fetching advocates:', error);
  } 



})
app.post('/bookappointment', async (req, res)=>{
  const { appointmentData } = req.body;
  console.log('Received appointment data:', appointmentData)
  const{advocateId,userId, date, time,status,consultationType,notes,createdAt}= appointmentData;
  try{
    const db = newclient.db('Vakil-setu');
    const collection = db.collection('advocates_booking');
    const appointment = await collection.insertOne({
      advocate_id:new mongoose.Types.ObjectId(advocateId),
      user_id: userId,
      date: date,
      time: time,
      status: status,
      consultation_type: consultationType,
      notes: notes,
      createdAt: createdAt
    })
    res.status(200).json({ message: 'Appointment booked successfully' });

  }
  catch (error) {
    console.error('Error booking appointment:', error);

  }



}
)
app.post('/getappointments', async (req, res)=>{
  const { userId }= req.body;
  try{
    const db = newclient.db('Vakil-setu');
    const collection = db.collection('advocates_booking');
    const appointments = await collection.find({ user_id: userId }).toArray();
    res.status(200).json({ appointments });
  }
  catch (error) {
    console.error('Error fetching appointments:', error);
  }

})
app.post('/cancelappointment', async (req, res)=>{
  const { appointmentId,status }= req.body;
  try{
    const db = newclient.db('Vakil-setu');
    const collection = db.collection('advocates_booking');
    await collection.updateOne({
      _id: new mongoose.Types.ObjectId(appointmentId)
    }, { $set: { status: status } });
    res.status(200).json({ message: 'Appointment cancelled successfully' });
  }
  catch (error) {
    console.error('Error cancelling appointments:', error);
  }
})
   

app.listen(process.env.PORT, () => {
  console.log(`✅ Server running on http://localhost:${process.env.PORT}`);
});
