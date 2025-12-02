export interface SoftSkill {
  name: string;
  description: string;
}

export interface AboutTranslation {
  summary: string;
  longDescription: string;
  heading: string;
  myStory: string;
  highlightsText: string;
  videoPitch: string;
  videoPitchUrl?: string;
  videoPlaceholderTitle: string;
  videoPlaceholderDescription: string;
  skillsText: string;
  softSkills: SoftSkill[];
  highlights: string[];
}

export interface AboutContent {
  title: string;
  videoPitchUrl: string;
  profileImage: string;
  translations: {
    en: AboutTranslation;
    es: AboutTranslation;
    fr: AboutTranslation;
    pt: AboutTranslation;
  };
  updatedAt?: string;
}

export const defaultAboutContent: AboutContent = {
  title: 'About me',
  videoPitchUrl: '',
  profileImage: '',
  translations: {
    en: {
      summary: '',
      longDescription: '',
      heading: 'About',
      myStory: 'My Story',
      highlightsText: 'Highlights',
      videoPitch: 'Video Pitch',
      videoPitchUrl: '',
      videoPlaceholderTitle: 'No video available',
      videoPlaceholderDescription:
        'A personal video pitch will be added here soon.',
      skillsText: 'Skills',
      softSkills: [],
      highlights: [],
    },
    es: {
      summary: '',
      longDescription: '',
      heading: 'Sobre Mí',
      myStory: 'Mi Historia',
      highlightsText: 'Puntos Destacados',
      videoPitch: 'Video de Presentación',
      videoPitchUrl: '',
      videoPlaceholderTitle: 'Video no disponible',
      videoPlaceholderDescription:
        'Pronto se agregará un video de presentación personal.',
      skillsText: 'Habilidades',
      softSkills: [],
      highlights: [],
    },
    fr: {
      summary: '',
      longDescription: '',
      heading: 'À Propos',
      myStory: 'Mon Histoire',
      highlightsText: 'Faits Saillants',
      videoPitch: 'Présentation Vidéo',
      videoPitchUrl: '',
      videoPlaceholderTitle: 'Aucune vidéo disponible',
      videoPlaceholderDescription:
        'Une présentation vidéo personnelle sera ajoutée ici bientôt.',
      skillsText: 'Compétences',
      softSkills: [],
      highlights: [],
    },
    pt: {
      summary: '',
      longDescription: '',
      heading: 'Sobre Mim',
      myStory: 'Minha História',
      highlightsText: 'Destaques',
      videoPitch: 'Video de Apresentação',
      videoPitchUrl: '',
      videoPlaceholderTitle: 'Nenhum vídeo disponível',
      videoPlaceholderDescription:
        'Um vídeo de apresentação pessoal será adicionado aqui em breve.',
      skillsText: 'Habilidades',
      softSkills: [],
      highlights: [],
    },
  },
};

export function mergeAboutContent(data?: Partial<AboutContent>): AboutContent {
  if (!data) return defaultAboutContent;

  const merged: AboutContent = {
    ...defaultAboutContent,
    ...data,
    translations: {
      en: {
        ...defaultAboutContent.translations.en,
        ...(data.translations?.en ?? {}),
        softSkills:
          data.translations?.en?.softSkills ??
          defaultAboutContent.translations.en.softSkills,
        highlights:
          data.translations?.en?.highlights ??
          defaultAboutContent.translations.en.highlights,
      },
      es: {
        ...defaultAboutContent.translations.es,
        ...(data.translations?.es ?? {}),
        softSkills:
          data.translations?.es?.softSkills ??
          defaultAboutContent.translations.es.softSkills,
        highlights:
          data.translations?.es?.highlights ??
          defaultAboutContent.translations.es.highlights,
      },
      fr: {
        ...defaultAboutContent.translations.fr,
        ...(data.translations?.fr ?? {}),
        softSkills:
          data.translations?.fr?.softSkills ??
          defaultAboutContent.translations.fr.softSkills,
        highlights:
          data.translations?.fr?.highlights ??
          defaultAboutContent.translations.fr.highlights,
      },
      pt: {
        ...defaultAboutContent.translations.pt,
        ...(data.translations?.pt ?? {}),
        softSkills:
          data.translations?.pt?.softSkills ??
          defaultAboutContent.translations.pt.softSkills,
        highlights:
          data.translations?.pt?.highlights ??
          defaultAboutContent.translations.pt.highlights,
      },
    },
  };

  return merged;
}
