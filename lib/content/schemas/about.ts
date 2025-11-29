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
      heading: "Sobre Mim",
      myStory: "Minha História",
      highlightsText: "Destaques",
      videoPitch: "Video de Apresentação",
      videoPlaceholderTitle: "Nenhum vídeo disponível",
      videoPlaceholderDescription: "Um vídeo de apresentação pessoal será adicionado aqui em breve.",
      skillsText: "Habilidades",
    },
  },
};

export function mergeAboutContent(data?: Partial<AboutContent>): AboutContent {
  if (!data) return defaultAboutContent;

  const merged: AboutContent = {
    ...defaultAboutContent,
    ...data,
    softSkills: data.softSkills ?? defaultAboutContent.softSkills,
    highlights: data.highlights ?? defaultAboutContent.highlights,
    translations: {
      en: {
        ...defaultAboutContent.translations.en,
        ...(data.translations?.en ?? {}),
      },
      es: {
        ...defaultAboutContent.translations.es,
        ...(data.translations?.es ?? {}),
      },
      fr: {
        ...defaultAboutContent.translations.fr,
        ...(data.translations?.fr ?? {}),
      },
      pt: {
        ...defaultAboutContent.translations.pt,
        ...(data.translations?.pt ?? {}),
      },
    },
  };

  return merged;
}
