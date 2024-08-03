import fs from "fs";
import util from "util";
import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const bee_movie = `paid good money for those.
BARRY:
Sorry. I'm excited.
MARTIN:
Here's the graduate.
We're very proud of you, son.
 :
A perfect report card, all B's.
JANET:
Very proud.
(Rubs Barry's hair)
BARRY=
Ma! I got a thing going here.
JANET:
- You got lint on your fuzz.
BARRY:
- Ow! That's me!

JANET:
- Wave to us! We'll be in row 118,000.
- Bye!
(Barry flies out the door)
JANET:
Barry, I told you,
stop flying in the house!
(Barry drives through the hive,and is waved at by Adam who is reading a
newspaper)
BARRY==
- Hey, Adam.
ADAM:
- Hey, Barry.
(Adam gets in Barry's car)
 :
- Is that fuzz gel?
BARRY:
- A little. Special day, graduation.`;

export async function convertTextToSpeech(string, name) {
    const client = new OpenAI(process.env.OPENAI_API_KEY);

    async function getSpeech(string, name) {
        let text = string;
        let newArr = text.match(/[^\.]+\./g);

        let charCount = 0;
        let textChunk = "";

        if (newArr) {
            for (let n = 0; n < newArr.length; n++) {
                charCount += newArr[n].length;
                textChunk = textChunk + newArr[n];

                if (charCount > 4600 || n === newArr.length - 1) {
                    // Construct the request
                    let response = await client.audio.speech.create({
                        model: "tts-1",
                        voice: "onyx",
                        input: textChunk
                    });

                    // Save response data to file
                    const filePath = `${process.cwd()}/bokbok/audio/${name}.mp3`;
                    // fs.writeFileSync(filePath, Buffer.from(response.data));
                    const buffer = Buffer.from(await response.arrayBuffer());
                    await fs.promises.writeFile(filePath, buffer);

                    charCount = 0;
                    textChunk = "";
                }
            }
        } else {
            return;
        }
    }
    await getSpeech(string, name);
}

// Uncomment the line below to check if the API key is loaded correctly
// console.log(process.env.OPENAI_API_KEY);

// convertTextToSpeech(bee_movie, "bee2");
