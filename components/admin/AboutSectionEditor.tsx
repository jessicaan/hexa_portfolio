'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSave, FiLoader, FiPlus, FiTrash, FiRefreshCw, FiUser } from 'react-icons/fi';
import FileUploader from '@/components/admin/FileUploader';
import {
  autoTranslateContent,
  saveAboutContent,
} from '@/app/admin/about/actions';

// --- Interfaces defined first for usage in component ---

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
  videoPitchUrl?: string; // Added this field
  videoPlaceholderTitle: string;
  videoPlaceholderDescription: string;
  skillsText: string;
  softSkills: SoftSkill[];
  highlights: string[];
}

export interface AboutContent {
  title: string;
  videoPitchUrl: string; // Top level acts as PT/Default
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
  title: "",
  videoPitchUrl: "",
  profileImage: "",
  translations: {
    en: {
      summary: "",
      longDescription: "",
      heading: "About",
      myStory: "My Story",
      highlightsText: "Highlights",
      videoPitch: "Video Pitch",
      videoPitchUrl: "",
      videoPlaceholderTitle: "No video available",
      videoPlaceholderDescription: "A personal video pitch will be added here soon.",
      skillsText: "Skills",
      softSkills: [],
      highlights: [],
    },
    es: {
      summary: "",
      longDescription: "",
      heading: "Sobre Mí",
      myStory: "Mi Historia",
      highlightsText: "Puntos Destacados",
      videoPitch: "Video de Presentación",
      videoPitchUrl: "",
      videoPlaceholderTitle: "Video no disponible",
      videoPlaceholderDescription: "Pronto se agregará un video de presentación personal.",
      skillsText: "Habilidades",
      softSkills: [],
      highlights: [],
    },
    fr: {
      summary: "",
      longDescription: "",
      heading: "À Propos",
      myStory: "Mon Histoire",
      highlightsText: "Faits Saillants",
      videoPitch: "Présentation Vidéo",
      videoPitchUrl: "",
      videoPlaceholderTitle: "Aucune vidéo disponible",
      videoPlaceholderDescription: "Une présentation vidéo personnelle sera ajoutée ici bientôt.",
      skillsText: "Compétences",
      softSkills: [],
      highlights: [],
    },
    pt: {
      summary: "",
      longDescription: "",
      heading: "Sobre Mim",
      myStory: "Minha História",
      highlightsText: "Destaques",
      videoPitch: "Video de Apresentação",
      videoPitchUrl: "",
      videoPlaceholderTitle: "Nenhum vídeo disponível",
      videoPlaceholderDescription: "Um vídeo de apresentação pessoal será adicionado aqui em breve.",
      skillsText: "Habilidades",
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
        softSkills: data.translations?.en?.softSkills ?? defaultAboutContent.translations.en.softSkills,
        highlights: data.translations?.en?.highlights ?? defaultAboutContent.translations.en.highlights,
      },
      es: {
        ...defaultAboutContent.translations.es,
        ...(data.translations?.es ?? {}),
        softSkills: data.translations?.es?.softSkills ?? defaultAboutContent.translations.es.softSkills,
        highlights: data.translations?.es?.highlights ?? defaultAboutContent.translations.es.highlights,
      },
      fr: {
        ...defaultAboutContent.translations.fr,
        ...(data.translations?.fr ?? {}),
        softSkills: data.translations?.fr?.softSkills ?? defaultAboutContent.translations.fr.softSkills,
        highlights: data.translations?.fr?.highlights ?? defaultAboutContent.translations.fr.highlights,
      },
      pt: {
        ...defaultAboutContent.translations.pt,
        ...(data.translations?.pt ?? {}),
        softSkills: data.translations?.pt?.softSkills ?? defaultAboutContent.translations.pt.softSkills,
        highlights: data.translations?.pt?.highlights ?? defaultAboutContent.translations.pt.highlights,
      },
    },
  };

  return merged;
}

