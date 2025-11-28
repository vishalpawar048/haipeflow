import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
// Note: This requires OPENAI_API_KEY environment variable to be set
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "mock-key", // Fallback for build/dev without key
});

export async function POST(request: Request) {
  try {
    const { selectedImages, content, videoType } = await request.json();

    if (!content && (!selectedImages || selectedImages.length === 0)) {
      return NextResponse.json(
        { error: "Content or images are required" },
        { status: 400 }
      );
    }

    // If no API key is configured, return a mock script for demonstration
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        script: `[SCENE 1]
Visual: Split screen showing the app interface and a happy user.
Audio: "Tired of managing your budget manually?"
Duration: 3s

[SCENE 2]
Visual: Quick montage of features (${
          selectedImages.length > 0
            ? "using extracted assets"
            : "app screenshots"
        }).
Audio: "Meet Plannr. The AI-powered budget tracker that does the heavy lifting."
Duration: 5s

[SCENE 3]
Visual: Text overlay 'Download Now' with app icon.
Audio: "Take control of your finances today. Link in bio."
Duration: 7s`,
      });
    }

    const prompt = `
    You are an expert video marketing strategist and scriptwriter.
    Create a high-converting 15-second ${videoType} video script based on the following website content and visual assets.

    CONTEXT:
    ${content.slice(0, 2000)}... (truncated)

    ASSETS AVAILABLE:
    ${selectedImages.length} extracted images provided.

    REQUIREMENTS:
    - Format: Vertical Video (9:16)
    - Duration: Exactly 15 seconds
    - Tone: Engaging, fast-paced, and native to social media (TikTok/Reels)
    - Structure: Hook (0-3s), Value Prop (3-10s), CTA (10-15s)
    - Output Format: Scene-by-scene breakdown with Visual and Audio cues.

    Please output ONLY the script in a clean Markdown format.
    `;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a creative director for social media ads.",
        },
        { role: "user", content: prompt },
      ],
      model: "gpt-5.1", // Using the latest GPT-5.1 model as requested
    });

    const script =
      completion.choices[0].message.content || "Failed to generate script.";

    return NextResponse.json({ script });
  } catch (error) {
    console.error("Script generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate script" },
      { status: 500 }
    );
  }
}
