import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Initialize Google GenAI client
const genai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "mock-key",
});

export async function POST(request: Request) {
  try {
    const { script, selectedImages } = await request.json();

    if (!script) {
      return NextResponse.json(
        { error: "Script is required" },
        { status: 400 }
      );
    }

    // If no API key is configured, return a mock video for demonstration
    if (!process.env.GEMINI_API_KEY) {
      // Mock delay to simulate generation
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return NextResponse.json({
        videoUrl:
          "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4", // Sample video
        isMock: true,
      });
    }

    // Construct prompt from script
    const prompt = `Create a high-quality social media video based on this script: ${script.slice(
      0,
      300
    )}. Use a cinematic and engaging style suitable for advertising.`;

    // Prepare image if selected
    let imageInput = undefined;
    if (selectedImages && selectedImages.length > 0) {
      try {
        const imageResponse = await fetch(selectedImages[0]);
        if (imageResponse.ok) {
          const arrayBuffer = await imageResponse.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const base64Image = buffer.toString("base64");

          imageInput = {
            imageBytes: base64Image,
            mimeType: "image/jpeg", // Assuming JPEG/PNG, usually safe default for Veo input or check header
          };
          console.log("Added image input to Veo generation");
        }
      } catch (imgError) {
        console.warn(
          "Failed to fetch selected image for generation:",
          imgError
        );
      }
    }

    // Call Veo 3.1 API
    console.log("Starting Veo 3.1 generation with prompt:", prompt);

    let operation;
    try {
      operation = await genai.models.generateVideos({
        model: "veo-3.1-generate-preview",
        prompt: prompt,
        image: imageInput, // Add image input if available
      });
    } catch (apiError: any) {
      // Handle Rate Limit (429) specifically
      if (apiError.status === 429 || apiError.message?.includes("429")) {
        console.warn(
          "Veo 3.1 API Rate Limit Exceeded. Falling back to mock video."
        );
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate delay
        return NextResponse.json({
          videoUrl:
            "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
          isMock: true,
          note: "Rate limit exceeded. Showing sample video.",
        });
      }
      throw apiError; // Re-throw other errors
    }

    // Poll for completion
    let attempts = 0;
    while (!operation.done && attempts < 60) {
      // Poll for up to ~60-120 seconds
      console.log("Waiting for video generation...");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      operation = await genai.operations.getVideosOperation({
        operation: operation,
      });
      attempts++;
    }

    if (!operation.done) {
      return NextResponse.json(
        {
          error:
            "Video generation timed out. Please try again later or check status.",
        },
        { status: 504 }
      );
    }

    // Get the video URI
    const videoUri = operation.response.generatedVideos[0].video.uri;
    console.log("Video generated at URI:", videoUri);

    // Fetch the video content to return as Data URI (Proxy)
    // This fixes the display/CORS/Auth issues on the frontend
    const videoResponse = await fetch(videoUri, {
      headers: {
        "x-goog-api-key": process.env.GEMINI_API_KEY || "",
      },
    });

    if (!videoResponse.ok) {
      throw new Error(
        `Failed to fetch generated video content: ${videoResponse.statusText}`
      );
    }

    const videoBuffer = await videoResponse.arrayBuffer();
    const base64Video = Buffer.from(videoBuffer).toString("base64");
    const dataUri = `data:video/mp4;base64,${base64Video}`;

    return NextResponse.json({ videoUrl: dataUri });
  } catch (error: any) {
    console.error("Video generation error:", error);

    // Double check for 429 in the outer catch just in case
    if (error.status === 429) {
      return NextResponse.json({
        videoUrl:
          "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        isMock: true,
        note: "Rate limit exceeded. Showing sample video.",
      });
    }

    return NextResponse.json(
      { error: "Failed to generate video" },
      { status: 500 }
    );
  }
}
