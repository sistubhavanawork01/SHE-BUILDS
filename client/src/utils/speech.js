// Web Speech Recognition & Speech Synthesis (TTS) Helper

export class VoiceAssistant {
  constructor(onCommandCallback) {
    this.recognition = null;
    this.isListening = false;
    this.onCommand = onCommandCallback;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event) => {
        const lastIndex = event.results.length - 1;
        const transcript = event.results[lastIndex][0].transcript.trim().toLowerCase();
        if (this.onCommand) {
          this.onCommand(transcript);
        }
      };

      this.recognition.onerror = (e) => {
        console.warn('Speech recognition error:', e.error);
      };
    }
  }

  start() {
    if (this.recognition && !this.isListening) {
      try {
        this.recognition.start();
        this.isListening = true;
      } catch (e) {
        console.warn('Speech start warning:', e);
      }
    }
  }

  stop() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
        this.isListening = false;
      } catch (e) {
        console.warn('Speech stop warning:', e);
      }
    }
  }

  toggle() {
    if (this.isListening) {
      this.stop();
    } else {
      this.start();
    }
    return this.isListening;
  }
}

// Browser Text-To-Speech for Alerts and AI Fake Call
export function speakText(text, lang = 'en-US', pitch = 1.0, rate = 0.95) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel(); // Stop any pending speech

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.pitch = pitch;
  utterance.rate = rate;

  window.speechSynthesis.speak(utterance);
}

