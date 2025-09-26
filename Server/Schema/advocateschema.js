import mongoose from "mongoose";

const advocateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  experience: {
    type: Number,
    required: true
  },
  specialization: {
    type: [String], // e.g., ["Criminal Law", "Corporate Law"]
    required: true
  },
  location: {
    type: String,
    required: true
  },
  qualification: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  casesWon: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  practiceAreas: {
    type: [String], // e.g., ["Civil Litigation", "Contract Law"]
    required: true
  },
  barCouncil: {
    type: String,
    required: true
  }
}, {
  timestamps: true // adds createdAt & updatedAt automatically
});

const Advocate = mongoose.model("advocates", advocateSchema);

export default Advocate;
