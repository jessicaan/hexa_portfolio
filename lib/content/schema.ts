export type LanguageCode = "pt" | "en" | "es" | "fr";

export interface InitialTranslation {
  headline: string;
  subheadline: string;
  description: string;
}

export interface InitialSectionContent {
  headline: string;
  subheadline: string;
  description: string;
  heroVideoUrl: string;
  languagesAvailable: LanguageCode[];
  backgroundConfig: {
    gradientFrom?: string;
    gradientTo?: string;
    glowColor?: string;
    noiseOpacity?: number;
    blur?: number;
  };
  translations: {
    en: InitialTranslation;
    es: InitialTranslation;
    fr: InitialTranslation;
  };
  updatedAt?: string;
}

export interface SoftSkill {
  name: string;
  description: string;
}

export interface AboutTranslation {
  summary: string;
  longDescription: string;
  softSkills: { description: string }[];
  highlights: string[];
  videoPitchUrl?: string;
}

export interface AboutContent {
  title: string;
  summary: string;
  longDescription: string;
  videoPitchUrl: string;
  profileImage: string;
  softSkills: SoftSkill[];
  highlights: string[];
  translations: {
    en: AboutTranslation;
    es: AboutTranslation;
    fr: AboutTranslation;
  };
  updatedAt?: string;
}

export interface EducationItem {
  institution: string;
  course: string;
  period: string;
  description: string;
  highlights: string[];
}

export interface EducationTranslation {
  summary: string;
  education: EducationItem[];
}

export interface EducationContent {
  summary: string;
  education: EducationItem[];
  translations: {
    en: EducationTranslation;
    es: EducationTranslation;
    fr: EducationTranslation;
  };
  updatedAt?: string;
}

export const defaultInitialContent: InitialSectionContent = {
  headline: "",
  subheadline: "",
  description: "",
  heroVideoUrl: "",
  languagesAvailable: ["pt", "en", "es", "fr"],
  backgroundConfig: {
    gradientFrom: "hsl(var(--primary))",
    gradientTo: "hsl(var(--secondary))",
    glowColor: "hsl(var(--glow))",
    noiseOpacity: 0.08,
    blur: 12,
  },
  translations: {
    en: { headline: "", subheadline: "", description: "" },
    es: { headline: "", subheadline: "", description: "" },
    fr: { headline: "", subheadline: "", description: "" },
  },
  updatedAt: undefined,
};

export function mergeInitialContent(
  data?: Partial<InitialSectionContent>
): InitialSectionContent {
  const content = data ?? {};

  return {
    ...defaultInitialContent,
    ...content,
    backgroundConfig: {
      ...defaultInitialContent.backgroundConfig,
      ...(content.backgroundConfig ?? {}),
    },
    translations: {
      en: {
        ...defaultInitialContent.translations.en,
        ...(content.translations?.en ?? {}),
      },
      es: {
        ...defaultInitialContent.translations.es,
        ...(content.translations?.es ?? {}),
      },
      fr: {
        ...defaultInitialContent.translations.fr,
        ...(content.translations?.fr ?? {}),
      },
    },
  };
}

export const defaultAboutContent: AboutContent = {
  title: "",
  summary: "",
  longDescription: "",
  videoPitchUrl: "",
  profileImage: "",
  softSkills: [],
  highlights: [],
  translations: {
    en: { summary: "", longDescription: "", softSkills: [], highlights: [], videoPitchUrl: "" },
    es: { summary: "", longDescription: "", softSkills: [], highlights: [], videoPitchUrl: "" },
    fr: { summary: "", longDescription: "", softSkills: [], highlights: [], videoPitchUrl: "" },
  },
  updatedAt: undefined,
};

