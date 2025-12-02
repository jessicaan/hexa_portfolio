'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSave, FiLoader, FiPlus, FiTrash, FiRefreshCw, FiBook } from 'react-icons/fi';
import {
  autoTranslateEducation,
  saveEducationContent,
  type EducationContent,
  type EducationItem,
} from '@/app/admin/education/actions';

interface Props {
  initial: EducationContent;
}

export default function EducationSectionEditor({ initial }: Props) {
  const [tab, setTab] = useState<'pt' | 'translations'>('pt');
  const [form, setForm] = useState<EducationContent>(initial);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, startSave] = useTransition();
  const [isTranslating, startTranslate] = useTransition();

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
      education[index] = { ...education[index], [key]: value };
      return { ...prev, education };
    });
  };

  const addHighlight = (eduIndex: number) => {
    setForm(prev => {
      const education = [...prev.education];
      education[eduIndex].highlights = [...education[eduIndex].highlights, ''];
      return { ...prev, education };
    });
  };

  const removeHighlight = (eduIndex: number, hlIndex: number) => {
    setForm(prev => {
      const education = [...prev.education];
      education[eduIndex].highlights = education[eduIndex].highlights.filter((_, i) => i !== hlIndex);
      return { ...prev, education };
    });
  };

  const handleSave = () => {
    setMessage(null);
    setError(null);
    startSave(async () => {
      try {
        await saveEducationContent(form);
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
        const translations = await autoTranslateEducation({
          summary: form.summary,
          education: form.education,
        });
        setForm(prev => ({ ...prev, translations }));
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
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground-subtle">Education</p>
          <h1 className="text-xl font-semibold text-foreground">Formação acadêmica</h1>
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
                <motion.span layoutId="education-tab" className="absolute inset-x-1 bottom-0 h-0.5 rounded-full bg-primary block" />
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
                <label className="space-y-2 block">
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle">Resumo</span>
                  <textarea
                    value={form.summary}
                    onChange={e => setForm(prev => ({ ...prev, summary: e.target.value }))}
                    placeholder="Introdução sobre sua formação"
                    className="w-full rounded-lg border border-border-subtle/70 bg-background/60 px-3 py-2 text-sm min-h-[60px]"
                  />
                </label>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <FiBook className="w-4 h-4" />
                      Educação
                    </h3>
                    <button
                      type="button"
                      onClick={addEducation}
                      className="inline-flex items-center gap-2 rounded-lg border border-border-subtle px-3 py-1.5 text-sm hover:border-primary/60 transition-colors"
                    >
                      <FiPlus className="w-4 h-4" />
                      Adicionar
                    </button>
                  </div>

                  {form.education.map((edu, index) => (
                    <EducationCard
                      key={index}
                      index={index}
                      data={edu}
                      onChange={updateEducation}
                      onRemove={() => removeEducation(index)}
                      onAddHighlight={() => addHighlight(index)}
                      onRemoveHighlight={(hlIdx) => removeHighlight(index, hlIdx)}
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
                className="space-y-4"
              >
                <p className="text-xs text-muted-foreground">Traduções automáticas geradas.</p>
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
    <div className="rounded-xl border border-border-subtle/70 bg-background/60 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">#{index + 1}</p>
        <button type="button" onClick={onRemove} className="text-red-300 hover:text-red-200 text-sm">
          <FiTrash className="w-4 h-4" />
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          label="Instituição"
          value={data.institution}
          onChange={v => onChange(index, 'institution', v)}
          placeholder="Universidade"
        />
        <Input
          label="Curso"
          value={data.course}
          onChange={v => onChange(index, 'course', v)}
          placeholder="Engenharia, Design..."
        />
      </div>

      <Input
        label="Período"
        value={data.period}
        onChange={v => onChange(index, 'period', v)}
        placeholder="2018-2022"
      />

      <Input
        label="Descrição"
        value={data.description}
        onChange={v => onChange(index, 'description', v)}
        placeholder="Resumo da formação"
        multiline
      />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle">Highlights</span>
          <button type="button" onClick={onAddHighlight} className="text-xs text-primary hover:underline">
            + Adicionar
          </button>
        </div>
        {data.highlights.map((hl, hlIdx) => (
          <div key={hlIdx} className="flex gap-2">
            <input
              value={hl}
              onChange={e => onChange(index, 'highlights', data.highlights.map((h, i) => i === hlIdx ? e.target.value : h))}
              placeholder="Conquista ou destaque"
              className="flex-1 rounded-lg border border-border-subtle/70 bg-background/60 px-3 py-2 text-sm"
            />
            <button type="button" onClick={() => onRemoveHighlight(hlIdx)} className="text-red-300">
              <FiTrash className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
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
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={`${className} min-h-[60px]`} />
      ) : (
        <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={className} />
      )}
    </label>
  );
}
