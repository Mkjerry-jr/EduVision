const express = require('express');
const multer = require('multer');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { Storage } = require('@google-cloud/storage');
const authController = require('../controllers/authController');
const Student = require('../models/newstudentModel');
const Teacher = require('../models/newteacherModel');
const Head = require('../models/newheadModel');
const session = require('express-session');

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload only images.'), false);
    }
  };

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads'),
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        const date = Date.now();
        cb(null, `Time-Table_${Date}.${ext}`);
      }
});

const upload = multer({ storage: storage, fileFilter: multerFilter, limits: { fileSize: 20000000 } });

let teacher;
let globalTeacher = null;

// BEO
router.post('/BEO', async (req, res) => {
    try {
        let message;
        // console.log(req.body);
        console.log("Received username:", req.body.username);
        console.log("Received password:", req.body.password);

        if (!req.body.username || !req.body.password) {
            message = "username and password is required";
        }

        // const cluster = await Cluster.findOne({ key: req.body.username });
        
        // console.log("Found head");

        let c_user = "beo";
        let c_pass = "beo";

        /*if (!head) {
            console.log("No head found with username/tid:", req.body.username);
            return res.status(400).send('Teacher not found');
        }
            */

        if (typeof c_pass !== 'undefined') {
            if (req.body.password !== c_pass) {
                console.log("Password mismatch");
                message = "password mismatch";
            }
        } else if (typeof c_pass !== 'undefined') {
            const inputPassword = req.body.password;

            if (inputPassword !== c_pass) {
                console.log(`Password mismatch:
                    Input (number): ${inputPassword}
                    Stored (number): ${c_pass}`);
                message = "password mismatch lol";
            }
        } else {
            console.log("No password field found in teacher document");
            message = "BEO doesnt exist haha";
        }

        const BEO = await Head.find({}).select('');
        
        console.log("User logged in as beo successfully:", c_user);

        res.render("beo", { BEO });

    } catch (error) {
        message = error;
        console.error("Error in head login:", error);
        res.render('login');
    }
});

//CLUSTER
router.post('/cluster', async (req, res) => {
    try {
        // console.log(req.body);
        console.log("Received username:", req.body.username);
        console.log("Received password:", req.body.password);

        if (!req.body.username || !req.body.password) {
            return res.status(400).send('Username and password are required');
        }

        const c_user = req.body.username;
        const c_pass = req.body.password;
        

        // const cluster = await Cluster.findOne({ key: req.body.username });
        
        // console.log("Found head");


        /*if (!head) {
            console.log("No head found with username/tid:", req.body.username);
            return res.status(400).send('Teacher not found');
        }
            */

        if (typeof c_pass !== 'undefined') {
            if (req.body.password !== c_pass) {
                console.log("Password mismatch");
                return res.status(400).send('Wrong password');
            }
        } else if (typeof c_pass !== 'undefined') {
            const inputPassword = req.body.password;

            if (inputPassword !== c_pass) {
                console.log(`Password mismatch:
                    Input (number): ${inputPassword}
                    Stored (number): ${c_pass}`);
                return res.status(400).send('Wrong password');
            }
        } else {
            console.log("No password field found in teacher document");
            return res.status(500).send('Server error: invalid teacher record');
        }

        try {
            const validRegions = ['north', 'east', 'west', 'south'];
            
            if (validRegions.includes(c_user) && c_user === c_pass) {
              console.log(`User logged in as ${c_user}`);
              
              const head = await Head.findOne({ cid: c_user });
              
              if (!head) {
                console.log(`No head data found for region: ${c_user}`);
                return res.status(404).send('Region data not found');
              }
              
              let regionStats = {};
              if (c_user === 'north' && c_pass === 'north') {

                var schoolCount = await Head.countDocuments({ cid: c_pass });
                var nostuds = await Student.countDocuments({ cid: c_pass });
                var schoolDetails = await Head.find({ cid: c_pass });
                console.log(`Number of schools in ${c_pass}: ${schoolCount}`);
                regionStats.schoolCount = schoolCount;
                return res.render("cluster", { head, schoolCount, nostuds, schoolDetails });

              } else if(c_user === 'east' && c_pass === 'east') {

                var schoolCount = await Head.countDocuments({ cid: c_pass });
                var nostuds = await Student.countDocuments({ cid: c_pass });
                console.log(`Number of schools in ${c_pass}: ${schoolCount}`);
                regionStats.schoolCount = schoolCount;
                var schoolDetails = await Head.find({ cid: c_pass });
                return res.render("cluster", { head, schoolCount, nostuds, schoolDetails });

              } else if(c_user === 'west' && c_pass === 'west') {

                var schoolCount = await Head.countDocuments({ cid: c_pass });
                var nostuds = await Student.countDocuments({ cid: c_pass });
                console.log(`Number of schools in ${c_pass}: ${schoolCount}`);
                regionStats.schoolCount = schoolCount;
                var schoolDetails = await Head.find({ cid: c_pass });
                return res.render("cluster", { head, schoolCount, nostuds, schoolDetails });

              } else if(c_user === 'south' && c_pass === 'south') {

                var schoolCount = await Head.countDocuments({ cid: c_pass });
                var nostuds = await Student.countDocuments({ cid: c_pass });
                console.log(`Number of schools in ${c_pass}: ${schoolCount}`);
                regionStats.schoolCount = schoolCount;
                var schoolDetails = await Head.find({ cid: c_pass });
                return res.render("cluster", { head, schoolCount, nostuds, schoolDetails });

             } else {
                console.log(`Invalid credentials for user: ${c_user}`);
                return res.status(401).send('Invalid username or password');
            }
             }
        } catch (error) {
                console.error('Server error:', error);
                return res.status(500).send(`error. entered ${c_user} and ${c_pass}`);
            }
    } catch (error) {
        console.error("Error in head login:", error);
        res.status(500).send('Server error\n', error);
    }
});

