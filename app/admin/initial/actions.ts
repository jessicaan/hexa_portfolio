'use server';

import { adminDb } from '@/lib/firebase/firebase-admin';
import {
  defaultInitialContent,
  mergeInitialContent,
  type InitialSectionContent,
  type LanguageCode,
} from '@/lib/content/schema';
import { translateWithGemini } from '@/lib/ai/translate';

export type { InitialSectionContent, LanguageCode } from '@/lib/content/schema';

const docRef = adminDb.collection('content').doc('initial');

export async function getInitialContent(): Promise<InitialSectionContent> {
  const snapshot = await docRef.get();

  if (!snapshot.exists) return defaultInitialContent;

  const data = snapshot.data() as Partial<InitialSectionContent>;

  return mergeInitialContent(data);
}

export async function saveInitialContent(payload: InitialSectionContent) {
  await docRef.set(
    {
      ...payload,
      updatedAt: new Date().toISOString(),
    },
    { merge: true },
  );
}

export async function autoTranslateContent(pt: {
  headline: string;
  subheadline: string;
  description: string;
}) {
  const result = await translateWithGemini(pt);
  return {
    en: {
      ...defaultInitialContent.translations.en,
      headline: result.en?.headline ?? '',
      subheadline: result.en?.subheadline ?? '',
      description: result.en?.description ?? '',
    },
    es: {
      ...defaultInitialContent.translations.es,
      headline: result.es?.headline ?? '',
      subheadline: result.es?.subheadline ?? '',
      description: result.es?.description ?? '',
    },
    fr: {
      ...defaultInitialContent.translations.fr,
      headline: result.fr?.headline ?? '',
      subheadline: result.fr?.subheadline ?? '',
      description: result.fr?.description ?? '',
    },
    pt: {
      ...defaultInitialContent.translations.pt,
      ...pt,
    },
  };
}
