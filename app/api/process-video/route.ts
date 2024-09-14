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
    const heightOfScreen = 680;
    // Escape the paths for use in the command
    const escapePath = (filePath: string) =>
      `"${filePath.replace(/"/g, '\\"')}"`;

    // const ffmpegCommand = `ffmpeg -i ${escapePath(inputVideo)} -i ${escapePath(
    //   inputImage
    // )} -filter_complex "[1:v]scale=100:100[watermark];[0:v][watermark]overlay=12:12,drawbox=x=0:y=h-60:w=iw:h=60:color=black@0.5:t=fill,drawtext=fontfile=${escapePath(
    //   "public/Roboto-Regular.ttf"
    // )}:text='+91 7300112706':fontcolor=white:fontsize=24:x=10:y=h-text_h-10:box=1:boxcolor=black@0.5:boxborderw=0,drawtext=fontfile=${escapePath(
    //   "public/Roboto-Regular.ttf"
    // )}:text='nitesh098suthar@gmail.com':fontcolor=white:fontsize=24:x=w-text_w-10:y=h-text_h-10:box=1:boxcolor=black@0.5:boxborderw=0" -c:a copy ${escapePath(
    //   outputPath
    // )}`;
    const ffmpegCommand = `ffmpeg -i ${escapePath(inputVideo)} -i ${escapePath(
      inputImage
    )} -filter_complex "[1:v]scale=100:100[watermark];[0:v][watermark]overlay=12:12,drawbox=x=0:y=${heightOfScreen}:w=iw:h=60:color=black@0.5:t=fill,drawtext=fontfile=${escapePath(
      "public/Roboto-Regular.ttf"
    )}:text='Stack Overflow':fontcolor=white:fontsize=24:x=10:y=h-text_h-10:,drawtext=fontfile=${escapePath(
      "public/Roboto-Regular.ttf"
    )}:text='mobileno':fontcolor=white:fontsize=24:x=w-text_w-10:y=h-text_h-10" -c:a copy ${escapePath(
      outputPath
    )}`;

    console.log("Executing command:", ffmpegCommand);

    const { stderr } = await execPromise(ffmpegCommand);

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
