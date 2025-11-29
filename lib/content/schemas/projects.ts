export interface ProjectImageTranslations {
  en?: string;
  es?: string;
  fr?: string;
}

export interface ProjectImage {
  id: string;
  url: string;
  description: string | undefined;
  translations?: ProjectImageTranslations;
}

export type ProjectStatus = "completed" | "in-progress" | "archived" | "concept";
export type ProjectType =
  | "web"
  | "mobile"
  | "desktop"
  | "api"
  | "library"
  | "saas"
  | "ecommerce"
  | "portfolio"
  | "other";

export interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  thumbnail: string;
  images: ProjectImage[];
  technologies: string[];
  tags: string[];
  demoUrl?: string;
  repoUrl?: string;
  caseStudyUrl?: string;
  featured: boolean;
  status: ProjectStatus;
  type: ProjectType;
  client?: string;
  startDate?: string;
  endDate?: string;
  highlights?: string[];
  metrics?: {
    label: string;
    value: string;
  }[];
  order: number;
}

export interface ProjectsContent {
  summary: string;
  projects: ProjectItem[];
  translations: {
    en: TranslatedProjects;
    es: TranslatedProjects;
    fr: TranslatedProjects;
    pt: TranslatedProjects;
  };
  updatedAt?: string;
}

export interface TranslatedProjects {
  summary: string;
  eyebrow: string;
  title: string;
  empty: string;
  viewLive: string;
  viewCode: string;
  technologiesLabel: string;
  highlightsLabel: string;
  clientLabel: string;
  periodLabel: string;
  noProjectSelected: string;
  selectProjectFromGallery: string;
  descriptionLabel: string;
  statusLabels: Record<ProjectStatus, string>;
  typeLabels: Record<ProjectType, string>;
  otherInfoLabel: string;
  noImageAvailable: string;
  viewDetailsText: string;
  projects: {
    id: string;
    title: string;
    shortDescription: string;
    description: string;
    tags: string[];
    highlights?: string[];
    metrics?: { label: string; value: string }[];
    images?: { description: string }[];
  }[];
}

export const defaultProjectsContent: ProjectsContent = {
  summary: "",
  projects: [],
  translations: {
    en: {
      summary: "",
      projects: [],
      eyebrow: "Portfolio",
      title: "Creative Projects",
      empty: "No projects listed at the moment. Check back soon!",
      viewLive: 'View live',
      viewCode: 'Source code',
      technologiesLabel: 'Technologies',
      highlightsLabel: 'Highlights',
      clientLabel: 'Client',
      periodLabel: 'Period',
      noProjectSelected: 'No project selected',
      selectProjectFromGallery: 'Select a project from the gallery',
      descriptionLabel: 'Project Description',
      statusLabels: {
        completed: 'Completed',
        'in-progress': 'In development',
        archived: 'Archived',
        concept: 'Concept',
      },
      typeLabels: {
        web: 'Web App',
        mobile: 'Mobile',
        desktop: 'Desktop',
        api: 'API',
        library: 'Library',
        saas: 'SaaS',
        ecommerce: 'E-commerce',
        portfolio: 'Portfolio',
        other: 'Other',
      },
      otherInfoLabel: 'Details',
      noImageAvailable: 'No image available',
      viewDetailsText: 'View details...',
    },
    es: {
      summary: "",
      projects: [],
      eyebrow: "Portafolio",
      title: "Proyectos Creativos",
      empty: "No hay proyectos listados por el momento. ¡Vuelve pronto!",
      viewLive: 'Ver en vivo',
      viewCode: 'Ver código',
      technologiesLabel: 'Tecnologías',
      highlightsLabel: 'Destacados',
      clientLabel: 'Cliente',
      periodLabel: 'Período',
      noProjectSelected: 'Ningún proyecto seleccionado',
      selectProjectFromGallery: 'Selecciona un proyecto de la galería',
      descriptionLabel: 'Descripción',
      statusLabels: {
        completed: 'Completado',
        'in-progress': 'En desarrollo',
        archived: 'Archivado',
        concept: 'Concepto',
      },
      typeLabels: {
        web: 'Web App',
        mobile: 'Móvil',
        desktop: 'Desktop',
        api: 'API',
        library: 'Biblioteca',
        saas: 'SaaS',
        ecommerce: 'E-commerce',
        portfolio: 'Portafolio',
        other: 'Otro',
      },
      otherInfoLabel: 'Información',
      noImageAvailable: 'No hay imagen disponible',
      viewDetailsText: 'Ver detalles...',
    },
    fr: {
      summary: "",
      projects: [],
      eyebrow: "Portfolio",
      title: "Projets créatifs",
      empty: "Aucun projet répertorié pour le moment. Revenez bientôt !",
      viewLive: 'Voir en ligne',
      viewCode: 'Code source',
      technologiesLabel: 'Technologies',
      highlightsLabel: 'Points forts',
      clientLabel: 'Client',
      periodLabel: 'Période',
      noProjectSelected: 'Aucun projet sélectionné',
      selectProjectFromGallery: 'Sélectionnez un projet dans la galerie',
      descriptionLabel: 'Description',
      statusLabels: {
        completed: 'Terminé',
        'in-progress': 'En développement',
        archived: 'Archivé',
        concept: 'Concept',
      },
      typeLabels: {
        web: 'App Web',
        mobile: 'Mobile',
        desktop: 'Desktop',
        api: 'API',
        library: 'Bibliothèque',
        saas: 'SaaS',
        ecommerce: 'E-commerce',
        portfolio: 'Portfolio',
        other: 'Autre',
      },
      otherInfoLabel: 'Détails',
      noImageAvailable: 'Aucune image disponible',
      viewDetailsText: 'Voir les détails...',
    },
    pt: {
      summary: "",
      projects: [],
      eyebrow: "Portfolio",
      title: "Projetos Criativos",
      empty: "Nenhum projeto cadastrado no momento. Volte em breve!",
      viewLive: 'Ver projeto',
      viewCode: 'Ver código',
      technologiesLabel: 'Tecnologias',
      highlightsLabel: 'Destaques',
      clientLabel: 'Cliente',
      periodLabel: 'Período',
      noProjectSelected: 'Nenhum projeto selecionado',
      selectProjectFromGallery: 'Selecione um projeto na galeria',
      descriptionLabel: 'Descrição do Projeto',
      statusLabels: {
        completed: 'Concluído',
        'in-progress': 'Em desenvolvimento',
        archived: 'Arquivado',
        concept: 'Conceito',
      },
      typeLabels: {
        web: 'Web App',
        mobile: 'Mobile',
        desktop: 'Desktop',
        api: 'API',
        library: 'Biblioteca',
        saas: 'SaaS',
        ecommerce: 'E-commerce',
        portfolio: 'Portfolio',
        other: 'Outro',
      },
      otherInfoLabel: 'Informações',
      noImageAvailable: 'Nenhuma imagem disponível',
      viewDetailsText: 'Ver detalhes...',
    },
  },
  updatedAt: undefined,
};

