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
