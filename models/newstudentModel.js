const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    rollNo: {
        type: String,
        required: true,
        unique: true
    },
    classy: {
        type: String,
        required: true,
        enum: ['1st', '2nd', '3rd', '4th', '5th']
    },
    dob: {
        type: Date,
    },
    sex: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    },
    sid: {
        type: Number,
        unique: true
    },
    caste: String,
    height: Number,
    weight: Number,
    bloodGroup: String,
    fatherName: String,
    fatherOccupation: String,
    fatherPhone: Number,
    fatherEmail: String,
    motherName: String,
    motherOccupation: String,
    motherPhone: Number,
    motherEmail: String,
    
    // Fixed attendance structure
    attendance: [
        {
            date: {
                type: Date,
                required: true,
                immutable: false // Allows updates
            },
            status: {
                type: String,
                enum: ['present', 'absent'],
                default: 'present'
            }
        }
    ],
    
    // Automatic attendance summary
    attendanceSummary: {
        totalDays: { type: Number, default: 0 },
        presentDays: { type: Number, default: 0 },
        percentage: { type: Number, default: 0 }
    },

    // Marks structure (unchanged but validated)
    marks: [{
        internal_m: {
            eng: { type: Number, min: 0, max: 100 },
            meth: { type: Number, min: 0, max: 100 },
            sci: { type: Number, min: 0, max: 100 }
        },
        midterm_m: {
            eng: { type: Number, min: 0, max: 100 },
            meth: { type: Number, min: 0, max: 100 },
            sci: { type: Number, min: 0, max: 100 }
        },
        endterm_m: {
            eng: { type: Number, min: 0, max: 100 },
            meth: { type: Number, min: 0, max: 100 },
            sci: { type: Number, min: 0, max: 100 }
        }
    }],

    tribal: String,
    address: String,
    cid: String,
    bid: String,
    bname: String
}, {
    timestamps: true, // Adds createdAt and updatedAt
    strict: true // Ensures only defined fields are saved
});

// Auto-update attendance summary
studentSchema.pre('save', function(next) {
    if (this.isModified('attendance')) {
        const presentCount = this.attendance.filter(a => a.status === 'present').length;
        this.attendanceSummary = {
            totalDays: this.attendance.length,
            presentDays: presentCount,
            percentage: this.attendance.length > 0 
                ? Math.round((presentCount / this.attendance.length) * 100)
                : 0
        };
    }
    next();
});

module.exports = mongoose.model('Student', studentSchema);