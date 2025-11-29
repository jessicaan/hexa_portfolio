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
  socialLinks: { platform: string; url: string }[];
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
