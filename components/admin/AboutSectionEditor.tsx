'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSave, FiLoader, FiPlus, FiTrash, FiRefreshCw, FiUser } from 'react-icons/fi';
import FileUploader from '@/components/admin/FileUploader';
import {
  autoTranslateContent,
  saveAboutContent,
  type AboutContent,
  type SoftSkill,
} from '@/app/admin/about/actions';

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

  const addSoftSkill = () => {
    setForm(prev => ({
      ...prev,
      softSkills: [...prev.softSkills, { name: '', description: '' }],
    }));
  };

  const removeSoftSkill = (index: number) => {
    setForm(prev => ({
      ...prev,
      softSkills: prev.softSkills.filter((_, i) => i !== index),
    }));
  };

  const updateSoftSkill = (index: number, key: keyof SoftSkill, value: string) => {
    setForm(prev => {
      const softSkills = [...prev.softSkills];
      softSkills[index] = { ...softSkills[index], [key]: value };
      return { ...prev, softSkills };
    });
  };

  const addHighlight = () => {
    setForm(prev => ({ ...prev, highlights: [...prev.highlights, ''] }));
  };

  const removeHighlight = (index: number) => {
    setForm(prev => ({ ...prev, highlights: prev.highlights.filter((_, i) => i !== index) }));
  };

  const updateHighlight = (index: number, value: string) => {
    setForm(prev => {
      const highlights = [...prev.highlights];
      highlights[index] = value;
      return { ...prev, highlights };
    });
  };

  const handleSave = () => {
    setMessage(null);
    setError(null);
    startSave(async () => {
      try {
        await saveAboutContent(form);
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
        const translations = await autoTranslateContent({
          summary: form.summary,
          longDescription: form.longDescription,
          softSkills: form.softSkills,
          highlights: form.highlights,
        });
        setForm(prev => ({
          ...prev,
          translations: {
            en: { ...prev.translations.en, ...translations.en, videoPitchUrl: prev.translations.en.videoPitchUrl ?? "" },
            es: { ...prev.translations.es, ...translations.es, videoPitchUrl: prev.translations.es.videoPitchUrl ?? "" },
            fr: { ...prev.translations.fr, ...translations.fr, videoPitchUrl: prev.translations.fr.videoPitchUrl ?? "" },
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
          {['pt', 'translations'].map(value => (
            <button
              key={value}
              onClick={() => setTab(value as any)}
              className={`relative px-3 py-2.5 text-sm transition-colors ${tab === value ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              {value === 'pt' ? 'Conteúdo PT' : 'Traduções'}
              {tab === value && (
                <motion.div layoutId="about-tab" className="absolute inset-x-1 bottom-0 h-0.5 rounded-full bg-primary" />
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
                <FileUploader
                  value={form.profileImage}
                  onChange={url => setForm(prev => ({ ...prev, profileImage: url }))}
                  accept="image/*"
                  label="Foto de perfil"
                  folder="profile"
                />

                <FileUploader
                  value={form.videoPitchUrl}
                  onChange={url => setForm(prev => ({ ...prev, videoPitchUrl: url }))}
                  accept="video/*"
                  label="Vídeo de apresentação (PT)"
                  folder="about/pt"
                />

                <Input
                  label="Resumo"
                  value={form.summary}
                  onChange={(value: string) => setForm(prev => ({ ...prev, summary: value }))}
                  placeholder="Breve introdução sobre você"
                  multiline
                />

                <Input
                  label="Descrição longa"
                  value={form.longDescription}
                  onChange={(value: string) => setForm(prev => ({ ...prev, longDescription: value }))}
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

                  {form.softSkills.map((skill, index) => (
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
                  {form.highlights.map((highlight, index) => (
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
                      {form.softSkills.map((_, idx) => (
                        <Input
                          key={idx}
                          label={`Descrição #${idx + 1}`}
                          value={form.translations[lang]?.softSkills?.[idx]?.description ?? ''}
                          onChange={value =>
                            setForm(prev => {
                              const current = prev.translations[lang]?.softSkills ?? [];
                              const next = [...current];
                              const target = next[idx] ?? { description: '' };
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
                      ))}
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle">Highlights</p>
                      {form.highlights.map((_, idx) => (
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
