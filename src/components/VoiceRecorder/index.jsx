import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Mic, Square, AlertTriangle } from 'lucide-react';

const getRecognition = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return null;
  return SpeechRecognition;
};

export default function VoiceRecorder({ onTranscript, disabled }) {
  const SpeechRecognition = useMemo(() => getRecognition(), []);
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => {
      setListening(true);
      setError('');
    };

    recognition.onerror = (e) => {
      setListening(false);
      setError(e?.error || 'VOICE_ERROR');
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((res) => res[0]?.transcript || '')
        .join('')
        .trim();
      if (transcript) onTranscript?.(transcript);
    };

    recognitionRef.current = recognition;
  }, [SpeechRecognition, onTranscript]);

  const start = async () => {
    if (disabled || listening) return;
    if (!SpeechRecognition || !recognitionRef.current) {
      setError('VOICE_UNSUPPORTED');
      return;
    }

    try {
      if (navigator?.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((t) => t.stop());
      }
      recognitionRef.current.start();
    } catch (e) {
      setError(e?.message || 'MIC_PERMISSION_DENIED');
      setListening(false);
    }
  };

  const stop = () => {
    try {
      recognitionRef.current?.stop?.();
    } catch {}
  };

  const buttonLabel = listening ? 'Listening...' : 'Voice';

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={listening ? stop : start}
        disabled={disabled}
        className={`p-2.5 rounded-xl border transition-all duration-150 ${
          disabled
            ? 'opacity-50 bg-[#161B26] border-[#242F41] text-gray-500'
            : listening
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              : 'bg-[#161B26] border-[#242F41] text-gray-300 hover:text-white hover:border-gray-700'
        }`}
        aria-label={buttonLabel}
      >
        {listening ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
      </button>

      {error ? (
        <div className="flex items-center gap-2 text-[10px] font-bold text-amber-400">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>
            {error === 'VOICE_UNSUPPORTED'
              ? 'Voice input not supported in this browser.'
              : error === 'MIC_PERMISSION_DENIED'
                ? 'Mic permission denied.'
                : 'Voice input error.'}
          </span>
        </div>
      ) : null}
    </div>
  );
}
