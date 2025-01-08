"use client";

import { Button } from "@/components/ui/button";
import { Mic, X } from "lucide-react";
import { toast } from "sonner";

interface RecordingControlsProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onCancelRecording: () => void;
}

function RecordingControls({
  isRecording,
  onStartRecording,
  onStopRecording,
  onCancelRecording,
}: RecordingControlsProps) {
  if (!isRecording) {
    return (
      <Button
        onClick={onStartRecording}
        variant="secondary"
        className="flex items-center space-x-2"
      >
        <Mic className="h-4 w-4" />
        <span>Start Recording</span>
      </Button>
    );
  }

  return (
    <div className="flex space-x-2">
      <Button
        onClick={onStopRecording}
        variant="default"
        className="flex items-center space-x-2"
      >
        <Mic className="h-4 w-4" />
        <span>Stop Recording</span>
      </Button>
      <Button
        onClick={onCancelRecording}
        variant="destructive"
        className="flex items-center space-x-2"
      >
        <X className="h-4 w-4" />
        <span>Cancel</span>
      </Button>
    </div>
  );
}

export default RecordingControls;
