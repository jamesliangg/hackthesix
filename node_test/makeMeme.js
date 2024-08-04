import fs from "fs";
import path from "path";
import openai from "openai";

const robot = new openai({
  apiKey: process.env.OPENAI_API_KEY,
});

/* ------------------------ Take the design as a PNG ------------------------ */

const pathToDesign = path.join(process.env.HOME, "Desktop", "example.png");
const encodedDesign = fs.readFileSync(pathToDesign, { encoding: "base64" });

/* ------------------------------ Main function ----------------------------- */

export async function makeMeme() {
  /* --------------------- Ask GPT for Issue and Location --------------------- */

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

            Attached is the design.
            
            Look at the list of issues provided. Are any of those issues present? If so, pick one of the issues from the list. Then, identify the location of the issue, from: (top-left, top-center, top-right, center-left, center-center, center-right, bottom-left, bottom-center, bottom-right, no specific location). Think step-by-step. Finally, you must output in the exact form:
Issue: <exact string from the list>
Location: <exact string from the list>

Please do not include any additional information.
`,
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

  /* ----------------------- Extract Issue and Location ----------------------- */

  console.log(response.choices[0].message.content);
  const responseAsLines = response.choices[0].message.content.split("\n");
  const issue = responseAsLines[0].split(": ")[1];
  const location = responseAsLines[1].split(": ")[1];

  // TODO: If we get the wrong format, exit gracefully

  console.log(issue + "|" + location);

  /* --------------------------- Choose a meme image -------------------------- */

  // const mappings = {
  //   "Too many fonts": "wonka",
  //   "Fonts that don't match": "dbg",
  //   "Too many colours": "wonka",
  //   "Colours that don't match": "wonka",
  //   "Inadequate contrast": "wonka",
  //   "Poor padding": "wonka",
  //   "Too little whitespace": "wonka",
  //   "Too much whitespace": "wonka",
  //   "Low-resolution images": "wonka",
  //   "Images that don't make sense": "wonka",
  //   "Text obscured by images": "wonka",
  //   "Inconsistent alignment": "wonka",
  //   "Lack of symmetry": "wonka",
  //   "Excessive text length": "wonka",
  //   "Overuse of text effects, like bold or italics": "wonka",
  //   "Inconsistent icons": "wonka",
  //   "Poor cropping": "wonka",
  // };

  const memeNames = ["wonka", "dbg", "jim", "worst"];
  const memeName = memeNames[Math.floor(Math.random() * memeNames.length)];

  /* ------------------------ Ask GPT for meme texts ------------------------ */

  const response2 = await robot.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `You are a consultant who is the design equivalent of Gordon Ramsey. In a design you're reviewing, someone made the following mistake: ${issue}.

            You are going to send them a meme based on this image to mock them. What should the top and bottom text be? Aim for 30 characters for each. Please output in the exact format:            
Top: <top text>
Bottom: <bottom text>`,
          },
          {
            type: "image_url",
            image_url: {
              url: `https://api.memegen.link/images/${memeName}/_/_.png`,
            },
          },
        ],
      },
    ],
  });

  /* ---------------------------- Generate the meme --------------------------- */

  const memeTextAsLines = response2.choices[0].message.content.split("\n");
  const memeTop = memeTextAsLines[0].split(": ")[1];
  const memeBottom = memeTextAsLines[1].split(": ")[1];

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

  /* -------------------- Generate roast text for the video ------------------- */

  const response3 = await robot.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `You are a design critic, with the personality of Gordon Ramsey, who came across a design with the fatal issue of ${issue}. Output an 80-word roast for the designer.`,
          },
        ],
      },
    ],
  });

  const response3out = response3.choices[0].message.content;

  /* -------------------------------- Finalize -------------------------------- */

  return [
    `https://api.memegen.link/images/${memeName}/${sanitizeString(
      memeTop
    )}/${sanitizeString(memeBottom)}.png`,
    response3out,
  ];
}
