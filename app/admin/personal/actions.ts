"use server";

import { adminDb } from "@/lib/firebase-admin";
import { translateWithGemini } from "@/lib/ai/translate";
import {
  type PersonalContent,
  type Trait,
  type HobbyCard,
  defaultPersonalContent,
  mergePersonalContent,
} from "@/lib/content/schema";

const docRef = adminDb.collection("content").doc("personal");

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
    { merge: true }
  );
}

export async function autoTranslatePersonal(base: {
  bio: string;
  values: string[];
  traits: Trait[];
  hobbyCards: HobbyCard[];
}): Promise<PersonalContent["translations"]> {
  const result = await translateWithGemini({
    bio: base.bio,
    values: base.values,
    traitLabels: base.traits.map((t) => t.label),
    hobbyCards: base.hobbyCards.map((h) => ({
      title: h.title,
      description: h.description,
    })),
  });

  const mapArray = (arr?: string[]) => (Array.isArray(arr) ? arr : []);
  const mapTraits = (arr?: { label: string }[]) =>
    Array.isArray(arr) ? arr.map((t) => ({ label: t.label || "" })) : [];
  const mapHobbies = (arr?: { title: string; description: string }[]) =>
    Array.isArray(arr)
      ? arr.map((h) => ({
          title: h.title || "",
          description: h.description || "",
        }))
      : [];

  const buildTranslation = (lang: "en" | "es" | "fr" | "pt") => ({
    bio: result[lang]?.bio ?? "",
    values: mapArray(result[lang]?.values),
    translatedTraits: mapTraits(result[lang]?.translatedTraits),
    translatedHobbies: mapHobbies(result[lang]?.translatedHobbies),
    eyebrow:
      result[lang]?.eyebrow ??
      defaultPersonalContent.translations[lang].eyebrow,
    title:
      result[lang]?.title ?? defaultPersonalContent.translations[lang].title,
    description:
      result[lang]?.description ??
      defaultPersonalContent.translations[lang].description,
    hobbiesLabel:
      result[lang]?.hobbiesLabel ??
      defaultPersonalContent.translations[lang].hobbiesLabel,
    howToReadGraphTitle:
      result[lang]?.howToReadGraphTitle ??
      defaultPersonalContent.translations[lang].howToReadGraphTitle,
    howToReadGraphDescription:
      result[lang]?.howToReadGraphDescription ??
      defaultPersonalContent.translations[lang].howToReadGraphDescription,
  });

  return {
    en: buildTranslation("en"),
    es: buildTranslation("es"),
    fr: buildTranslation("fr"),
    pt: buildTranslation("pt"),
  };
}
