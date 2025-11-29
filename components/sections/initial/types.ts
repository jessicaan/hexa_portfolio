export type UiLanguageCode = 'PT' | 'EN' | 'ES' | 'FR';

export interface Language {
  code: UiLanguageCode;
  country: string;
  name: string;
  greeting: string;
  description: string;
  tip: string;
  explore: string;
}

export interface LanguageMeta {
  code: UiLanguageCode;
  country: string;
  name: string;
  fallbackGreeting: string;
  fallbackDescription: string;
  tip: string;
  explore: string;
}

export interface InitialSectionProps {
  onLanguageSelect?: (code: UiLanguageCode) => void;
  onExplore?: (code: UiLanguageCode) => void;
}

export interface LanguageSelectorProps {
  languages: Language[];
  activeGreeting: number;
  hoveredLang: number | null;
  selectedLang: number | null;
  primaryRgb: { r: number; g: number; b: number };
  onHover: (index: number | null) => void;
  onSelect: (index: number) => void;
}
