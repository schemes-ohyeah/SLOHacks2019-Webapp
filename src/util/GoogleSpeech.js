const token = "AIzaSyA_0IhKpkkLMrzIl4zS8N306XibgNoRTP4";

export default class GoogleSpeech {
    /**
     * Reads message out loud.
     * Promise finishes when clip is done playing.
     *
     * @param message
     * @returns {Promise<void>}
     */
    static speak(message) {
        return fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${token}`, {
            method: "POST",
            headers: new Headers({
                "Content-Type": "application/json"
            }),
            body: JSON.stringify({
                audioConfig: {
                    audioEncoding: "MP3",
                    pitch: "0.00",
                    speakingRate: "1.00"
                },
                input: {
                    text: message
                },
                voice: {
                    languageCode: "en-US",
                    name: "en-US-Wavenet-B"
                }
            })
        })
            .then(response => response.json())
            .then(data => {
                const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
                return audio.play();
            })
            .catch(error => console.error(error));
    }
}