'use server';

import { adminDb } from '@/lib/firebase/firebase-admin';
import {
  defaultExperienceContent,
  ExperienceContent,
  ExperienceItem,
  mergeExperienceContent,
} from '@/lib/content/schema';
import { revalidatePath } from 'next/cache';
import { translateWithGemini } from '@/lib/ai/translate';

const contentCollection = adminDb.collection('content');

export async function getExperienceContent(): Promise<ExperienceContent> {
  const docRef = contentCollection.doc('experience');
  const snapshot = await docRef.get();

  if (!snapshot.exists) {
    return mergeExperienceContent();
  }

  const data = snapshot.data();
  return mergeExperienceContent(data as ExperienceContent);
}

export async function saveExperienceContent(
  content: ExperienceContent,
): Promise<void> {
  const docRef = contentCollection.doc('experience');
  await docRef.set({
    ...content,
    updatedAt: new Date().toISOString(),
  });
  revalidatePath('/');
}

export async function autoTranslateExperience(base: {
  summary: string;
  experiences: ExperienceItem[];
}): Promise<ExperienceContent['translations']> {
  const ptPayload = {
    summary: base.summary,
    experiences: base.experiences.map((exp) => ({
      role: exp.role,
      description: exp.description,
      achievements: exp.achievements,
    })),
  };

  const result = await translateWithGemini(ptPayload);

  const mapExperiences = (
    translatedExperiences?: {
      role?: string;
      description?: string;
      achievements?: unknown[];
    }[],
  ): ExperienceItem[] => {
    return base.experiences.map((baseExp, index) => {
      const translated = Array.isArray(translatedExperiences)
        ? translatedExperiences[index]
        : undefined;
      const achievements =
        Array.isArray(translated?.achievements) &&
        translated.achievements.length > 0
          ? translated.achievements.map((item) =>
              typeof item === 'string' ? item : String(item ?? ''),
            )
          : baseExp.achievements;

      return {
        ...baseExp,
        role: translated?.role ?? baseExp.role,
        description: translated?.description ?? baseExp.description,
        achievements,
      };
    });
  };

  return {
    en: {
      ...defaultExperienceContent.translations.en,
      summary: result.en?.summary ?? base.summary,
      experiences: mapExperiences(result.en?.experiences),
    },
    es: {
      ...defaultExperienceContent.translations.es,
      summary: result.es?.summary ?? base.summary,
      experiences: mapExperiences(result.es?.experiences),
    },
    fr: {
      ...defaultExperienceContent.translations.fr,
      summary: result.fr?.summary ?? base.summary,
      experiences: mapExperiences(result.fr?.experiences),
    },
    pt: {
      ...defaultExperienceContent.translations.pt,
      summary: base.summary,
      experiences: base.experiences,
    },
  };
}
