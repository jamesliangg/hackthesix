## File Structure
- `extension/uwu` contains all the code related to Adobe SDK
- `node_test` is the Node.js server with OpenAI, FFmpeg, and yt-dl

## Getting Started
### Adobe Express
1. Open terminal and navigate to a folder you don't care about.
1. Run `npx @adobe/create-ccweb-add-on uwu --template swc-javascript-with-document-sandbox` and generate the SSL certificate
1. Delete the uwu folder
1. Navigate to `extension/uwu` and run `npm run build`
1. Run `npm run start`
### Node.js
1. Navigate to `node_test` in another terminal
1. Run `npm i`
1. Install FFmpeg and yt-dlp (brew on Mac suggested)
1. Run `node ser.js`
### Add-On
1. Open Adobe Express and enable the [add on](swc-javascript-with-document-sandbox) (Steps 4 & 5 in link)
1. Should be good to go!

