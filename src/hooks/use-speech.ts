"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface SpeechState {
  isSpeaking: boolean;
  isPaused: boolean;
  isSupported: boolean;
}

export function useSpeech() {
  const [state, setState] = useState<SpeechState>({
    isSpeaking: false,
    isPaused: false,
    isSupported: false,
  });

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setState((s) => ({
      ...s,
      isSupported:
        typeof window !== "undefined" && "speechSynthesis" in window,
    }));
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!state.isSupported) return;

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) => v.name.includes("Samantha") || v.name.includes("Google")
      );
      if (preferred) utterance.voice = preferred;

      utterance.onstart = () =>
        setState((s) => ({ ...s, isSpeaking: true, isPaused: false }));
      utterance.onend = () =>
        setState((s) => ({ ...s, isSpeaking: false, isPaused: false }));
      utterance.onpause = () => setState((s) => ({ ...s, isPaused: true }));
      utterance.onresume = () => setState((s) => ({ ...s, isPaused: false }));

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [state.isSupported]
  );

  const pause = useCallback(() => {
    window.speechSynthesis.pause();
  }, []);

  const resume = useCallback(() => {
    window.speechSynthesis.resume();
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setState((s) => ({ ...s, isSpeaking: false, isPaused: false }));
  }, []);

  return { ...state, speak, pause, resume, stop };
}