function padProjectsTranslations(
  base: ProjectsContent,
  translations: ProjectsContent["translations"]
) {
  const baseProjects = base.projects;

  const padProject = (list?: TranslatedProjects["projects"]) => {
    const arr = Array.isArray(list) ? [...list] : [];
    while (arr.length < baseProjects.length) {
      arr.push({
        id: "",
        title: "",
        shortDescription: "",
        description: "",
        tags: [],
        highlights: [],
        metrics: [],
        images: [],
      });
    }
    return arr.slice(0, baseProjects.length).map((item, idx) => {
      const baseItem = baseProjects[idx];
      if (!baseItem)
        return {
          id: item.id ?? "",
          title: item.title ?? "",
          shortDescription: item.shortDescription ?? "",
          description: item.description ?? "",
          tags: Array.isArray(item.tags) ? item.tags : [],
          highlights: Array.isArray(item.highlights) ? item.highlights : [],
          metrics: Array.isArray(item.metrics)
            ? item.metrics.map((m) => ({ label: m.label ?? "", value: m.value ?? "" }))
            : [],
          images: Array.isArray(item.images) ? item.images : [],
        };

      const tags = Array.isArray(item.tags) ? [...item.tags] : [];
      while (tags.length < baseItem.tags.length) tags.push("");

      const baseHighlights = Array.isArray(baseItem.highlights)
        ? baseItem.highlights
        : [];
      const highlights = Array.isArray(item.highlights) ? [...item.highlights] : [];
      while (highlights.length < baseHighlights.length) highlights.push("");

      const baseMetrics = Array.isArray(baseItem.metrics) ? baseItem.metrics : [];
      const metrics = Array.isArray(item.metrics)
        ? item.metrics.map((m) => ({
            label: m.label ?? "",
            value: m.value ?? "",
          }))
        : [];
      while (metrics.length < baseMetrics.length) metrics.push({ label: "", value: "" });

      const baseImages = Array.isArray(baseItem.images) ? baseItem.images : [];
      const images = Array.isArray(item.images) ? [...item.images] : [];
      while (images.length < baseImages.length) images.push({ description: "" });

      return {
        id: baseItem.id,
        title: item.title ?? "",
        tags: tags.slice(0, baseItem.tags.length),
        shortDescription: item.shortDescription ?? "",
        description: item.description ?? "",
        highlights: highlights.slice(0, baseHighlights.length),
        metrics: metrics.slice(0, baseMetrics.length),
        images: images.slice(0, baseImages.length).map((img) => ({
          description: (img as { description?: string })?.description ?? "",
        })),
      };
    });
  };

  return {
    en: {
      summary: translations.en.summary ?? "",
      eyebrow: translations.en.eyebrow ?? "",
      title: translations.en.title ?? "",
      empty: translations.en.empty ?? "",
      viewLive: translations.en.viewLive ?? "",
      viewCode: translations.en.viewCode ?? "",
      technologiesLabel: translations.en.technologiesLabel ?? "",
      highlightsLabel: translations.en.highlightsLabel ?? "",
      clientLabel: translations.en.clientLabel ?? "",
      periodLabel: translations.en.periodLabel ?? "",
      noProjectSelected: translations.en.noProjectSelected ?? "",
      selectProjectFromGallery: translations.en.selectProjectFromGallery ?? "",
      descriptionLabel: translations.en.descriptionLabel ?? "",
      statusLabels: translations.en.statusLabels ?? { completed: '', 'in-progress': '', archived: '', concept: '' },
      typeLabels: translations.en.typeLabels ?? { web: '', mobile: '', desktop: '', api: '', library: '', saas: '', ecommerce: '', portfolio: '', other: '' },
      otherInfoLabel: translations.en.otherInfoLabel ?? "",
      noImageAvailable: translations.en.noImageAvailable ?? "",
      viewDetailsText: translations.en.viewDetailsText ?? "",
      projects: padProject(translations.en.projects),
    },
    es: {
      summary: translations.es.summary ?? "",
      eyebrow: translations.es.eyebrow ?? "",
      title: translations.es.title ?? "",
      empty: translations.es.empty ?? "",
      viewLive: translations.es.viewLive ?? "",
      viewCode: translations.es.viewCode ?? "",
      technologiesLabel: translations.es.technologiesLabel ?? "",
      highlightsLabel: translations.es.highlightsLabel ?? "",
      clientLabel: translations.es.clientLabel ?? "",
      periodLabel: translations.es.periodLabel ?? "",
      noProjectSelected: translations.es.noProjectSelected ?? "",
      selectProjectFromGallery: translations.es.selectProjectFromGallery ?? "",
      descriptionLabel: translations.es.descriptionLabel ?? "",
      statusLabels: translations.es.statusLabels ?? { completed: '', 'in-progress': '', archived: '', concept: '' },
      typeLabels: translations.es.typeLabels ?? { web: '', mobile: '', desktop: '', api: '', library: '', saas: '', ecommerce: '', portfolio: '', other: '' },
      otherInfoLabel: translations.es.otherInfoLabel ?? "",
      noImageAvailable: translations.es.noImageAvailable ?? "",
      viewDetailsText: translations.es.viewDetailsText ?? "",
      projects: padProject(translations.es.projects),
    },
    fr: {
      summary: translations.fr.summary ?? "",
      eyebrow: translations.fr.eyebrow ?? "",
      title: translations.fr.title ?? "",
      empty: translations.fr.empty ?? "",
      viewLive: translations.fr.viewLive ?? "",
      viewCode: translations.fr.viewCode ?? "",
      technologiesLabel: translations.fr.technologiesLabel ?? "",
      highlightsLabel: translations.fr.highlightsLabel ?? "",
      clientLabel: translations.fr.clientLabel ?? "",
      periodLabel: translations.fr.periodLabel ?? "",
      noProjectSelected: translations.fr.noProjectSelected ?? "",
      selectProjectFromGallery: translations.fr.selectProjectFromGallery ?? "",
      descriptionLabel: translations.fr.descriptionLabel ?? "",
      statusLabels: translations.fr.statusLabels ?? { completed: '', 'in-progress': '', archived: '', concept: '' },
      typeLabels: translations.fr.typeLabels ?? { web: '', mobile: '', desktop: '', api: '', library: '', saas: '', ecommerce: '', portfolio: '', other: '' },
      otherInfoLabel: translations.fr.otherInfoLabel ?? "",
      noImageAvailable: translations.fr.noImageAvailable ?? "",
      viewDetailsText: translations.fr.viewDetailsText ?? "",
      projects: padProject(translations.fr.projects),
    },
    pt: {
      summary: translations.pt.summary ?? "",
      eyebrow: translations.pt.eyebrow ?? "",
      title: translations.pt.title ?? "",
      empty: translations.pt.empty ?? "",
      viewLive: translations.pt.viewLive ?? "",
      viewCode: translations.pt.viewCode ?? "",
      technologiesLabel: translations.pt.technologiesLabel ?? "",
      highlightsLabel: translations.pt.highlightsLabel ?? "",
      clientLabel: translations.pt.clientLabel ?? "",
      periodLabel: translations.pt.periodLabel ?? "",
      noProjectSelected: translations.pt.noProjectSelected ?? "",
      selectProjectFromGallery: translations.pt.selectProjectFromGallery ?? "",
      descriptionLabel: translations.pt.descriptionLabel ?? "",
      statusLabels: translations.pt.statusLabels ?? { completed: '', 'in-progress': '', archived: '', concept: '' },
      typeLabels: translations.pt.typeLabels ?? { web: '', mobile: '', desktop: '', api: '', library: '', saas: '', ecommerce: '', portfolio: '', other: '' },
      otherInfoLabel: translations.pt.otherInfoLabel ?? "",
      noImageAvailable: translations.pt.noImageAvailable ?? "",
      viewDetailsText: translations.pt.viewDetailsText ?? "",
      projects: padProject(translations.pt.projects),
    },
  };
}