function padAboutTranslations(content: AboutContent): AboutContent {
  const softCount = content.softSkills.length;
  const highCount = content.highlights.length;

  const ensureSoftSkills = (list?: { description: string }[]) => {
    const arr = Array.isArray(list) ? [...list] : [];
    while (arr.length < softCount) arr.push({ description: "" });
    return arr.slice(0, softCount);
  };

  const ensureHighlights = (list?: string[]) => {
    const arr = Array.isArray(list) ? [...list] : [];
    while (arr.length < highCount) arr.push("");
    return arr.slice(0, highCount);
  };

  return {
    ...content,
    translations: {
      en: {
        summary: content.translations.en.summary ?? "",
        longDescription: content.translations.en.longDescription ?? "",
        softSkills: ensureSoftSkills(content.translations.en.softSkills),
        highlights: ensureHighlights(content.translations.en.highlights),
        videoPitchUrl: content.translations.en.videoPitchUrl ?? "",
      },
      es: {
        summary: content.translations.es.summary ?? "",
        longDescription: content.translations.es.longDescription ?? "",
        softSkills: ensureSoftSkills(content.translations.es.softSkills),
        highlights: ensureHighlights(content.translations.es.highlights),
        videoPitchUrl: content.translations.es.videoPitchUrl ?? "",
      },
      fr: {
        summary: content.translations.fr.summary ?? "",
        longDescription: content.translations.fr.longDescription ?? "",
        softSkills: ensureSoftSkills(content.translations.fr.softSkills),
        highlights: ensureHighlights(content.translations.fr.highlights),
        videoPitchUrl: content.translations.fr.videoPitchUrl ?? "",
      },
    },
  };
}

export function mergeAboutContent(data?: Partial<AboutContent>): AboutContent {
  const merged: AboutContent = {
    ...defaultAboutContent,
    ...data,
    softSkills: data?.softSkills ?? defaultAboutContent.softSkills,
    highlights: data?.highlights ?? defaultAboutContent.highlights,
    translations: {
      en: {
        ...defaultAboutContent.translations.en,
        ...(data?.translations?.en ?? {}),
      },
      es: {
        ...defaultAboutContent.translations.es,
        ...(data?.translations?.es ?? {}),
      },
      fr: {
        ...defaultAboutContent.translations.fr,
        ...(data?.translations?.fr ?? {}),
      },
    },
  };

  return padAboutTranslations(merged);
}

export const defaultEducationContent: EducationContent = {
  summary: "",
  education: [
    {
      institution: "",
      course: "",
      period: "",
      description: "",
      highlights: [""],
    },
  ],
  translations: {
    en: { summary: "", education: [] },
    es: { summary: "", education: [] },
    fr: { summary: "", education: [] },
  },
  updatedAt: undefined,
};

function padEducationTranslations(
  base: EducationContent,
  translations: EducationContent["translations"]
) {
  const baseEdu = base.education;
  const padEdu = (list?: EducationItem[]) => {
    const arr = Array.isArray(list) ? [...list] : [];
    while (arr.length < baseEdu.length) {
      arr.push({
        institution: "",
        course: "",
        period: "",
        description: "",
        highlights: [],
      });
    }
    return arr.slice(0, baseEdu.length).map((item, idx) => {
      const baseHighlights = baseEdu[idx]?.highlights ?? [];
      const highlights = Array.isArray(item.highlights) ? [...item.highlights] : [];
      while (highlights.length < baseHighlights.length) highlights.push("");
      return {
        institution: item.institution ?? "",
        course: item.course ?? "",
        period: item.period ?? "",
        description: item.description ?? "",
        highlights: highlights.slice(0, baseHighlights.length),
      };
    });
  };

  return {
    en: {
      summary: translations.en.summary ?? "",
      education: padEdu(translations.en.education),
    },
    es: {
      summary: translations.es.summary ?? "",
      education: padEdu(translations.es.education),
    },
    fr: {
      summary: translations.fr.summary ?? "",
      education: padEdu(translations.fr.education),
    },
  };
}