//STUDENT
router.post('/student', async (req, res) => {
    try {
            console.log("Received username:", req.body.username);
            console.log("Received password:", req.body.password);
    
            if (!req.body.username || !req.body.password) {
                return res.status(400).send('Username and password are required');
            }
    
            const student = await Student.findOne({ rollNo: req.body.username.trim() });
    
            if (!student) {
                console.log("No user found with rollNo:", req.body.username);
                return res.status(400).send('User not found');
            }
    
            const inputPassword = String(req.body.password);

             const ip = typeof inputPassword;
             const sf = typeof student.fatherPhone;
    
            if (inputPassword !== String(student.fatherPhone)) {
                console.log(`Password mismatch:
                    Input: ${ip}
                    Stored: ${sf}`);
                return res.status(400).send('Wrong password');
            }

            let dob = student.dob;
            let time = new Date(dob);
            const day = String(time.getDate()).padStart(2, '0');
            const month = String(time.getMonth() + 1).padStart(2, '0');
            const year = time.getFullYear();

            const formattedDate = `${day}/${month}/${year}`;
            console.log("User logged in successfully:", req.body.username);

            const bdayyear = `${year}`;
            const today = new Date();
            const age = today.getFullYear() - parseInt(bdayyear);
            
            const height = student.height;
            const weight = student.weight;

            const bmiRounded = weight/((height/100)*(height/100));
            const bmi = parseFloat(bmiRounded.toFixed(2));

            const bmiStatus = 
            bmi < 18.5 ? "Underweight" :
            bmi < 24.9 ? "Normal" :
            bmi < 29.9 ? "Overweight" :
            "Obese";

              
            res.render("stud", { student, age, formattedDate, bmiStatus, bmi });
        
        } catch (error) {
            console.error("Error in s_login:", error);
            res.status(500).send('Server error');
        }
});

//HEAD
router.post('/head', async (req, res) => {
    try {
        // console.log(req.body);
        console.log("Received username:", req.body.username);
        console.log("Received password:", req.body.password);

        if (!req.body.username || !req.body.password) {
            return res.status(400).send('Username and password are required');
        }
        // Try to find teacher with either tid OR username field
        const head = await Head.findOne({ sid: req.body.username });
        
        console.log(head);

        if (!head) {
            console.log("No head found with username/tid:", req.body.username);
            return res.status(400).send('Head not found');
        }

        // Check if password should be validated as a number or string
        if (typeof head.password !== 'undefined') {
            // If teacher has a password field, use that (preferred approach)
            if (req.body.password !== teacher.password) {
                console.log("Password mismatch with head");
                return res.status(400).send('Wrong password');
            }
        } else if (typeof head.cid !== 'undefined') {
            // Fallback to sid field (which appears to be your current approach)
            const inputPassword = req.body.password;

            if (inputPassword !== head.cid) {
                console.log(`Password mismatch:
                    Input (number): ${inputPassword}
                    Stored (number): ${head.cid}`);
                return res.status(400).send('Wrong password');
            }
        } else {
            console.log("No password field found in teacher document");
            return res.status(500).send('Server error: invalid teacher record');
        }
        
        console.log("User logged in as teacher successfully:", head.sid);

        res.render("head", { head });

    } catch (error) {
        console.error("Error in head login:", error);
        res.status(500).send('Server error');
    }
});


