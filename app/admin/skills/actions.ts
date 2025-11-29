'use server';

import { adminDb } from '@/lib/firebase/firebase-admin';
import { translateWithGemini } from '@/lib/ai/translate';
import {
  type SkillsContent,
  type SkillCategory,
  defaultSkillsContent,
  mergeSkillsContent,
} from '@/lib/content/schema';

const docRef = adminDb.collection('content').doc('skills');

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
    { merge: true },
  );
}

export async function autoTranslateSkills(base: {
  summary: string;
  categories: SkillCategory[];
}): Promise<SkillsContent['translations']> {
  const result = await translateWithGemini({
    summary: base.summary,
    categories: base.categories.map((c) => ({
      name: c.name,
      skills: c.skills.map((s) => ({ name: s.name })),
    })),
  });

  const mapCategories = (
    translatedCategories?: { name: string; skills: { name: string }[] }[],
  ) => {
    if (!Array.isArray(translatedCategories)) {
      return base.categories.map((c) => ({
        name: c.name,
        skills: c.skills.map((s) => ({ name: s.name })),
      }));
    }
    return translatedCategories;
  };

  return {
    en: {
      ...defaultSkillsContent.translations.en,
      summary: result.en?.summary ?? '',
      categories: mapCategories(result.en?.categories),
    },
    es: {
      ...defaultSkillsContent.translations.es,
      summary: result.es?.summary ?? '',
      categories: mapCategories(result.es?.categories),
    },
    fr: {
      ...defaultSkillsContent.translations.fr,
      summary: result.fr?.summary ?? '',
      categories: mapCategories(result.fr?.categories),
    },
    pt: {
      ...defaultSkillsContent.translations.pt,
      summary: base.summary,
      categories: base.categories.map((c) => ({
        name: c.name,
        skills: c.skills.map((s) => ({ name: s.name })),
      })),
    },
  };
}
