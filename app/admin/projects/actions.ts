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
  const sanitized = {
    ...payload,
    projects: payload.projects.map((p, index) => ({
      ...p,
      order: p.order ?? index,
      technologies: p.technologies ?? [],
      images: p.images ?? [],
      tags: p.tags ?? [],
      highlights: p.highlights ?? [],
      metrics: p.metrics ?? [],
    })),
    updatedAt: new Date().toISOString(),
  };

  await docRef.set(sanitized, { merge: true });
}

export async function autoTranslateProjects(base: {
  summary: string;
  projects: ProjectItem[];
}): Promise<ProjectsContent["translations"]> {
  const result = await translateWithGemini({
    summary: base.summary,
    projects: base.projects.map((p) => ({
      title: p.title,
      shortDescription: p.shortDescription,
      description: p.description,
      tags: p.tags,
      highlights: p.highlights,
      metrics: p.metrics,
    })),
  });

  const mapProjects = (arr?: unknown) => {
    if (!Array.isArray(arr)) return [];
    return arr.map((p: Record<string, unknown>) => ({
      title: (p.title as string) ?? "",
      shortDescription: (p.shortDescription as string) ?? "",
      description: (p.description as string) ?? "",
      tags: Array.isArray(p.tags) ? p.tags : [],
      highlights: Array.isArray(p.highlights) ? p.highlights : [],
      metrics: Array.isArray(p.metrics) ? p.metrics : [],
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

export async function deleteProject(projectId: string) {
  const current = await getProjectsContent();
  const filtered = current.projects.filter((p) => p.id !== projectId);
  await saveProjectsContent({ ...current, projects: filtered });
}

export async function reorderProjects(projectIds: string[]) {
  const current = await getProjectsContent();
  const reordered = projectIds
    .map((id, index) => {
      const project = current.projects.find((p) => p.id === id);
      return project ? { ...project, order: index } : null;
    })
    .filter((p): p is ProjectItem => p !== null);

  await saveProjectsContent({ ...current, projects: reordered });
}
