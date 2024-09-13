"use client";

import { useState } from "react";

export default function VideoWatermark() {
  const [processing, setProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleProcessVideo = async () => {
    setProcessing(true);
    try {
      const response = await fetch("/api/process-video", { method: "POST" });
      const data = await response.json();
      if (data.output) {
        setDownloadUrl(data.output);
      }
    } catch (error) {
      console.error("Error processing video:", error);
    }
    setProcessing(false);
  };

  return (
    <div className="flex flex-col items-center">
      <video src="/video.mp4" controls className="w-full max-w-2xl mb-4" />
      <button
        onClick={handleProcessVideo}
        disabled={processing}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
      >
        {processing ? "Processing..." : "Add Watermark and Download"}
      </button>
      {downloadUrl && (
        <a
          href={downloadUrl}
          download="watermarked-video.mp4"
          className="mt-4 text-blue-500 underline"
        >
          Download Watermarked Video
        </a>
      )}
    </div>
  );
}
