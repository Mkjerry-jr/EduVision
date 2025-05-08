const express = require('express');
const router = express.Router();
const upload = require('../controllers/uploader')
const authController = require('../controllers/authController');
const Student = require('../models/newstudentModel');
const Teacher = require('../models/newteacherModel');
const Head = require('../models/newheadModel');
const session = require('express-session');
const multer = require('multer')
const path = require('path');
const fs = require('fs')

let teacher;
let student;
let head;
let globalTeacher = null;

const uploadTimetables = upload.fields([
    { name: 'class1_timetable', maxCount: 1 },
    { name: 'class2_timetable', maxCount: 1 },
    { name: 'class3_timetable', maxCount: 1 },
    { name: 'class4_timetable', maxCount: 1 },
    { name: 'class5_timetable', maxCount: 1 },
    { name: 'teacher_timetable', maxCount: 1 }
]);

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
        let message;

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

        const inputPassword = Number(req.body.password);
        console.log(inputPassword)

        const ip = typeof inputPassword;
        const sf = typeof student.fatherPhone;

        if (inputPassword !== student.fatherPhone) {
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

        let failed, passed;
        let engTotal = 0, methTotal = 0, sciTotal = 0;
        let ie = 0, im = 0, is = 0;
        let me = 0, mm = 0, ms = 0;
        let ee = 0, em = 0, es;
        let totalDays;
        let presentDays;
        let percentage;

        async function calculateStudentMarks() {
            try {
                if (!student.marks || student.marks.length === 0) {
                    console.log(`No marks data found for student: ${student.fullName}`);
                    message = "No marks data available for this student";
                    return;
                }
                
                const markEntry = student.marks[0];
                
                ie = markEntry.internal_m && markEntry.internal_m.eng ? Number(markEntry.internal_m.eng) : 0;
                im = markEntry.internal_m && markEntry.internal_m.meth ? Number(markEntry.internal_m.meth) : 0;
                is = markEntry.internal_m && markEntry.internal_m.sci ? Number(markEntry.internal_m.sci) : 0;
                
                me = markEntry.midterm_m && markEntry.midterm_m.eng ? Number(markEntry.midterm_m.eng) : 0;
                mm = markEntry.midterm_m && markEntry.midterm_m.meth ? Number(markEntry.midterm_m.meth) : 0;
                ms = markEntry.midterm_m && markEntry.midterm_m.sci ? Number(markEntry.midterm_m.sci) : 0;
                
                ee = markEntry.endterm_m && markEntry.endterm_m.eng ? Number(markEntry.endterm_m.eng) : 0;
                em = markEntry.endterm_m && markEntry.endterm_m.meth ? Number(markEntry.endterm_m.meth) : 0;
                es = markEntry.endterm_m && markEntry.endterm_m.sci ? Number(markEntry.endterm_m.sci) : 0;

                engTotal = ie + me + ee;
                methTotal = im + mm + em;
                sciTotal = is + ms + es;

                console.log(engTotal);
                console.log(methTotal);
                console.log(sciTotal);

                console.log("Marked data for student");
                
                if (engTotal > 75 && methTotal > 75 && sciTotal > 75){
                    passed = "Passed";
                } else if (engTotal < 75 || methTotal < 75 || sciTotal <75 ) {
                    failed = "Failed."
                }
                
            } catch (error) {
                console.error("Error retrieving student marks:", error);
                message = "Failed to retrieve student marks: " + error.message;
            }
        }
        
        await calculateStudentMarks();

        async function getAttendanceSummary() {
            totalDays = student.attendanceSummary.totalDays;
            presentDays = student.attendanceSummary.presentDays;
            percentage = student.attendanceSummary.percentage;
        }

        async function getTiTi() {
            try {
                const student = await Student.findOne({ rollNo: req.body.username.trim() });
                if (!student) {
                    console.log("Student not found");
                    return null;
                }
                
                let timetableFilename = '';
                
                if(student.classy === "1st") {
                    timetableFilename = 'class1_timetable.png';
                    console.log("fetched class 1");
                } else if(student.classy === "2nd") {
                    timetableFilename = 'class2_timetable.png';
                    console.log("fetched class 2");
                } else if(student.classy === "3rd") {
                    timetableFilename = 'class3_timetable.png';
                    console.log("fetched class 3");
                } else if(student.classy === "4th") {
                    timetableFilename = 'class4_timetable.png';
                    console.log("fetched class 4");
                } else if(student.classy === "5th") {
                    timetableFilename = 'class5_timetable.png';
                    console.log("fetched class 5");
                } else {
                    console.log("Error fetching student timetable: Invalid class");
                    return null;
                }
                
                // Return just the URL path that will be accessible from the browser
                return `/uploads/${timetableFilename}`;
            } catch (error) {
                console.error("Error in getTiTi function:", error);
                return null;
            }
        }
        
        const timetableData = await getTiTi();

        await getAttendanceSummary();

        const absentDays = totalDays - presentDays;

        res.render("stud", { 
            student, 
            age, 
            formattedDate, 
            bmiStatus, 
            bmi,
            totalDays,
            presentDays,
            absentDays,
            percentage,
            failed, 
            passed, 
            message,
            engTotal,
            methTotal,
            sciTotal,
            im,
            ie,
            is,
            mm,
            me,
            ms,
            es,
            em,
            ee,
            timetableData
        });

    
    } catch (error) {
        console.error("Error in s_login:", error);
        res.status(500).send('Server error');
    }
});

