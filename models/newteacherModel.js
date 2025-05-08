    const mongoose = require('mongoose');

    const teacherSchema = new mongoose.Schema({
        sid: Number,
        tid: Number,
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
        bid: Number,
        bname: String
    });

    const Teacher = mongoose.model('teachers', teacherSchema);

    module.exports = Teacher;
