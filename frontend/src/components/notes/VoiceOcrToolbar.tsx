import { useRef, useState } from 'react';
import { ImageUp, Mic, MicOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface VoiceOcrToolbarProps {
  onText: (text: string) => void;
}

// Minimal ambient typing for the Web Speech API (not in default TS DOM lib)
type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
};

export function VoiceOcrToolbar({ onText }: VoiceOcrToolbarProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function toggleVoiceInput() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Voice input is not supported in this browser (try Chrome or Edge)');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition: SpeechRecognitionLike = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      if (transcript.trim()) onText(transcript.trim() + ' ');
    };
    recognition.onerror = () => {
      toast.error('Voice recognition error — please try again');
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setIsProcessingImage(true);
    try {
      const Tesseract = await import('tesseract.js');
      const result = await Tesseract.recognize(file, 'eng');
      const text = result.data.text.trim();
      if (text) {
        onText(text + ' ');
        toast.success('Text extracted from image');
      } else {
        toast.error('No text found in that image');
      }
    } catch {
      toast.error('Could not process that image');
    } finally {
      setIsProcessingImage(false);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        title={isListening ? 'Stop voice input' : 'Voice to text'}
        onClick={toggleVoiceInput}
        className={`flex h-8 w-8 items-center justify-center rounded-lg hover:bg-surface-raised ${
          isListening ? 'animate-pulse text-danger' : 'text-ink/70'
        }`}
      >
        {isListening ? <MicOff size={15} /> : <Mic size={15} />}
      </button>

      <button
        type="button"
        title="Extract text from an image (OCR)"
        onClick={() => fileInputRef.current?.click()}
        disabled={isProcessingImage}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/70 hover:bg-surface-raised disabled:opacity-50"
      >
        {isProcessingImage ? <Loader2 size={15} className="animate-spin" /> : <ImageUp size={15} />}
      </button>
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
    </div>
  );
}
