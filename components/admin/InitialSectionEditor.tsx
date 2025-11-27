'use client';

import { useMemo, useState, useTransition, type ReactNode } from 'react';
import { FiSave, FiLoader, FiGlobe, FiFilm, FiSliders, FiZap } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import TranslationEditor from '@/components/admin/TranslationEditor';
import {
  autoTranslateContent,
  saveInitialContent,
  type InitialSectionContent,
  type LanguageCode,
} from '@/app/admin/initial/actions';

const languageOptions: LanguageCode[] = ['pt', 'en', 'es', 'fr'];

interface Props {
  initial: InitialSectionContent;
}

export default function InitialSectionEditor({ initial }: Props) {
  const [tab, setTab] = useState<'pt' | 'translations'>('pt');
  const [form, setForm] = useState<InitialSectionContent>(initial);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, startSave] = useTransition();
  const [isTranslating, startTranslate] = useTransition();

  const languagesSelected = useMemo(() => new Set(form.languagesAvailable), [form.languagesAvailable]);

  const updateField = (key: keyof InitialSectionContent, value: unknown) => {
    setForm(prev => ({ ...prev, [key]: value } as InitialSectionContent));
  };

  const toggleLanguage = (code: LanguageCode) => {
    setForm(prev => {
      const set = new Set(prev.languagesAvailable);
      if (set.has(code)) {
        set.delete(code);
      } else {
        set.add(code);
      }
      return { ...prev, languagesAvailable: Array.from(set) };
    });
  };

  const updateBackground = (key: keyof InitialSectionContent['backgroundConfig'], value: string | number) => {
    setForm(prev => ({
      ...prev,
      backgroundConfig: {
        ...prev.backgroundConfig,
        [key]: value,
      },
    }));
  };

  const handleSave = () => {
    setMessage(null);
    setError(null);
    startSave(async () => {
      try {
        await saveInitialContent(form);
        setMessage('Conteúdo salvo em /content/initial no Firebase.');
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
        const translations = await autoTranslateContent({
          headline: form.headline,
          subheadline: form.subheadline,
          description: form.description,
        });
        setForm(prev => ({
          ...prev,
          translations: {
            ...prev.translations,
            ...translations,
          },
        }));
        setMessage('Traduções preenchidas automaticamente.');
        setTab('translations');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Não foi possível traduzir agora.');
      }
    });
  };

  const statusBadge = form.updatedAt
    ? `Última atualização: ${new Date(form.updatedAt).toLocaleString('pt-BR')}`
    : 'Novo conteúdo';

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground-subtle">Initial Section</p>
          <h1 className="text-2xl font-semibold text-foreground">Editar hero imersivo</h1>
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
              className={`relative px-4 py-3 text-sm transition-colors ${tab === value ? 'text-foreground' : 'text-muted-foreground'
                }`}
            >
              {value === 'pt' ? 'Conteúdo PT' : 'Traduções'}
              {tab === value && (
                <motion.div
                  layoutId="admin-tab-pill"
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
                    label="Headline"
                    value={form.headline}
                    onChange={value => updateField('headline', value)}
                    placeholder="Ex: Interfaces vivas e imersivas"
                  />
                  <Field
                    label="Subheadline"
                    value={form.subheadline}
                    onChange={value => updateField('subheadline', value)}
                    placeholder="Ex: Frontend com motion e microinterações"
                  />
                </div>

                <Field
                  label="Descrição"
                  value={form.description}
                  onChange={value => updateField('description', value)}
                  placeholder="Texto que aparece no hero explicando seu posicionamento."
                  multiline
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label="Hero video URL"
                    value={form.heroVideoUrl}
                    onChange={value => updateField('heroVideoUrl', value)}
                    placeholder="https://cdn..."
                    icon={<FiFilm className="w-4 h-4 text-muted-foreground" />}
                  />

                  <div className="rounded-xl border border-border-subtle/70 bg-background/60 p-3">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground-subtle mb-2 flex items-center gap-2">
                      <FiGlobe className="w-4 h-4" />
                      Idiomas disponíveis
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {languageOptions.map(code => (
                        <label
                          key={code}
                          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${languagesSelected.has(code)
                            ? 'border-primary/60 bg-primary/10 text-foreground'
                            : 'border-border-subtle/70 bg-surface-soft text-muted-foreground hover:border-primary/40'
                            }`}
                        >
                          <input
                            type="checkbox"
                            checked={languagesSelected.has(code)}
                            onChange={() => toggleLanguage(code)}
                            className="accent-primary"
                          />
                          {code.toUpperCase()}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border-subtle/70 bg-background/60 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground-subtle">
                    <FiSliders className="w-4 h-4" />
                    Background config
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Field
                      label="Gradient from"
                      value={form.backgroundConfig.gradientFrom ?? ''}
                      onChange={value => updateBackground('gradientFrom', value)}
                      placeholder="hsl(var(--primary))"
                    />
                    <Field
                      label="Gradient to"
                      value={form.backgroundConfig.gradientTo ?? ''}
                      onChange={value => updateBackground('gradientTo', value)}
                      placeholder="hsl(var(--secondary))"
                    />
                    <Field
                      label="Glow color"
                      value={form.backgroundConfig.glowColor ?? ''}
                      onChange={value => updateBackground('glowColor', value)}
                      placeholder="hsl(var(--glow))"
                    />
                    <Field
                      label="Noise opacity"
                      type="number"
                      step="0.01"
                      value={form.backgroundConfig.noiseOpacity?.toString() ?? '0'}
                      onChange={value => updateBackground('noiseOpacity', Number(value))}
                      placeholder="0.08"
                    />
                    <Field
                      label="Blur"
                      type="number"
                      value={form.backgroundConfig.blur?.toString() ?? '0'}
                      onChange={value => updateBackground('blur', Number(value))}
                      placeholder="12"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <FiZap className="w-4 h-4" />
                    Esses valores são salvos como objeto em /content/initial.backgroundConfig.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="translations"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <TranslationEditor
                  pt={{
                    headline: form.headline,
                    subheadline: form.subheadline,
                    description: form.description,
                  }}
                  translations={form.translations}
                  onChange={(translations) =>
                    setForm(prev => ({ ...prev, translations: { ...prev.translations, ...translations } }))
                  }
                  onAutoTranslate={autoTranslateContent}
                  fields={[
                    { key: 'headline', label: 'Headline traduzido', placeholder: 'Headline' },
                    { key: 'subheadline', label: 'Subheadline traduzido', placeholder: 'Subheadline' },
                    { key: 'description', label: 'Descrição traduzida', placeholder: 'Descrição', multiline: true },
                  ]}
                />
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
  step?: string;
  icon?: ReactNode;
}

function Field({ label, value, onChange, placeholder, multiline, type = 'text', step, icon }: FieldProps) {
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
          step={step}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${inputClass} ${icon ? 'pl-10' : ''}`}
        />
      </div>
    </label>
  );
}
