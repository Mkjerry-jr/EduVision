const User = require('../models/newstudentModel');
const Teacher = require('../models/newteacherModel');
const bcrypt = require('bcrypt');
const sesh_sto = require('node-sessionstorage')
const express = require('express');
const app = express();
const router = express.Router();



exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).send('User already exists');

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role });

        await newUser.save();
        res.redirect('/auth/login');
    } catch (error) {
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).send('Invalid credentials');
        }

        req.session.user = user;
        res.redirect('/dashboard');
    } catch (error) {
        res.status(500).send('Server error');
    }
};

exports.s_login = async (req, res) => {
    try {
        console.log("Received username:", req.body.username);
        console.log("Received password:", req.body.password);

        if (!req.body.username || !req.body.password) {
            return res.status(400).send('Username and password are required');
        }

        const s_user = await User.findOne({ rollNo: req.body.username.trim() });

        if (!s_user) {
            console.log("No user found with rollNo:", req.body.username);
            return res.status(400).send('User not found');
        }

        const inputPassword = parseInt(req.body.password, 10);
        if (isNaN(inputPassword)) {
            return res.status(400).send('Password must be a number');
        }

        if (inputPassword !== s_user.weight) {
            console.log(`Password mismatch:
                Input (number): ${inputPassword}
                Stored (number): ${s_user.weight}`);
            return res.status(400).send('Wrong password');
        }

        const s_details = await User.findOne({ motherName: s_user.motherName });
        req.session.studentDetails = s_details;
        console.log("User logged in successfully:", req.body.username);

        res.render("student/S_index");
    
    } catch (error) {
        console.error("Error in s_login:", error);
        res.status(500).send('Server error');
    }
};

exports.t_login = async (req, res) => {
    try {
        // console.log(req.body);
        console.log("Received username:", req.body.username);
        console.log("Received password:", req.body.password);

        if (!req.body.username || !req.body.password) {
            return res.status(400).send('Username and password are required');
        }

        // Try to find teacher with either tid OR username field
        const teacher = await Teacher.findOne({ 
            $or: [
                { tid: req.body.username },
                { username: req.body.username }
            ]
        });
        
        console.log("Found teacher:", teacher);

        if (!teacher) {
            console.log("No teacher found with username/tid:", req.body.username);
            return res.status(400).send('Teacher not found');
        }

        // Check if password should be validated as a number or string
        if (typeof teacher.password !== 'undefined') {
            // If teacher has a password field, use that (preferred approach)
            if (req.body.password !== teacher.password) {
                console.log("Password mismatch with teacher.password");
                return res.status(400).send('Wrong password');
            }
        } else if (typeof teacher.sid !== 'undefined') {
            // Fallback to sid field (which appears to be your current approach)
            const inputPassword = parseInt(req.body.password, 10);
            if (isNaN(inputPassword)) {
                return res.status(400).send('Password must be a number');
            }

            if (inputPassword !== teacher.sid) {
                console.log(`Password mismatch:
                    Input (number): ${inputPassword}
                    Stored (number): ${teacher.sid}`);
                return res.status(400).send('Wrong password');
            }
        } else {
            console.log("No password field found in teacher document");
            return res.status(500).send('Server error: invalid teacher record');
        }

        const t_details = await Teacher.findOne({ });
        req.session.teacherDetails = t_details;

        function take() {
            sesh_sto.setItem("teacherDetails", JSON.stringify(t_details));
        }

        take();

        if (!take) {
            console.log('failed')
        } else if (take) {
            console.log('success')
        } else {
            console.log('error')
        }
        console.log("User logged in as teacher successfully:", req.body.username);

        // Store in session storage if needed (client-side)
        // Note: This block won't execute server-side as sessionStorage is client-side
        // Consider moving this to client code or using a different approach
        
        res.render("teacher/T_index");

    } catch (error) {
        console.error("Error in teacher login:", error);
        res.status(500).send('Server error');
    }
};