import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

interface UseVoiceRecorderProps {
  onStop?: (audioBlob: Blob) => void;
  onCancel?: () => void;
}

export function useVoiceRecorder({ onStop, onCancel }: UseVoiceRecorderProps = {}) {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          streamRef.current = stream;
          const recorder = new MediaRecorder(stream, {
            mimeType: "audio/webm;codecs=opus",
          });

          recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              audioChunksRef.current.push(event.data);
            }
          };

          setMediaRecorder(recorder);
        })
        .catch((err) => {
          console.error("Error accessing microphone:", err);
          toast.error("Error accessing microphone");
        });

      return () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };
    }
  }, []);

  const startRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "inactive") {
      audioChunksRef.current = [];
      mediaRecorder.start(250);
      setIsRecording(true);
    }
  };

  const stopRecording = async () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setIsRecording(false);

      await new Promise((resolve) => setTimeout(resolve, 300));

      if (audioChunksRef.current.length === 0) {
        toast.error("No audio recorded");
        return;
      }

      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm;codecs=opus",
      });

      if (onStop) {
        onStop(audioBlob);
      }
    }
  };

  const cancelRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setIsRecording(false);
      audioChunksRef.current = []; // Clear the recorded chunks
      if (onCancel) {
        onCancel();
      }
    }
  };

  return {
    isRecording,
    startRecording,
    stopRecording,
    cancelRecording,
  };
}