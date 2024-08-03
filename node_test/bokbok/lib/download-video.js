import ytdl from "@distube/ytdl-core";
import fs from "fs";
import process from "process";

export async function downloadVideo(videoURL) {
    let url = videoURL;
    function startDownload() {
        ytdl(url).pipe(fs.createWriteStream(`${process.cwd()}/bokbok/videos/background.webm`));
    }

    startDownload();
}