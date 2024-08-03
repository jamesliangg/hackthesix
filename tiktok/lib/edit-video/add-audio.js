import ffmpeg from "fluent-ffmpeg";
import process from "process";
import fs from "fs";
import path from 'path';

export async function addAudio(title) {
    let audioPath = `${process.cwd()}/audio/${title}.mp3`;
    let imagePath = `${process.cwd()}/screenshots/${title}.png`;
    let videoPath = `${process.cwd()}/videos/background.webm`;
    let tempOutputPath = `${process.cwd()}/lib/edit-video/temp/${title}_temp.mp4`
    let finalOutputPath = `${process.cwd()}/lib/edit-video/temp/${title}.mp4`
    // Get the duration of the audio file
    ffmpeg.ffprobe(audioPath, (err, metadata) => {
        if (err) {
            console.error('Error reading audio metadata:', err);
            return;
        }

        const audioDuration = metadata.format.duration;
        const maxDuration = Math.min(60, audioDuration);

        // Stage 1: Overlay the image on the video
        ffmpeg(videoPath)
            .input(imagePath)
            .complexFilter([
                {
                    filter: 'overlay',
                    options: { x: 10, y: 10 } // Position of the image on the video
                }
            ])
            .videoCodec('libx264') // Set video codec
            .duration(maxDuration) // Limit video duration
            .on('end', () => {
                console.log('Overlaying finished!');

                // Stage 2: Replace the audio
                ffmpeg(tempOutputPath)
                    .input(audioPath)
                    .outputOptions('-map 0:v') // Map the video stream from the first input (video)
                    .outputOptions('-map 1:a') // Map the audio stream from the second input (new audio)
                    .audioCodec('aac') // Set audio codec
                    .videoCodec('copy') // Copy video stream without re-encoding
                    .duration(maxDuration) // Limit final video duration
                    .on('end', () => {
                        console.log('Processing finished!');
                    })
                    .on('error', (err) => {
                        console.error('Error during audio replacement:', err);
                    })
                    .save(finalOutputPath);
            })
            .on('error', (err) => {
                console.error('Error during overlay:', err);
            })
            .save(tempOutputPath);
    });
}