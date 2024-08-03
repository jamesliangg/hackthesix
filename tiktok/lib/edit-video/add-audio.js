import ffmpeg from "fluent-ffmpeg";
import process from "process";
import fs from "fs";
import path from 'path';

export async function addAudio(title) {
    let audioPath = `${process.cwd()}/audio/${title}.mp3`;
    let imagePath = `${process.cwd()}/screenshots/${title}.png`;
    let videoPath = `${process.cwd()}/videos/background.webm`;
    let tempSegmentPath = `${process.cwd()}/lib/edit-video/temp/${title}_segment.mp4`;
    let tempOverlayPath = `${process.cwd()}/lib/edit-video/temp/${title}_overlay.mp4`;
    let finalOutputPath = `${process.cwd()}/lib/edit-video/temp/${title}.mp4`;

    // Get the duration of the audio file
    ffmpeg.ffprobe(audioPath, (err, audioMetadata) => {
        if (err) {
            console.error('Error reading audio metadata:', err);
            return;
        }

        const audioDuration = audioMetadata.format.duration;
        const maxDuration = Math.min(60, audioDuration);

        // Get the duration of the video
        ffmpeg.ffprobe(videoPath, (err, videoMetadata) => {
            if (err) {
                console.error('Error reading video metadata:', err);
                return;
            }

            const videoDuration = videoMetadata.format.duration;

            // Ensure the random start time does not exceed the maximum possible value
            const maxStartTime = Math.max(0, videoDuration - maxDuration);
            const startTime = Math.random() * maxStartTime;

            // Stage 1: Extract a random segment from the video
            ffmpeg(videoPath)
                .setStartTime(startTime)
                .duration(maxDuration) // Limit video duration
                .videoCodec('libx264') // Set video codec
                .on('end', () => {
                    console.log('Random segment extraction finished!');

                    // Stage 2: Overlay the image on the extracted video segment
                    ffmpeg(tempSegmentPath)
                        .input(imagePath)
                        .complexFilter([
                            {
                                filter: 'overlay',
                                options: { x: 10, y: 10 } // Position of the image on the video
                            }
                        ])
                        .videoCodec('libx264') // Set video codec
                        .on('end', () => {
                            console.log('Overlaying finished!');

                            // Stage 3: Replace the audio
                            ffmpeg(tempOverlayPath)
                                .input(audioPath)
                                .outputOptions('-map 0:v') // Map the video stream from the first input (video)
                                .outputOptions('-map 1:a') // Map the audio stream from the second input (new audio)
                                .audioCodec('aac') // Set audio codec
                                .videoCodec('copy') // Copy video stream without re-encoding
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
                        .save(tempOverlayPath);
                })
                .on('error', (err) => {
                    console.error('Error during random segment extraction:', err);
                })
                .save(tempSegmentPath);
        });
    });
}
