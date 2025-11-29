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
