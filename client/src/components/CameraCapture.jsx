import { useEffect, useRef } from "react";

export default function CameraCapture({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  let streamRef = useRef(null);

  useEffect(() => {
    startCamera();
    return stopCamera;
  }, []);

  const startCamera = async () => {
    streamRef.current = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }
    });
    videoRef.current.srcObject = streamRef.current;
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(blob => {
      onCapture(blob);
      stopCamera();
      onClose();
    }, "image/jpeg");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[9999]">
      <div className="bg-white p-4 rounded-lg w-[350px]">
        <video ref={videoRef} autoPlay playsInline className="w-full rounded" />
        <canvas ref={canvasRef} className="hidden" />

        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 rounded"
          >
            Cancel
          </button>
          <button
            onClick={capturePhoto}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Capture
          </button>
        </div>
      </div>
    </div>
  );
}
