export type LanguageCode = "pt" | "en" | "es" | "fr";

export interface InitialTranslation {
  headline: string;
  subheadline: string;
  description: string;
  greeting: string;
  tip: string;
  explore: string;
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
    pt: InitialTranslation;
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
  heading: string;
  myStory: string;
  highlightsText: string;
  videoPitch: string;
  videoPlaceholderTitle: string;
  videoPlaceholderDescription: string;
  skillsText: string;
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
    pt: AboutTranslation;
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
  eyebrow: string;
  title: string;
  description: string;
  listLabel: string;
  highlightsLabel: string;
}

export interface EducationContent {
  summary: string;
  education: EducationItem[];
  translations: {
    en: EducationTranslation;
    es: EducationTranslation;
    fr: EducationTranslation;
    pt: EducationTranslation;
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
    en: {
      headline: "",
      subheadline: "",
      description: "",
      greeting: "Hello,",
      tip: "Click the node lines to see the magic happening",
      explore: "EXPLORE",
    },
    es: {
      headline: "",
      subheadline: "",
      description: "",
      greeting: "Hola,",
      tip: "Haz clic en las lineas del nodo para ver la magia",
      explore: "EXPLORAR",
    },
    fr: {
      headline: "",
      subheadline: "",
      description: "",
      greeting: "Bonjour,",
      tip: "Cliquez sur les lignes du noeud pour voir la magie",
      explore: "EXPLORER",
    },
    pt: {
      headline: "",
      subheadline: "",
      description: "",
      greeting: "Ola,",
      tip: "Clique nas linhas do no para ver a magica acontecer",
      explore: "EXPLORAR",
    },
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
      pt: {
        ...defaultInitialContent.translations.pt,
        ...(content.translations?.pt ?? {}),
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
    en: {
      summary: "",
      longDescription: "",
      softSkills: [],
      highlights: [],
      videoPitchUrl: "",
      heading: "About",
      myStory: "My Story",
      highlightsText: "Highlights",
      videoPitch: "Video Pitch",
      videoPlaceholderTitle: "No video available",
      videoPlaceholderDescription: "A personal video pitch will be added here soon.",
      skillsText: "Skills",
    },
    es: {
      summary: "",
      longDescription: "",
      softSkills: [],
      highlights: [],
      videoPitchUrl: "",
      heading: "Sobre Mí",
      myStory: "Mi Historia",
      highlightsText: "Puntos Destacados",
      videoPitch: "Video de Presentación",
      videoPlaceholderTitle: "Video no disponible",
      videoPlaceholderDescription: "Pronto se agregará un video de presentación personal.",
      skillsText: "Habilidades",
    },
    fr: {
      summary: "",
      longDescription: "",
      softSkills: [],
      highlights: [],
      videoPitchUrl: "",
      heading: "À Propos",
      myStory: "Mon Histoire",
      highlightsText: "Faits Saillants",
      videoPitch: "Présentation Vidéo",
      videoPlaceholderTitle: "Aucune vidéo disponible",
      videoPlaceholderDescription: "Une présentation vidéo personnelle sera ajoutée ici bientôt.",
      skillsText: "Compétences",
    },
    pt: {
      summary: "",
      longDescription: "",
      softSkills: [],
      highlights: [],
      videoPitchUrl: "",
      heading: "Sobre Mim",
      myStory: "Minha História",
      highlightsText: "Destaques",
      videoPitch: "Video de Apresentação",
      videoPlaceholderTitle: "Nenhum vídeo disponível",
      videoPlaceholderDescription: "Um vídeo de apresentação pessoal será adicionado aqui em breve.",
      skillsText: "Habilidades",
    },
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
        heading: content.translations.en.heading ?? "",
        myStory: content.translations.en.myStory ?? "",
        highlightsText: content.translations.en.highlightsText ?? "",
        videoPitch: content.translations.en.videoPitch ?? "",
        videoPlaceholderTitle: content.translations.en.videoPlaceholderTitle ?? "",
        videoPlaceholderDescription: content.translations.en.videoPlaceholderDescription ?? "",
        skillsText: content.translations.en.skillsText ?? "",
      },
      es: {
        summary: content.translations.es.summary ?? "",
        longDescription: content.translations.es.longDescription ?? "",
        softSkills: ensureSoftSkills(content.translations.es.softSkills),
        highlights: ensureHighlights(content.translations.es.highlights),
        videoPitchUrl: content.translations.es.videoPitchUrl ?? "",
        heading: content.translations.es.heading ?? "",
        myStory: content.translations.es.myStory ?? "",
        highlightsText: content.translations.es.highlightsText ?? "",
        videoPitch: content.translations.es.videoPitch ?? "",
        videoPlaceholderTitle: content.translations.es.videoPlaceholderTitle ?? "",
        videoPlaceholderDescription: content.translations.es.videoPlaceholderDescription ?? "",
        skillsText: content.translations.es.skillsText ?? "",
      },
      fr: {
        summary: content.translations.fr.summary ?? "",
        longDescription: content.translations.fr.longDescription ?? "",
        softSkills: ensureSoftSkills(content.translations.fr.softSkills),
        highlights: ensureHighlights(content.translations.fr.highlights),
        videoPitchUrl: content.translations.fr.videoPitchUrl ?? "",
        heading: content.translations.fr.heading ?? "",
        myStory: content.translations.fr.myStory ?? "",
        highlightsText: content.translations.fr.highlightsText ?? "",
        videoPitch: content.translations.fr.videoPitch ?? "",
        videoPlaceholderTitle: content.translations.fr.videoPlaceholderTitle ?? "",
        videoPlaceholderDescription: content.translations.fr.videoPlaceholderDescription ?? "",
        skillsText: content.translations.fr.skillsText ?? "",
      },
      pt: {
        summary: content.translations.pt.summary ?? "",
        longDescription: content.translations.pt.longDescription ?? "",
        softSkills: ensureSoftSkills(content.translations.pt.softSkills),
        highlights: ensureHighlights(content.translations.pt.highlights),
        videoPitchUrl: content.translations.pt.videoPitchUrl ?? "",
        heading: content.translations.pt.heading ?? "",
        myStory: content.translations.pt.myStory ?? "",
        highlightsText: content.translations.pt.highlightsText ?? "",
        videoPitch: content.translations.pt.videoPitch ?? "",
        videoPlaceholderTitle: content.translations.pt.videoPlaceholderTitle ?? "",
        videoPlaceholderDescription: content.translations.pt.videoPlaceholderDescription ?? "",
        skillsText: content.translations.pt.skillsText ?? "",
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
      pt: {
        ...defaultAboutContent.translations.pt,
        ...(data?.translations?.pt ?? {}),
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
    en: {
      summary: "",
      education: [],
      eyebrow: 'Education & Courses',
      title: 'Where I learned and keep learning',
      description: 'A snapshot of my education and courses that shape how I think about digital products.',
      listLabel: 'Education and learning path',
      highlightsLabel: 'What stood out',
    },
    es: {
      summary: "",
      education: [],
      eyebrow: 'Educacion y cursos',
      title: 'Donde aprendi y sigo aprendiendo',
      description: 'Un recorte de mi formacion y de los cursos que influyen en como pienso productos digitales.',
      listLabel: 'Formacion y ruta de aprendizaje',
      highlightsLabel: 'Lo que destaco',
    },
    fr: {
      summary: "",
      education: [],
      eyebrow: 'Education & cours',
      title: 'Ou jai appris et ou j apprends encore',
      description: 'Un apercu de ma formation et des cours qui influencent ma maniere de penser les produits numeriques.',
      listLabel: 'Parcours et etudes',
      highlightsLabel: 'Points forts',
    },
    pt: {
      summary: "",
      education: [],
      eyebrow: 'Educacao & Cursos',
      title: 'Onde aprendi e continuo aprendendo',
      description: 'Um recorte da minha formacao e dos cursos que ajudam a construir minha forma de pensar produtos digitais.',
      listLabel: 'Formacao e trilha',
      highlightsLabel: 'O que marcou esse periodo',
    },
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
      eyebrow: translations.en.eyebrow ?? "",
      title: translations.en.title ?? "",
      description: translations.en.description ?? "",
      listLabel: translations.en.listLabel ?? "",
      highlightsLabel: translations.en.highlightsLabel ?? "",
    },
    es: {
      summary: translations.es.summary ?? "",
      education: padEdu(translations.es.education),
      eyebrow: translations.es.eyebrow ?? "",
      title: translations.es.title ?? "",
      description: translations.es.description ?? "",
      listLabel: translations.es.listLabel ?? "",
      highlightsLabel: translations.es.highlightsLabel ?? "",
    },
    fr: {
      summary: translations.fr.summary ?? "",
      education: padEdu(translations.fr.education),
      eyebrow: translations.fr.eyebrow ?? "",
      title: translations.fr.title ?? "",
      description: translations.fr.description ?? "",
      listLabel: translations.fr.listLabel ?? "",
      highlightsLabel: translations.fr.highlightsLabel ?? "",
    },
    pt: {
      summary: translations.pt.summary ?? "",
      education: padEdu(translations.pt.education),
      eyebrow: translations.pt.eyebrow ?? "",
      title: translations.pt.title ?? "",
      description: translations.pt.description ?? "",
      listLabel: translations.pt.listLabel ?? "",
      highlightsLabel: translations.pt.highlightsLabel ?? "",
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
      pt: {
        ...defaultEducationContent.translations.pt,
        ...(data?.translations?.pt ?? {}),
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
  emailLabel: string;
  socialLabel: string;
  openText: string;
}

export interface ContactContent {
  headline: string;
  description: string;
  availability: string;
  email: string;
  phone?: string;
  location?: string;
  preferredContact: string[];
  socialLinks: { platform: string; url: string; label: string; handle: string }[];
  translations: {
    en: ContactTranslation;
    es: ContactTranslation;
    fr: ContactTranslation;
    pt: ContactTranslation;
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
  socialLinks: [],
  translations: {
    en: { headline: "", description: "", availability: "", emailLabel: "Primary email", socialLabel: "Other places you can find me", openText: "OPEN" },
    es: { headline: "", description: "", availability: "", emailLabel: "Email principal", socialLabel: "Otros lugares donde puedes encontrarme", openText: "ABRIR" },
    fr: { headline: "", description: "", availability: "", emailLabel: "Email principal", socialLabel: "Autres endroits où me trouver", openText: "OUVRIR" },
    pt: { headline: "", description: "", availability: "", emailLabel: "E-mail principal", socialLabel: "Outros lugares onde você pode me encontrar", openText: "ABRIR" },
  },
  updatedAt: undefined,
};

export function mergeContactContent(data?: Partial<ContactContent>): ContactContent {
  const normalize = (value?: Partial<ContactTranslation>): ContactTranslation => ({
    headline: value?.headline ?? "",
    description: value?.description ?? "",
    availability: value?.availability ?? "",
    emailLabel: value?.emailLabel ?? "",
    socialLabel: value?.socialLabel ?? "",
    openText: value?.openText ?? "",
  });

  return {
    ...defaultContactContent,
    ...data,
    phone: data?.phone ?? defaultContactContent.phone,
    location: data?.location ?? defaultContactContent.location,
    preferredContact: Array.isArray(data?.preferredContact)
      ? data.preferredContact
      : defaultContactContent.preferredContact,
    socialLinks: Array.isArray(data?.socialLinks)
      ? data.socialLinks
      : defaultContactContent.socialLinks,
    translations: {
      en: normalize(data?.translations?.en),
      es: normalize(data?.translations?.es),
      fr: normalize(data?.translations?.fr),
      pt: normalize(data?.translations?.pt),
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
  eyebrow: string;
  title: string;
  tabs: Record<ExperienceTab, string>;
  detailHeading: string;
  highlightsHeading: string;
  stackHeading: string;
}

export type ExperienceTab = 'freelancer' | 'clt' | 'pj' | 'others';

export interface ExperienceContent {
  summary: string;
  experiences: ExperienceItem[];
  translations: {
    en: ExperienceTranslation;
    es: ExperienceTranslation;
    fr: ExperienceTranslation;
    pt: ExperienceTranslation;
  };
  updatedAt?: string;
}

export const defaultExperienceContent: ExperienceContent = {
  summary: "",
  experiences: [],
  translations: {
    en: {
      summary: "",
      experiences: [],
      eyebrow: 'Professional Experience',
      title: 'My Journey',
      tabs: {
        freelancer: 'Freelancer',
        pj: 'PJ',
        clt: 'CLT',
        others: 'Others',
      },
      detailHeading: 'Details',
      highlightsHeading: 'Highlights',
      stackHeading: 'Technologies',
    },
    es: {
      summary: "",
      experiences: [],
      eyebrow: 'Experiencia Profesional',
      title: 'Mi Trayectoria',
      tabs: {
        freelancer: 'Freelancer',
        pj: 'PJ',
        clt: 'CLT',
        others: 'Otros',
      },
      detailHeading: 'Detalles',
      highlightsHeading: 'Destacados',
      stackHeading: 'Tecnologías',
    },
    fr: {
      summary: "",
      experiences: [],
      eyebrow: 'Expérience Professionnelle',
      title: 'Mon Parcours',
      tabs: {
        freelancer: 'Freelancer',
        pj: 'PJ',
        clt: 'CLT',
        others: 'Autres',
      },
      detailHeading: 'Détails',
      highlightsHeading: 'Faits Saillants',
      stackHeading: 'Technologies',
    },
    pt: {
      summary: "",
      experiences: [],
      eyebrow: 'Experiência profissional',
      title: 'Minha trajetória',
      tabs: {
        freelancer: 'Freelancer',
        pj: 'PJ',
        clt: 'CLT',
        others: 'Outros',
      },
      detailHeading: 'Detalhes',
      highlightsHeading: 'Destaques',
      stackHeading: 'Tecnologias',
    },
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
      eyebrow: translations.en.eyebrow ?? "",
      title: translations.en.title ?? "",
      tabs: translations.en.tabs ?? { freelancer: '', clt: '', pj: '', others: '' },
      detailHeading: translations.en.detailHeading ?? "",
      highlightsHeading: translations.en.highlightsHeading ?? "",
      stackHeading: translations.en.stackHeading ?? "",
    },
    es: {
      summary: translations.es.summary ?? "",
      experiences: padExp(translations.es.experiences),
      eyebrow: translations.es.eyebrow ?? "",
      title: translations.es.title ?? "",
      tabs: translations.es.tabs ?? { freelancer: '', clt: '', pj: '', others: '' },
      detailHeading: translations.es.detailHeading ?? "",
      highlightsHeading: translations.es.highlightsHeading ?? "",
      stackHeading: translations.es.stackHeading ?? "",
    },
    fr: {
      summary: translations.fr.summary ?? "",
      experiences: padExp(translations.fr.experiences),
      eyebrow: translations.fr.eyebrow ?? "",
      title: translations.fr.title ?? "",
      tabs: translations.fr.tabs ?? { freelancer: '', clt: '', pj: '', others: '' },
      detailHeading: translations.fr.detailHeading ?? "",
      highlightsHeading: translations.fr.highlightsHeading ?? "",
      stackHeading: translations.fr.stackHeading ?? "",
    },
    pt: {
      summary: translations.pt.summary ?? "",
      experiences: padExp(translations.pt.experiences),
      eyebrow: translations.pt.eyebrow ?? "",
      title: translations.pt.title ?? "",
      tabs: translations.pt.tabs ?? { freelancer: '', clt: '', pj: '', others: '' },
      detailHeading: translations.pt.detailHeading ?? "",
      highlightsHeading: translations.pt.highlightsHeading ?? "",
      stackHeading: translations.pt.stackHeading ?? "",
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
      pt: {
        ...defaultExperienceContent.translations.pt,
        ...(data?.translations?.pt ?? {}),
      },
    },
  };

  return {
    ...merged,
    translations: padExperienceTranslations(merged, merged.translations),
  };
}

export interface Trait {
  id: string;
  label: string;
  value: number;
}

export interface HobbyCard {
  id: string;
  title: string;
  description: string;
}

export interface PersonalTranslation {
  bio: string;
  values: string[];
  translatedTraits: { label: string }[];
  translatedHobbies: { title: string; description: string }[];
  eyebrow: string;
  title: string;
  description: string;
  hobbiesLabel: string;
  howToReadGraphTitle: string;
  howToReadGraphDescription: string;
}

export interface PersonalContent {
  bio: string;
  values: string[];
  photos: string[];
  socialLinks: { platform: string; url: string }[];
  traits: Trait[];
  hobbyCards: HobbyCard[];
  translations: {
    en: PersonalTranslation;
    es: PersonalTranslation;
    fr: PersonalTranslation;
    pt: PersonalTranslation;
  };
  updatedAt?: string;
}

export const defaultPersonalContent: PersonalContent = {
  bio: "",
  values: [],
  photos: [],
  socialLinks: [],
  traits: [
    { id: 'curiosity', label: 'Curiosidade', value: 0.95 },
    { id: 'creativity', label: 'Criatividade', value: 0.9 },
    { id: 'focus', label: 'Foco profundo', value: 0.85 },
    { id: 'calm', label: 'Calma', value: 0.75 },
    { id: 'collaboration', label: 'Colaboração', value: 0.82 },
    { id: 'experimentation', label: 'Experimentação', value: 0.9 },
  ],
  hobbyCards: [
    {
      id: 'games',
      title: 'Jogos e narrativas interativas',
      description: 'Gosto de analisar como jogos contam histórias através de interfaces e ritmo.',
    },
    {
      id: 'music',
      title: 'Música como trilha de foco',
      description: 'Trabalho com playlists de lo-fi, eletrônica leve e trilhas de filmes.',
    },
    {
      id: 'visual-experiments',
      title: 'Experimentos visuais',
      description: 'Protótipos rápidos para testar novas ideias de UI e animação.',
    },
  ],
  translations: {
    en: {
      bio: "",
      values: [],
      translatedTraits: [
        { label: 'Curiosity' },
        { label: 'Creativity' },
        { label: 'Deep Focus' },
        { label: 'Calmness' },
        { label: 'Collaboration' },
        { label: 'Experimentation' },
      ],
      translatedHobbies: [
        { title: 'Games and interactive narratives', description: 'I enjoy analyzing how games tell stories through interfaces and rhythm.' },
        { title: 'Music as a focus soundtrack', description: 'I work with playlists of lo-fi, light electronic, and movie soundtracks.' },
        { title: 'Visual experiments', description: 'Quick prototypes to test new UI and animation ideas.' },
      ],
      eyebrow: 'About Me',
      title: 'A Glimpse into My World',
      description: 'Here you\'ll find a mix of my professional ethos, personal passions, and the soft skills that define my approach to work and life. I believe in continuous learning, thoughtful collaboration, and approaching challenges with a calm, focused, and creative mindset.',
      hobbiesLabel: 'My Hobbies',
      howToReadGraphTitle: 'Understanding My Trait Graph',
      howToReadGraphDescription: 'This graph illustrates key traits that I bring to my work. Each spoke represents a trait, and the distance from the center indicates its prominence. It\'s a visual metaphor for my professional personality and how I engage with projects and teams.',
    },
    es: {
      bio: "",
      values: [],
      translatedTraits: [
        { label: 'Curiosidad' },
        { label: 'Creatividad' },
        { label: 'Foco Profundo' },
        { label: 'Calma' },
        { label: 'Colaboración' },
        { label: 'Experimentación' },
      ],
      translatedHobbies: [
        { title: 'Juegos y narrativas interactivas', description: 'Me gusta analizar cómo los juegos cuentan historias a través de interfaces y ritmo.' },
        { title: 'Música como banda sonora de concentración', description: 'Trabajo con listas de reproducción de lo-fi, electrónica ligera y bandas sonoras de películas.' },
        { title: 'Experimentos visuales', description: 'Prototipos rápidos para probar nuevas ideas de interfaz de usuario y animación.' },
      ],
      eyebrow: 'Sobre Mí',
      title: 'Un Vistazo a Mi Mundo',
      description: 'Aquí encontrarás una mezcla de mi ética profesional, pasiones personales y las habilidades blandas que definen mi enfoque al trabajo y la vida. Creo en el aprendizaje continuo, la colaboración reflexiva y en abordar los desafíos con una mentalidad tranquila, enfocada y creativa.',
      hobbiesLabel: 'Mis Pasatiempos',
      howToReadGraphTitle: 'Entendiendo Mi Gráfico de Rasgos',
      howToReadGraphDescription: 'Este gráfico ilustra los rasgos clave que aporto a mi trabajo. Cada radio representa un rasgo, y la distancia desde el centro indica su prominencia. Es una metáfora visual de mi personalidad profesional y de cómo me involucro con proyectos y equipos.',
    },
    fr: {
      bio: "",
      values: [],
      translatedTraits: [
        { label: 'Curiosité' },
        { label: 'Créativité' },
        { label: 'Concentration Profonde' },
        { label: 'Calme' },
        { label: 'Collaboration' },
        { label: 'Expérimentation' },
      ],
      translatedHobbies: [
        { title: 'Jeux et récits interactifs', description: "J'aime analyser comment les jeux racontent des histoires à travers les interfaces et le rythme." },
        { title: 'La musique comme bande sonore de concentration', description: "Je travaille avec des listes de lecture de lo-fi, d'électronique légère et de bandes sonores de films." },
        { title: 'Expériences visuelles', description: 'Prototypages rapides pour tester de nouvelles idées d\'interface utilisateur et d\'animation.' },
      ],
      eyebrow: 'À Propos de Moi',
      title: 'Un Aperçu de Mon Monde',
      description: 'Ici, vous trouverez un mélange de mon éthique professionnelle, de mes passions personnelles et des compétences non techniques qui définissent mon approche du travail et de la vie. Je crois en l\'apprentissage continu, la collaboration réfléchie et l\'approche des défis avec un esprit calme, concentré et créatif.',
      hobbiesLabel: 'Mes Loisirs',
      howToReadGraphTitle: 'Comprendre Mon Graphique de Traits',
      howToReadGraphDescription: 'Ce graphique illustre les traits clés que j\'apporte à mon travail. Chaque rayon représente un trait, et la distance du centre indique sa prééminence. C\'est une métaphore visuelle de ma personnalité professionnelle et de la façon dont je m\'engage dans les projets et les équipes.',
    },
    pt: {
      bio: "",
      values: [],
      translatedTraits: [
        { label: 'Curiosidade' },
        { label: 'Criatividade' },
        { label: 'Foco profundo' },
        { label: 'Calma' },
        { label: 'Colaboração' },
        { label: 'Experimentação' },
      ],
      translatedHobbies: [
        { title: 'Jogos e narrativas interativas', description: 'Gosto de analisar como jogos contam histórias através de interfaces e ritmo.' },
        { title: 'Música como trilha de foco', description: 'Trabalho com playlists de lo-fi, eletrônica leve e trilhas de filmes.' },
        { title: 'Experimentos visuais', description: 'Protótipos rápidos para testar novas ideias de UI e animação.' },
      ],
      eyebrow: 'Sobre Mim',
      title: 'Uma Visão do Meu Mundo',
      description: 'Aqui você encontrará uma mistura da minha ética profissional, paixões pessoais e das soft skills que definem minha abordagem ao trabalho e à vida. Acredito no aprendizado contínuo, na colaboração atenciosa e em abordar desafios com uma mentalidade calma, focada e criativa.',
      hobbiesLabel: 'Meus Hobbies',
      howToReadGraphTitle: 'Entendendo Meu Gráfico de Traços',
      howToReadGraphDescription: 'Este gráfico ilustra os traços chave que trago para o meu trabalho. Cada raio representa um traço, e a distância do centro indica sua proeminência. É uma metáfora visual da minha personalidade profissional e de como me envolvo com projetos e equipes.',
    },
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

  const padTranslatedTraits = (list?: { label: string }[]) => {
    const arr = Array.isArray(list) ? [...list] : [];
    while (arr.length < base.traits.length) arr.push({ label: "" });
    return arr.slice(0, base.traits.length);
  };

  const padTranslatedHobbies = (list?: { title: string; description: string }[]) => {
    const arr = Array.isArray(list) ? [...list] : [];
    while (arr.length < base.hobbyCards.length) arr.push({ title: "", description: "" });
    return arr.slice(0, base.hobbyCards.length);
  };

  return {
    en: {
      bio: translations.en.bio ?? "",
      values: padArray(translations.en.values, base.values.length),
      translatedTraits: padTranslatedTraits(translations.en.translatedTraits),
      translatedHobbies: padTranslatedHobbies(translations.en.translatedHobbies),
      eyebrow: translations.en.eyebrow ?? "",
      title: translations.en.title ?? "",
      description: translations.en.description ?? "",
      hobbiesLabel: translations.en.hobbiesLabel ?? "",
      howToReadGraphTitle: translations.en.howToReadGraphTitle ?? "",
      howToReadGraphDescription: translations.en.howToReadGraphDescription ?? "",
    },
    es: {
      bio: translations.es.bio ?? "",
      values: padArray(translations.es.values, base.values.length),
      translatedTraits: padTranslatedTraits(translations.es.translatedTraits),
      translatedHobbies: padTranslatedHobbies(translations.es.translatedHobbies),
      eyebrow: translations.es.eyebrow ?? "",
      title: translations.es.title ?? "",
      description: translations.es.description ?? "",
      hobbiesLabel: translations.es.hobbiesLabel ?? "",
      howToReadGraphTitle: translations.es.howToReadGraphTitle ?? "",
      howToReadGraphDescription: translations.es.howToReadGraphDescription ?? "",
    },
    fr: {
      bio: translations.fr.bio ?? "",
      values: padArray(translations.fr.values, base.values.length),
      translatedTraits: padTranslatedTraits(translations.fr.translatedTraits),
      translatedHobbies: padTranslatedHobbies(translations.fr.translatedHobbies),
      eyebrow: translations.fr.eyebrow ?? "",
      title: translations.fr.title ?? "",
      description: translations.fr.description ?? "",
      hobbiesLabel: translations.fr.hobbiesLabel ?? "",
      howToReadGraphTitle: translations.fr.howToReadGraphTitle ?? "",
      howToReadGraphDescription: translations.fr.howToReadGraphDescription ?? "",
    },
    pt: {
      bio: translations.pt.bio ?? "",
      values: padArray(translations.pt.values, base.values.length),
      translatedTraits: padTranslatedTraits(translations.pt.translatedTraits),
      translatedHobbies: padTranslatedHobbies(translations.pt.translatedHobbies),
      eyebrow: translations.pt.eyebrow ?? "",
      title: translations.pt.title ?? "",
      description: translations.pt.description ?? "",
      hobbiesLabel: translations.pt.hobbiesLabel ?? "",
      howToReadGraphTitle: translations.pt.howToReadGraphTitle ?? "",
      howToReadGraphDescription: translations.pt.howToReadGraphDescription ?? "",
    },
  };
}

export function mergePersonalContent(
  data?: Partial<PersonalContent>
): PersonalContent {
  const merged: PersonalContent = {
    ...defaultPersonalContent,
    ...data,
    hobbyCards: data?.hobbyCards ?? defaultPersonalContent.hobbyCards,
    values: data?.values ?? defaultPersonalContent.values,
    photos: data?.photos ?? defaultPersonalContent.photos,
    socialLinks: data?.socialLinks ?? defaultPersonalContent.socialLinks,
    traits: data?.traits ?? defaultPersonalContent.traits,
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
      pt: {
        ...defaultPersonalContent.translations.pt,
        ...(data?.translations?.pt ?? {}),
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
  eyebrow: string;
  title: string;
  description: string;
  legendTitle: string;
  levels: Record<1 | 2 | 3 | 4 | 5, string>;
  nowText: string;
  viewText: string;
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
    pt: SkillsTranslation;
  };
  updatedAt?: string;
}

export const defaultSkillsContent: SkillsContent = {
  summary: "",
  categories: [],
  translations: {
    en: {
      summary: "",
      eyebrow: "Skills",
      title: "Stack, craft and mindset",
      description: "More than a list of technologies, this is how I like to design and build digital experiences – from technical foundation to visual polish.",
      legendTitle: "Level of familiarity",
      levels: {
        1: 'Beginner',
        2: 'Intermediate',
        3: 'Advanced',
        4: 'Expert',
        5: 'Master',
      },
      nowText: "NOW",
      viewText: "VIEW",
      categories: [],
    },
    es: {
      summary: "",
      eyebrow: "Skills",
      title: "Stack, craft y forma de pensar",
      description: "Más que una lista de tecnologías, es como me gusta diseñar y construir experiencias digitales, de la base técnica al cuidado visual.",
      legendTitle: "Nivel de familiaridad",
      levels: {
        1: 'Principiante',
        2: 'Intermedio',
        3: 'Avanzado',
        4: 'Experto',
        5: 'Maestro',
      },
      nowText: "AHORA",
      viewText: "VER",
      categories: [],
    },
    fr: {
      summary: "",
      eyebrow: "Compétences",
      title: "Stack, craft et manière de penser",
      description: "Plus qu'une liste de technologies, voici ma façon de concevoir et construire des expériences numériques, du socle technique au soin visuel.",
      legendTitle: "Niveau de familiarité",
      levels: {
        1: 'Débutant',
        2: 'Intermédiaire',
        3: 'Avançé',
        4: 'Expert',
        5: 'Maître',
      },
      nowText: "ICI",
      viewText: "VOIR",
      categories: [],
    },
    pt: {
      summary: "",
      eyebrow: "Habilidades",
      title: "Stack, craft e mentalidade",
      description: "Mais do que uma lista de tecnologias, é como gosto de projetar e construir experiências digitais - da fundação técnica ao polimento visual.",
      legendTitle: "Nível de familiaridade",
      levels: {
        1: 'Básico',
        2: 'Intermediário',
        3: 'Avançado',
        4: 'Especialista',
        5: 'Mestre',
      },
      nowText: "AGORA",
      viewText: "VER",
      categories: [],
    },
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
      eyebrow: translations.en.eyebrow ?? "",
      title: translations.en.title ?? "",
      description: translations.en.description ?? "",
      legendTitle: translations.en.legendTitle ?? "",
      levels: translations.en.levels ?? { 1: '', 2: '', 3: '', 4: '', 5: '' },
      nowText: translations.en.nowText ?? "",
      viewText: translations.en.viewText ?? "",
      categories: padCat(translations.en.categories),
    },
    es: {
      summary: translations.es.summary ?? "",
      eyebrow: translations.es.eyebrow ?? "",
      title: translations.es.title ?? "",
      description: translations.es.description ?? "",
      legendTitle: translations.es.legendTitle ?? "",
      levels: translations.es.levels ?? { 1: '', 2: '', 3: '', 4: '', 5: '' },
      nowText: translations.es.nowText ?? "",
      viewText: translations.es.viewText ?? "",
      categories: padCat(translations.es.categories),
    },
    fr: {
      summary: translations.fr.summary ?? "",
      eyebrow: translations.fr.eyebrow ?? "",
      title: translations.fr.title ?? "",
      description: translations.fr.description ?? "",
      legendTitle: translations.fr.legendTitle ?? "",
      levels: translations.fr.levels ?? { 1: '', 2: '', 3: '', 4: '', 5: '' },
      nowText: translations.fr.nowText ?? "",
      viewText: translations.fr.viewText ?? "",
      categories: padCat(translations.fr.categories),
    },
    pt: {
      summary: translations.pt.summary ?? "",
      eyebrow: translations.pt.eyebrow ?? "",
      title: translations.pt.title ?? "",
      description: translations.pt.description ?? "",
      legendTitle: translations.pt.legendTitle ?? "",
      levels: translations.pt.levels ?? { 1: '', 2: '', 3: '', 4: '', 5: '' },
      nowText: translations.pt.nowText ?? "",
      viewText: translations.pt.viewText ?? "",
      categories: padCat(translations.pt.categories),
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
      pt: {
        ...defaultSkillsContent.translations.pt,
        ...(data?.translations?.pt ?? {}),
      },
    },
  };

  return {
    ...merged,
    translations: padSkillsTranslations(merged, merged.translations),
  };
}