export function mergeEducationContent(
  data?: Partial<EducationContent>
): EducationContent {
  const merged: EducationContent = {
    ...defaultEducationContent,
    ...data,
    education: data?.education ?? defaultEducationContent.education,
    translations: {
      en: {
        ...defaultEducationContent.translations.en,
        ...(data?.translations?.en ?? {}),
      },
      es: {
        ...defaultEducationContent.translations.es,
        ...(data?.translations?.es ?? {}),
      },
      fr: {
        ...defaultEducationContent.translations.fr,
        ...(data?.translations?.fr ?? {}),
      },
    },
  };

  return {
    ...merged,
    translations: padEducationTranslations(merged, merged.translations),
  };
}

export interface ContactTranslation {
  headline: string;
  description: string;
  availability: string;
}

export interface ContactContent {
  headline: string;
  description: string;
  availability: string;
  email: string;
  phone?: string;
  location?: string;
  preferredContact: string[];
  translations: {
    en: ContactTranslation;
    es: ContactTranslation;
    fr: ContactTranslation;
  };
  updatedAt?: string;
}

export const defaultContactContent: ContactContent = {
  headline: "",
  description: "",
  availability: "",
  email: "",
  phone: "",
  location: "",
  preferredContact: [],
  translations: {
    en: { headline: "", description: "", availability: "" },
    es: { headline: "", description: "", availability: "" },
    fr: { headline: "", description: "", availability: "" },
  },
  updatedAt: undefined,
};

export function mergeContactContent(data?: Partial<ContactContent>): ContactContent {
  const normalize = (value?: Partial<ContactTranslation>): ContactTranslation => ({
    headline: value?.headline ?? "",
    description: value?.description ?? "",
    availability: value?.availability ?? "",
  });

  return {
    ...defaultContactContent,
    ...data,
    phone: data?.phone ?? defaultContactContent.phone,
    location: data?.location ?? defaultContactContent.location,
    preferredContact: Array.isArray(data?.preferredContact)
      ? data.preferredContact
      : defaultContactContent.preferredContact,
    translations: {
      en: normalize(data?.translations?.en),
      es: normalize(data?.translations?.es),
      fr: normalize(data?.translations?.fr),
    },
  };
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  contractType: string;
  location: string;
  description: string;
  achievements: string[];
  technologies: string[];
  logo?: string;
}

export interface ExperienceTranslation {
  summary: string;
  experiences: ExperienceItem[];
}

export interface ExperienceContent {
  summary: string;
  experiences: ExperienceItem[];
  translations: {
    en: ExperienceTranslation;
    es: ExperienceTranslation;
    fr: ExperienceTranslation;
  };
  updatedAt?: string;
}

export const defaultExperienceContent: ExperienceContent = {
  summary: "",
  experiences: [],
  translations: {
    en: { summary: "", experiences: [] },
    es: { summary: "", experiences: [] },
    fr: { summary: "", experiences: [] },
  },
  updatedAt: undefined,
};

function padExperienceTranslations(
  base: ExperienceContent,
  translations: ExperienceContent["translations"]
) {
  const baseExp = base.experiences;
  const padExp = (list?: ExperienceItem[]) => {
    const arr = Array.isArray(list) ? [...list] : [];
    while (arr.length < baseExp.length) {
      arr.push({
        company: "",
        role: "",
        period: "",
        contractType: "",
        location: "",
        description: "",
        achievements: [],
        technologies: [],
      });
    }
    return arr.slice(0, baseExp.length).map((item, idx) => {
      const baseItem = baseExp[idx];
      if (!baseItem)
        return {
          company: "",
          role: "",
          period: "",
          contractType: "",
          location: "",
          description: "",
          achievements: [],
          technologies: [],
        };

      const achievements = Array.isArray(item.achievements)
        ? [...item.achievements]
        : [];
      while (achievements.length < baseItem.achievements.length)
        achievements.push("");

      const technologies = Array.isArray(item.technologies)
        ? [...item.technologies]
        : [];
      while (technologies.length < baseItem.technologies.length)
        technologies.push("");

      return {
        company: item.company ?? "",
        role: item.role ?? "",
        period: item.period ?? "",
        contractType: item.contractType ?? "",
        location: item.location ?? "",
        description: item.description ?? "",
        achievements: achievements.slice(0, baseItem.achievements.length),
        technologies: technologies.slice(0, baseItem.technologies.length),
      };
    });
  };

  return {
    en: {
      summary: translations.en.summary ?? "",
      experiences: padExp(translations.en.experiences),
    },
    es: {
      summary: translations.es.summary ?? "",
      experiences: padExp(translations.es.experiences),
    },
    fr: {
      summary: translations.fr.summary ?? "",
      experiences: padExp(translations.fr.experiences),
    },
  };
}

