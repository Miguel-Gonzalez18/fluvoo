import { createGoogleGenerativeAI } from "@ai-sdk/google";

export function resolveGeminiApiKey(): string | undefined {
  return (
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim() ||
    undefined
  );
}

export function resolveGeminiModelId(): string {
  return process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
}

export function createGeminiLanguageModel() {
  const apiKey = resolveGeminiApiKey();
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY (or GOOGLE_GENERATIVE_AI_API_KEY) is not configured"
    );
  }

  const provider = createGoogleGenerativeAI({ apiKey });
  return provider(resolveGeminiModelId());
}
