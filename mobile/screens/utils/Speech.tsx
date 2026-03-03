import { useEffect } from "react";
import * as Speech from "expo-speech";

const message = "Votre séance commence dans dix minutes";

const useRepeatSpeech = () => {
  useEffect(() => {
    const speakMessage = () => {
      Speech.speak(message, { language: "fr" });
    };

    speakMessage();

    const interval = setInterval(() => {
      speakMessage();
    }, 60000);

    return () => clearInterval(interval);
  }, []);
};

export default useRepeatSpeech;