export function mergeProjectsContent(
  data?: Partial<ProjectsContent>
): ProjectsContent {
  const normalizeImages = (projectId: string, list?: unknown, orderFallback = 0): ProjectImage[] => {
    if (!Array.isArray(list)) return [];

    return list
      .map((item, index): ProjectImage | null => {
        if (typeof item === "string") {
          return {
            id: generateProjectImageId(projectId, index),
            url: item,
            description: "",
            translations: {},
          };
        }

        const img = item as Partial<ProjectImage>;
        const url = img.url ?? "";
        if (!url) return null;

        return {
          id: img.id ?? generateProjectImageId(projectId, index || orderFallback),
          url,
          description: img.description ?? "",
          translations: img.translations ?? {},
        };
      })
      .filter((img): img is ProjectImage => !!img);
  };

  const normalizeProjects = (list?: Partial<ProjectItem>[]) => {
    if (!Array.isArray(list)) return defaultProjectsContent.projects;

    return list.map((item, index) => {
      const metrics = Array.isArray(item.metrics)
        ? item.metrics.map((m) => ({
            label: m.label ?? "",
            value: m.value ?? "",
          }))
        : [];

      const resolvedId = item.id ?? generateProjectId();

      return {
        id: resolvedId,
        title: item.title ?? "",
        slug:
          item.slug ??
          (item.title ? generateSlug(item.title) : ""),
        shortDescription: item.shortDescription ?? "",
        description: item.description ?? "",
        thumbnail: item.thumbnail ?? "",
        images: normalizeImages(resolvedId, item.images, index),
        technologies: Array.isArray(item.technologies)
          ? item.technologies
          : [],
        tags: Array.isArray(item.tags) ? item.tags : [],
        demoUrl: item.demoUrl ?? "",
        repoUrl: item.repoUrl ?? "",
        caseStudyUrl: item.caseStudyUrl ?? "",
        featured: item.featured ?? false,
        status: item.status ?? "in-progress",
        type: item.type ?? "web",
        client: item.client ?? "",
        startDate: item.startDate ?? "",
        endDate: item.endDate ?? "",
        highlights: Array.isArray(item.highlights) ? item.highlights : [],
        metrics,
        order: item.order ?? index,
      };
    });
  };

  const merged: ProjectsContent = {
    ...defaultProjectsContent,
    ...data,
    projects: normalizeProjects(data?.projects),
    translations: {
      en: {
        ...defaultProjectsContent.translations.en,
        ...(data?.translations?.en ?? {}),
      },
      es: {
        ...defaultProjectsContent.translations.es,
        ...(data?.translations?.es ?? {}),
      },
      fr: {
        ...defaultProjectsContent.translations.fr,
        ...(data?.translations?.fr ?? {}),
      },
      pt: {
        ...defaultProjectsContent.translations.pt,
        ...(data?.translations?.pt ?? {}),
      },
    },
  };

  merged.projects.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return {
    ...merged,
    translations: padProjectsTranslations(merged, merged.translations),
  };
}

export function generateProjectId(): string {
  return `proj_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function generateProjectImageId(projectId?: string, index?: number): string {
  const suffix = index !== undefined ? `_${index}` : "";
  return `img_${projectId ?? Date.now().toString(36)}${suffix}_${Math.random().toString(36).slice(2, 6)}`;
}
