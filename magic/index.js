const fs = require("fs");
const path = require("path");
const openai = require("openai");

// Get the PNG file

const filePath = path.join(process.env.HOME, "Desktop", "example.png");
const base64Data = fs.readFileSync(filePath, { encoding: "base64" });

// Send it to the OpenAI API

const robot = new openai({
  apiKey: "",
});

async function main() {
  const response = await robot.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "What is everything wrong with this UI?" },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Data}`,
            },
          },
        ],
      },
    ],
  });

  console.log(response.choices[0]);
}

main();

// Categorize the issue & choose a meme
// Create the meme
// Output the meme
