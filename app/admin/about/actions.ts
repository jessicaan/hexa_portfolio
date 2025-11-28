"use server";

import { adminDb } from "@/lib/firebase-admin";
import {
  defaultAboutContent,
  mergeAboutContent,
  type AboutContent,
  type SoftSkill,
} from "@/lib/content/schema";
import { translateWithGemini } from "@/lib/ai/translate";

export type { AboutContent, SoftSkill, LanguageCode } from "@/lib/content/schema";


const docRef = adminDb.collection("content").doc("about");

export async function getAboutContent(): Promise<AboutContent> {
  const snapshot = await docRef.get();

  if (!snapshot.exists) {
    return mergeAboutContent(defaultAboutContent);
  }

  const data = snapshot.data() as Partial<AboutContent>;

  return mergeAboutContent(data);
}

export async function saveAboutContent(payload: AboutContent) {
  await docRef.set(
    {
      ...payload,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

export async function autoTranslateContent(base: {
  summary: string;
  longDescription: string;
  softSkills: SoftSkill[];
  highlights: string[];
}): Promise<AboutContent["translations"]> {
  const ptPayload = {
    summary: base.summary,
    longDescription: base.longDescription,
    softSkills: base.softSkills.map((s) => s.description),
    highlights: base.highlights,
  };

  const result = await translateWithGemini(ptPayload);

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
      videoPitchUrl: "",
    },
    es: {
      summary: result.es?.summary ?? "",
      longDescription: result.es?.longDescription ?? "",
      softSkills: mapSkills(result.es?.softSkills),
      highlights: mapHighlights(result.es?.highlights),
      videoPitchUrl: "",
    },
    fr: {
      summary: result.fr?.summary ?? "",
      longDescription: result.fr?.longDescription ?? "",
      softSkills: mapSkills(result.fr?.softSkills),
      highlights: mapHighlights(result.fr?.highlights),
      videoPitchUrl: "",
    },
  };
}