export function mergeExperienceContent(
  data?: Partial<ExperienceContent>
): ExperienceContent {
  const normalizeExperiences = (list?: ExperienceItem[]) => {
    if (!Array.isArray(list)) return defaultExperienceContent.experiences;
    return list.map((item) => ({
      company: item.company ?? "",
      role: item.role ?? "",
      period: item.period ?? "",
      contractType: item.contractType ?? "",
      location: item.location ?? "",
      description: item.description ?? "",
      achievements: Array.isArray(item.achievements) ? item.achievements : [],
      technologies: Array.isArray(item.technologies) ? item.technologies : [],
      logo: item.logo ?? "",
    }));
  };

  const merged: ExperienceContent = {
    ...defaultExperienceContent,
    ...data,
    experiences: normalizeExperiences(
      data?.experiences ?? defaultExperienceContent.experiences
    ),
    translations: {
      en: {
        ...defaultExperienceContent.translations.en,
        ...(data?.translations?.en ?? {}),
      },
      es: {
        ...defaultExperienceContent.translations.es,
        ...(data?.translations?.es ?? {}),
      },
      fr: {
        ...defaultExperienceContent.translations.fr,
        ...(data?.translations?.fr ?? {}),
      },
    },
  };

  return {
    ...merged,
    translations: padExperienceTranslations(merged, merged.translations),
  };
}

export interface PersonalTranslation {
  bio: string;
  hobbies: string[];
  values: string[];
}

export interface PersonalContent {
  bio: string;
  hobbies: string[];
  values: string[];
  photos: string[];
  socialLinks: { platform: string; url: string }[];
  translations: {
    en: PersonalTranslation;
    es: PersonalTranslation;
    fr: PersonalTranslation;
  };
  updatedAt?: string;
}

export const defaultPersonalContent: PersonalContent = {
  bio: "",
  hobbies: [],
  values: [],
  photos: [],
  socialLinks: [],
  translations: {
    en: { bio: "", hobbies: [], values: [] },
    es: { bio: "", hobbies: [], values: [] },
    fr: { bio: "", hobbies: [], values: [] },
  },
  updatedAt: undefined,
};

function padPersonalTranslations(
  base: PersonalContent,
  translations: PersonalContent["translations"]
) {
  const padArray = (arr: string[] | undefined, count: number) => {
    const list = Array.isArray(arr) ? [...arr] : [];
    while (list.length < count) list.push("");
    return list.slice(0, count);
  };

  return {
    en: {
      bio: translations.en.bio ?? "",
      hobbies: padArray(translations.en.hobbies, base.hobbies.length),
      values: padArray(translations.en.values, base.values.length),
    },
    es: {
      bio: translations.es.bio ?? "",
      hobbies: padArray(translations.es.hobbies, base.hobbies.length),
      values: padArray(translations.es.values, base.values.length),
    },
    fr: {
      bio: translations.fr.bio ?? "",
      hobbies: padArray(translations.fr.hobbies, base.hobbies.length),
      values: padArray(translations.fr.values, base.values.length),
    },
  };
}

export function mergePersonalContent(
  data?: Partial<PersonalContent>
): PersonalContent {
  const merged: PersonalContent = {
    ...defaultPersonalContent,
    ...data,
    hobbies: data?.hobbies ?? defaultPersonalContent.hobbies,
    values: data?.values ?? defaultPersonalContent.values,
    photos: data?.photos ?? defaultPersonalContent.photos,
    socialLinks: data?.socialLinks ?? defaultPersonalContent.socialLinks,
    translations: {
      en: {
        ...defaultPersonalContent.translations.en,
        ...(data?.translations?.en ?? {}),
      },
      es: {
        ...defaultPersonalContent.translations.es,
        ...(data?.translations?.es ?? {}),
      },
      fr: {
        ...defaultPersonalContent.translations.fr,
        ...(data?.translations?.fr ?? {}),
      },
    },
  };

  return {
    ...merged,
    translations: padPersonalTranslations(merged, merged.translations),
  };
}

