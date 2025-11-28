"use server";

import { adminDb } from "@/lib/firebase-admin";
import { translateWithGemini } from "@/lib/ai/translate";
import {
  type SkillsContent,
  type SkillCategory,
  defaultSkillsContent,
  mergeSkillsContent,
} from "@/lib/content/schema";

const docRef = adminDb.collection("content").doc("skills");

export async function getSkillsContent(): Promise<SkillsContent> {
  const snapshot = await docRef.get();
  if (!snapshot.exists) return defaultSkillsContent;
  const data = snapshot.data() as Partial<SkillsContent>;
  return mergeSkillsContent(data);
}

export async function saveSkillsContent(payload: SkillsContent) {
  await docRef.set(
    {
      ...payload,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

export async function autoTranslateSkills(base: {
  summary: string;
  categories: SkillCategory[];
}): Promise<SkillsContent["translations"]> {
  const result = await translateWithGemini(base);

  const mapCategories = (arr?: any) => {
    if (!Array.isArray(arr)) return [];
    return arr.map((cat: any) => ({
      name: cat.name ?? "",
      skills: Array.isArray(cat.skills)
        ? cat.skills.map((s: any) => ({
            name: s.name ?? "",
            level: s.level ?? 0,
          }))
        : [],
    }));
  };

  return {
    en: {
      summary: result.en?.summary ?? "",
      categories: mapCategories(result.en?.categories),
    },
    es: {
      summary: result.es?.summary ?? "",
      categories: mapCategories(result.es?.categories),
    },
    fr: {
      summary: result.fr?.summary ?? "",
      categories: mapCategories(result.fr?.categories),
    },
  };
}
