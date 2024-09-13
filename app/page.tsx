// import React from "react";
// import VideoOverlay from "./components/VideoOverlay";

import VideoWatermark from "./components/VideoOverlay";

// const page = () => {
//   return (
//     <div>
//       <VideoOverlay />
//     </div>
//   );
// };

// export default page;

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">Video Watermark App</h1>
      <VideoWatermark />
    </main>
  );
}