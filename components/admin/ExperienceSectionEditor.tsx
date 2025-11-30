'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSave, FiLoader, FiPlus, FiTrash, FiRefreshCw, FiBriefcase } from 'react-icons/fi';
import FileUploader from '@/components/admin/FileUploader';
import TranslationEditor from '@/components/admin/TranslationEditor';
import {
    autoTranslateExperience,
    saveExperienceContent,
} from '@/app/admin/experience/actions';
import type { ExperienceContent, ExperienceItem, LanguageCode } from '@/lib/content/schema';
import { defaultExperienceContent } from '@/lib/content/schema';

interface Props {
    initial: ExperienceContent;
}

export default function ExperienceSectionEditor({ initial }: Props) {
    const [tab, setTab] = useState<'pt' | 'translations'>('pt');
    const [form, setForm] = useState<ExperienceContent>(initial);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, startSave] = useTransition();
    const [isTranslating, startTranslate] = useTransition();

    const addExperience = () => {
        setForm(prev => ({
            ...prev,
            experiences: [
                ...prev.experiences,
                {
                    company: '',
                    role: '',
                    period: '',
                    contractType: '',
                    location: '',
                    description: '',
                    achievements: [''],
                    technologies: [''],
                    logo: '',
                },
            ],
        }));
    };

    const removeExperience = (index: number) => {
        setForm(prev => ({
            ...prev,
            experiences: prev.experiences.filter((_, i) => i !== index),
        }));
    };

    const updateExperience = (
        index: number,
        key: keyof ExperienceItem,
        value: ExperienceItem[keyof ExperienceItem],
    ) => {
        setForm(prev => {
            const experiences = [...prev.experiences];
            experiences[index] = { ...experiences[index], [key]: value };
            return { ...prev, experiences };
        });
    };

    const addAchievement = (expIndex: number) => {
        setForm(prev => {
            const experiences = [...prev.experiences];
            experiences[expIndex].achievements = [...experiences[expIndex].achievements, ''];
            return { ...prev, experiences };
        });
    };

    const removeAchievement = (expIndex: number, achIndex: number) => {
        setForm(prev => {
            const experiences = [...prev.experiences];
            experiences[expIndex].achievements = experiences[expIndex].achievements.filter((_, i) => i !== achIndex);
            return { ...prev, experiences };
        });
    };

    const addTechnology = (expIndex: number) => {
        setForm(prev => {
            const experiences = [...prev.experiences];
            experiences[expIndex].technologies = [...experiences[expIndex].technologies, ''];
            return { ...prev, experiences };
        });
    };

    const removeTechnology = (expIndex: number, techIndex: number) => {
        setForm(prev => {
            const experiences = [...prev.experiences];
            experiences[expIndex].technologies = experiences[expIndex].technologies.filter((_, i) => i !== techIndex);
            return { ...prev, experiences };
        });
    };

    const handleSave = () => {
        setMessage(null);
        setError(null);
        startSave(async () => {
            try {
                await saveExperienceContent(form);
                setMessage('Conteúdo salvo com sucesso.');
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro ao salvar.');
            }
        });
    };

    const translateWithGemini = async () => {
        const translations = await autoTranslateExperience({
            summary: form.summary,
            experiences: form.experiences,
        });
        setForm(prev => ({ ...prev, translations }));
        setTab('translations');
        return translations;
    };

    const handleAutoTranslate = () => {
        setMessage(null);
        setError(null);
        startTranslate(async () => {
            try {
                await translateWithGemini();
                setMessage('Traduções geradas com sucesso.');
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro ao traduzir.');
            }
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground-subtle">Experience</p>
                    <h1 className="text-xl font-semibold text-foreground">Experiência profissional</h1>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={handleAutoTranslate}
                        className="inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-surface-soft px-3 py-2 text-sm hover:border-primary/60 transition-colors disabled:opacity-60"
                        disabled={isTranslating}
                    >
                        {isTranslating ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiRefreshCw className="w-4 h-4" />}
                        Traduzir
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-primary to-secondary px-3 py-2 text-sm font-semibold text-foreground shadow-glow hover:shadow-glow-lg transition-all disabled:opacity-60"
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
                                <motion.div layoutId="experience-tab" className="absolute inset-x-1 bottom-0 h-0.5 rounded-full bg-primary" />
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
                                        placeholder="Descrição geral da sua experiência profissional"
                                        className="w-full rounded-lg border border-border-subtle/70 bg-background/60 px-3 py-2 text-sm min-h-20"
                                    />
                                </label>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                            <FiBriefcase className="w-4 h-4" />
                                            Experiências
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={addExperience}
                                            className="inline-flex items-center gap-2 rounded-lg border border-border-subtle px-3 py-1.5 text-sm hover:border-primary/60 transition-colors"
                                        >
                                            <FiPlus className="w-4 h-4" />
                                            Adicionar
                                        </button>
                                    </div>

                                    {form.experiences.map((exp, index) => (
                                        <ExperienceCard
                                            key={index}
                                            index={index}
                                            data={exp}
                                            onChange={updateExperience}
                                            onRemove={() => removeExperience(index)}
                                            onAddAchievement={() => addAchievement(index)}
                                            onRemoveAchievement={(achIdx) => removeAchievement(index, achIdx)}
                                            onAddTechnology={() => addTechnology(index)}
                                            onRemoveTechnology={(techIdx) => removeTechnology(index, techIdx)}
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
                                <TranslationEditor
                                    pt={form.translations.pt}
                                    translations={{
                                        en: form.translations.en,
                                        es: form.translations.es,
                                        fr: form.translations.fr,
                                    }}
                                    onChange={(newTranslations) => {
                                        setForm(prev => ({
                                            ...prev,
                                            translations: {
                                                ...prev.translations,
                                                en: { ...prev.translations.en, ...newTranslations.en },
                                                es: { ...prev.translations.es, ...newTranslations.es },
                                                fr: { ...prev.translations.fr, ...newTranslations.fr },
                                            },
                                        }))
                                    }}
                                    fields={[
                                        { key: 'eyebrow', label: 'Eyebrow', placeholder: 'Ex: Minha Jornada' },
                                        { key: 'title', label: 'Título', placeholder: 'Ex: Experiência Profissional' },
                                        { key: 'summary', label: 'Resumo', placeholder: 'Ex: Breve descrição da sua experiência', multiline: true },
                                        { key: 'detailHeading', label: 'Título Detalhes', placeholder: 'Ex: Detalhes do Cargo' },
                                        { key: 'highlightsHeading', label: 'Título Destaques', placeholder: 'Ex: Principais Conquistas' },
                                        { key: 'stackHeading', label: 'Título Tecnologias', placeholder: 'Ex: Tecnologias Utilizadas' },
                                    ]}
                                    onAutoTranslate={translateWithGemini}
                                />

                                {form.experiences.map((exp, expIndex) => (
                                    <div key={expIndex} className="rounded-xl border border-border-subtle/70 bg-background/60 p-4 space-y-3">
                                        <h4 className="text-sm font-semibold text-foreground">Tradução para Experiência #{expIndex + 1}</h4>
                                        <p className="text-xs text-muted-foreground-subtle">{exp.role} @ {exp.company}</p>
                                        <TranslatedExperienceEditor
                                            expIndex={expIndex}
                                            translations={form.translations}
                                            onExperienceChange={(lang: TranslationLang, index: number, key: keyof ExperienceItem, value: ExperienceItem[keyof ExperienceItem]) => {
                                                setForm(prev => {
                                                    const newTranslations = { ...prev.translations };
                                                    const experiences = [...(newTranslations[lang]?.experiences ?? [])];
                                                    const fallback: ExperienceItem = {
                                                        company: '',
                                                        role: '',
                                                        period: '',
                                                        contractType: '',
                                                        location: '',
                                                        description: '',
                                                        achievements: [],
                                                        technologies: [],
                                                        logo: '',
                                                    };
                                                    const current = experiences[index] ?? fallback;
                                                    experiences[index] = { ...current, [key]: value };
                                                    newTranslations[lang] = { ...newTranslations[lang], experiences };

                                                    return { ...prev, translations: newTranslations };
                                                });
                                            }}
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

type TranslationLang = keyof ExperienceContent['translations'];

interface TranslatedExperienceEditorProps {
    translations: ExperienceContent['translations'];
    expIndex: number;
    onExperienceChange: (lang: TranslationLang, index: number, key: keyof ExperienceItem, value: ExperienceItem[keyof ExperienceItem]) => void;
}

function TranslatedExperienceEditor({ translations, expIndex, onExperienceChange }: TranslatedExperienceEditorProps) {
    const [lang, setLang] = useState<TranslationLang>('en');

    const currentTranslation = translations?.[lang]?.experiences?.[expIndex] || {};

    return (
        <div className="space-y-3">
            <div className="flex gap-2">
                {(['en', 'es', 'fr'] as TranslationLang[]).map(l => (
                    <button
                        key={l}
                        onClick={() => setLang(l)}
                        className={`px-3 py-1 text-xs rounded-full ${lang === l ? 'bg-primary text-white' : 'bg-surface-soft'}`}
                    >
                        {l.toUpperCase()}
                    </button>
                ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
                <Input label="Cargo" value={currentTranslation.role ?? ''} onChange={v => onExperienceChange(lang, expIndex, 'role', v)} />
                <Input label="Descrição" value={currentTranslation.description ?? ''} onChange={v => onExperienceChange(lang, expIndex, 'description', v)} multiline />
            </div>
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle">Conquistas</span>
                </div>
                {(currentTranslation.achievements ?? []).map((ach: string, achIdx: number) => (
                    <div key={achIdx} className="flex gap-2">
                        <input
                            value={ach}
                            onChange={(e) => {
                                const newAchievements = [...(currentTranslation.achievements ?? [])];
                                newAchievements[achIdx] = e.target.value;
                                onExperienceChange(lang, expIndex, 'achievements', newAchievements);
                            }}
                            className="flex-1 rounded-lg border border-border-subtle/70 bg-background/60 px-3 py-2 text-sm"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

interface ExperienceCardProps {
    index: number;
    data: ExperienceItem;
    onChange: (index: number, key: keyof ExperienceItem, value: ExperienceItem[keyof ExperienceItem]) => void;
    onRemove: () => void;
    onAddAchievement: () => void;
    onRemoveAchievement: (achIndex: number) => void;
    onAddTechnology: () => void;
    onRemoveTechnology: (techIndex: number) => void;
}

function ExperienceCard({
    index,
    data,
    onChange,
    onRemove,
    onAddAchievement,
    onRemoveAchievement,
    onAddTechnology,
    onRemoveTechnology,
}: ExperienceCardProps) {
    return (
        <div className="rounded-xl border border-border-subtle/70 bg-background/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">#{index + 1}</p>
                <button type="button" onClick={onRemove} className="text-red-300 hover:text-red-200 text-sm">
                    <FiTrash className="w-4 h-4" />
                </button>
            </div>

            <FileUploader
                value={data.logo ?? ''}
                onChange={(url) => onChange(index, 'logo', url)}
                accept="image/*"
                label="Logo da empresa"
                folder="logos"
            />

            <div className="grid gap-3 sm:grid-cols-2">
                <Input label="Empresa" value={data.company} onChange={(v) => onChange(index, 'company', v)} />
                <Input label="Cargo" value={data.role} onChange={(v) => onChange(index, 'role', v)} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-2 block">
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle">Tipo de contrato</span>
                    <select
                        value={data.contractType}
                        onChange={(e) => onChange(index, 'contractType', e.target.value)}
                        className="w-full rounded-lg border border-border-subtle/70 bg-background/60 px-3 py-2 text-sm"
                    >
                        <option value="">Selecione...</option>
                        <option value="CLT">CLT</option>
                        <option value="PJ">PJ</option>
                        <option value="PJ">PJ - Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Freelancer">Freelancer</option>
                        <option value="Estágio">Estágio</option>
                        <option value="Temporário">Temporário</option>
                        <option value="Voluntário">Voluntário</option>
                        <option value="Contrato internacional">Contrato internacional</option>
                        <option value="Remoto">Remoto</option>
                    </select>
                </label>
                <Input
                    label="Localidade"
                    value={data.location}
                    onChange={(v) => onChange(index, 'location', v)}
                    placeholder="Cidade/País ou remoto"
                />
            </div>

            <Input label="Período" value={data.period} onChange={(v) => onChange(index, 'period', v)} placeholder="Jan 2020 - Dez 2022" />
            <Input label="Descrição" value={data.description} onChange={(v) => onChange(index, 'description', v)} multiline />

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle">Conquistas</span>
                    <button type="button" onClick={onAddAchievement} className="text-xs text-primary hover:underline">
                        + Adicionar
                    </button>
                </div>
                {data.achievements.map((ach, achIdx) => (
                    <div key={achIdx} className="flex gap-2">
                        <input
                            value={ach}
                            onChange={(e) => onChange(index, 'achievements', data.achievements.map((a, i) => i === achIdx ? e.target.value : a))}
                            className="flex-1 rounded-lg border border-border-subtle/70 bg-background/60 px-3 py-2 text-sm"
                        />
                        <button type="button" onClick={() => onRemoveAchievement(achIdx)} className="text-red-300">
                            <FiTrash className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle">Tecnologias</span>
                    <button type="button" onClick={onAddTechnology} className="text-xs text-primary hover:underline">
                        + Adicionar
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {data.technologies.map((tech, techIdx) => (
                        <div key={techIdx} className="flex items-center gap-1 rounded-full border border-border-subtle px-3 py-1">
                            <input
                                value={tech}
                                onChange={(e) => onChange(index, 'technologies', data.technologies.map((t, i) => i === techIdx ? e.target.value : t))}
                                className="w-20 bg-transparent text-sm outline-none"
                            />
                            <button type="button" onClick={() => onRemoveTechnology(techIdx)} className="text-red-300">
                                <FiTrash className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
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
                <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${className} min-h-20`} />
            ) : (
                <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={className} />
            )}
        </label>
    );
}
