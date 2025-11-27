"use server";

import { adminDb } from "@/lib/firebase-admin";

export type LanguageCode = "pt" | "en" | "es" | "fr";

export interface EducationItem {
  institution: string;
  course: string;
  period: string;
  description: string;
  highlights: string[];
}

export interface EducationTranslation {
  summary: string;
  education: EducationItem[];
}

export interface EducationContent {
  summary: string;
  education: EducationItem[];
  translations: {
    en: EducationTranslation;
    es: EducationTranslation;
    fr: EducationTranslation;
  };
  updatedAt?: string;
}

const docRef = adminDb.collection("content").doc("education");

const defaultEducation: EducationContent = {
  summary: "",
  education: [
    {
      institution: "",
      course: "",
      period: "",
      description: "",
      highlights: [""],
    },
  ],
  translations: {
    en: { summary: "", education: [] },
    es: { summary: "", education: [] },
    fr: { summary: "", education: [] },
  },
  updatedAt: undefined,
};

function padTranslations(base: EducationContent, translations: EducationContent["translations"]) {
  const baseEdu = base.education;
  const padEdu = (list?: EducationItem[]) => {
    const arr = Array.isArray(list) ? [...list] : [];
    while (arr.length < baseEdu.length) {
      arr.push({
        institution: "",
        course: "",
        period: "",
        description: "",
        highlights: [],
      });
    }
    return arr.slice(0, baseEdu.length).map((item, idx) => {
      const baseHighlights = baseEdu[idx]?.highlights ?? [];
      const highlights = Array.isArray(item.highlights) ? [...item.highlights] : [];
      while (highlights.length < baseHighlights.length) highlights.push("");
      return {
        institution: item.institution ?? "",
        course: item.course ?? "",
        period: item.period ?? "",
        description: item.description ?? "",
        highlights: highlights.slice(0, baseHighlights.length),
      };
    });
  };

  return {
    en: {
      summary: translations.en.summary ?? "",
      education: padEdu(translations.en.education),
    },
    es: {
      summary: translations.es.summary ?? "",
      education: padEdu(translations.es.education),
    },
    fr: {
      summary: translations.fr.summary ?? "",
      education: padEdu(translations.fr.education),
    },
  };
}

export async function getEducationContent(): Promise<EducationContent> {
  const snapshot = await docRef.get();
  if (!snapshot.exists) {
    return defaultEducation;
  }

  const data = snapshot.data() as Partial<EducationContent>;
  const merged: EducationContent = {
    ...defaultEducation,
    ...data,
    education: data.education ?? defaultEducation.education,
    translations: {
      en: { ...defaultEducation.translations.en, ...(data.translations?.en ?? {}) },
      es: { ...defaultEducation.translations.es, ...(data.translations?.es ?? {}) },
      fr: { ...defaultEducation.translations.fr, ...(data.translations?.fr ?? {}) },
    },
  };

  return {
    ...merged,
    translations: padTranslations(merged, merged.translations),
  };
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

export async function autoTranslateEducation(base: { summary: string; education: EducationItem[] }) {
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
    en?: EducationTranslation;
    es?: EducationTranslation;
    fr?: EducationTranslation;
  };

  const normalizeList = (list?: EducationItem[]) =>
    Array.isArray(list) ? list.map((item) => ({
      institution: item.institution ?? "",
      course: item.course ?? "",
      period: item.period ?? "",
      description: item.description ?? "",
      highlights: Array.isArray(item.highlights) ? item.highlights.map((h) => h ?? "") : [],
    })) : [];

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
