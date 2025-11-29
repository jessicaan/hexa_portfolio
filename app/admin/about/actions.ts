'use server';

import { adminDb } from '@/lib/firebase/firebase-admin';
import {
  defaultAboutContent,
  mergeAboutContent,
  type AboutContent,
  type SoftSkill,
} from '@/lib/content/schema';
import { translateWithGemini } from '@/lib/ai/translate';

export type {
  AboutContent,
  SoftSkill,
  LanguageCode,
} from '@/lib/content/schema';

const docRef = adminDb.collection('content').doc('about');

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
    { merge: true },
  );
}

export async function autoTranslateContent(base: {
  summary: string;
  longDescription: string;
  softSkills: SoftSkill[];
  highlights: string[];
}): Promise<AboutContent['translations']> {
  const ptPayload = {
    summary: base.summary,
    longDescription: base.longDescription,
    softSkillNames: base.softSkills.map((s) => s.name),
    softSkillDescriptions: base.softSkills.map((s) => s.description),
    highlights: base.highlights,
  };

  const result = (await translateWithGemini(ptPayload)) as {
    en: {
      summary: string;
      longDescription: string;
      softSkillNames: string[];
      softSkillDescriptions: string[];
      highlights: string[];
    };
    es: {
      summary: string;
      longDescription: string;
      softSkillNames: string[];
      softSkillDescriptions: string[];
      highlights: string[];
    };
    fr: {
      summary: string;
      longDescription: string;
      softSkillNames: string[];
      softSkillDescriptions: string[];
      highlights: string[];
    };
  };

  const buildTranslatedSoftSkills = (
    translatedNames: string[] | undefined,
    translatedDescriptions: string[] | undefined,
  ): SoftSkill[] => {
    return base.softSkills.map((skill, index) => ({
      name: translatedNames?.[index] ?? skill.name,
      description: translatedDescriptions?.[index] ?? skill.description,
    }));
  };

  const translations = {
    en: {
      ...defaultAboutContent.translations.en,
      summary: result.en?.summary ?? '',
      longDescription: result.en?.longDescription ?? '',
      softSkills: buildTranslatedSoftSkills(
        result.en?.softSkillNames,
        result.en?.softSkillDescriptions,
      ),
      highlights: result.en?.highlights ?? [],
    },
    es: {
      ...defaultAboutContent.translations.es,
      summary: result.es?.summary ?? '',
      longDescription: result.es?.longDescription ?? '',
      softSkills: buildTranslatedSoftSkills(
        result.es?.softSkillNames,
        result.es?.softSkillDescriptions,
      ),
      highlights: result.es?.highlights ?? [],
    },
    fr: {
      ...defaultAboutContent.translations.fr,
      summary: result.fr?.summary ?? '',
      longDescription: result.fr?.longDescription ?? '',
      softSkills: buildTranslatedSoftSkills(
        result.fr?.softSkillNames,
        result.fr?.softSkillDescriptions,
      ),
      highlights: result.fr?.highlights ?? [],
    },
    pt: {
      ...defaultAboutContent.translations.pt,
      summary: base.summary,
      longDescription: base.longDescription,
      softSkills: base.softSkills,
      highlights: base.highlights,
    },
  };

  return translations as any;
}
