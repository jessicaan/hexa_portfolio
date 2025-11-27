"use server";

import { adminDb } from "@/lib/firebase-admin";
import { translateWithGemini } from "@/lib/ai/translate";

// -----------------------------
// TYPES
// -----------------------------

export type LanguageCode = "pt" | "en" | "es" | "fr";

export interface SoftSkill {
  name: string;
  description: string;
}

export interface AboutTranslation {
  summary: string;
  longDescription: string;
  softSkills: { description: string }[];
  highlights: string[];
}

export interface AboutContent {
  title: string;
  summary: string;
  longDescription: string;
  videoPitchUrl: string;
  profileImage: string;
  softSkills: SoftSkill[];
  highlights: string[];
  translations: {
    en: AboutTranslation;
    es: AboutTranslation;
    fr: AboutTranslation;
  };
  updatedAt?: string;
}

// -----------------------------
// FIRESTORE
// -----------------------------

const docRef = adminDb.collection("content").doc("about");

const defaultContent: AboutContent = {
  title: "",
  summary: "",
  longDescription: "",
  videoPitchUrl: "",
  profileImage: "",
  softSkills: [],
  highlights: [],
  translations: {
    en: { summary: "", longDescription: "", softSkills: [], highlights: [] },
    es: { summary: "", longDescription: "", softSkills: [], highlights: [] },
    fr: { summary: "", longDescription: "", softSkills: [], highlights: [] },
  },
  updatedAt: undefined,
};

// -----------------------------
// UTILS — ensure translated arrays have the correct length
// -----------------------------

function padTranslations(content: AboutContent): AboutContent {
  const softCount = content.softSkills.length;
  const highCount = content.highlights.length;

  const ensureSoftSkills = (list?: { description: string }[]) => {
    const arr = Array.isArray(list) ? [...list] : [];
    while (arr.length < softCount) arr.push({ description: "" });
    return arr.slice(0, softCount);
  };

  const ensureHighlights = (list?: string[]) => {
    const arr = Array.isArray(list) ? [...list] : [];
    while (arr.length < highCount) arr.push("");
    return arr.slice(0, highCount);
  };

  return {
    ...content,
    translations: {
      en: {
        summary: content.translations.en.summary ?? "",
        longDescription: content.translations.en.longDescription ?? "",
        softSkills: ensureSoftSkills(content.translations.en.softSkills),
        highlights: ensureHighlights(content.translations.en.highlights),
      },
      es: {
        summary: content.translations.es.summary ?? "",
        longDescription: content.translations.es.longDescription ?? "",
        softSkills: ensureSoftSkills(content.translations.es.softSkills),
        highlights: ensureHighlights(content.translations.es.highlights),
      },
      fr: {
        summary: content.translations.fr.summary ?? "",
        longDescription: content.translations.fr.longDescription ?? "",
        softSkills: ensureSoftSkills(content.translations.fr.softSkills),
        highlights: ensureHighlights(content.translations.fr.highlights),
      },
    },
  };
}

// -----------------------------
// GET CONTENT
// -----------------------------

export async function getAboutContent(): Promise<AboutContent> {
  const snapshot = await docRef.get();

  if (!snapshot.exists) {
    return padTranslations(defaultContent);
  }

  const data = snapshot.data() as Partial<AboutContent>;

  const merged: AboutContent = {
    ...defaultContent,
    ...data,
    softSkills: data.softSkills ?? defaultContent.softSkills,
    highlights: data.highlights ?? defaultContent.highlights,
    translations: {
      en: {
        ...defaultContent.translations.en,
        ...(data.translations?.en ?? {}),
      },
      es: {
        ...defaultContent.translations.es,
        ...(data.translations?.es ?? {}),
      },
      fr: {
        ...defaultContent.translations.fr,
        ...(data.translations?.fr ?? {}),
      },
    },
  };

  return padTranslations(merged);
}

// -----------------------------
// SAVE CONTENT
// -----------------------------

export async function saveAboutContent(payload: AboutContent) {
  await docRef.set(
    {
      ...payload,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

// -----------------------------
// AUTO TRANSLATION — matches Initial Section style
// -----------------------------

export async function autoTranslateContent(base: {
  summary: string;
  longDescription: string;
  softSkills: SoftSkill[];
  highlights: string[];
}): Promise<AboutContent['translations']> {
  const ptPayload = {
    summary: base.summary,
    longDescription: base.longDescription,
    softSkills: base.softSkills.map((s) => s.description),
    highlights: base.highlights,
  };

  const result = await translateWithGemini(ptPayload);

  // convert flat arrays back into structured content
  const mapSkills = (arr?: string | string[]) => {
    if (!arr) return [];
    const list = Array.isArray(arr) ? arr : [arr];
    return list.map((d) => ({ description: d }));
  };

  const mapHighlights = (arr?: string | string[]) => {
    if (!arr) return [];
    return Array.isArray(arr) ? arr : [arr];
  };

  return {
    en: {
      summary: result.en?.summary ?? "",
      longDescription: result.en?.longDescription ?? "",
      softSkills: mapSkills(result.en?.softSkills),
      highlights: mapHighlights(result.en?.highlights),
    },
    es: {
      summary: result.es?.summary ?? "",
      longDescription: result.es?.longDescription ?? "",
      softSkills: mapSkills(result.es?.softSkills),
      highlights: mapHighlights(result.es?.highlights),
    },
    fr: {
      summary: result.fr?.summary ?? "",
      longDescription: result.fr?.longDescription ?? "",
      softSkills: mapSkills(result.fr?.softSkills),
      highlights: mapHighlights(result.fr?.highlights),
    },
  };
}
