import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { startVideoEdit } from "./bokbok/main.js";
import { makeMeme } from "./makeMeme.js";

/* ---------------------------------- Setup --------------------------------- */

const bee_movie = ``;

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

// TODO: Use makeMeme
// TODO: Add meme to the UI

/* ------------------------- Generate brainrot video ------------------------ */

// TODO: Get a screenshot of the canvas
// TODO: Generate a brainrot video
// TODO: Post a link to the brainrot video in the UI

// Handle file upload
app.post("/upload", upload.single("file"), async (req, res) => {
  if (req.file) {
    // const fileUrl = `https://api.memegen.link/images/pigeon/Engineer/_/You_call_this_contrast~q.png?style=https://i.imgur.com/W0NXFpQ.png`;
    const [fileUrl, roastText] = await makeMeme();
    let plainTextStrings = {
      strings: [roastText],
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
