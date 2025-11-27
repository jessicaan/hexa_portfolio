"use server";

import { adminDb } from "@/lib/firebase-admin";
import { translateWithGemini } from "@/lib/ai/translate";

// -----------------------------
// TYPES
// -----------------------------

export type LanguageCode = "pt" | "en" | "es" | "fr";

export interface InitialTranslation {
  headline: string;
  subheadline: string;
  description: string;
}

export interface InitialSectionContent {
  headline: string;
  subheadline: string;
  description: string;
  heroVideoUrl: string;
  languagesAvailable: LanguageCode[];
  backgroundConfig: {
    gradientFrom?: string;
    gradientTo?: string;
    glowColor?: string;
    noiseOpacity?: number;
    blur?: number;
  };
  translations: {
    en: InitialTranslation;
    es: InitialTranslation;
    fr: InitialTranslation;
  };
  updatedAt?: string;
}

// -----------------------------
// FIRESTORE
// -----------------------------

const docRef = adminDb.collection("content").doc("initial");

const defaultContent: InitialSectionContent = {
  headline: "",
  subheadline: "",
  description: "",
  heroVideoUrl: "",
  languagesAvailable: ["pt"],
  backgroundConfig: {
    gradientFrom: "hsl(var(--primary))",
    gradientTo: "hsl(var(--secondary))",
    glowColor: "hsl(var(--glow))",
    noiseOpacity: 0.08,
    blur: 12,
  },
  translations: {
    en: { headline: "", subheadline: "", description: "" },
    es: { headline: "", subheadline: "", description: "" },
    fr: { headline: "", subheadline: "", description: "" },
  },
  updatedAt: undefined,
};

// -----------------------------
// GET CONTENT
// -----------------------------

export async function getInitialContent(): Promise<InitialSectionContent> {
  const snapshot = await docRef.get();

  if (!snapshot.exists) return defaultContent;

  const data = snapshot.data() as Partial<InitialSectionContent>;

  return {
    ...defaultContent,
    ...data,
    backgroundConfig: {
      ...defaultContent.backgroundConfig,
      ...data.backgroundConfig,
    },
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
}

// -----------------------------
// SAVE CONTENT
// -----------------------------

export async function saveInitialContent(payload: InitialSectionContent) {
  await docRef.set(
    {
      ...payload,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

// -----------------------------
// AUTO TRANSLATION (using global Gemini API)
// -----------------------------

export async function autoTranslateContent(pt: {
  headline: string;
  subheadline: string;
  description: string;
}) {
  return translateWithGemini(pt);
}
