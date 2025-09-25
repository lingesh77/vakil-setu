const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    phone: {type: String, required: true, unique: true},
    address: {type: String, required: true},
    state: {type: String, required: true},
    district: {type: String, required: true},
    dob: {type: String, required: true},

})
const User = mongoose.model('User', UserSchema);
module.exports = User;