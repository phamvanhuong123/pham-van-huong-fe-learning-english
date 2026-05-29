const fallbackToTTS = (word: string) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn("Trình duyệt không hỗ trợ Web Speech API");
  }
};

export const playVocabAudio = (audioUrl: string | null | undefined, word: string) => {
  const isValidUrl = audioUrl
    && audioUrl.trim() !== ''
    && !audioUrl.includes('translate.google.com/translate_tts');

  if (isValidUrl) {
    const audio = new Audio(audioUrl!);
    audio.play().catch((e) => {
      console.error("Lỗi phát audio, chuyển sang TTS:", e);
      fallbackToTTS(word);
    });
  } else {
    fallbackToTTS(word);
  }
};
