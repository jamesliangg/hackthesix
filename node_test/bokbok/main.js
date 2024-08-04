import { downloadVideo } from "./lib/download-video.js";
import { convertTextToSpeech } from "./lib/text-to-speech.js";
import { editVideo } from "./lib/edit-video/edit-video.js";

const bee_movie = `Scripts.com
Bee Movie
By Jerry Seinfeld

NARRATOR:
(Black screen with text; The sound of buzzing bees can be heard)
According to all known laws
of aviation,
 :
there is no way a bee
should be able to fly.
 :
Its wings are too small to get
its fat little body off the ground.
 :
The bee, of course, flies anyway
 :
because bees don't care
what humans think is impossible.
BARRY BENSON:
(Barry is picking out a shirt)
Yellow, black. Yellow, black.
Yellow, black. Yellow, black.
 :
Ooh, black and yellow!
Let's shake it up a little.
JANET BENSON:
Barry! Breakfast is ready!
BARRY:
Coming!
 :
Hang on a second.
(Barry uses his antenna like a phone)
 :
Hello?
ADAM FLAYMAN:

(Through phone)
- Barry?
BARRY:
- Adam?
ADAM:
- Can you believe this is happening?
BARRY:
- I can't. I'll pick you up.
(Barry flies down the stairs)
 :
MARTIN BENSON:
Looking sharp.
JANET:
Use the stairs. Your father`

// sleep is used to add a bit of delay to function calls if needed
const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

// * Global variables
let videoURL = "https://www.youtube.com/watch?v=RbVMiu4ubT0";

/**
 * prints confirmation that process has begun
 * calls makeApiCall function to grab text from API
 * calls screenshot function to utilize puppeteer and grab screenshots
 * calls convertTextToSpeech function to utilize say to generate text to speech
 * calls downloadVideo function to utilize ytdl to download background video
 * calls editVideo function to utilize etro to stitch together video
 */
async function startVideoEdit(transcript, name) {
    console.log("Starting Video Edit, this might take a while");
    await sleep();

    // TODO : convert all text to speech
    console.log(`Converting text to speech`);
    console.log("");
    await convertTextToSpeech(transcript.strings[0], name);
    await sleep();

    // * downloads video from youtube for background
    console.log(`Grabbing video from ${videoURL}`);
    console.log("");
    await downloadVideo(videoURL);
    await sleep();

    // TODO : finish audio then stitch audio to matching image, overlay them all ontop of background
    console.log("Wrapping up");
    console.log("");

    await editVideo(name);
}

// let plainTextStrings = {
//     strings: [bee_movie],
// };
// let fileNames = ["bee2"];
//
// // * function calls
// await startVideoEdit(plainTextStrings, fileNames);

export { startVideoEdit };