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
