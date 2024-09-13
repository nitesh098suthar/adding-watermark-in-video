import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import util from "util";

const execPromise = util.promisify(exec);

export async function POST() {
  try {
    const timeAndDate = new Date().getTime();
    console.log(timeAndDate);
    const inputVideo = path.join(process.cwd(), "public", "video.mp4");
    const inputImage = path.join(process.cwd(), "public", "image.png");
    const outputPath = path.join(process.cwd(), "public", `${timeAndDate}.mp4`);

    // Escape the paths for use in the command
    const escapePath = (filePath: string) =>
      `"${filePath.replace(/"/g, '\\"')}"`;

    const ffmpegCommand = `ffmpeg -i ${escapePath(inputVideo)} -i ${escapePath(
      inputImage
    )} -filter_complex "[1:v]scale=100:100[watermark];[0:v][watermark]overlay=12:12" -c:a copy ${escapePath(
      outputPath
    )}`;

    console.log("Executing command:", ffmpegCommand);

    const { stdout, stderr } = await execPromise(ffmpegCommand);

    if (stderr) {
      console.error("FFmpeg stderr:", stderr);
    }

    // Check if the output file exists and has a non-zero size
    const stats = await fs.stat(outputPath);
    if (stats.size === 0) {
      throw new Error("Output file is empty");
    }

    return NextResponse.json({ output: `/${timeAndDate}.mp4` });
  } catch (error) {
    console.error("Error in API:", error);
    return NextResponse.json(
      { error: "Failed to process video", details: error },
      { status: 500 }
    );
  }
}
