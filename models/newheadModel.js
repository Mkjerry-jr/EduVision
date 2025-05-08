    const mongoose = require('mongoose');

    const headSchema = new mongoose.Schema({
        sid: String,
        sname: String,
        hname: String,
        Address: String,
        Nostud: Number,
        Noteach: Number,
        NoOther: Number,
        NoTribal: Number,
        cid: String,
        bid: String,
        bname: String
    });

    module.exports = mongoose.model('heads', headSchema);