"use server";

import { adminDb } from "@/lib/firebase-admin";
import { translateWithGemini } from "@/lib/ai/translate";
import {
  type ProjectsContent,
  type ProjectItem,
  defaultProjectsContent,
  mergeProjectsContent,
} from "@/lib/content/schema";

const docRef = adminDb.collection("content").doc("projects");

export async function getProjectsContent(): Promise<ProjectsContent> {
  const snapshot = await docRef.get();
  if (!snapshot.exists) return defaultProjectsContent;
  const data = snapshot.data() as Partial<ProjectsContent>;
  return mergeProjectsContent(data);
}

export async function saveProjectsContent(payload: ProjectsContent) {
  await docRef.set(
    {
      ...payload,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

export async function autoTranslateProjects(base: {
  summary: string;
  projects: ProjectItem[];
}): Promise<ProjectsContent["translations"]> {
  const result = await translateWithGemini({
    summary: base.summary,
    projects: base.projects.map((p) => ({
      title: p.title,
      description: p.description,
      tags: p.tags,
    })),
  });

  const mapProjects = (arr?: any) => {
    if (!Array.isArray(arr)) return [];
    return arr.map((p: any) => ({
      title: p.title ?? "",
      description: p.description ?? "",
      tags: Array.isArray(p.tags) ? p.tags : [],
    }));
  };

  return {
    en: {
      summary: result.en?.summary ?? "",
      projects: mapProjects(result.en?.projects),
    },
    es: {
      summary: result.es?.summary ?? "",
      projects: mapProjects(result.es?.projects),
    },
    fr: {
      summary: result.fr?.summary ?? "",
      projects: mapProjects(result.fr?.projects),
    },
  };
}
