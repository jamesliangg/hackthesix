import ffmpeg from 'fluent-ffmpeg';

const videoPath = '../videos/background.webm';
const imagePath = '../screenshots/bee.png';
const audioPath = '../audio/bee.mp3';
const tempOutputPath = 'temp_output.mp4';
const finalOutputPath = 'output.mp4';

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
    .on('end', () => {
        console.log('Overlaying finished!');

        // Stage 2: Replace the audio
        ffmpeg(tempOutputPath)
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
    .save(tempOutputPath);
