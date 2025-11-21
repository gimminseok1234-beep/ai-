import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { NovelSettings } from "../types";

// Initialize client using the environment variable
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateNovelStream = async (
  settings: NovelSettings,
  onChunk: (text: string) => void
): Promise<void> => {
  
  // Construct the prompt specifically for creative writing
  const prompt = constructPrompt(settings);

  // Configure Safety Settings
  // If "isMature" is true, we lower the thresholds to BLOCK_NONE to allow for requested content.
  // Note: Hard blocks by the API for illegal content cannot be bypassed.
  const safetySettings = settings.isMature
    ? [
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ]
    : [
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
      ];

  const systemInstruction = `
You are a world-class web novel author known for high engagement, deep immersion, and vivid descriptions. 
Your goal is to write a compelling story segment based on the user's synopsis.

KEY GUIDELINES:
1. **Show, Don't Tell**: Do not just describe emotions; depict actions, sensory details, and internal reactions that reveal them.
2. **Pacing**: Maintain a rhythm that fits the genre. Fast in action, slow in introspection.
3. **Formatting**: Use standard web novel formatting with clear paragraph breaks for readability.
4. **POV Adherence**: Strictly stick to the requested Point of View.
5. **Style Mimicry**: If reference text is provided, analyze its sentence structure, tone, and vocabulary choice, and apply that style to the new story.
6. **Immersion**: The story should feel real and grounded, even in fantasy settings.
  `;

  try {
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3-pro-preview', // High quality model for creative writing
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.9, // High creativity
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192, // Allow for long form
        safetySettings: safetySettings,
      },
    });

    for await (const chunk of responseStream) {
      const text = chunk.text;
      if (text) {
        onChunk(text);
      }
    }
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};

const constructPrompt = (settings: NovelSettings): string => {
  let styleInstruction = "";
  if (settings.referenceText.trim()) {
    styleInstruction = `
=== STYLE REFERENCE START ===
${settings.referenceText.substring(0, 3000)}...
=== STYLE REFERENCE END ===

INSTRUCTION: Analyze the writing style (sentence length, vocabulary, tone) of the reference above and write the story using a similar style.
`;
  }

  return `
Write a web novel chapter/segment based on the following details.

**Synopsis/Plot Outline:**
${settings.synopsis}

**Requirements:**
- **Language:** Korean (한국어)
- **Point of View:** ${settings.pov}
- **Target Length:** Approximately ${settings.targetLength} Korean characters (공백 포함 ${settings.targetLength}자 내외). Ensure the story is detailed and immersive to meet this length.
- **Content Tone:** ${settings.isMature ? "Mature, raw, and unfiltered (Adult/19+ themes allowed where appropriate to the plot)." : "Standard web novel tone."}

${styleInstruction}

Begin the story now. Do not write an intro like "Here is the story". Just start writing the novel in Korean.
`;
};