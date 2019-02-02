import React from "react";
import MicIcon from "@material-ui/icons/Mic";
import "./AudioTranscriber.css";

export default class AudioTranscriber extends React.Component {
    constructor(props) {
        super(props);

        this.speechRecognition = undefined;
        this.initAudioRecorder();
    }

    initAudioRecorder = () => {
        // eslint-disable-next-line
        const recognition = new webkitSpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            const result = event.results[0][0].transcript;
            this.props.sendRecognizedSpeech(result);
        };

        recognition.start();

        this.speechRecognition = recognition;
    };

    render() {
        return (
            <div className="mic-icon-animation" onClick={() => this.speechRecognition.start()}>
                <MicIcon/>
            </div>
        );
    }
}