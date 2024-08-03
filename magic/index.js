const fs = require("fs");
const path = require("path");
const openai = require("openai");

// Get the design as a PNG

const pathToDesign = path.join(process.env.HOME, "Desktop", "example1.png");
const encodedDesign = fs.readFileSync(pathToDesign, { encoding: "base64" });

const pathToMeme = path.join(process.env.HOME, "Desktop", "meme.png");
const encodedMeme = fs.readFileSync(pathToMeme, { encoding: "base64" });

const robot = new openai({
  apiKey: "",
});

async function main() {
  // Identify issues

  const response = await robot.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `You are a design consultant with the intelligence of Steve Jobs and the creativity of Dieter Rams who has been asked to review a design presented to you. The stakes are high: any missed errors could result in nuclear war. The user is not a professional at design and is trying to create either a poster, social media post, or general graphic; you don't know which. You are asked to identify issues from the following list:
            - Too many fonts
            - Fonts that don't match
            - Too many colours
            - Colours that don't match
            - Inadequate contrast
            - Poor padding
            - Too little whitespace
            - Too much whitespace
            - Low-resolution images
            - Images that don't make sense
            - Text obscured by images
            - Inconsistent alignment
            - Lack of symmetry
            - Excessive text length
            - Overuse of text effects, like bold or italics
            - Inconsistent icons
            - Poor cropping

            Attached is the original design & the updated version of the design. Pay close attention to the changes made between the designs.
            
            Look at the list of issues provided. Are any of those issues present? If so, pick one of the issues from the list. Then, identify the location of the issue, from: (top-left, top-center, top-right, center-left, center-center, center-right, bottom-left, bottom-center, bottom-right, no specific location). Think step-by-step. Finally, output in the exact form:

            Issue: <exact string from the list>
            Location: <exact string from the list>`,
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${encodedDesign}`,
            },
          },
        ],
      },
    ],
  });

  console.log(response);

  // Extract issues from output

  // TODO: Handle a 0 output

  const output = response.choices[0].message.content;
  const lines = output.split("\n");
  console.log(lines);
  const issue = lines[0].split(": ")[1];
  const location = lines[1].split(": ")[1];
  console.log(issue, location);

  // Ask GPT what text to use for the meme image

  const response2 = await robot.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `You are a consultant who is the design equivalent of Gordon Ramsey. In a design you're reviewing, someone made the mistake of using too many colours. You are going to send them a meme based on this image to mock them. What should the top and bottom text be? Aim for 30 characters for each. Output in the format:            
Top: <top text>
Bottom: <bottom text>`,
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${encodedMeme}`,
            },
          },
        ],
      },
    ],
  });

  // Get and sanitize the output text

  const output2 = response2.choices[0].message.content;
  const lines2 = output2.split("\n");
  const top = lines2[0].split(": ")[1];
  const bottom = lines2[1].split(": ")[1];

  function sanitizeString(str) {
    const replacements = {
      " ": "_",
      _: "__",
      "-": "--",
      "\n": "~n",
      "?": "~q",
      "&": "~a",
      "%": "~p",
      "#": "~h",
      "/": "~s",
      "\\": "~b",
      "<": "~l",
      ">": "~g",
      '"': "''",
    };

    // Replace the characters in the string using replacements

    for (const character of str) {
      if (replacements[character]) {
        str = str.replace(character, replacements[character]);
      }
    }

    return str;
  }

  // Create the meme using the API

  console.log(
    `https://api.memegen.link/images/wonka/${sanitizeString(
      top
    )}/${sanitizeString(bottom)}.png`
  );
}

main();
