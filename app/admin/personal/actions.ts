"use server";

import { adminDb } from "@/lib/firebase-admin";
import { translateWithGemini } from "@/lib/ai/translate";
import {
  type PersonalContent,
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
  hobbies: string[];
  values: string[];
}): Promise<PersonalContent["translations"]> {
  const result = await translateWithGemini(base);

  const mapArray = (arr?: any) => (Array.isArray(arr) ? arr : []);

  return {
    en: {
      bio: result.en?.bio ?? "",
      hobbies: mapArray(result.en?.hobbies),
      values: mapArray(result.en?.values),
    },
    es: {
      bio: result.es?.bio ?? "",
      hobbies: mapArray(result.es?.hobbies),
      values: mapArray(result.es?.values),
    },
    fr: {
      bio: result.fr?.bio ?? "",
      hobbies: mapArray(result.fr?.hobbies),
      values: mapArray(result.fr?.values),
    },
  };
}
