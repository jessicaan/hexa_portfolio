'use server';

type TranslatePayload = Record<string, unknown>;

export async function translateWithGemini(content: TranslatePayload) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY está ausente.');

  const prompt = `
You are a precise multilingual localization engine.

Translate the following JSON content from Portuguese (pt-BR) into:
- English (en)
- Spanish (es)
- French (fr)

**Rules:**
- Output MUST be valid JSON.
- Do NOT include comments, markdown, backticks, or explanations.
- Keep the same structure as the input JSON.
- Only translate the values.

Format:
{
  "en": { ... },
  "es": { ... },
  "fr": { ... }
}

Content JSON to translate:
${JSON.stringify(content, null, 2)}
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2 },
      }),
    },
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const data = await response.json();
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  const cleaned = raw.replace(/```json|```/g, '').trim();

  return JSON.parse(cleaned);
}
