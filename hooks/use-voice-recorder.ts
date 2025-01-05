import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

interface UseVoiceRecorderProps {
  onStop?: (audioBlob: Blob) => void;
}

export function useVoiceRecorder({ onStop }: UseVoiceRecorderProps = {}) {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
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

  return {
    isRecording,
    startRecording,
    stopRecording,
  };
}
