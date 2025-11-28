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

export interface ProjectItem {
  title: string;
  description: string;
  thumbnail: string;
  images: string[];
  tags: string[];
  demoUrl?: string;
  repoUrl?: string;
  featured: boolean;
}

export interface ProjectsTranslation {
  summary: string;
  projects: Pick<ProjectItem, "title" | "description" | "tags">[];
}

export interface ProjectsContent {
  summary: string;
  projects: ProjectItem[];
  translations: {
    en: ProjectsTranslation;
    es: ProjectsTranslation;
    fr: ProjectsTranslation;
  };
  updatedAt?: string;
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
  const padProject = (list?: ProjectsTranslation["projects"]) => {
    const arr = Array.isArray(list) ? [...list] : [];
    while (arr.length < baseProjects.length) {
      arr.push({ title: "", description: "", tags: [] });
    }
    return arr.slice(0, baseProjects.length).map((item, idx) => {
      const baseItem = baseProjects[idx];
      if (!baseItem) return { title: "", description: "", tags: [] };

      const tags = Array.isArray(item.tags) ? [...item.tags] : [];
      while (tags.length < baseItem.tags.length) tags.push("");

      return {
        title: item.title ?? "",
        description: item.description ?? "",
        tags: tags.slice(0, baseItem.tags.length),
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
  const merged: ProjectsContent = {
    ...defaultProjectsContent,
    ...data,
    projects: data?.projects ?? defaultProjectsContent.projects,
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
