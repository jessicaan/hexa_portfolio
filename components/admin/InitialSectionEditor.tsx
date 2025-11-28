'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSave, FiLoader, FiRefreshCw, FiZap } from 'react-icons/fi';
import FileUploader from '@/components/admin/FileUploader';
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
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground-subtle">Initial</p>
          <h1 className="text-xl font-semibold text-foreground">Seção inicial</h1>
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
                <motion.div layoutId="initial-tab" className="absolute inset-x-1 bottom-0 h-0.5 rounded-full bg-primary" />
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
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Headline"
                    value={form.headline}
                    onChange={value => setForm(prev => ({ ...prev, headline: value }))}
                    placeholder="Título principal"
                  />
                  <Input
                    label="Subheadline"
                    value={form.subheadline}
                    onChange={value => setForm(prev => ({ ...prev, subheadline: value }))}
                    placeholder="Subtítulo"
                  />
                </div>

                <Input
                  label="Descrição"
                  value={form.description}
                  onChange={value => setForm(prev => ({ ...prev, description: value }))}
                  placeholder="Descrição do hero"
                  multiline
                />

                <FileUploader
                  value={form.heroVideoUrl}
                  onChange={url => setForm(prev => ({ ...prev, heroVideoUrl: url }))}
                  accept="video/*"
                  label="Vídeo do hero"
                  folder="hero"
                />

                <div className="rounded-lg border border-border-subtle/70 bg-background/60 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle mb-2">
                    Idiomas disponíveis
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {languageOptions.map(code => (
                      <label
                        key={code}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors cursor-pointer ${form.languagesAvailable.includes(code)
                          ? 'border-primary/60 bg-primary/10 text-foreground'
                          : 'border-border-subtle/70 bg-surface-soft text-muted-foreground hover:border-primary/40'
                          }`}
                      >
                        <input
                          type="checkbox"
                          checked={form.languagesAvailable.includes(code)}
                          onChange={() => toggleLanguage(code)}
                          className="accent-primary"
                        />
                        {code.toUpperCase()}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-border-subtle/70 bg-background/60 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle">
                    <FiZap className="w-4 h-4" />
                    Configuração de background
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Input
                      label="Gradient from"
                      value={form.backgroundConfig.gradientFrom ?? ''}
                      onChange={value => updateBackground('gradientFrom', value)}
                      placeholder="hsl(var(--primary))"
                    />
                    <Input
                      label="Gradient to"
                      value={form.backgroundConfig.gradientTo ?? ''}
                      onChange={value => updateBackground('gradientTo', value)}
                      placeholder="hsl(var(--secondary))"
                    />
                    <Input
                      label="Glow color"
                      value={form.backgroundConfig.glowColor ?? ''}
                      onChange={value => updateBackground('glowColor', value)}
                      placeholder="hsl(var(--glow))"
                    />
                    <Input
                      label="Noise opacity"
                      type="number"
                      step="0.01"
                      value={form.backgroundConfig.noiseOpacity?.toString() ?? '0'}
                      onChange={value => updateBackground('noiseOpacity', Number(value))}
                      placeholder="0.08"
                    />
                    <Input
                      label="Blur"
                      type="number"
                      value={form.backgroundConfig.blur?.toString() ?? '0'}
                      onChange={value => updateBackground('blur', Number(value))}
                      placeholder="12"
                    />
                  </div>
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
                    <Input
                      label="Headline"
                      value={form.translations[lang]?.headline ?? ''}
                      onChange={value =>
                        setForm(prev => ({
                          ...prev,
                          translations: {
                            ...prev.translations,
                            [lang]: { ...prev.translations[lang], headline: value },
                          },
                        }))
                      }
                    />
                    <Input
                      label="Subheadline"
                      value={form.translations[lang]?.subheadline ?? ''}
                      onChange={value =>
                        setForm(prev => ({
                          ...prev,
                          translations: {
                            ...prev.translations,
                            [lang]: { ...prev.translations[lang], subheadline: value },
                          },
                        }))
                      }
                    />
                    <Input
                      label="Descrição"
                      value={form.translations[lang]?.description ?? ''}
                      onChange={value =>
                        setForm(prev => ({
                          ...prev,
                          translations: {
                            ...prev.translations,
                            [lang]: { ...prev.translations[lang], description: value },
                          },
                        }))
                      }
                      multiline
                    />
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
  type?: string;
  step?: string | number;
  placeholder?: string;
}

function Input({ label, value, onChange, multiline, type = 'text', step, placeholder }: InputProps) {
  const className = "w-full rounded-lg border border-border-subtle/70 bg-background/60 px-3 py-2 text-sm";
  return (
    <label className="space-y-2 block">
      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle">{label}</span>
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={`${className} min-h-20`} />
      ) : (
        <input type={type} step={step} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={className} />
      )}
    </label>
  );
}
