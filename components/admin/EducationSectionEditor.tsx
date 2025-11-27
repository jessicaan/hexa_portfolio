'use client';

import { useMemo, useState, useTransition, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSave, FiLoader, FiGlobe, FiPlus, FiTrash, FiRefreshCw, FiBook } from 'react-icons/fi';
import TranslationEditor from '@/components/admin/TranslationEditor';
import {
  autoTranslateEducation,
  saveEducationContent,
  type EducationContent,
  type EducationItem,
  type LanguageCode,
} from '@/app/admin/education/actions';

const translationTabs: { code: Exclude<LanguageCode, 'pt'>; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Espanol' },
  { code: 'fr', label: 'Frances' },
];

interface Props {
  initial: EducationContent;
}

export default function EducationSectionEditor({ initial }: Props) {
  const [tab, setTab] = useState<'pt' | 'translations'>('pt');
  const [translationTab, setTranslationTab] = useState<Exclude<LanguageCode, 'pt'>>('en');
  const [form, setForm] = useState<EducationContent>(initial);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, startSave] = useTransition();
  const [isTranslating, startTranslate] = useTransition();

  const statusBadge = form.updatedAt
    ? `Ultima atualizacao: ${new Date(form.updatedAt).toLocaleString('pt-BR')}`
    : 'Novo conteudo';

  const translationEducation = useMemo(() => {
    const baseEdu = form.education;
    const padEdu = (list: EducationItem[]) => {
      const arr = Array.isArray(list) ? [...list] : [];
      while (arr.length < baseEdu.length) {
        arr.push({
          institution: '',
          course: '',
          period: '',
          description: '',
          highlights: [],
        });
      }
      return arr.slice(0, baseEdu.length).map((item, idx) => {
        const baseHighlights = baseEdu[idx]?.highlights ?? [];
        const highlights = Array.isArray(item.highlights) ? [...item.highlights] : [];
        while (highlights.length < baseHighlights.length) highlights.push('');
        return {
          institution: item.institution ?? '',
          course: item.course ?? '',
          period: item.period ?? '',
          description: item.description ?? '',
          highlights: highlights.slice(0, baseHighlights.length),
        };
      });
    };

    return {
      en: padEdu(form.translations.en.education),
      es: padEdu(form.translations.es.education),
      fr: padEdu(form.translations.fr.education),
    };
  }, [form.education, form.translations.en.education, form.translations.es.education, form.translations.fr.education]);

  const updateField = (key: keyof EducationContent, value: unknown) => {
    setForm(prev => ({ ...prev, [key]: value } as EducationContent));
  };

  const addEducation = () => {
    setForm(prev => ({
      ...prev,
      education: [
        ...prev.education,
        { institution: '', course: '', period: '', description: '', highlights: [''] },
      ],
    }));
  };

  const removeEducation = (index: number) => {
    setForm(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const updateEducation = (index: number, key: keyof EducationItem, value: string | string[]) => {
    setForm(prev => {
      const education = [...prev.education];
      const current = education[index] ?? { institution: '', course: '', period: '', description: '', highlights: [] };
      education[index] = { ...current, [key]: value };
      return { ...prev, education };
    });
  };

  const addHighlight = (eduIndex: number) => {
    setForm(prev => {
      const education = [...prev.education];
      const current = education[eduIndex];
      if (!current) return prev;
      education[eduIndex] = { ...current, highlights: [...current.highlights, ''] };
      return { ...prev, education };
    });
  };

  const removeHighlight = (eduIndex: number, hlIndex: number) => {
    setForm(prev => {
      const education = [...prev.education];
      const current = education[eduIndex];
      if (!current) return prev;
      education[eduIndex] = {
        ...current,
        highlights: current.highlights.filter((_, i) => i !== hlIndex),
      };
      return { ...prev, education };
    });
  };

  const updateTranslationSummary = (lang: Exclude<LanguageCode, 'pt'>, value: string) => {
    setForm(prev => ({
      ...prev,
      translations: {
        ...prev.translations,
        [lang]: { ...prev.translations[lang], summary: value },
      },
    }));
  };

  const updateTranslationEducation = (
    lang: Exclude<LanguageCode, 'pt'>,
    index: number,
    key: keyof EducationItem,
    value: string,
  ) => {
    setForm(prev => {
      const list =
        lang === 'en'
          ? translationEducation.en
          : lang === 'es'
            ? translationEducation.es
            : translationEducation.fr;
      const updated = [...list];
      updated[index] = { ...updated[index], [key]: value };
      return {
        ...prev,
        translations: {
          ...prev.translations,
          [lang]: { ...prev.translations[lang], education: updated },
        },
      };
    });
  };

  const updateTranslationHighlight = (
    lang: Exclude<LanguageCode, 'pt'>,
    eduIndex: number,
    hlIndex: number,
    value: string,
  ) => {
    setForm(prev => {
      const list =
        lang === 'en'
          ? translationEducation.en
          : lang === 'es'
            ? translationEducation.es
            : translationEducation.fr;
      const updated = [...list];
      const edu = updated[eduIndex];
      if (!edu) return prev;
      const highlights = [...edu.highlights];
      highlights[hlIndex] = value;
      updated[eduIndex] = { ...edu, highlights };
      return {
        ...prev,
        translations: {
          ...prev.translations,
          [lang]: { ...prev.translations[lang], education: updated },
        },
      };
    });
  };

  const applyTranslations = (translations: EducationContent['translations']) => {
    setForm(prev => {
      const baseEdu = prev.education;
      const padEdu = (list: EducationItem[] | undefined) => {
        const arr = Array.isArray(list) ? [...list] : [];
        while (arr.length < baseEdu.length) {
          arr.push({
            institution: '',
            course: '',
            period: '',
            description: '',
            highlights: [],
          });
        }
        return arr.slice(0, baseEdu.length).map((item, idx) => {
          const baseHighlights = baseEdu[idx]?.highlights ?? [];
          const highlights = Array.isArray(item.highlights) ? [...item.highlights] : [];
          while (highlights.length < baseHighlights.length) highlights.push('');
          return {
            institution: item.institution ?? '',
            course: item.course ?? '',
            period: item.period ?? '',
            description: item.description ?? '',
            highlights: highlights.slice(0, baseHighlights.length),
          };
        });
      };

      return {
        ...prev,
        translations: {
          ...prev.translations,
          en: { ...prev.translations.en, ...translations.en, education: padEdu(translations.en.education) },
          es: { ...prev.translations.es, ...translations.es, education: padEdu(translations.es.education) },
          fr: { ...prev.translations.fr, ...translations.fr, education: padEdu(translations.fr.education) },
        },
      };
    });
  };

  const handleAutoTranslate = () => {
    setMessage(null);
    setError(null);
    startTranslate(async () => {
      try {
        const translations = await autoTranslateEducation({
          summary: form.summary,
          education: form.education,
        });
        applyTranslations(translations);
        setTab('translations');
        setMessage('Traducoes preenchidas automaticamente.');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Nao foi possivel traduzir agora.');
      }
    });
  };

  const handleSave = () => {
    setMessage(null);
    setError(null);
    startSave(async () => {
      try {
        await saveEducationContent({
          ...form,
          translations: {
            en: { ...form.translations.en, education: translationEducation.en },
            es: { ...form.translations.es, education: translationEducation.es },
            fr: { ...form.translations.fr, education: translationEducation.fr },
          },
        });
        setMessage('Conteudo salvo em /content/education no Firebase.');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Nao foi possivel salvar agora.');
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground-subtle">Education Section</p>
          <h1 className="text-2xl font-semibold text-foreground">Formacao + Cursos</h1>
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
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-semibold text-foreground shadow-glow hover:shadow-glow-lg transition-all disabled:opacity-60"
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
              {value === 'pt' ? 'Conteudo PT' : 'Traducoes'}
              {tab === value && (
                <motion.div
                  layoutId="admin-education-tab-pill"
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
                <Field
                  label="Summary"
                  value={form.summary}
                  onChange={value => updateField('summary', value)}
                  placeholder="Resumo curto da formacao"
                  multiline
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground-subtle">
                    <FiBook className="w-4 h-4" />
                    Entradas de educacao
                  </div>
                  <button
                    type="button"
                    onClick={addEducation}
                    className="inline-flex items-center gap-2 rounded-lg border border-border-subtle px-3 py-2 text-sm text-foreground hover:border-primary/60 transition-colors"
                  >
                    <FiPlus className="w-4 h-4" />
                    Adicionar entrada
                  </button>
                </div>

                <div className="space-y-4">
                  {form.education.map((edu, index) => (
                    <EducationCard
                      key={index}
                      index={index}
                      data={edu}
                      onChange={updateEducation}
                      onRemove={() => removeEducation(index)}
                      onAddHighlight={() => addHighlight(index)}
                      onRemoveHighlight={(hl) => removeHighlight(index, hl)}
                    />
                  ))}
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
                  pt={{ summary: form.summary }}
                  translations={{
                    en: { summary: form.translations.en.summary },
                    es: { summary: form.translations.es.summary },
                    fr: { summary: form.translations.fr.summary },
                  }}
                  onChange={(translations) => {
                    setForm(prev => ({
                      ...prev,
                      translations: {
                        ...prev.translations,
                        en: { ...prev.translations.en, summary: translations.en.summary ?? '' },
                        es: { ...prev.translations.es, summary: translations.es.summary ?? '' },
                        fr: { ...prev.translations.fr, summary: translations.fr.summary ?? '' },
                      },
                    }));
                  }}
                  onAutoTranslate={async (pt) => {
                    const translations = await autoTranslateEducation({
                      summary: pt.summary,
                      education: form.education,
                    });
                    applyTranslations({
                      en: { summary: translations.en.summary, education: translations.en.education },
                      es: { summary: translations.es.summary, education: translations.es.education },
                      fr: { summary: translations.fr.summary, education: translations.fr.education },
                    });
                    setTab('translations');
                    return {
                      en: { summary: translations.en.summary },
                      es: { summary: translations.es.summary },
                      fr: { summary: translations.fr.summary },
                    };
                  }}
                  fields={[
                    { key: 'summary', label: 'Summary traduzido', placeholder: 'Summary' },
                  ]}
                />

                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="text-xs text-muted-foreground">Traducoes alinhadas automaticamente (education e highlights seguem a estrutura PT).</p>
                  <div className="flex flex-wrap gap-2">
                    {translationTabs.map(tabItem => (
                      <button
                        key={tabItem.code}
                        onClick={() => setTranslationTab(tabItem.code)}
                        className={`rounded-full border px-3 py-2 text-sm transition-colors ${
                          translationTab === tabItem.code
                            ? 'border-primary/60 bg-primary/10 text-foreground'
                            : 'border-border-subtle/70 bg-surface-soft text-muted-foreground hover:border-primary/40'
                        }`}
                      >
                        {tabItem.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {translationEducation[translationTab].map((edu, index) => (
                    <TranslationCard
                      key={index}
                      index={index}
                      base={form.education[index]}
                      data={edu}
                      onChangeField={(key, value) => updateTranslationEducation(translationTab, index, key, value)}
                      onChangeHighlight={(hlIndex, value) => updateTranslationHighlight(translationTab, index, hlIndex, value)}
                    />
                  ))}
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

interface EducationCardProps {
  index: number;
  data: EducationItem;
  onChange: (index: number, key: keyof EducationItem, value: string | string[]) => void;
  onRemove: () => void;
  onAddHighlight: () => void;
  onRemoveHighlight: (hlIndex: number) => void;
}

function EducationCard({ index, data, onChange, onRemove, onAddHighlight, onRemoveHighlight }: EducationCardProps) {
  return (
    <div className="rounded-2xl border border-border-subtle/70 bg-background/60 p-4 space-y-3 shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
      <div className="flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">#{index + 1} Educacao</p>
        <button
          type="button"
          onClick={onRemove}
          className="text-red-300 hover:text-red-200 inline-flex items-center gap-1 text-sm"
        >
          <FiTrash className="w-4 h-4" />
          Remover
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          label="Instituicao"
          value={data.institution}
          onChange={value => onChange(index, 'institution', value)}
          placeholder="Universidade"
        />
        <Field
          label="Curso"
          value={data.course}
          onChange={value => onChange(index, 'course', value)}
          placeholder="Design / Engenharia"
        />
      </div>

      <Field
        label="Periodo"
        value={data.period}
        onChange={value => onChange(index, 'period', value)}
        placeholder="2018–2021"
      />

      <Field
        label="Descricao"
        value={data.description}
        onChange={value => onChange(index, 'description', value)}
        placeholder="Resumo da formacao ou curso."
        multiline
      />

      <div className="rounded-xl border border-border-subtle/60 bg-surface-soft/60 p-3 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground-subtle">Highlights</p>
          <button
            type="button"
            onClick={onAddHighlight}
            className="inline-flex items-center gap-2 rounded-lg border border-border-subtle px-3 py-1.5 text-sm text-foreground hover:border-primary/60 transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            Adicionar
          </button>
        </div>
        <div className="space-y-2">
          {data.highlights.map((hl, hlIndex) => (
            <div key={hlIndex} className="flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground">#{hlIndex + 1}</span>
              <input
                value={hl}
                onChange={e => onChange(index, 'highlights', data.highlights.map((h, i) => (i === hlIndex ? e.target.value : h)))}
                placeholder="Resultado ou destaque"
                className="flex-1 rounded-lg border border-border-subtle/70 bg-background/60 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 transition"
              />
              <button
                type="button"
                onClick={() => onRemoveHighlight(hlIndex)}
                className="text-red-300 hover:text-red-200"
              >
                <FiTrash className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface TranslationCardProps {
  index: number;
  base?: EducationItem;
  data: EducationItem;
  onChangeField: (key: keyof EducationItem, value: string) => void;
  onChangeHighlight: (hlIndex: number, value: string) => void;
}

function TranslationCard({ index, base, data, onChangeField, onChangeHighlight }: TranslationCardProps) {
  return (
    <div className="rounded-2xl border border-border-subtle/70 bg-background/60 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">#{index + 1} Tradução</p>
        <span className="rounded-full border border-border-subtle/60 bg-surface px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground-subtle">
          Synced
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          label="Instituicao traduzida"
          value={data.institution}
          onChange={value => onChangeField('institution', value)}
          placeholder={base?.institution}
        />
        <Field
          label="Curso traduzido"
          value={data.course}
          onChange={value => onChangeField('course', value)}
          placeholder={base?.course}
        />
      </div>

      <Field
        label="Periodo traduzido"
        value={data.period}
        onChange={value => onChangeField('period', value)}
        placeholder={base?.period}
      />

      <Field
        label="Descricao traduzida"
        value={data.description}
        onChange={value => onChangeField('description', value)}
        placeholder={base?.description}
        multiline
      />

      <div className="space-y-2">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground-subtle">Highlights traduzidos</p>
        {data.highlights.map((hl, hlIndex) => (
          <div key={hlIndex} className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground">#{hlIndex + 1}</span>
            <input
              value={hl}
              onChange={e => onChangeHighlight(hlIndex, e.target.value)}
              placeholder={base?.highlights?.[hlIndex]}
              className="flex-1 rounded-lg border border-border-subtle/70 bg-background/60 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 transition"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
