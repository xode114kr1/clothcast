const GEMINI_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";
const DEFAULT_GEMINI_RETRY_COUNT = 2;
const GEMINI_RETRY_DELAY_MS = 700;

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

class GeminiRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "GeminiRequestError";
  }
}

export type GenerateGeminiTextInput = {
  prompt: string;
  systemInstruction?: string;
  maxOutputTokens?: number;
  responseMimeType?: "application/json" | "text/plain";
  retryCount?: number;
  thinkingBudget?: number;
  temperature?: number;
};

// Gemini 연동에 필요한 서버 환경 변수를 읽고 누락 시 즉시 실패시킨다.
function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not set.`);
  }

  return value;
}

// 환경 변수에 지정된 Gemini 모델이 없으면 기본 모델을 사용한다.
function getGeminiModel() {
  return process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
}

// 현재 설정된 Gemini 모델의 generateContent 호출 URL을 만든다.
function buildGenerateContentUrl() {
  const model = getGeminiModel();

  return `${GEMINI_API_BASE_URL}/models/${model}:generateContent`;
}

// Gemini 응답 후보에서 최종 텍스트를 추출한다.
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

// 일시적인 Gemini 장애나 rate limit 응답인지 확인한다.
function isRetryableGeminiStatus(status: number) {
  return status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
}

// 재시도 사이에 짧은 대기 시간을 둔다.
function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// Gemini generateContent API를 호출해 텍스트 응답을 반환한다.
export async function generateGeminiText({
  maxOutputTokens,
  prompt,
  retryCount = DEFAULT_GEMINI_RETRY_COUNT,
  responseMimeType,
  systemInstruction,
  thinkingBudget,
  temperature = 0.4,
}: GenerateGeminiTextInput) {
  for (let attempt = 0; attempt <= retryCount; attempt += 1) {
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
          ...(maxOutputTokens ? { maxOutputTokens } : {}),
          ...(responseMimeType ? { responseMimeType } : {}),
          ...(thinkingBudget !== undefined
            ? {
                thinkingConfig: {
                  thinkingBudget,
                },
              }
            : {}),
          temperature,
        },
      }),
    });

    if (!response.ok) {
      if (attempt < retryCount && isRetryableGeminiStatus(response.status)) {
        await delay(GEMINI_RETRY_DELAY_MS * (attempt + 1));
        continue;
      }

      throw new GeminiRequestError(
        `Gemini request failed with status ${response.status}.`,
        response.status,
      );
    }

    const data = (await response.json()) as GeminiGenerateContentResponse;

    return extractGeminiText(data);
  }

  throw new Error("Gemini request failed after retries.");
}
