"use server";

import { adminDb } from "@/lib/firebase-admin";
import {
  defaultInitialContent,
  mergeInitialContent,
  type InitialSectionContent,
  type LanguageCode,
} from "@/lib/content/schema";
import { translateWithGemini } from "@/lib/ai/translate";

export type { InitialSectionContent, LanguageCode } from "@/lib/content/schema";


// -----------------------------
// FIRESTORE
// -----------------------------

const docRef = adminDb.collection("content").doc("initial");

// -----------------------------
// GET CONTENT
// -----------------------------

export async function getInitialContent(): Promise<InitialSectionContent> {
  const snapshot = await docRef.get();

  if (!snapshot.exists) return defaultInitialContent;

  const data = snapshot.data() as Partial<InitialSectionContent>;

  return mergeInitialContent(data);
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
