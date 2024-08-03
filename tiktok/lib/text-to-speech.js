#!/usr/bin/env node

import fs from "fs";
import util from "util";
import {OpenAI} from "openai";

export async function convertTextToSpeech(string, name) {
    const client = OpenAI()

    async function getSpeech(string, name) {
        let text = string;
        let newArr = text.match(/[^\.]+\./g);

        let charCount = 0;
        let textChunk = "";

        if (newArr) {
            for (var n = 0; n < newArr.length; n++) {
                charCount += newArr[n].length;
                textChunk = textChunk + newArr[n];

                if (charCount > 4600 || n == newArr.length - 1) {
                    // Construct the request
                    let response = client.audio.speech.create(
                        model="tts-1",
                        voice="alloy",
                        input="Hello world! This is a streaming test.",
                    )

                    response.stream_to_file(`./audio/${name}.mp3`)
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