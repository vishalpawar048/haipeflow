import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const genai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

const AI_MODELS = {
  VIDEO_GEN: 'veo-3.1-generate-preview',
};

// Helper to poll for operation completion
const waitForOperation = async (operation: any) => {
  let currentOp = operation;
  while (!currentOp.done) {
    // console.log("Polling Veo operation...");
    await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5 seconds
    currentOp = await genai.operations.getVideosOperation({ operation: currentOp });
  }
  return currentOp;
};

const cleanBase64 = (data: string) => data.split(',')[1] || data;

const getVeoAspectRatio = (details: any): string => {
  if (details.aspectRatio === "16:9") return "16:9";
  if (details.aspectRatio === "9:16") return "9:16";
  if (details.aspectRatio === "Custom" && details.customWidth && details.customHeight) {
    return details.customWidth > details.customHeight ? "16:9" : "9:16";
  }
  return "9:16"; 
};

export async function POST(request: Request) {
  try {
    const { concept, details } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json(
          { error: "GEMINI_API_KEY is not set" },
          { status: 500 }
        );
    }

    const selectedRatio = getVeoAspectRatio(details);
    const isLong = details.duration === '30s';

    // Determine scenes
    const scenes = [];
    scenes.push({ name: "Scene 1", script: concept.script.scene1 });
    scenes.push({ name: "Scene 2", script: concept.script.scene2 });
    
    if (isLong && concept.script.scene3 && concept.script.scene4) {
      scenes.push({ name: "Scene 3", script: concept.script.scene3 });
      scenes.push({ name: "Scene 4", script: concept.script.scene4 });
    }

    let previousVideoContext: any = null;
    let finalVideoUri: string | null = null;

    console.log(`Starting Video Generation (${scenes.length} Scenes) with Ratio: ${selectedRatio}...`);

    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      const stepNumber = i + 1;
      
      console.log(`Generating Step ${stepNumber}/${scenes.length}: ${scene.name}`);

      const prompt = `
        ${scene.name} (${i*8}-${(i+1)*8}s): Mobile app demo for ${details.name}.
        Action: ${scene.script}
        Style: ${concept.description}, ${details.tone}, consistent character and environment.
        Marketing Focus: ${details.sellingPoint}.
        
        CRITICAL TEXT INSTRUCTION:
        - Maintain legibility of any UI text visible in the input.
        - Ensure any new generated text overlays are meaningful English words derived from the Selling Point ("${details.sellingPoint}").
        - NO gibberish.
      `;

      // Config for Veo
      const requestConfig: any = {
        model: AI_MODELS.VIDEO_GEN,
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          // @ts-ignore
          resolution: '720p', // Required for extension
          aspectRatio: selectedRatio,
        }
      };

      if (i === 0) {
        // First Scene: Start from Image
        requestConfig.image = {
          imageBytes: cleanBase64(concept.startFrame),
          mimeType: 'image/png',
        };
      } else {
        // Subsequent Scenes: Extend previous video
        if (!previousVideoContext) {
            throw new Error(`Previous video context missing for ${scene.name}`);
        }
        requestConfig.video = previousVideoContext;
      }

      let operation = await genai.models.generateVideos(requestConfig);
      operation = await waitForOperation(operation);
      
      // @ts-ignore
      const generatedVideo = operation.response?.generatedVideos?.[0]?.video;
      if (!generatedVideo) {
        throw new Error(`Failed to generate video for ${scene.name}`);
      }

      // Update context for next iteration
      previousVideoContext = generatedVideo;
      finalVideoUri = generatedVideo.uri;

      // SAFETY DELAY:
      if (i < scenes.length - 1) {
        console.log("Waiting for backend consistency...");
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    if (!finalVideoUri) {
      throw new Error("No video URI returned from final step");
    }

    // Fetch the content to return a blob/url to client
    // In a real app, you might want to upload this to S3/GCS.
    // Here we proxy the content.
    const response = await fetch(finalVideoUri, {
        headers: {
          "x-goog-api-key": process.env.GEMINI_API_KEY || "",
        },
    });

    if (!response.ok) {
      throw new Error(`Failed to download final video: ${response.status} ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64Video = Buffer.from(arrayBuffer).toString('base64');
    const dataUri = `data:video/mp4;base64,${base64Video}`;

    return NextResponse.json({
        videoUrl: dataUri,
        aspectRatio: selectedRatio
    });

  } catch (error: any) {
    console.error("Veo Generation Error:", error);
    return NextResponse.json(
        { error: error.message || "Failed to generate video" },
        { status: 500 }
    );
  }
}

