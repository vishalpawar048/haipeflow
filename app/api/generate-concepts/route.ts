import { NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

// Use environment variable for API key
const genai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

const AI_MODELS = {
  IMAGE_GEN: 'gemini-2.5-flash-image',
  TEXT_GEN: 'gemini-2.5-flash',
};

// Helper to remove data:image/xyz;base64, prefix
const cleanBase64 = (data: string) => data.split(',')[1] || data;

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
  try {
    const details = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not set" },
        { status: 500 }
      );
    }

    const selectedAspectRatio = getBestAspectRatio(details);
    const isLong = details.duration === '30s';
    const totalScenes = isLong ? 4 : 2;

    // 1. Generate Scripts & Concept Descriptions
    const scriptPrompt = `
      You are a mobile marketing expert. Create 4 distinct visual concepts for a ${details.category} app named "${details.name}".
      Key Selling Point: "${details.sellingPoint}".
      Tone: ${details.tone}.

      The video will be ${isLong ? '30 seconds (4 scenes)' : '15 seconds (2 scenes)'} long.
      Maintain consistent characters, voice, and narrative arc throughout all scenes.

      For each concept, provide:
      1. A short description of the visual style.
      2. A visual script describing the ON-SCREEN ACTION for ${totalScenes} scenes.
         
      CRITICAL INSTRUCTION FOR TEXT:
      When describing the UI or screen content in the script, specify EXACT meaningful text that should appear on the screen.
      - DO NOT say "Screen shows text". 
      - DO say "Screen header reads 'My Portfolio', button says 'Invest Now'".
      - Incorporate keywords from the Selling Point ("${details.sellingPoint}") into the headlines, button labels, and data points.
      - Ensure all text mentioned is real English, correctly spelled, and strictly relevant to a ${details.category} app.
      
      Structure:
         - Scene 1: Intro/Hook. Define the exact headline text on screen (using Selling Point words).
         - Scene 2: Feature/Interaction. Define the button labels or data points.
         ${isLong ? '- Scene 3: Benefit/Expansion. Define the benefit text.\n       - Scene 4: Resolution/CTA.' : '- Scene 2 should lead to the CTA if it is the last scene.'}
         - The Final Scene (Scene ${totalScenes}): Must end with the logo and a clear text CTA like "Download Now" or "Start [Benefit]".
      
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
                required: isLong ? ['scene1', 'scene2', 'scene3', 'scene4'] : ['scene1', 'scene2']
              }
            }
          }
        }
      }
    });

    const extractText = (response: any) => {
      if (response.text && typeof response.text === 'function') {
        return response.text();
      }
      // Fallback for @google/genai if text() helper isn't present
      if (response.candidates?.[0]?.content?.parts?.[0]?.text) {
        return response.candidates[0].content.parts[0].text;
      }
      return "[]";
    };

    const conceptsData = JSON.parse(extractText(scriptResponse));
    const finalConcepts: any[] = [];

    // 2. Generate Visual Hooks (Start/End frames) for each concept
    // Use Promise.all to run in parallel
    await Promise.all(conceptsData.map(async (concept: any, index: number) => {
      try {
        const parts: any[] = [];
        if (details.logo) {
           parts.push({ inlineData: { mimeType: 'image/png', data: cleanBase64(details.logo) } });
        }
        if (details.screenshots.length > 0) {
          parts.push({ inlineData: { mimeType: 'image/png', data: cleanBase64(details.screenshots[0]) } });
        }

        // Generate Start Frame
        const startPrompt = `
          Generate a photorealistic Start Frame for a mobile app video ad.
          App: ${details.name} (${details.category}).
          Style: ${details.tone}, ${concept.description}.
          Action: ${concept.script.scene1}.
          Color Theme: ${details.themeColor}.
          
          CRITICAL TEXT INSTRUCTIONS:
          - Show the app interface on a modern smartphone screen clearly.
          - The UI text MUST reflect the Key Selling Point: "${details.sellingPoint}".
          - Example: If selling point is "Track Fast", show "Fast Tracker" or "Speed: High".
          - ANY visible text on the screen MUST be meaningful, legible English words.
          - DO NOT use "Lorem Ipsum" or gibberish. 
          - Use specific labels like "Dashboard", "Total Balance", "Settings", or "Start" based on the app category.
          - High quality, professional product photography.
        `;
        
        const startParts = [...parts, { text: startPrompt }];

        const startResp = await genai.models.generateContent({
          model: AI_MODELS.IMAGE_GEN,
          contents: { parts: startParts },
          config: {
              // @ts-ignore: imageConfig typing
              imageConfig: {
                aspectRatio: selectedAspectRatio
              }
          }
        });
        
        let startFrame = "";
        const startCandidates = startResp.candidates;
        if (startCandidates && startCandidates[0]?.content?.parts) {
             for (const part of startCandidates[0].content.parts) {
                if (part.inlineData) {
                    startFrame = `data:image/png;base64,${part.inlineData.data}`;
                }
             }
        }

        // Generate End Frame (Call To Action) based on the LAST scene
        const lastSceneScript = isLong ? concept.script.scene4 : concept.script.scene2;
        const endPrompt = `
          Generate a photorealistic End Frame for a mobile app video ad.
          App: ${details.name}.
          Style: ${details.tone}, consistent with previous frame.
          Action: ${lastSceneScript}.
          Color Theme: ${details.themeColor}.
          
          CRITICAL TEXT INSTRUCTIONS:
          - A clear, legible Call to Action.
          - Use words related to "${details.sellingPoint}" (e.g. "Start [Benefit]" or "Get [Benefit]").
          - The App Name "${details.name}" must be spelled correctly if shown.
          - NO random characters or gibberish.
          - Minimal text, high contrast, professional.
        `;

        const endParts = [...parts, { text: endPrompt }];

        const endResp = await genai.models.generateContent({
          model: AI_MODELS.IMAGE_GEN,
          contents: { parts: endParts },
          config: {
            // @ts-ignore
            imageConfig: {
              aspectRatio: selectedAspectRatio
            }
          }
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
            endFrame
          });
        }

      } catch (e) {
        console.error("Error generating concept images for concept", index, e);
      }
    }));

    return NextResponse.json(finalConcepts);

  } catch (error: any) {
    console.error("Concept generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate concepts" },
      { status: 500 }
    );
  }
}

