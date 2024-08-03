import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { startVideoEdit } from "./bokbok/main.js";
import { makeMeme } from "./makeMeme.js";

/* ---------------------------------- Setup --------------------------------- */

const bee_movie = `And begins your career
at Honex Industries!
ADAM:
Will we pick our job today?
(Adam and Barry get into a tour bus)
BARRY=
I heard it's just orientation.
(Tour buses rise out of the ground and the students are automatically
loaded into the buses)
TOUR GUIDE:
Heads up! Here we go.

ANNOUNCER:
Keep your hands and antennas
inside the tram at all times.
BARRY:
- Wonder what it'll be like?
ADAM:
- A little scary.
TOUR GUIDE==
Welcome to Honex,
a division of Honesco
 :
and a part of the Hexagon Group.
Barry:
This is it!
BARRY AND ADAM:
Wow.
BARRY:
Wow.
(The bus drives down a road an on either side are the Bee's massive
complicated Honey-making machines)`;

const app = express();
app.use(cors());
const port = 5002;

/* ------------------------------ Set up Multer ----------------------------- */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory to save the uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Keep the original file name
  },
});

const upload = multer({ storage });

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

/* ------------------------------ Get the meme ------------------------------ */

// async function getRandomMemeURL() {
//   // Fetch the JSON response from the URL
//   const response = await fetch("https://api.memegen.link/templates/");

//   // Check if the response is successful
//   if (!response.ok) {
//     throw new Error("Network response was not ok " + response.statusText);
//   }

//   // Parse the JSON response
//   const templates = await response.json();

//   // Select a random template
//   const randomTemplate =
//     templates[Math.floor(Math.random() * templates.length)];

//   // Get the URL from the random template
//   const randomURL = randomTemplate.example.url;
//   // console.log(randomURL);

//   return randomURL;
// }

/* ----------------------------- Add meme to UI ----------------------------- */

// TODO

/* ------------------------- Generate brainrot video ------------------------ */

//

// Handle file upload
app.post("/upload", upload.single("file"), async (req, res) => {
  if (req.file) {
    // const fileUrl = `https://api.memegen.link/images/pigeon/Engineer/_/You_call_this_contrast~q.png?style=https://i.imgur.com/W0NXFpQ.png`;
    const fileUrl = await makeMeme();
    let plainTextStrings = {
      strings: [bee_movie],
    };
    let fileNames = ["uwuwu"];
    startVideoEdit(plainTextStrings, fileNames);
    res.status(200).json({
      message: "File uploaded successfully",
      fileUrl: fileUrl,
    });
  } else {
    res.status(400).send("No file uploaded");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
