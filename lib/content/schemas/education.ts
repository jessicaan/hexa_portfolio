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
