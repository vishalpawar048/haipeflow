import { NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

// Use environment variable for API key
const genai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

const AI_MODELS = {
  IMAGE_GEN: "gemini-3-pro-image-preview",
  TEXT_GEN: "gemini-2.0-flash",
};

const getBestAspectRatio = (details: any): string => {
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
  console.log("Service concept request");
  try {
    const details = await request.json();

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
      You are a service business marketing expert. Create 4 distinct visual concepts for a service business named "${
        details.brandName
      }" (${details.serviceType}).
      Key Selling Point: "${details.sellingPoint}".
      Tone: ${details.tone}.

      The video will be ${
        isLong ? "30 seconds (4 scenes)" : "15 seconds (2 scenes)"
      } long.
      Focus on the result, trust, and human connection.

      For each concept, provide:
      1. A short description of the visual style (e.g. "Professional office", "Happy client result").
      2. A visual script describing the ON-SCREEN ACTION for ${totalScenes} scenes.
         
      CRITICAL INSTRUCTION FOR TEXT:
      - Specify EXACT text for headlines and overlays.
      - Headlines should focus on the PROBLEM solved or the RESULT gained.
      - Incorporate keywords from "${details.sellingPoint}".
      
      Structure:
         - Scene 1: Hook/Problem. Address the viewer's pain point or desire. Headline text.
         - Scene 2: Solution/Process. Show the service in action (e.g. consulting, working) or the immediate result.
         ${
           isLong
             ? "- Scene 3: Trust/Testimonial. Show a happy client or credential.\n       - Scene 4: Offer/CTA."
             : "- Scene 2 should lead to the CTA if it is the last scene."
         }
         - The Final Scene: Must end with the logo and a clear CTA like "Book Now", "Call Us", or "Learn More".
      
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
          Generate a professional Start Frame for a service business video ad.
          Business: ${details.brandName} (${details.serviceType}).
          Style: ${details.tone}, ${concept.description}.
          Action: ${concept.script.scene1}.
          Color Theme: ${details.themeColor}.
          
          CRITICAL INSTRUCTIONS:
          - Depict a professional setting or a happy client outcome.
          - Avoid generic stock photo look if possible; aim for authentic business photography.
          - Include text overlay matching the hook: "${details.sellingPoint}".
          - High resolution, trustworthy atmosphere.
        `;

          // Only use text prompt for Imagen
          const startParts = [{ text: startPrompt }];

          const startResp = await genai.models.generateContent({
            model: AI_MODELS.IMAGE_GEN,
            contents: { parts: startParts },
            config: {
              // @ts-ignore
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
          Generate a professional End Frame for a service business video ad.
          Business: ${details.brandName}.
          Style: ${details.tone}.
          Action: ${lastSceneScript}.
          Color Theme: ${details.themeColor}.
          
          CRITICAL INSTRUCTIONS:
          - Clear Call to Action (e.g. "Book Consultation").
          - Professional typography.
          - Clean layout.
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

    return NextResponse.json(finalConcepts);
  } catch (error: any) {
    console.error("Concept generation error", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate concepts" },
      { status: 500 }
    );
  }
}
