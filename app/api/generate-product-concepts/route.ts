import { NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { calculateTextCost, calculateImageCost, deductCredits, hasSufficientCredits } from "@/lib/credits";

// Use environment variable for API key
const genai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

const AI_MODELS = {
  IMAGE_GEN: "gemini-2.5-flash-image",
  TEXT_GEN: "gemini-2.0-flash",
};

// Helper to remove data:image/xyz;base64, prefix
const cleanBase64 = (data: string) => data.split(",")[1] || data;

const getBestAspectRatio = (details: any): string => {
  // Simple mapping for the demo, can be expanded
  if (details.aspectRatio === "9:16") return "9:16";
  if (details.aspectRatio === "16:9") return "16:9";
  if (details.aspectRatio === "1:1") return "1:1";

  if (details.customWidth && details.customHeight) {
    const ratio = details.customWidth / details.customHeight;
    if (ratio <= 0.6) return "9:16";
    if (ratio <= 0.85) return "3:4";
    if (ratio <= 1.15) return "1:1";
    if (ratio <= 1.5) return "4:3";
    return "16:9";
  }
  return "1:1";
};

export async function POST(request: Request) {
  console.log("Product concept request");
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const FIXED_CONCEPT_PRICE = 50;
    if (!(await hasSufficientCredits(session.user.id, FIXED_CONCEPT_PRICE))) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 402 }
      );
    }

    const details = await request.json();
    let totalCost = 0;

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not set" },
        { status: 500 }
      );
    }

    const selectedAspectRatio = getBestAspectRatio(details);
    const isLong = details.duration === "30s";
    const totalScenes = isLong ? 4 : 2;

    // 1. Generate Scripts & Concept Descriptions
    const scriptPrompt = `
      You are an e-commerce video marketing expert. Create 4 distinct visual concepts for a product named "${details.productName}" (${details.productType}).
      Key Selling Point: "${details.sellingPoint}".
      Tone: ${details.tone}.

      The video will be ${isLong ? "30 seconds (4 scenes)" : "15 seconds (2 scenes)"} long.
      Focus on showcasing the physical product, its features, and benefits.

      For each concept, provide:
      1. A short description of the visual style (e.g. "Cinematic close-up", "Lifestyle usage").
      2. A visual script describing the ON-SCREEN ACTION for ${totalScenes} scenes.
         
      CRITICAL INSTRUCTION FOR TEXT:
      When describing the UI or text overlay in the script, specify EXACT meaningful text.
      - DO NOT say "Text appears". 
      - DO say "Text overlay: 'Built to Last'".
      - Incorporate keywords from the Selling Point ("${details.sellingPoint}") into the headlines.
      - Ensure all text mentioned is real English, correctly spelled.
      
      Structure:
         - Scene 1: Hook. Show the product clearly. Define headline text.
         - Scene 2: Feature/Benefit. Show the product in action or detail. Define data point or benefit text.
         ${isLong ? "- Scene 3: Social Proof/Lifestyle. Show someone using it or a testimonial quote.\n       - Scene 4: Offer/CTA." : "- Scene 2 should lead to the CTA if it is the last scene."}
         - The Final Scene: Must end with the product and a clear CTA like "Shop Now" or "Get Yours".
      
      Return JSON.
    `;

    const scriptProperties: any = {
      scene1: { type: Type.STRING },
      scene2: { type: Type.STRING },
    };

    if (isLong) {
      scriptProperties.scene3 = { type: Type.STRING };
      scriptProperties.scene4 = { type: Type.STRING };
    }

    const scriptResponse = await genai.models.generateContent({
      model: AI_MODELS.TEXT_GEN,
      contents: scriptPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              description: { type: Type.STRING },
              script: {
                type: Type.OBJECT,
                properties: scriptProperties,
                required: isLong
                  ? ["scene1", "scene2", "scene3", "scene4"]
                  : ["scene1", "scene2"],
              },
            },
          },
        },
      },
    });

    if (scriptResponse.usageMetadata) {
      const input = scriptResponse.usageMetadata.promptTokenCount || 0;
      const output = scriptResponse.usageMetadata.candidatesTokenCount || 0;
      totalCost += calculateTextCost(input, output);
    }

    const extractText = (response: any) => {
      if (response.text && typeof response.text === "function") {
        return response.text();
      }
      if (response.candidates?.[0]?.content?.parts?.[0]?.text) {
        return response.candidates[0].content.parts[0].text;
      }
      return "[]";
    };

    const conceptsData = JSON.parse(extractText(scriptResponse));
    const finalConcepts: any[] = [];

    // 2. Generate Visual Hooks (Start/End frames) for each concept
    await Promise.all(
      conceptsData.map(async (concept: any, index: number) => {
        try {
          // Generate Start Frame
          const startPrompt = `
          Generate a high-quality product photography Start Frame for a video ad.
          Product: ${details.productName} (${details.productType}).
          Style: ${details.tone}, ${concept.description}.
          Action: ${concept.script.scene1}.
          Color Theme: ${details.themeColor}.
          
          CRITICAL INSTRUCTIONS:
          - Show the physical product clearly and attractively.
          - Lighting should be professional studio or lifestyle depending on style.
          - Include text overlay matching the selling point: "${details.sellingPoint}".
          - Ensure text is legible and minimal.
          - High resolution, photorealistic.
        `;

          // Only use text prompt for Imagen
          const startParts = [{ text: startPrompt }];

          const startResp = await genai.models.generateContent({
            model: AI_MODELS.IMAGE_GEN,
            contents: { parts: startParts },
            config: {
              // @ts-ignore: imageConfig typing
              imageConfig: {
                aspectRatio: selectedAspectRatio,
              },
            },
          });

          let startFrame = "";
          const startCandidates = startResp.candidates;
          if (startCandidates && startCandidates[0]?.content?.parts) {
            for (const part of startCandidates[0].content.parts) {
              if (part.inlineData) {
                startFrame = `data:image/png;base64,${part.inlineData.data}`;
              }
            }
          } else {
            console.warn("No candidates in start frame response", startResp);
          }

          // Generate End Frame (Call To Action)
          const lastSceneScript = isLong
            ? concept.script.scene4
            : concept.script.scene2;
          const endPrompt = `
          Generate a high-quality product photography End Frame for a video ad.
          Product: ${details.productName}.
          Style: ${details.tone}.
          Action: ${lastSceneScript}.
          Color Theme: ${details.themeColor}.
          
          CRITICAL INSTRUCTIONS:
          - Clear Call to Action (e.g. "Shop Now").
          - Show the product one last time.
          - Professional typography.
          - No gibberish.
        `;

          const endParts = [{ text: endPrompt }];

          const endResp = await genai.models.generateContent({
            model: AI_MODELS.IMAGE_GEN,
            contents: { parts: endParts },
            config: {
              // @ts-ignore
              imageConfig: {
                aspectRatio: selectedAspectRatio,
              },
            },
          });

          let endFrame = "";
          const endCandidates = endResp.candidates;
          if (endCandidates && endCandidates[0]?.content?.parts) {
            for (const part of endCandidates[0].content.parts) {
              if (part.inlineData) {
                endFrame = `data:image/png;base64,${part.inlineData.data}`;
              }
            }
          }

          if (startFrame && endFrame) {
            finalConcepts.push({
              id: concept.id || `concept-${index}`,
              description: concept.description,
              script: concept.script,
              startFrame,
              endFrame,
            });
          }
        } catch (e) {
          console.error(
            "Error generating concept images for concept",
            index,
            e
          );
        }
      })
    );

    console.log("finalConcepts", finalConcepts);

    try {
      await deductCredits(session.user.id, FIXED_CONCEPT_PRICE);
    } catch (e) {
      console.error("Failed to deduct credits", e);
    }

    return NextResponse.json(finalConcepts);
  } catch (error: any) {
    console.error("Concept generation error", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate concepts" },
      { status: 500 }
    );
  }
}

