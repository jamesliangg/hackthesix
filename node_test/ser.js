import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { startVideoEdit} from "./bokbok/main.js";

const app = express();
const port = 5002;

const bee_movie = `I love this incorporating
an amusement park into our regular day.
BARRY:
I guess that's why they say we don't need vacations.
(Barry parallel parks the car and together they fly over the graduating
students)
Boy, quite a bit of pomp...
under the circumstances.
(Barry and Adam sit down and put on their hats)
 :
- Well, Adam, today we are men.

ADAM:
- We are!
BARRY=
- Bee-men.
=ADAM=
- Amen!
BARRY AND ADAM:
Hallelujah!
(Barry and Adam both have a happy spasm)
ANNOUNCER:
Students, faculty, distinguished bees,
 :
please welcome Dean Buzzwell.
DEAN BUZZWELL:
Welcome, New Hive Oity`

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

async function getRandomMemeURL() {
    // Fetch the JSON response from the URL
    const response = await fetch('https://api.memegen.link/templates/');

    // Check if the response is successful
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }

    // Parse the JSON response
    const templates = await response.json();

    // Select a random template
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];

    // Get the URL from the random template
    const randomURL = randomTemplate.example.url;
    // console.log(randomURL);

    return randomURL;
}

// Handle file upload
app.post('/upload', upload.single('file'), async (req, res) => {
    if (req.file) {
        // const fileUrl = `https://api.memegen.link/images/pigeon/Engineer/_/You_call_this_contrast~q.png?style=https://i.imgur.com/W0NXFpQ.png`;
        const fileUrl = await getRandomMemeURL();
        let plainTextStrings = {
            strings: [bee_movie],
        };
        let fileNames = ["bee2"];
        startVideoEdit(plainTextStrings, fileNames);
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
