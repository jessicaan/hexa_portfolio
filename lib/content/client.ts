"use client";

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import {
  defaultAboutContent,
  defaultEducationContent,
  defaultInitialContent,
  mergeAboutContent,
  mergeEducationContent,
  mergeInitialContent,
  type AboutContent,
  type EducationContent,
  type InitialSectionContent,
} from "@/lib/content/schema";

async function fetchContent<T>(key: string): Promise<Partial<T> | null> {
  try {
    const snapshot = await getDoc(doc(db, "content", key));
    if (!snapshot.exists()) return null;
    return snapshot.data() as Partial<T>;
  } catch (error) {
    console.error(`[content] Failed to load "${key}" from Firestore`, error);
    return null;
  }
}

export async function loadInitialContent(): Promise<InitialSectionContent> {
  const data = await fetchContent<InitialSectionContent>("initial");
  if (!data) return mergeInitialContent(defaultInitialContent);
  return mergeInitialContent(data);
}

export async function loadAboutContent(): Promise<AboutContent> {
  const data = await fetchContent<AboutContent>("about");
  if (!data) return mergeAboutContent(defaultAboutContent);
  return mergeAboutContent(data);
}

export async function loadEducationContent(): Promise<EducationContent> {
  const data = await fetchContent<EducationContent>("education");
  if (!data) return mergeEducationContent(defaultEducationContent);
  return mergeEducationContent(data);
}
