const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../public/uploads/');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images.'), false);
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        const fieldName = file.fieldname;
        cb(null, `${fieldName}.${ext}`);
    }
});

const upload = multer({ 
    storage: storage, 
    fileFilter: multerFilter, 
    limits: { fileSize: 20000000 }
});

module.exports = upload;
