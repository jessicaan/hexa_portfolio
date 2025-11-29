'use server';

import { adminDb } from '@/lib/firebase/firebase-admin';
import { translateWithGemini } from '@/lib/ai/translate';
import {
  type ContactContent,
  defaultContactContent,
  mergeContactContent,
} from '@/lib/content/schema';

const docRef = adminDb.collection('content').doc('contact');

export async function getContactContent(): Promise<ContactContent> {
  const snapshot = await docRef.get();
  if (!snapshot.exists) return defaultContactContent;
  const data = snapshot.data() as Partial<ContactContent>;
  return mergeContactContent(data);
}

export async function saveContactContent(payload: ContactContent) {
  await docRef.set(
    {
      ...payload,
      updatedAt: new Date().toISOString(),
    },
    { merge: true },
  );
}

export async function autoTranslateContact(base: {
  headline: string;
  description: string;
  availability: string;
}): Promise<ContactContent['translations']> {
  const result = await translateWithGemini(base);

  return {
    en: {
      ...defaultContactContent.translations.en,
      headline: result.en?.headline ?? '',
      description: result.en?.description ?? '',
      availability: result.en?.availability ?? '',
    },
    es: {
      ...defaultContactContent.translations.es,
      headline: result.es?.headline ?? '',
      description: result.es?.description ?? '',
      availability: result.es?.availability ?? '',
    },
    fr: {
      ...defaultContactContent.translations.fr,
      headline: result.fr?.headline ?? '',
      description: result.fr?.description ?? '',
      availability: result.fr?.availability ?? '',
    },
    pt: {
      ...defaultContactContent.translations.pt,
      headline: base.headline,
      description: base.description,
      availability: base.availability,
    },
  };
}
