import { useState, useRef, useEffect } from "react";
export default function AudioRecorder({ onRecordingComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState(""); // For playback
  const [playbackRate, setPlaybackRate] = useState(1); // State for playback speed
  const [pitch, setPitch] = useState(1); // State for pitch adjustment
  const mediaRecorderRef = useRef(null); // Keep recorder out of state
  const timerRef = useRef(null);
  const audioPlayerRef = useRef(null);
  const chunksRef = useRef([]); // Local chunks array

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

      chunksRef.current = []; // Reset audio chunks
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }

        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        onRecordingComplete(audioBlob);

        if (audioPlayerRef.current) {
          audioPlayerRef.current.load();
        }
      };

      recorder.start();
    } catch (err) {
      console.error("Microphone error:", err);
      alert("Could not access microphone. Please check your permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setIsRecording(false);
    setRecordingTime(0);
    setAudioUrl("");
    chunksRef.current = [];
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const modifyAndSendAudio = () => {
    if (!audioUrl) return;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();
    const pitchShifter = audioContext.createBiquadFilter();

    pitchShifter.type = "allpass"; // Use allpass filter for pitch shifting
    pitchShifter.frequency.value = 1000; // Adjust frequency for pitch effect

    fetch(audioUrl)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        source.buffer = audioBuffer;
        source.playbackRate.value = playbackRate; // Adjust playback rate
        source.connect(pitchShifter).connect(gainNode).connect(audioContext.destination);

        const modifiedAudioChunks = [];
        const mediaRecorder = new MediaRecorder(audioContext.destination.stream);

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            modifiedAudioChunks.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          const modifiedBlob = new Blob(modifiedAudioChunks, { type: "audio/webm" });
          onRecordingComplete(modifiedBlob); // Send modified audio
        };

        mediaRecorder.start();
        source.start();

        setTimeout(() => {
          source.stop();
          mediaRecorder.stop();
        }, audioBuffer.duration * 1000 / playbackRate); // Adjust duration based on playback rate
      })
      .catch((err) => console.error("Error modifying audio:", err));
  };

  return (
    <div className="w-full">
      {!isRecording ? (
        <div className="flex flex-col items-center">
          <p className="text-sm text-gray-500 mb-2">Click to start recording your statement:</p>
          <button
            type="button"
            onClick={startRecording}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
          >
            <span className="w-4 h-4 rounded-full bg-white"></span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse mr-2"></div>
            <span className="text-red-500 font-medium">Recording: {formatTime(recordingTime)}</span>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={cancelRecording}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={stopRecording}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              Finish
            </button>
          </div>
        </div>
      )}

      {audioUrl && (
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">Preview your recording:</p>
          <audio ref={audioPlayerRef} src={audioUrl} controls className="w-full" />

          <div className="mt-4">
            <label htmlFor="playbackRate" className="block text-sm text-gray-500 mb-2">
              Adjust Playback Speed:
            </label>
            <input
              id="playbackRate"
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={playbackRate}
              onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-2">Speed: {playbackRate}x</p>
          </div>

          <div className="mt-4">
            <label htmlFor="pitch" className="block text-sm text-gray-500 mb-2">
              Adjust Pitch:
            </label>
            <input
              id="pitch"
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-2">Pitch: {pitch}x</p>
          </div>

          <button
            type="button"
            onClick={modifyAndSendAudio}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Send Modified Audio
          </button>
        </div>
      )}
    </div>
  );
}
