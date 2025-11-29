'use client';

import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import {
  defaultAboutContent,
  defaultEducationContent,
  defaultInitialContent,
  defaultSkillsContent,
  defaultContactContent,
  defaultExperienceContent,
  defaultPersonalContent,
  defaultProjectsContent,
  mergeAboutContent,
  mergeEducationContent,
  mergeInitialContent,
  mergeSkillsContent,
  mergeContactContent,
  mergeExperienceContent,
  mergePersonalContent,
  mergeProjectsContent,
  type AboutContent,
  type EducationContent,
  type InitialSectionContent,
  type SkillsContent,
  type ContactContent,
  type ExperienceContent,
  type PersonalContent,
  type ProjectsContent,
} from '@/lib/content/schema';

async function fetchContent<T>(key: string): Promise<Partial<T> | null> {
  try {
    const snapshot = await getDoc(doc(db, 'content', key));
    if (!snapshot.exists()) return null;
    return snapshot.data() as Partial<T>;
  } catch (error) {
    console.error(`[content] Failed to load "${key}" from Firestore`, error);
    return null;
  }
}

export async function loadInitialContent(): Promise<InitialSectionContent> {
  const data = await fetchContent<InitialSectionContent>('initial');
  if (!data) return mergeInitialContent(defaultInitialContent);
  return mergeInitialContent(data);
}

export async function loadAboutContent(): Promise<AboutContent> {
  const data = await fetchContent<AboutContent>('about');
  if (!data) return mergeAboutContent(defaultAboutContent);
  return mergeAboutContent(data);
}

export async function loadEducationContent(): Promise<EducationContent> {
  const data = await fetchContent<EducationContent>('education');
  if (!data) return mergeEducationContent(defaultEducationContent);
  return mergeEducationContent(data);
}

export async function loadSkillsContent(): Promise<SkillsContent> {
  const data = await fetchContent<SkillsContent>('skills');
  if (!data) return mergeSkillsContent(defaultSkillsContent);
  return mergeSkillsContent(data);
}

export async function loadContactContent(): Promise<ContactContent> {
  const data = await fetchContent<ContactContent>('contact');
  if (!data) return mergeContactContent(defaultContactContent);
  return mergeContactContent(data);
}

export async function loadExperienceContent(): Promise<ExperienceContent> {
  const data = await fetchContent<ExperienceContent>('experience');
  if (!data) return mergeExperienceContent(defaultExperienceContent);
  return mergeExperienceContent(data);
}

export async function loadPersonalContent(): Promise<PersonalContent> {
  const data = await fetchContent<PersonalContent>('personal');
  if (!data) return mergePersonalContent(defaultPersonalContent);
  return mergePersonalContent(data);
}

export async function loadProjectsContent(): Promise<ProjectsContent> {
  const data = await fetchContent<ProjectsContent>('projects');
  if (!data) return mergeProjectsContent(defaultProjectsContent);
  return mergeProjectsContent(data);
}
