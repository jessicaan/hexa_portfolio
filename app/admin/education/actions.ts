'use server';

import { translateWithGemini } from '@/lib/ai/translate';
import { adminDb } from '@/lib/firebase/firebase-admin';
import {
  defaultEducationContent,
  mergeEducationContent,
  type EducationContent,
  type EducationItem,
} from '@/lib/content/schema';

export type {
  EducationContent,
  EducationItem,
  LanguageCode,
} from '@/lib/content/schema';

const docRef = adminDb.collection('content').doc('education');

export async function getEducationContent(): Promise<EducationContent> {
  const snapshot = await docRef.get();
  if (!snapshot.exists) {
    return mergeEducationContent(defaultEducationContent);
  }

  const data = snapshot.data() as Partial<EducationContent>;

  return mergeEducationContent(data);
}

export async function saveEducationContent(payload: EducationContent) {
  await docRef.set(
    {
      ...payload,
      updatedAt: new Date().toISOString(),
    },
    { merge: true },
  );
}

export async function autoTranslateEducation(base: {
  summary: string;
  education: EducationItem[];
}) {
  const translated = (await translateWithGemini(base)) as {
    en?: { summary?: string; education?: EducationItem[] };
    es?: { summary?: string; education?: EducationItem[] };
    fr?: { summary?: string; education?: EducationItem[] };
  };

  const normalizeList = (list?: EducationItem[]) =>
    Array.isArray(list)
      ? list.map((item) => ({
          institution: item.institution ?? '',
          course: item.course ?? '',
          period: item.period ?? '',
          description: item.description ?? '',
          highlights: Array.isArray(item.highlights)
            ? item.highlights.map((h) => h ?? '')
            : [],
        }))
      : [];

  return {
    en: {
      ...defaultEducationContent.translations.en,
      summary: translated.en?.summary ?? '',
      education: normalizeList(translated.en?.education),
    },
    es: {
      ...defaultEducationContent.translations.es,
      summary: translated.es?.summary ?? '',
      education: normalizeList(translated.es?.education),
    },
    fr: {
      ...defaultEducationContent.translations.fr,
      summary: translated.fr?.summary ?? '',
      education: normalizeList(translated.fr?.education),
    },
    pt: {
      ...defaultEducationContent.translations.pt,
      summary: base.summary,
      education: normalizeList(base.education),
    },
  };
}