export interface ProjectImageTranslations {
  en?: string;
  es?: string;
  fr?: string;
}

export interface ProjectImage {
  id: string;
  url: string;
  description?: string;
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
  };
  updatedAt?: string;
}

export interface TranslatedProjects {
  summary: string;
  projects: {
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
    en: { summary: "", projects: [] },
    es: { summary: "", projects: [] },
    fr: { summary: "", projects: [] },
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
      projects: padProject(translations.en.projects),
    },
    es: {
      summary: translations.es.summary ?? "",
      projects: padProject(translations.es.projects),
    },
    fr: {
      summary: translations.fr.summary ?? "",
      projects: padProject(translations.fr.projects),
    },
  };
}

export function mergeProjectsContent(
  data?: Partial<ProjectsContent>
): ProjectsContent {
  const normalizeImages = (projectId: string, list?: unknown, orderFallback = 0): ProjectImage[] => {
    if (!Array.isArray(list)) return [];

    return list
      .map((item, index) => {
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
    },
  };

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

export interface Skill {
  name: string;
  level: number;
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
}

export interface SkillsTranslation {
  summary: string;
  categories: {
    name: string;
    skills: { name: string }[];
  }[];
}

export interface SkillsContent {
  summary: string;
  categories: SkillCategory[];
  translations: {
    en: SkillsTranslation;
    es: SkillsTranslation;
    fr: SkillsTranslation;
  };
  updatedAt?: string;
}

export const defaultSkillsContent: SkillsContent = {
  summary: "",
  categories: [],
  translations: {
    en: { summary: "", categories: [] },
    es: { summary: "", categories: [] },
    fr: { summary: "", categories: [] },
  },
  updatedAt: undefined,
};

function padSkillsTranslations(
  base: SkillsContent,
  translations: SkillsContent["translations"]
) {
  const baseCats = base.categories;
  const padCat = (list?: SkillsTranslation["categories"]) => {
    const arr = Array.isArray(list) ? [...list] : [];
    while (arr.length < baseCats.length) {
      arr.push({ name: "", skills: [] });
    }
    return arr.slice(0, baseCats.length).map((item, idx) => {
      const baseItem = baseCats[idx];
      if (!baseItem) return { name: "", skills: [] };

      const skills = Array.isArray(item.skills) ? [...item.skills] : [];
      while (skills.length < baseItem.skills.length) {
        skills.push({ name: "" });
      }

      return {
        name: item.name ?? "",
        skills: skills.slice(0, baseItem.skills.length),
      };
    });
  };

  return {
    en: {
      summary: translations.en.summary ?? "",
      categories: padCat(translations.en.categories),
    },
    es: {
      summary: translations.es.summary ?? "",
      categories: padCat(translations.es.categories),
    },
    fr: {
      summary: translations.fr.summary ?? "",
      categories: padCat(translations.fr.categories),
    },
  };
}

export function mergeSkillsContent(
  data?: Partial<SkillsContent>
): SkillsContent {
  const merged: SkillsContent = {
    ...defaultSkillsContent,
    ...data,
    categories: data?.categories ?? defaultSkillsContent.categories,
    translations: {
      en: {
        ...defaultSkillsContent.translations.en,
        ...(data?.translations?.en ?? {}),
      },
      es: {
        ...defaultSkillsContent.translations.es,
        ...(data?.translations?.es ?? {}),
      },
      fr: {
        ...defaultSkillsContent.translations.fr,
        ...(data?.translations?.fr ?? {}),
      },
    },
  };

  return {
    ...merged,
    translations: padSkillsTranslations(merged, merged.translations),
  };
}
