const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 5002;

// Enable CORS
app.use(cors());

// Set up multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to save the uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Keep the original file name
    }
});

const upload = multer({ storage });

// Create the uploads directory if it does not exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
    if (req.file) {
        const fileUrl = `https://api.memegen.link/images/pigeon/Engineer/_/You_call_this_contrast~q.png?style=https://i.imgur.com/W0NXFpQ.png`;
        res.status(200).json({
            message: 'File uploaded successfully',
            fileUrl: fileUrl
        });
    } else {
        res.status(400).send('No file uploaded');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
