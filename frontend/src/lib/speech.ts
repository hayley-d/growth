export const isSpeechSupported = () =>
  typeof window !== "undefined" &&
  "speechSynthesis" in window &&
  typeof window.SpeechSynthesisUtterance === "function";

export const speakAll = (texts: readonly string[], onDone: () => void) => {
  const spoken = texts.map((text) => text.trim()).filter((text) => text !== "");
  if (!isSpeechSupported() || spoken.length === 0) {
    onDone();
    return;
  }
  const synthesis = window.speechSynthesis;
  synthesis.cancel();
  spoken.forEach((text, index) => {
    const utterance = new window.SpeechSynthesisUtterance(text);
    if (index === spoken.length - 1) {
      utterance.onend = onDone;
      utterance.onerror = onDone;
    }
    synthesis.speak(utterance);
  });
};

export const stopSpeaking = () => {
  if (isSpeechSupported()) window.speechSynthesis.cancel();
};
