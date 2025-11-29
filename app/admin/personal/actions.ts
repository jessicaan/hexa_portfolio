'use server';

import { adminDb } from '@/lib/firebase/firebase-admin';
import { translateWithGemini } from '@/lib/ai/translate';
import {
  type PersonalContent,
  type Trait,
  type HobbyCard,
  defaultPersonalContent,
  mergePersonalContent,
} from '@/lib/content/schema';

const docRef = adminDb.collection('content').doc('personal');

export async function getPersonalContent(): Promise<PersonalContent> {
  const snapshot = await docRef.get();
  if (!snapshot.exists) return defaultPersonalContent;
  const data = snapshot.data() as Partial<PersonalContent>;
  return mergePersonalContent(data);
}

export async function savePersonalContent(payload: PersonalContent) {
  await docRef.set(
    {
      ...payload,
      updatedAt: new Date().toISOString(),
    },
    { merge: true },
  );
}

export async function autoTranslatePersonal(base: {
  bio: string;
  values: string[];
  traits: Trait[];
  hobbyCards: HobbyCard[];
}): Promise<PersonalContent['translations']> {
  const result = await translateWithGemini({
    bio: base.bio,
    values: base.values,
    traitLabels: base.traits.map((t) => t.label),
    hobbyCards: base.hobbyCards.map((h) => ({
      title: h.title,
      description: h.description,
    })),
  });

  const buildTranslation = (lang: 'en' | 'es' | 'fr') => {
    const translated = result[lang];

    const mapTraits = (labels?: string[]): { label: string }[] => {
      const sourceLabels = labels ?? base.traits.map((t) => t.label);
      return sourceLabels.map((label) => ({ label }));
    };

    const mapHobbies = (
      hobbies?: { title: string; description: string }[],
    ): { title: string; description: string }[] => {
      if (!Array.isArray(hobbies)) {
        return base.hobbyCards.map((h) => ({
          title: h.title,
          description: h.description,
        }));
      }
      return base.hobbyCards.map((baseHobby, i) => ({
        title: hobbies[i]?.title ?? baseHobby.title,
        description: hobbies[i]?.description ?? baseHobby.description,
      }));
    };

    const t = defaultPersonalContent.translations[lang];

    return {
      ...t,
      bio: translated?.bio ?? base.bio,
      values: Array.isArray(translated?.values)
        ? translated.values
        : base.values,
      translatedTraits: mapTraits(translated?.traitLabels),
      translatedHobbies: mapHobbies(translated?.hobbyCards),
    };
  };

  return {
    en: buildTranslation('en'),
    es: buildTranslation('es'),
    fr: buildTranslation('fr'),
    pt: {
      ...defaultPersonalContent.translations.pt,
      bio: base.bio,
      values: base.values,
      translatedTraits: base.traits.map((t) => ({ label: t.label })),
      translatedHobbies: base.hobbyCards.map((h) => ({
        title: h.title,
        description: h.description,
      })),
    },
  };
}
