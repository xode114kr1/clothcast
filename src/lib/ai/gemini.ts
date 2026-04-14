const GEMINI_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";

type GeminiPart = {
  text?: string;
};

type GeminiCandidate = {
  content?: {
    parts?: GeminiPart[];
  };
};

type GeminiGenerateContentResponse = {
  candidates?: GeminiCandidate[];
};

export type GenerateGeminiTextInput = {
  prompt: string;
  systemInstruction?: string;
  temperature?: number;
};

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not set.`);
  }

  return value;
}

function getGeminiModel() {
  return process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
}

function buildGenerateContentUrl() {
  const model = getGeminiModel();

  return `${GEMINI_API_BASE_URL}/models/${model}:generateContent`;
}

function extractGeminiText(data: GeminiGenerateContentResponse) {
  const text = data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text)
    .filter((part): part is string => Boolean(part))
    .join("");

  if (!text) {
    throw new Error("Gemini response did not include text.");
  }

  return text;
}

export async function generateGeminiText({
  prompt,
  systemInstruction,
  temperature = 0.4,
}: GenerateGeminiTextInput) {
  const response = await fetch(buildGenerateContentUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": getRequiredEnv("GEMINI_API_KEY"),
    },
    body: JSON.stringify({
      ...(systemInstruction
        ? {
            systemInstruction: {
              parts: [{ text: systemInstruction }],
            },
          }
        : {}),
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini request failed with status ${response.status}.`);
  }

  const data = (await response.json()) as GeminiGenerateContentResponse;

  return extractGeminiText(data);
}
