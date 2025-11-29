import { LanguageCode } from "./common";

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
