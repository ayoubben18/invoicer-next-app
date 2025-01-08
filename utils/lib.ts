const textCapitalizer = (text: string) => {
  return text
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Helper function to convert AudioBuffer to WAV
function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2;
  const result = new ArrayBuffer(44 + length);
  const view = new DataView(result);
  const channels = [];
  let pos = 0;

  // Write WAV header
  writeString(view, pos, "RIFF");
  pos += 4;
  view.setUint32(pos, 36 + length, true);
  pos += 4;
  writeString(view, pos, "WAVE");
  pos += 4;
  writeString(view, pos, "fmt ");
  pos += 4;
  view.setUint32(pos, 16, true);
  pos += 4; // Format chunk length
  view.setUint16(pos, 1, true);
  pos += 2; // Format type
  view.setUint16(pos, numOfChan, true);
  pos += 2; // Number of channels
  view.setUint32(pos, buffer.sampleRate, true);
  pos += 4; // Sample rate
  view.setUint32(pos, buffer.sampleRate * 2 * numOfChan, true);
  pos += 4; // Byte rate
  view.setUint16(pos, numOfChan * 2, true);
  pos += 2; // Block align
  view.setUint16(pos, 16, true);
  pos += 2; // Bits per sample
  writeString(view, pos, "data");
  pos += 4;
  view.setUint32(pos, length, true);
  pos += 4;

  // Write PCM data
  for (let i = 0; i < buffer.numberOfChannels; i++)
    channels.push(buffer.getChannelData(i));

  while (pos < view.byteLength) {
    for (let i = 0; i < numOfChan; i++) {
      const sample = Math.max(-1, Math.min(1, channels[i][pos]));
      view.setInt16(pos, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      pos += 2;
    }
  }

  return result;
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

export { audioBufferToWav, writeString, textCapitalizer };
