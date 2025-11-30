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

interface SkillCategoryWithTech extends Omit<SkillCategory, 'skills'> {
  skills: {
    name: string;
    level: number;
    techId?: string;
    skillLevel?: 'beginner' | 'intermediate' | 'advanced';
  }[];
}

export async function autoTranslateSkills(base: {
  summary: string;
  categories: SkillCategoryWithTech[];
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
        skills: c.skills.map((s) => ({
          name: s.name,
          level: s.level,
          techId: s.techId,
        })),
      }));
    }

    return translatedCategories.map((translatedCat, catIndex) => {
      const originalCat = base.categories[catIndex];

      return {
        name: translatedCat.name,
        skills: translatedCat.skills.map((translatedSkill, skillIndex) => {
          const originalSkill = originalCat?.skills[skillIndex];

          return {
            name: translatedSkill.name,
            level: originalSkill?.level ?? 0,
            techId: originalSkill?.techId,
          };
        }),
      };
    });
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
        skills: c.skills.map((s) => ({
          name: s.name,
          level: s.level,
          techId: s.techId,
        })),
      })),
    },
  };
}