// --- Component ---

interface Props {
  initial: AboutContent;
}

export default function AboutSectionEditor({ initial }: Props) {
  const [tab, setTab] = useState<'pt' | 'translations'>('pt');
  const [form, setForm] = useState<AboutContent>(initial);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, startSave] = useTransition();
  const [isTranslating, startTranslate] = useTransition();

  // Helper to update PT translations specifically
  const updatePt = (updater: (prevPt: AboutTranslation) => Partial<AboutTranslation>) => {
    setForm(prev => {
      const newPt = { ...prev.translations.pt, ...updater(prev.translations.pt) };
      return {
        ...prev,
        translations: { ...prev.translations, pt: newPt }
      };
    });
  };

  const addSoftSkill = () => {
    updatePt(prevPt => ({
      softSkills: [...prevPt.softSkills, { name: '', description: '' }]
    }));
  };

  const removeSoftSkill = (index: number) => {
    updatePt(prevPt => ({
      softSkills: prevPt.softSkills.filter((_, i) => i !== index)
    }));
  };

  const updateSoftSkill = (index: number, key: keyof SoftSkill, value: string) => {
    updatePt(prevPt => {
      const softSkills = [...prevPt.softSkills];
      softSkills[index] = { ...softSkills[index], [key]: value };
      return { softSkills };
    });
  };

  const addHighlight = () => {
    updatePt(prevPt => ({
      highlights: [...prevPt.highlights, '']
    }));
  };

  const removeHighlight = (index: number) => {
    updatePt(prevPt => ({
      highlights: prevPt.highlights.filter((_, i) => i !== index)
    }));
  };

  const updateHighlight = (index: number, value: string) => {
    updatePt(prevPt => {
      const highlights = [...prevPt.highlights];
      highlights[index] = value;
      return { highlights };
    });
  };

  const handleSave = () => {
    setMessage(null);
    setError(null);
    startSave(async () => {
      const payload: AboutContent = {
        ...form,
        translations: {
          ...form.translations,
          pt: { ...form.translations.pt, videoPitchUrl: form.videoPitchUrl },
        },
      };
      setForm(payload);
      try {
        await saveAboutContent(payload);
        setMessage('Conteúdo salvo com sucesso.');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao salvar.');
      }
    });
  };

  const handleAutoTranslate = () => {
    setMessage(null);
    setError(null);
    startTranslate(async () => {
      try {
        // Source content from PT translations
        const ptContent = form.translations.pt;

        const translations = await autoTranslateContent({
          summary: ptContent.summary,
          longDescription: ptContent.longDescription,
          softSkills: ptContent.softSkills,
          highlights: ptContent.highlights,
        });

        setForm(prev => ({
          ...prev,
          translations: {
            ...prev.translations,
            en: { ...prev.translations.en, ...translations.en, videoPitchUrl: prev.translations.en.videoPitchUrl ?? "" },
            es: { ...prev.translations.es, ...translations.es, videoPitchUrl: prev.translations.es.videoPitchUrl ?? "" },
            fr: { ...prev.translations.fr, ...translations.fr, videoPitchUrl: prev.translations.fr.videoPitchUrl ?? "" },
            pt: prev.translations.pt, // Preserve PT
          },
        }));
        setMessage('Traduções geradas com sucesso.');
        setTab('translations');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao traduzir.');
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground-subtle">About</p>
          <h1 className="text-xl font-semibold text-foreground">Sobre você</h1>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleAutoTranslate}
            className="inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-surface-soft px-3 py-2 text-sm hover:border-primary/60 transition-colors"
            disabled={isTranslating}
          >
            {isTranslating ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiRefreshCw className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-primary to-secondary px-3 py-2 text-sm font-semibold text-foreground shadow-glow hover:shadow-glow-lg transition-all"
            disabled={isSaving}
          >
            {isSaving ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSave className="w-4 h-4" />}
            Salvar
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-border-subtle/70 bg-surface/70 backdrop-blur-xl">
        <div className="flex gap-3 border-b border-border-subtle/60 px-4">
          {(['pt', 'translations'] as const).map(value => (
            <button
              key={value}
              onClick={() => setTab(value)}
              className={`relative px-3 py-2.5 text-sm transition-colors ${tab === value ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              {value === 'pt' ? 'Conteúdo PT' : 'Traduções'}
              {tab === value && (
                <motion.span layoutId="about-tab" className="absolute inset-x-1 bottom-0 h-0.5 rounded-full bg-primary block" />
              )}
            </button>
          ))}
        </div>

        <div className="p-4">
          <AnimatePresence mode="wait">
            {tab === 'pt' ? (
              <motion.div
                key="pt"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-4"
              >
                {/* Profile Image is Global */}
                <FileUploader
                  value={form.profileImage}
                  onChange={url => setForm(prev => ({ ...prev, profileImage: url }))}
                  accept="image/*"
                  label="Foto de perfil"
                  folder="profile"
                />

                {/* Video Pitch URL (PT) uses the top-level property */}
                <FileUploader
                  value={form.videoPitchUrl}
                  onChange={url =>
                    setForm(prev => ({
                      ...prev,
                      videoPitchUrl: url,
                      translations: {
                        ...prev.translations,
                        pt: { ...prev.translations.pt, videoPitchUrl: url },
                      },
                    }))
                  }
                  accept="video/*"
                  label="Vídeo de apresentação (PT)"
                  folder="about/pt"
                />

                {/* Text fields map to translations.pt */}
                <Input
                  label="Resumo"
                  value={form.translations.pt.summary}
                  onChange={(value: string) => updatePt(() => ({ summary: value }))}
                  placeholder="Breve introdução sobre você"
                  multiline
                />

                <Input
                  label="Descrição longa"
                  value={form.translations.pt.longDescription}
                  onChange={(value: string) => updatePt(() => ({ longDescription: value }))}
                  placeholder="Descrição detalhada sobre sua trajetória"
                  multiline
                />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <FiUser className="w-4 h-4" />
                      Soft Skills
                    </h3>
                    <button
                      type="button"
                      onClick={addSoftSkill}
                      className="inline-flex items-center gap-2 rounded-lg border border-border-subtle px-3 py-1.5 text-sm hover:border-primary/60 transition-colors"
                    >
                      <FiPlus className="w-4 h-4" />
                      Adicionar
                    </button>
                  </div>

                  {form.translations.pt.softSkills.map((skill: SoftSkill, index: number) => (
                    <div key={index} className="rounded-lg border border-border-subtle/70 bg-background/60 p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">#{index + 1}</span>
                        <button type="button" onClick={() => removeSoftSkill(index)} className="text-red-300">
                          <FiTrash className="w-4 h-4" />
                        </button>
                      </div>
                      <Input
                        label="Nome"
                        value={skill.name}
                        onChange={(value: string) => updateSoftSkill(index, 'name', value)}
                        placeholder="Ex: Comunicação"
                      />
                      <Input
                        label="Descrição"
                        value={skill.description}
                        onChange={(value: string) => updateSoftSkill(index, 'description', value)}
                        placeholder="Descrição da habilidade"
                        multiline
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">Highlights</span>
                    <button type="button" onClick={addHighlight} className="text-xs text-primary hover:underline">
                      + Adicionar
                    </button>
                  </div>
                  {form.translations.pt.highlights.map((highlight: string, index: number) => (
                    <div key={index} className="flex gap-2">
                      <input
                        value={highlight}
                        onChange={e => updateHighlight(index, e.target.value)}
                        placeholder="Conquista ou resultado"
                        className="flex-1 rounded-lg border border-border-subtle/70 bg-background/60 px-3 py-2 text-sm"
                      />
                      <button type="button" onClick={() => removeHighlight(index)} className="text-red-300">
                        <FiTrash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="translations"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-4"
              >
                {(['en', 'es', 'fr'] as const).map(lang => (
                  <div key={lang} className="rounded-lg border border-border-subtle/70 bg-background/60 p-4 space-y-3">
                    <h3 className="text-sm font-semibold text-foreground uppercase">{lang}</h3>
                    <FileUploader
                      value={form.translations[lang]?.videoPitchUrl ?? ''}
                      onChange={url =>
                        setForm(prev => ({
                          ...prev,
                          translations: {
                            ...prev.translations,
                            [lang]: { ...prev.translations[lang], videoPitchUrl: url },
                          },
                        }))
                      }
                      accept="video/*"
                      label="Vídeo de apresentação"
                      folder={`about/${lang}`}
                    />
                    <Input
                      label="Resumo"
                      value={form.translations[lang]?.summary ?? ''}
                      onChange={value =>
                        setForm(prev => ({
                          ...prev,
                          translations: {
                            ...prev.translations,
                            [lang]: { ...prev.translations[lang], summary: value },
                          },
                        }))
                      }
                      multiline
                    />
                    <Input
                      label="Descrição longa"
                      value={form.translations[lang]?.longDescription ?? ''}
                      onChange={value =>
                        setForm(prev => ({
                          ...prev,
                          translations: {
                            ...prev.translations,
                            [lang]: { ...prev.translations[lang], longDescription: value },
                          },
                        }))
                      }
                      multiline
                    />
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle">Soft skills</p>
                      {form.translations.pt.softSkills.map((_, idx: number) => (
                        <div key={idx} className="space-y-2">
                          <Input
                            label={`Nome da soft skill #${idx + 1}`}
                            value={form.translations[lang]?.softSkills?.[idx]?.name ?? ''}
                            onChange={value =>
                              setForm(prev => {
                                const current = prev.translations[lang]?.softSkills ?? [];
                                const next = [...current];
                                const target = next[idx] ?? { name: '', description: '' };
                                next[idx] = { ...target, name: value };
                                return {
                                  ...prev,
                                  translations: {
                                    ...prev.translations,
                                    [lang]: { ...prev.translations[lang], softSkills: next },
                                  },
                                };
                              })
                            }
                          />
                          <Input
                            label="Descrição"
                            value={form.translations[lang]?.softSkills?.[idx]?.description ?? ''}
                            onChange={value =>
                              setForm(prev => {
                                const current = prev.translations[lang]?.softSkills ?? [];
                                const next = [...current];
                                const target = next[idx] ?? { name: '', description: '' };
                                next[idx] = { ...target, description: value };
                                return {
                                  ...prev,
                                  translations: {
                                    ...prev.translations,
                                    [lang]: { ...prev.translations[lang], softSkills: next },
                                  },
                                };
                              })
                            }
                            multiline
                          />
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle">Highlights</p>
                      {form.translations.pt.highlights.map((_, idx: number) => (
                        <Input
                          key={idx}
                          label={`Highlight #${idx + 1}`}
                          value={form.translations[lang]?.highlights?.[idx] ?? ''}
                          onChange={value =>
                            setForm(prev => {
                              const current = prev.translations[lang]?.highlights ?? [];
                              const next = [...current];
                              next[idx] = value;
                              return {
                                ...prev,
                                translations: {
                                  ...prev.translations,
                                  [lang]: { ...prev.translations[lang], highlights: next },
                                },
                              };
                            })
                          }
                          multiline
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-lg border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-100"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
}

function Input({ label, value, onChange, multiline, placeholder }: InputProps) {
  const className = "w-full rounded-lg border border-border-subtle/70 bg-background/60 px-3 py-2 text-sm";
  return (
    <label className="space-y-2 block">
      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle">{label}</span>
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={`${className} min-h-20`} />
      ) : (
        <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={className} />
      )}
    </label>
  );
}
