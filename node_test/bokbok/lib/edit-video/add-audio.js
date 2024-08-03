import ffmpeg from "fluent-ffmpeg";
import process from "process";
import fs from "fs";
import path from 'path';

export async function addAudio(title) {
    let audioPath = `${process.cwd()}/bokbok/audio/${title}.mp3`;
    // let imagePath = `${process.cwd()}/screenshots/${title}.png`;
    let imagePath = `${process.cwd()}/uploads/document.jpg`;
    let videoPath = `${process.cwd()}/bokbok/videos/background.webm`;
    let tempSegmentPath = `${process.cwd()}/bokbok/lib/edit-video/temp/${title}_segment.mp4`;
    let tempOverlayPath = `${process.cwd()}/bokbok/lib/edit-video/temp/${title}_overlay.mp4`;
    let finalOutputPath = `${process.cwd()}/bokbok/lib/edit-video/temp/${title}.mp4`;

    // Retry function
    function retryOperation(operation, maxRetries, delay) {
        let attempt = 0;

        function execute() {
            attempt++;
            operation()
                .then(() => {
                    console.log('Operation succeeded!');
                })
                .catch((err) => {
                    if (attempt < maxRetries) {
                        console.log(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
                        setTimeout(execute, delay);
                    } else {
                        console.error('Operation failed after maximum retries:', err);
                    }
                });
        }

        execute();
    }

// Define the operation
    function processVideo() {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(audioPath, (err, audioMetadata) => {
                if (err) {
                    console.error('Error reading audio metadata:', err);
                    return reject(err);
                }

                const audioDuration = audioMetadata.format.duration;
                const maxDuration = Math.min(60, audioDuration);

                // Get the duration of the video
                ffmpeg.ffprobe(videoPath, (err, videoMetadata) => {
                    if (err) {
                        console.error('Error reading video metadata:', err);
                        return reject(err);
                    }

                    const videoDuration = videoMetadata.format.duration;
                    const maxStartTime = Math.max(0, videoDuration - maxDuration);
                    const startTime = Math.random() * maxStartTime;

                    // Stage 1: Extract a random segment from the video
                    ffmpeg(videoPath)
                        .setStartTime(startTime)
                        .duration(maxDuration)
                        .videoCodec('libx264')
                        .on('end', () => {
                            console.log('Random segment extraction finished!');

                            // Stage 2: Overlay the image on the extracted video segment
                            ffmpeg(tempSegmentPath)
                                .input(imagePath)
                                .complexFilter([
                                    {
                                        filter: 'overlay',
                                        options: { x: 10, y: 10 }
                                    }
                                ])
                                .videoCodec('libx264')
                                .on('end', () => {
                                    console.log('Overlaying finished!');

                                    // Stage 3: Replace the audio
                                    ffmpeg(tempOverlayPath)
                                        .input(audioPath)
                                        .outputOptions('-map 0:v')
                                        .outputOptions('-map 1:a')
                                        .audioCodec('aac')
                                        .videoCodec('copy')
                                        .on('end', () => {
                                            console.log('Processing finished!');
                                            resolve();
                                        })
                                        .on('error', (err) => {
                                            console.error('Error during audio replacement:', err);
                                            reject(err);
                                        })
                                        .save(finalOutputPath);
                                })
                                .on('error', (err) => {
                                    console.error('Error during overlay:', err);
                                    reject(err);
                                })
                                .save(tempOverlayPath);
                        })
                        .on('error', (err) => {
                            console.error('Error during random segment extraction:', err);
                            reject(err);
                        })
                        .save(tempSegmentPath);
                });
            });
        });
    }

    // Call the retry function
    const maxRetries = 5;  // Set the maximum number of retries
    const retryDelay = 3000;  // Set the delay between retries in milliseconds

    retryOperation(processVideo, maxRetries, retryDelay);
}
