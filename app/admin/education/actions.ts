"use server";

import { adminDb } from "@/lib/firebase-admin";
import {
  defaultEducationContent,
  mergeEducationContent,
  type EducationContent,
  type EducationItem,
} from "@/lib/content/schema";

export type { EducationContent, EducationItem, LanguageCode } from "@/lib/content/schema";


const docRef = adminDb.collection("content").doc("education");

export async function getEducationContent(): Promise<EducationContent> {
  const snapshot = await docRef.get();
  if (!snapshot.exists) {
    return mergeEducationContent(defaultEducationContent);
  }

  const data = snapshot.data() as Partial<EducationContent>;

  return mergeEducationContent(data);
}

export async function saveEducationContent(payload: EducationContent) {
  await docRef.set(
    {
      ...payload,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

export async function autoTranslateEducation(base: {
  summary: string;
  education: EducationItem[];
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY ausente nas variaveis de ambiente.");
  }

  const educationText = base.education
    .map(
      (item, idx) =>
        `Item ${idx + 1}:\n- institution: ${item.institution}\n- course: ${item.course}\n- period: ${item.period}\n- description: ${item.description}\n- highlights: ${JSON.stringify(
          item.highlights
        )}`
    )
    .join("\n\n");

  const prompt = `
Você é um tradutor especializado em conteúdo de portfólio. Traduza do português para EN, ES e FR mantendo a estrutura.
Retorne APENAS JSON no formato:
{
  "en": { "summary": "...", "education": [{ "institution": "...", "course": "...", "period": "...", "description": "...", "highlights": ["..."] }] },
  "es": { ... },
  "fr": { ... }
}
O número de itens em education e highlights deve ser o mesmo da versão em português.

Conteúdo:
summary: ${base.summary}
Education:
${educationText}
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.25 },
      }),
    }
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Falha ao traduzir: ${message}`);
  }

  const data = await response.json();
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  const cleaned = raw.replace(/```json|```/g, "").trim();

  const parsed = JSON.parse(cleaned) as {
    en?: { summary?: string; education?: EducationItem[] };
    es?: { summary?: string; education?: EducationItem[] };
    fr?: { summary?: string; education?: EducationItem[] };
  };

  const normalizeList = (list?: EducationItem[]) =>
    Array.isArray(list)
      ? list.map((item) => ({
          institution: item.institution ?? "",
          course: item.course ?? "",
          period: item.period ?? "",
          description: item.description ?? "",
          highlights: Array.isArray(item.highlights)
            ? item.highlights.map((h) => h ?? "")
            : [],
        }))
      : [];

  return {
    en: {
      summary: parsed.en?.summary ?? "",
      education: normalizeList(parsed.en?.education),
    },
    es: {
      summary: parsed.es?.summary ?? "",
      education: normalizeList(parsed.es?.education),
    },
    fr: {
      summary: parsed.fr?.summary ?? "",
      education: normalizeList(parsed.fr?.education),
    },
  };
}