//TEACHER
router.post('/teacher', async (req, res) => {
    try {
        if (!req.body.username || !req.body.password) {
            return res.status(400).send('Username and password are required');
        }

        const t_user = req.body.username;
        const t_pass = req.body.password;

        console.log(`entered: ${typeof t_user} and ${typeof t_pass}`);
        
        const teacher = await Teacher.findOne({ tid: req.body.username });
        
        // Store teacher in the session
        req.session.teacher = teacher;
        globalTeacher = teacher; 

        console.log(`found: ${typeof teacher.tid} and ${typeof teacher.sid}`);
        console.log("Teacher found:", teacher);
        
        if (!teacher) {
            return res.status(400).send('Teacher not found');
        }

        if (typeof teacher.sid !== 'undefined') {
            if (t_pass !== teacher.sid) {
                console.log("Password mismatch: expected", teacher.sid, "got", t_pass);  
                return res.status(400).send('Wrong password');
            }
        } else if (typeof teacher.sid !== 'undefined') {
            const inputPassword = parseInt(t_pass, 10);
            if (isNaN(inputPassword)) {
                return res.status(400).send('Password must be a number');
            }

            if (inputPassword !== teacher.sid) {
                console.log("Password mismatch: expected", teacher.sid, "got", inputPassword);
                return res.status(400).send('Wrong password');
            }
        } else {
            console.log("No password or sid field found in teacher record:", teacher);
            return res.status(500).send('Server error: invalid teacher record');
        }

        console.log("Teacher authenticated successfully");

        const { classSelected, date } = req.query;
        const students = await Student.find({});
        let message = '';
        let studentNames = [];

        if (classSelected && date) {
            studentNames = await Student.find({ $and: [{classy: classSelected}, { sid: teacher.sid }, {tribal: 'No'}] });
            if (studentNames.length === 0) {
                message = 'No students found for the selected class.';
            }
        }

        res.render("teach", { teacher, students: studentNames, classSelected, date, message });

    } catch (error) {
        console.error("Error in teacher login route:", error);
        res.status(500).send('Server error');
    }
});

//STUDENT
router.get('/attendance', async (req, res) => {
    try {
        // Try multiple ways to get the teacher
        let teacher = null;
        
        // 1. Try from session
        if (req.session && req.session.teacher) {
            teacher = req.session.teacher;
            console.log("Teacher found in session");
        } 
        // 2. Fall back to global variable
        else if (globalTeacher) {
            teacher = globalTeacher;
            console.log("Teacher found in global variable");
        } 
        // 3. Try to get from query parameter
        else if (req.query.tid) {
            teacher = await Teacher.findOne({ tid: req.query.tid });
            console.log("Teacher fetched from database");
            
            if (teacher) {
                // Store for future requests
                req.session.teacher = teacher;
                globalTeacher = teacher;
            }
        }
        
        console.log("\n\n Found teacher? \n\n", teacher ? "Yes" : "No");
        
        const { classSelected, date } = req.query;
        let students = [];
        let message = '';
        
        // Initialize studentsid variable before using it
        const studentsid = req.session.studentsid || [];
        
        if (classSelected && date) {
            // Fetch students either by student IDs or by class
            if (studentsid && studentsid.length > 0) {
                students = await Student.find({ 
                    sid: { $in: studentsid },
                    classy: classSelected, 
                    tribal: { $ne: 'Yes' } 
                });
            } else {
                students = await Student.find({ 
                    $and: [{ sid: teacher.sid }, { classy: classSelected }, { tribal: 'No' }] 
                });
            }
            
            if (students.length === 0) {
                message = 'No students found for the selected class.';
            }
            
            console.log(`Found ${students.length} students`);
        }
  
        res.render('teacher/attendance', { 
            students, 
            classSelected, 
            date, 
            message, 
            teacher,
            studentsid: studentsid || []
        });
    } catch (error) {
        console.error("Error in attendance route:", error);
        res.status(500).send('Server error: ' + error.message);
    }
});

router.post('/attendance', async (req, res) => {
    const { classSelected, date, attendancestatus } = req.body;
    teacher = req.session.teacher;
    const students = null;
    let message;

    try {
        const attendanceDate = new Date(date);

        for (const [rollNo, status] of Object.entries(attendancestatus)) {
            const attendanceEntry = {
                date: attendanceDate,
                status: status === "1" ? "present" : "absent"
            };
            const student = await Student.findOne({ rollNo, classy: classSelected });
            if (student) {
                const alreadyMarked = student.attendance.some(att => 
                    new Date(att.date).toDateString() === attendanceDate.toDateString()
                );

                if (!alreadyMarked) {
                    student.attendance.push(attendanceEntry);
                    await student.save();
                }
            }
        }
        message = "Submitted attendance successfully";
        res.render('teacher/attendance', { teacher, classSelected, date, message, students });
    } catch (err) {
        message = "Error:" + err;
        console.error("Error saving attendance:", err);
        res.render('teacher/attendance', { teacher, classSelected, date, message, students });
    }
});

router.post('/upload-timetables', upload.single('timetable'), async(req, res) => {
    const { timetable } = req.file;
    const gDriveLink = "https://drive.google.com/drive/folders/1b-FHnIAeFOo5Gr6E7IxBynHkl8Uw_Fbk?usp=drive_link";


});

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