//HEAD
router.post('/head', async (req, res) => {
    try {
        let message, success, failed;
        // console.log(req.body);
        console.log("Received username:", req.body.username);
        console.log("Received password:", req.body.password);

        if (!req.body.username || !req.body.password) {
            return res.status(400).send('Username and password are required');
        }
        // Try to find teacher with either sid OR username field
        head = await Head.findOne({ sid: req.body.username });
        req.session.head = head;
        
        console.log("Head: ",req.session.head);

        if (!head) {
            console.log("No head found with username/sid:", req.body.username);
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

        try {
            student = await Student.find({ sid: req.body.username, tribal: 'Yes'  });
            teacher = await Teacher.find({ sid: Number(req.body.username) });
        } catch (error) {
            res.send(error);
        }
    
        const countTribals = await Student.countDocuments({ tribal: 'Yes' });
        const headdb = await Head.findOneAndUpdate(
            { sid: String(req.session.head.sid) },
            { $set: { NoTribal: countTribals } }
        );
        if (!headdb) {
            message = 'Error occurred during updating Head';
            console.log(message);
        } else {
            console.log('Successfully updated Head');
        }   

        console.log("User logged in as head successfully:", head.sid);

        res.render("head", { head, student, teacher, success, failed, message });

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
        const t_pass = Number(req.body.password);

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

        async function getTiTi() {
        try {
        let timetableFilename = 'teacher_timetable.png';
                return `/uploads/${timetableFilename}`;
            } catch (error) {
                console.error("Error in getTiTi function:", error);
                return null;
            }
        }        
        const timetableData = await getTiTi();

        res.render("teach", { teacher, students: studentNames, classSelected, date, message, timetableData });

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

router.post('/marks', async (req, res) => {
    const { studroll, internal_english, internal_maths, internal_science, midterm_maths, midterm_science, midterm_english, endterm_english, endterm_maths, endterm_science } = req.body;
    let message = "";
    teacher = req.session.teacher;
    const classSelected = null;
    const date = null;

    try {
        if (!studroll) {
            message = "Missing required fields";
            console.log("missing required fields")
            return;
        }

        const marksEntry = {
            internal_m: {
                eng: internal_english,
                meth: internal_maths,
                sci: internal_science
            },
            midterm_m: {
                eng: midterm_english,
                meth: midterm_maths,
                sci: midterm_science
            },
            endterm_m: {
                eng: endterm_english,
                meth: endterm_maths,
                sci: endterm_science
            }
        };

        const student = await Student.findOne({ rollNo: studroll });
        if (student) {
            student.marks.push(marksEntry);
            await student.save();
            message = "Submitted marks successfully";
        } else {
            message = "Student not found";
        }

        console.log(message);

        res.render('teacher/marks', { message, teacher, classSelected, date });
    } catch (err) {
        message = "Error: " + err.message;
        console.error("Error saving marks:", err);
        res.render('teacher/marks', { message, teacher });
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

                console.log(alreadyMarked);

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

router.post('/up-timetable', uploadTimetables, async (req, res) => {
    const head = req.session.head;
    console.log(head);
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ message: "Please upload at least one timetable!" })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred during file upload." });
    }
     res.status(200).json({ message: "Uploaded Successfully!"});
});

router.get('/time-table', async (req, res) => {

});

router.post('/submit', async (req, res) => {
    try {
        let message = '', success = '', failed = '';
        const head = req.session.head;
        
        const student = await Student.find({ rollNo: String(req.body.rollNo) });
        console.log("Student :",student);
        
        if (student.length > 0) {
            failed = "Student already registered"
            res.render("head", { head, success, message, failed, student, teacher })
        } else {
            await registerStud();
        }
        
        async function registerStud() {
            try {
                const studentReg = new Student({ 
                    fullName: req.body.fullName, 
                    rollNo: req.body.rollNo, 
                    classy: String(req.body.classy), 
                    dob: req.body.dob, 
                    caste: req.body.caste, 
                    height: Number(req.body.height), 
                    weight: Number(req.body.weight), 
                    bloodGroup: req.body.bloodGroup, 
                    fatherName: req.body.fatherName, 
                    fatherOccupation: req.body.fatherOccupation, 
                    fatherEmail: req.body.fatherEmail, 
                    fatherPhone: Number(req.body.fatherPhone), 
                    motherName: req.body.motherName, 
                    motherOccupation: req.body.motherOccupation, 
                    motherEmail: req.body.motherEmail, 
                    motherPhone: Number(req.body.motherPhone), 
                    tribal: req.body.tribal, 
                    address: req.body.address, 
                    cid: head?.cid || null, 
                    sid: head?.sid ? Number(head.sid) : null, 
                    bid: head?.bid ? Number(head.bid) : null, 
                    bname: req.session.head.bname || null 
                });

                const countStuds = await Student.countDocuments({ sid: Number(req.session.head.sid) });

const headdb = await Head.findOneAndUpdate(
    { sid: String(req.session.head.sid) },
    { $set: { Nostud: countStuds } }
);

if (!headdb) {
    message = 'Error occurred during updating Head';
    console.log(message);
} else {
    console.log(success);
}   
                
                const result = await studentReg.save();
                
                if (!result) {
                    message = 'Error occurred during registration';
                    console.log('Error occurred during registration');
                    res.render("head", { head, message, student, teacher, failed, success });
                } else {
                    success = 'Successfully registered';
                    console.log('Pushed data successfully to MongoDB');
                    res.render("head", { head, success, student, teacher, message, failed });
                }
            } catch (error) {
                message = error;
                console.error("Error in register function:", error);
                res.render("head", { head, message, student, teacher, failed, success })
            }
        }
    } catch (error) {
        console.error("Error in main route handler:", error);
        res.status(500).send("Server error occurred");
    }
});

router.post('/Tsubmit', async (req, res) => {
        try {
            let message, success, failed;
            const head = req.session.head;
            
            const teacher = await Teacher.find({ tid: String(req.body.tid) });
            
            if (teacher.length > 0) {
                failed = "Teacher already registered"
                res.render("head", { head, success, message, failed, student, teacher })
            } else {
                await registerTeach();
            }
            
            async function registerTeach() {
                try {
                    const teacherReg = new Teacher({ tid: String(req.body.tid), sex: req.body.sex, name: req.body.name, dob: req.body.dob, education: req.body.education, bloodgroup: req.body.bloodgroup, experience: req.body.experience, domain: req.body.domain, mobile: req.body.mobile, email: req.body.email, address: req.body.address, bid: req.session.head.bid, cid: req.session.head.cid, bname: req.session.head.bname, sid: req.session.head.sid });
                    const result = await teacherReg.save();

                    const countTeachs = await Teacher.countDocuments({ sid: String(req.session.head.sid) });
                    const headdb = await Head.findOneAndUpdate(
                        { sid: Number(req.session.head.sid) },
                        { $set: { Noteach: Number(countTeachs) }
                    });
                    console.log(headdb)
                    
                    if (!headdb) {
                        message = 'Error occurred during updating Head';
                        console.log(message);
                    } else {
                        success = 'Successfully updated Head';
                        console.log(success);
                    }

                    if (!result) {
                        message = 'Error occurred during registration';
                        console.log('Error occurred during registration');
                        res.render("head", { head, message, student, teacher, failed, success });
                    } else {
                        success = 'Successfully registered';
                        console.log('Pushed data successfully to MongoDB');
                        res.render("head", { head, success, student, teacher, message, failed });
                    }
                } catch (error) {
                    message = error;
                    console.error("Error in register function:", error);
                    res.render("head", { head, message, student, teacher, failed, success })
                }
            }
        } catch (error) {
            console.error("Error in main route handler:", error);
            res.status(500).send("Server error occurred");
        }
});

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
