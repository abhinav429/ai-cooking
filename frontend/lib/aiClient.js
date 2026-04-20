import OpenAI from "openai";

// AICredits (and similar) expose an OpenAI-style HTTP API; `model` still targets Gemini here.
const DEFAULT_BASE_URL = "https://api.aicredits.in/v1";
const DEFAULT_MODEL = "gemini-2.5-flash-lite";

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  const rawBase = process.env.GEMINI_API_BASE || DEFAULT_BASE_URL;
  const baseURL = rawBase.replace(/\/$/, "");
  return new OpenAI({ apiKey, baseURL });
}

export function getAiModel() {
  return process.env.GEMINI_MODEL || DEFAULT_MODEL;
}

export async function generateText(prompt) {
  const client = getClient();
  const model = getAiModel();
  const completion = await client.chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
  });
  const text = completion.choices[0]?.message?.content;
  if (!text) throw new Error("Empty AI response");
  return text;
}

export async function generateTextWithImage(prompt, mimeType, base64Image) {
  const client = getClient();
  const model = getAiModel();
  const type = mimeType || "image/jpeg";
  const completion = await client.chat.completions.create({
    model,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          {
            type: "image_url",
            image_url: { url: `data:${type};base64,${base64Image}` },
          },
        ],
      },
    ],
  });
  const text = completion.choices[0]?.message?.content;
  if (!text) throw new Error("Empty AI response");
  return text;
}
