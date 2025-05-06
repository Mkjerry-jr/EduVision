const express = require('express');
const router = express.Router();
const NewStudent = require('../models/newstudentModel'); // Adjust path if needed
const NewTeacher = require('../models/newteacherModel');

router.post('/submit', async (req, res) => {
    try {
        console.log(req.body)
        const { fullName, dob, rollNo, classy, caste, height, weight, bloodGroup, fatherName, fatherOccupation, fatherPhone, fatherEmail, motherName, motherOccupation, motherPhone, motherEmail, tribal, address } = req.body;

        console.log(JSON.stringify(req.body.bloodGroup));

        // Create a new student entry
        const student = new NewStudent({ fullName, dob, rollNo, classy, caste, height, weight, bloodGroup, fatherName, fatherOccupation, fatherPhone, fatherEmail, motherName, motherOccupation, motherPhone, motherEmail, tribal, address });
        const nigger = student.save();
        await nigger;
        if(!nigger) {
            console.log('something error happened');
        } else {
            console.log('pushed data successfully to MongoDB');
        }

        res.status(201).send("Student Registeration Successfull !!!   Work on Progress!!!   Kindly Go back Manually!!!")
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/Tsubmit', async (req, res) => {
    try {
        const { sid, tid , sex, name, dob, education, bloodgroup, experience, domain, mobile, email, address } = req.body;
        console.log(JSON.stringify(req.body.bloodgroup));
        console.log(JSON.stringify(req.body.education));
        console.log(JSON.stringify(req.body.domain));


        // Create a new teacherx entry
        const teacher = new NewTeacher({ sid, tid , sex, name, dob, education, bloodgroup, experience, domain, mobile, email, address });
        const trigger = teacher.save();
        await trigger;
        if(!trigger) {
            console.log('something error happened');
        } else {
            console.log('pushed data successfully to MongoDB');
        }

        res.status(200).send("Teacher Registeration Successfull !!!   Work on Progress!!!   Kindly Go back Manually!!!")
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});



module.exports = router;
