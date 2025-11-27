'use client';

import { useMemo, useState, useTransition, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSave, FiLoader, FiGlobe, FiFilm, FiImage, FiPlus, FiTrash, FiRefreshCw } from 'react-icons/fi';
import TranslationEditor from '@/components/admin/TranslationEditor';
import {
  autoTranslateContent,
  saveAboutContent,
  type AboutContent,
  type LanguageCode,
} from '@/app/admin/about/actions';

const translationTabs: { code: Exclude<LanguageCode, 'pt'>; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Espanol' },
  { code: 'fr', label: 'Frances' },
];

interface Props {
  initial: AboutContent;
}

export default function AboutSectionEditor({ initial }: Props) {
  const [tab, setTab] = useState<'pt' | 'translations'>('pt');
  const [translationTab, setTranslationTab] = useState<Exclude<LanguageCode, 'pt'>>('en');
  const [form, setForm] = useState<AboutContent>(initial);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, startSave] = useTransition();
  const [isTranslating, startTranslate] = useTransition();

  const statusBadge = form.updatedAt
    ? `Ultima atualizacao: ${new Date(form.updatedAt).toLocaleString('pt-BR')}`
    : 'Novo conteudo';

  const translationSoftSkills = useMemo(() => {
    const size = form.softSkills.length;
    const pad = (list: { description: string }[]) => {
      const clone = [...list];
      while (clone.length < size) clone.push({ description: '' });
      return clone.slice(0, size);
    };
    return {
      en: pad(form.translations.en.softSkills),
      es: pad(form.translations.es.softSkills),
      fr: pad(form.translations.fr.softSkills),
    };
  }, [form.softSkills, form.translations.en.softSkills, form.translations.es.softSkills, form.translations.fr.softSkills]);

  const translationHighlights = useMemo(() => {
    const size = form.highlights.length;
    const pad = (list: string[]) => {
      const clone = [...list];
      while (clone.length < size) clone.push('');
      return clone.slice(0, size);
    };
    return {
      en: pad(form.translations.en.highlights),
      es: pad(form.translations.es.highlights),
      fr: pad(form.translations.fr.highlights),
    };
  }, [form.highlights, form.translations.en.highlights, form.translations.es.highlights, form.translations.fr.highlights]);

  const updateField = (key: keyof AboutContent, value: unknown) => {
    setForm(prev => ({ ...prev, [key]: value } as AboutContent));
  };

  const updateSoftSkill = (index: number, key: 'name' | 'description', value: string) => {
    setForm(prev => {
      const softSkills = [...prev.softSkills];
      softSkills[index] = { ...softSkills[index], [key]: value };
      return { ...prev, softSkills };
    });
  };

  const addSoftSkill = () => {
    setForm(prev => ({
      ...prev,
      softSkills: [...prev.softSkills, { name: '', description: '' }],
      translations: {
        ...prev.translations,
        en: { ...prev.translations.en, softSkills: [...translationSoftSkills.en, { description: '' }] },
        es: { ...prev.translations.es, softSkills: [...translationSoftSkills.es, { description: '' }] },
        fr: { ...prev.translations.fr, softSkills: [...translationSoftSkills.fr, { description: '' }] },
      },
    }));
  };

  const removeSoftSkill = (index: number) => {
    setForm(prev => ({
      ...prev,
      softSkills: prev.softSkills.filter((_, i) => i !== index),
      translations: {
        ...prev.translations,
        en: { ...prev.translations.en, softSkills: translationSoftSkills.en.filter((_, i) => i !== index) },
        es: { ...prev.translations.es, softSkills: translationSoftSkills.es.filter((_, i) => i !== index) },
        fr: { ...prev.translations.fr, softSkills: translationSoftSkills.fr.filter((_, i) => i !== index) },
      },
    }));
  };

  const updateHighlight = (index: number, value: string) => {
    setForm(prev => {
      const highlights = [...prev.highlights];
      highlights[index] = value;
      return { ...prev, highlights };
    });
  };

  const addHighlight = () => {
    setForm(prev => ({
      ...prev,
      highlights: [...prev.highlights, ''],
      translations: {
        ...prev.translations,
        en: { ...prev.translations.en, highlights: [...translationHighlights.en, ''] },
        es: { ...prev.translations.es, highlights: [...translationHighlights.es, ''] },
        fr: { ...prev.translations.fr, highlights: [...translationHighlights.fr, ''] },
      },
    }));
  };

  const removeHighlight = (index: number) => {
    setForm(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
      translations: {
        ...prev.translations,
        en: { ...prev.translations.en, highlights: translationHighlights.en.filter((_, i) => i !== index) },
        es: { ...prev.translations.es, highlights: translationHighlights.es.filter((_, i) => i !== index) },
        fr: { ...prev.translations.fr, highlights: translationHighlights.fr.filter((_, i) => i !== index) },
      },
    }));
  };

  const updateTranslationSoftSkill = (
    lang: Exclude<LanguageCode, 'pt'>,
    index: number,
    value: string,
  ) => {
    const list =
      lang === 'en'
        ? translationSoftSkills.en
        : lang === 'es'
          ? translationSoftSkills.es
          : translationSoftSkills.fr;
    const updated = [...list];
    updated[index] = { description: value };
    setForm(prev => ({
      ...prev,
      translations: {
        ...prev.translations,
        [lang]: {
          ...prev.translations[lang],
          softSkills: updated,
        },
      },
    }));
  };

  const updateTranslationHighlight = (
    lang: Exclude<LanguageCode, 'pt'>,
    index: number,
    value: string,
  ) => {
    const list =
      lang === 'en'
        ? translationHighlights.en
        : lang === 'es'
          ? translationHighlights.es
          : translationHighlights.fr;
    const updated = [...list];
    updated[index] = value;
    setForm(prev => ({
      ...prev,
      translations: {
        ...prev.translations,
        [lang]: {
          ...prev.translations[lang],
          highlights: updated,
        },
      },
    }));
  };

  const applyTranslations = (translations: AboutContent['translations']) => {
    setForm(prev => {
      const softCount = prev.softSkills.length;
      const highCount = prev.highlights.length;

      const padSkills = (list: { description: string }[]) => {
        const clone = Array.isArray(list) ? [...list] : [];
        while (clone.length < softCount) clone.push({ description: '' });
        return clone.slice(0, softCount);
      };

      const padHighlights = (list: string[]) => {
        const clone = Array.isArray(list) ? [...list] : [];
        while (clone.length < highCount) clone.push('');
        return clone.slice(0, highCount);
      };

      return {
        ...prev,
        translations: {
          ...prev.translations,
          en: {
            ...prev.translations.en,
            ...translations.en,
            softSkills: padSkills(translations.en.softSkills),
            highlights: padHighlights(translations.en.highlights),
          },
          es: {
            ...prev.translations.es,
            ...translations.es,
            softSkills: padSkills(translations.es.softSkills),
            highlights: padHighlights(translations.es.highlights),
          },
          fr: {
            ...prev.translations.fr,
            ...translations.fr,
            softSkills: padSkills(translations.fr.softSkills),
            highlights: padHighlights(translations.fr.highlights),
          },
        },
      };
    });
  };

  const translateWithGemini = async () => {
    const translations = await autoTranslateContent({
      summary: form.summary,
      longDescription: form.longDescription,
      softSkills: form.softSkills,
      highlights: form.highlights,
    });
    applyTranslations(translations);
    setTab('translations');
    return {
      en: { summary: translations.en.summary, longDescription: translations.en.longDescription },
      es: { summary: translations.es.summary, longDescription: translations.es.longDescription },
      fr: { summary: translations.fr.summary, longDescription: translations.fr.longDescription },
    };
  };

  const handleSave = () => {
    setMessage(null);
    setError(null);
    startSave(async () => {
      try {
        await saveAboutContent({
          ...form,
          translations: {
            en: { ...form.translations.en, softSkills: translationSoftSkills.en, highlights: translationHighlights.en },
            es: { ...form.translations.es, softSkills: translationSoftSkills.es, highlights: translationHighlights.es },
            fr: { ...form.translations.fr, softSkills: translationSoftSkills.fr, highlights: translationHighlights.fr },
          },
        });
        setMessage('Conteúdo salvo em /content/about no Firebase.');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Não foi possível salvar agora.');
      }
    });
  };

  const handleAutoTranslate = () => {
    setMessage(null);
    setError(null);
    startTranslate(async () => {
      try {
        await translateWithGemini();
        setMessage('Traduções preenchidas automaticamente.');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Não foi possível traduzir agora.');
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground-subtle">About Section</p>
          <h1 className="text-2xl font-semibold text-foreground">Sobre + Vídeo</h1>
          <p className="text-xs text-muted-foreground">{statusBadge}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleAutoTranslate}
            className="inline-flex items-center gap-2 rounded-xl border border-border-subtle bg-surface-soft px-4 py-2 text-sm text-foreground hover:border-primary/60 hover:text-foreground transition-colors disabled:opacity-60"
            disabled={isTranslating}
          >
            {isTranslating ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiGlobe className="w-4 h-4" />}
            Traduzir automaticamente
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-primary to-secondary px-4 py-2 text-sm font-semibold text-foreground shadow-glow hover:shadow-glow-lg transition-all disabled:opacity-60"
            disabled={isSaving}
          >
            {isSaving ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSave className="w-4 h-4" />}
            {isSaving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border-subtle/70 bg-surface/70 backdrop-blur-2xl shadow-[0_20px_70px_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-3 border-b border-border-subtle/60 px-4">
          {['pt', 'translations'].map(value => (
            <button
              key={value}
              onClick={() => setTab(value as 'pt' | 'translations')}
              className={`relative px-4 py-3 text-sm transition-colors ${tab === value ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              {value === 'pt' ? 'Conteúdo PT' : 'Traduções'}
              {tab === value && (
                <motion.div
                  layoutId="admin-about-tab-pill"
                  className="absolute inset-x-1 bottom-0 h-0.5 rounded-full bg-primary"
                />
              )}
            </button>
          ))}
        </div>

        <div className="p-5">
          <AnimatePresence mode="wait">
            {tab === 'pt' ? (
              <motion.div
                key="pt"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Título"
                    value={form.title}
                    onChange={value => updateField('title', value)}
                    placeholder="Ex: Sobre interfaces vivas"
                  />
                  <Field
                    label="Summary"
                    value={form.summary}
                    onChange={value => updateField('summary', value)}
                    placeholder="Resumo curto para cards"
                  />
                </div>
                <Field
                  label="Long description (markdown)"
                  value={form.longDescription}
                  onChange={value => updateField('longDescription', value)}
                  placeholder="Conte sua história com markdown. Ex: **olá**"
                  multiline
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label="Vídeo pitch URL"
                    value={form.videoPitchUrl}
                    onChange={value => updateField('videoPitchUrl', value)}
                    placeholder="https://cdn/video.mp4"
                    icon={<FiFilm className="w-4 h-4 text-muted-foreground" />}
                  />
                  <Field
                    label="Profile image URL"
                    value={form.profileImage}
                    onChange={value => updateField('profileImage', value)}
                    placeholder="https://cdn/profile.jpg"
                    icon={<FiImage className="w-4 h-4 text-muted-foreground" />}
                  />
                </div>

                <div className="rounded-xl border border-border-subtle/70 bg-background/60 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground-subtle">
                      <FiRefreshCw className="w-4 h-4" />
                      Soft skills
                    </div>
                    <button
                      type="button"
                      onClick={addSoftSkill}
                      className="inline-flex items-center gap-2 rounded-lg border border-border-subtle px-3 py-2 text-sm text-foreground hover:border-primary/60 transition-colors"
                    >
                      <FiPlus className="w-4 h-4" />
                      Adicionar
                    </button>
                  </div>
                  <div className="space-y-3">
                    {form.softSkills.map((skill, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-border-subtle/60 bg-surface-soft/60 p-3 space-y-2"
                      >
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>#{index + 1}</span>
                          <button
                            type="button"
                            onClick={() => removeSoftSkill(index)}
                            className="text-red-300 hover:text-red-200 inline-flex items-center gap-1"
                          >
                            <FiTrash className="w-3 h-3" />
                            Remover
                          </button>
                        </div>
                        <Field
                          label="Nome"
                          value={skill.name}
                          onChange={value => updateSoftSkill(index, 'name', value)}
                          placeholder="Comunicação"
                        />
                        <Field
                          label="Descrição"
                          value={skill.description}
                          onChange={value => updateSoftSkill(index, 'description', value)}
                          placeholder="Ex: Conecto produto e tech."
                          multiline
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-border-subtle/70 bg-background/60 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground-subtle">
                      <FiRefreshCw className="w-4 h-4" />
                      Highlights
                    </div>
                    <button
                      type="button"
                      onClick={addHighlight}
                      className="inline-flex items-center gap-2 rounded-lg border border-border-subtle px-3 py-2 text-sm text-foreground hover:border-primary/60 transition-colors"
                    >
                      <FiPlus className="w-4 h-4" />
                      Adicionar
                    </button>
                  </div>
                  <div className="space-y-2">
                    {form.highlights.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-[11px] text-muted-foreground">#{index + 1}</span>
                        <input
                          value={item}
                          onChange={e => updateHighlight(index, e.target.value)}
                          placeholder="Resultado ou premiação"
                          className="flex-1 rounded-lg border border-border-subtle/70 bg-background/60 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 transition"
                        />
                        <button
                          type="button"
                          onClick={() => removeHighlight(index)}
                          className="text-red-300 hover:text-red-200"
                        >
                          <FiTrash className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="translations"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <TranslationEditor
                  pt={{ summary: form.summary, longDescription: form.longDescription }}
                  translations={{
                    en: { summary: form.translations.en.summary, longDescription: form.translations.en.longDescription },
                    es: { summary: form.translations.es.summary, longDescription: form.translations.es.longDescription },
                    fr: { summary: form.translations.fr.summary, longDescription: form.translations.fr.longDescription },
                  }}
                  onChange={(translations) =>
                    setForm(prev => ({
                      ...prev,
                      translations: {
                        ...prev.translations,
                        en: { ...prev.translations.en, ...translations.en },
                        es: { ...prev.translations.es, ...translations.es },
                        fr: { ...prev.translations.fr, ...translations.fr },
                      },
                    }))
                  }
                  onAutoTranslate={translateWithGemini}
                  fields={[
                    { key: 'summary', label: 'Summary traduzido', placeholder: 'Summary' },
                    { key: 'longDescription', label: 'Descrição longa traduzida', placeholder: 'Descrição longa', multiline: true },
                  ]}
                />

                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="text-xs text-muted-foreground">Soft skills e highlights (ajuste manual)</p>
                  <div className="flex flex-wrap gap-2">
                    {translationTabs.map(tabItem => (
                      <button
                        key={tabItem.code}
                        onClick={() => setTranslationTab(tabItem.code)}
                        className={`rounded-full border px-3 py-2 text-sm transition-colors ${translationTab === tabItem.code
                            ? 'border-primary/60 bg-primary/10 text-foreground'
                            : 'border-border-subtle/70 bg-surface-soft text-muted-foreground hover:border-primary/40'
                          }`}
                      >
                        {tabItem.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-border-subtle/70 bg-background/60 p-4 space-y-3">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground-subtle">Soft skills</div>
                  <div className="space-y-3">
                    {translationSoftSkills[translationTab].map((item, index) => (
                      <div key={index} className="rounded-lg border border-border-subtle/60 bg-surface-soft/60 p-3 space-y-2">
                        <p className="text-[11px] text-muted-foreground">#{index + 1} — {form.softSkills[index]?.name || 'Sem nome'}</p>
                        <Field
                          label="Descrição traduzida"
                          value={item.description}
                          onChange={value => updateTranslationSoftSkill(translationTab, index, value)}
                          placeholder="Descrição em outro idioma"
                          multiline
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-border-subtle/70 bg-background/60 p-4 space-y-3">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground-subtle">Highlights</div>
                  <div className="space-y-2">
                    {translationHighlights[translationTab].map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-[11px] text-muted-foreground">#{index + 1}</span>
                        <input
                          value={item}
                          onChange={e => updateTranslationHighlight(translationTab, index, e.target.value)}
                          placeholder="Highlight traduzido"
                          className="flex-1 rounded-lg border border-border-subtle/70 bg-background/60 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 transition"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-100"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  type?: string;
  icon?: ReactNode;
}

function Field({ label, value, onChange, placeholder, multiline, type = 'text', icon }: FieldProps) {
  const inputClass =
    'w-full rounded-xl border border-border-subtle/70 bg-background/60 px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 transition';

  if (multiline) {
    return (
      <label className="space-y-2 block">
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle">{label}</span>
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${inputClass} min-h-[120px]`}
        />
      </label>
    );
  }

  return (
    <label className="space-y-2 block">
      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle">{label}</span>
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${inputClass} ${icon ? 'pl-10' : ''}`}
        />
      </div>
    </label>
  );
}
