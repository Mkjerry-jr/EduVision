    const mongoose = require('mongoose');

    const teacherSchema = new mongoose.Schema({
        sid: String,
        tid: String,
        name: String,
        dob: Date,
        sex: String,
        bloodgroup: String,
        education: String,
        experience: Number,
        domain: String,
        mobile: Number,
        email: String,
        address: String,
        cid: String,
        bid: String,
        bname: String
    });

    module.exports = mongoose.model('teachers', teacherSchema);
