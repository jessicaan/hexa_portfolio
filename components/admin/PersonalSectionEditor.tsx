'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSave, FiLoader, FiPlus, FiTrash, FiRefreshCw } from 'react-icons/fi';
import FileUploader from '@/components/admin/FileUploader';
import {
    autoTranslatePersonal,
    savePersonalContent,
} from '@/app/admin/personal/actions';
import type { PersonalContent, Trait, HobbyCard } from '@/lib/content/schema';

interface Props {
    initial: PersonalContent;
}

export default function PersonalSectionEditor({ initial }: Props) {
    const [form, setForm] = useState<PersonalContent>(initial);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, startSave] = useTransition();
    const [isTranslating, startTranslate] = useTransition();
    const [activeTab, setActiveTab] = useState<'general' | 'traits' | 'hobbies' | 'translations'>('general');

    const addValue = () => setForm(prev => ({ ...prev, values: [...prev.values, ''] }));
    const removeValue = (index: number) => setForm(prev => ({ ...prev, values: prev.values.filter((_, i) => i !== index) }));
    const updateValue = (index: number, value: string) => {
        setForm(prev => ({
            ...prev,
            values: prev.values.map((v, i) => (i === index ? value : v)),
        }));
    };

    const addPhoto = () => setForm(prev => ({ ...prev, photos: [...prev.photos, ''] }));
    const removePhoto = (index: number) => setForm(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }));
    const updatePhoto = (index: number, url: string) => {
        setForm(prev => ({
            ...prev,
            photos: prev.photos.map((p, i) => (i === index ? url : p)),
        }));
    };

    const addSocialLink = () => setForm(prev => ({ ...prev, socialLinks: [...prev.socialLinks, { platform: '', url: '' }] }));
    const removeSocialLink = (index: number) => setForm(prev => ({ ...prev, socialLinks: prev.socialLinks.filter((_, i) => i !== index) }));
    const updateSocialLink = (index: number, key: 'platform' | 'url', value: string) => {
        setForm(prev => ({
            ...prev,
            socialLinks: prev.socialLinks.map((s, i) => (i === index ? { ...s, [key]: value } : s)),
        }));
    };

    const addTrait = () => {
        const newTrait: Trait = { id: `trait-${Date.now()}`, label: '', value: 0.5 };
        setForm(prev => ({ ...prev, traits: [...prev.traits, newTrait] }));
    };

    const removeTrait = (index: number) => {
        setForm(prev => ({
            ...prev,
            traits: prev.traits.filter((_, i) => i !== index),
        }));
    };

    const updateTrait = (index: number, key: keyof Trait, value: string | number) => {
        setForm(prev => ({
            ...prev,
            traits: prev.traits.map((t, i) =>
                i === index ? { ...t, [key]: key === 'value' ? Number(value) : value } : t
            ),
        }));
    };

    const addHobbyCard = () => {
        const newCard: HobbyCard = { id: `hobby-${Date.now()}`, title: '', description: '' };
        setForm(prev => ({ ...prev, hobbyCards: [...prev.hobbyCards, newCard] }));
    };

    const removeHobbyCard = (index: number) => {
        setForm(prev => ({
            ...prev,
            hobbyCards: prev.hobbyCards.filter((_, i) => i !== index),
        }));
    };

    const updateHobbyCard = (index: number, key: keyof HobbyCard, value: string) => {
        setForm(prev => ({
            ...prev,
            hobbyCards: prev.hobbyCards.map((h, i) => (i === index ? { ...h, [key]: value } : h)),
        }));
    };

    const handleSave = () => {
        setMessage(null);
        setError(null);
        startSave(async () => {
            try {
                await savePersonalContent(form);
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
                const translations = await autoTranslatePersonal({
                    bio: form.bio,
                    values: form.values,
                    traits: form.traits,
                    hobbyCards: form.hobbyCards,
                });
                setForm(prev => ({ ...prev, translations }));
                setMessage('Traduções geradas com sucesso.');
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro ao traduzir.');
            }
        });
    };

    const tabs = [
        { id: 'general', label: 'Geral' },
        { id: 'traits', label: 'Traits' },
        { id: 'hobbies', label: 'Hobbies' },
        { id: 'translations', label: 'Traduções' },
    ] as const;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground-subtle">Personal</p>
                    <h1 className="text-xl font-semibold text-foreground">Informações Pessoais</h1>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={handleAutoTranslate}
                        className="inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-surface-soft px-3 py-2 text-sm hover:border-primary/60 transition-colors"
                        disabled={isTranslating}
                    >
                        {isTranslating ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiRefreshCw className="w-4 h-4" />}
                        Traduzir
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
                        disabled={isSaving}
                    >
                        {isSaving ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSave className="w-4 h-4" />}
                        Salvar
                    </button>
                </div>
            </div>

            <div className="flex gap-1 p-1 rounded-lg bg-surface-soft border border-border-subtle">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 px-4 py-2 text-sm rounded-md transition-colors ${activeTab === tab.id
                            ? 'bg-primary/20 text-primary font-medium'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'general' && (
                    <motion.div
                        key="general"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        <div className="rounded-xl border border-border-subtle bg-surface-soft p-5 space-y-4">
                            <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Informações Básicas</p>

                            <label className="block space-y-2">
                                <span className="text-xs text-muted-foreground">Bio</span>
                                <textarea
                                    value={form.bio}
                                    onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))}
                                    placeholder="Conte um pouco sobre você..."
                                    className="w-full rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm min-h-[100px] resize-none"
                                />
                            </label>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">Valores</span>
                                    <button type="button" onClick={addValue} className="text-xs text-primary hover:underline flex items-center gap-1">
                                        <FiPlus className="w-3 h-3" /> Adicionar
                                    </button>
                                </div>
                                {form.values.map((value, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <input
                                            value={value}
                                            onChange={e => updateValue(idx, e.target.value)}
                                            placeholder="Ex: Inovação, Colaboração..."
                                            className="flex-1 rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm"
                                        />
                                        <button type="button" onClick={() => removeValue(idx)} className="text-red-400 hover:text-red-300 p-2">
                                            <FiTrash className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-xl border border-border-subtle bg-surface-soft p-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Fotos</p>
                                <button type="button" onClick={addPhoto} className="text-xs text-primary hover:underline flex items-center gap-1">
                                    <FiPlus className="w-3 h-3" /> Adicionar
                                </button>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {form.photos.map((photo, idx) => (
                                    <div key={idx} className="relative">
                                        <FileUploader
                                            value={photo}
                                            onChange={url => updatePhoto(idx, url)}
                                            accept="image/*"
                                            label={`Foto ${idx + 1}`}
                                            folder="personal"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removePhoto(idx)}
                                            className="absolute top-2 right-2 text-red-400 hover:text-red-300 text-xs bg-black/50 rounded px-2 py-1"
                                        >
                                            Remover
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-xl border border-border-subtle bg-surface-soft p-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Redes Sociais</p>
                                <button type="button" onClick={addSocialLink} className="text-xs text-primary hover:underline flex items-center gap-1">
                                    <FiPlus className="w-3 h-3" /> Adicionar
                                </button>
                            </div>
                            {form.socialLinks.map((link, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input
                                        value={link.platform}
                                        onChange={e => updateSocialLink(idx, 'platform', e.target.value)}
                                        placeholder="Plataforma"
                                        className="w-32 rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm"
                                    />
                                    <input
                                        value={link.url}
                                        onChange={e => updateSocialLink(idx, 'url', e.target.value)}
                                        placeholder="URL"
                                        className="flex-1 rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm"
                                    />
                                    <button type="button" onClick={() => removeSocialLink(idx)} className="text-red-400 hover:text-red-300 p-2">
                                        <FiTrash className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'traits' && (
                    <motion.div
                        key="traits"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                    >
                        <div className="rounded-xl border border-border-subtle bg-surface-soft p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Traits do Gráfico</p>
                                    <p className="text-[11px] text-muted-foreground mt-1">Defina os traços que aparecem no gráfico radar</p>
                                </div>
                                <button type="button" onClick={addTrait} className="text-xs text-primary hover:underline flex items-center gap-1">
                                    <FiPlus className="w-3 h-3" /> Adicionar Trait
                                </button>
                            </div>

                            <div className="space-y-4">
                                {form.traits.map((trait, idx) => (
                                    <div
                                        key={trait.id}
                                        className="rounded-lg border border-border-subtle bg-background p-4 space-y-3"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-muted-foreground">Trait {idx + 1}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeTrait(idx)}
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                <FiTrash className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <label className="block space-y-1">
                                                <span className="text-[11px] text-muted-foreground">ID</span>
                                                <input
                                                    value={trait.id}
                                                    onChange={e => updateTrait(idx, 'id', e.target.value)}
                                                    placeholder="curiosity"
                                                    className="w-full rounded-lg border border-border-subtle bg-surface-soft px-3 py-2 text-sm"
                                                />
                                            </label>
                                            <label className="block space-y-1">
                                                <span className="text-[11px] text-muted-foreground">Label (PT)</span>
                                                <input
                                                    value={trait.label}
                                                    onChange={e => updateTrait(idx, 'label', e.target.value)}
                                                    placeholder="Curiosidade"
                                                    className="w-full rounded-lg border border-border-subtle bg-surface-soft px-3 py-2 text-sm"
                                                />
                                            </label>
                                        </div>

                                        <label className="block space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] text-muted-foreground">Valor</span>
                                                <span className="text-xs font-mono text-primary">{trait.value.toFixed(2)}</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.05"
                                                value={trait.value}
                                                onChange={e => updateTrait(idx, 'value', e.target.value)}
                                                className="w-full accent-primary"
                                            />
                                            <div className="flex justify-between text-[10px] text-muted-foreground">
                                                <span>0%</span>
                                                <span>50%</span>
                                                <span>100%</span>
                                            </div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'hobbies' && (
                    <motion.div
                        key="hobbies"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                    >
                        <div className="rounded-xl border border-border-subtle bg-surface-soft p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Hobby Cards</p>
                                    <p className="text-[11px] text-muted-foreground mt-1">Cards que aparecem na seção de hobbies</p>
                                </div>
                                <button type="button" onClick={addHobbyCard} className="text-xs text-primary hover:underline flex items-center gap-1">
                                    <FiPlus className="w-3 h-3" /> Adicionar Hobby
                                </button>
                            </div>

                            <div className="space-y-4">
                                {form.hobbyCards.map((card, idx) => (
                                    <div
                                        key={card.id}
                                        className="rounded-lg border border-border-subtle bg-background p-4 space-y-3"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-muted-foreground">Hobby {idx + 1}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeHobbyCard(idx)}
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                <FiTrash className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <label className="block space-y-1">
                                            <span className="text-[11px] text-muted-foreground">ID</span>
                                            <input
                                                value={card.id}
                                                onChange={e => updateHobbyCard(idx, 'id', e.target.value)}
                                                placeholder="games"
                                                className="w-full rounded-lg border border-border-subtle bg-surface-soft px-3 py-2 text-sm"
                                            />
                                        </label>

                                        <label className="block space-y-1">
                                            <span className="text-[11px] text-muted-foreground">Título (PT)</span>
                                            <input
                                                value={card.title}
                                                onChange={e => updateHobbyCard(idx, 'title', e.target.value)}
                                                placeholder="Jogos e narrativas interativas"
                                                className="w-full rounded-lg border border-border-subtle bg-surface-soft px-3 py-2 text-sm"
                                            />
                                        </label>

                                        <label className="block space-y-1">
                                            <span className="text-[11px] text-muted-foreground">Descrição (PT)</span>
                                            <textarea
                                                value={card.description}
                                                onChange={e => updateHobbyCard(idx, 'description', e.target.value)}
                                                placeholder="Gosto de analisar como jogos contam histórias..."
                                                className="w-full rounded-lg border border-border-subtle bg-surface-soft px-3 py-2 text-sm min-h-20 resize-none"
                                            />
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'translations' && (
                    <motion.div
                        key="translations"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                    >
                        {(['en', 'es', 'fr', 'pt'] as const).map(lang => (
                            <div key={lang} className="rounded-xl border border-border-subtle bg-surface-soft p-5 space-y-4">
                                <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                                    {lang === 'en' ? 'English' : lang === 'es' ? 'Español' : lang === 'fr' ? 'Français' : 'Português'}
                                </p>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <label className="block space-y-1">
                                        <span className="text-[11px] text-muted-foreground">Eyebrow</span>
                                        <input
                                            value={form.translations[lang].eyebrow}
                                            onChange={e =>
                                                setForm(prev => ({
                                                    ...prev,
                                                    translations: {
                                                        ...prev.translations,
                                                        [lang]: { ...prev.translations[lang], eyebrow: e.target.value },
                                                    },
                                                }))
                                            }
                                            className="w-full rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm"
                                        />
                                    </label>
                                    <label className="block space-y-1">
                                        <span className="text-[11px] text-muted-foreground">Título</span>
                                        <input
                                            value={form.translations[lang].title}
                                            onChange={e =>
                                                setForm(prev => ({
                                                    ...prev,
                                                    translations: {
                                                        ...prev.translations,
                                                        [lang]: { ...prev.translations[lang], title: e.target.value },
                                                    },
                                                }))
                                            }
                                            className="w-full rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm"
                                        />
                                    </label>
                                </div>

                                <label className="block space-y-1">
                                    <span className="text-[11px] text-muted-foreground">Descrição</span>
                                    <textarea
                                        value={form.translations[lang].description}
                                        onChange={e =>
                                            setForm(prev => ({
                                                ...prev,
                                                translations: {
                                                    ...prev.translations,
                                                    [lang]: { ...prev.translations[lang], description: e.target.value },
                                                },
                                            }))
                                        }
                                        className="w-full rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm min-h-20 resize-none"
                                    />
                                </label>

                                <label className="block space-y-1">
                                    <span className="text-[11px] text-muted-foreground">Bio</span>
                                    <textarea
                                        value={form.translations[lang].bio}
                                        onChange={e =>
                                            setForm(prev => ({
                                                ...prev,
                                                translations: {
                                                    ...prev.translations,
                                                    [lang]: { ...prev.translations[lang], bio: e.target.value },
                                                },
                                            }))
                                        }
                                        className="w-full rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm min-h-20 resize-none"
                                    />
                                </label>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <label className="block space-y-1">
                                        <span className="text-[11px] text-muted-foreground">Hobbies Label</span>
                                        <input
                                            value={form.translations[lang].hobbiesLabel}
                                            onChange={e =>
                                                setForm(prev => ({
                                                    ...prev,
                                                    translations: {
                                                        ...prev.translations,
                                                        [lang]: { ...prev.translations[lang], hobbiesLabel: e.target.value },
                                                    },
                                                }))
                                            }
                                            className="w-full rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm"
                                        />
                                    </label>
                                    <label className="block space-y-1">
                                        <span className="text-[11px] text-muted-foreground">Graph Title</span>
                                        <input
                                            value={form.translations[lang].howToReadGraphTitle}
                                            onChange={e =>
                                                setForm(prev => ({
                                                    ...prev,
                                                    translations: {
                                                        ...prev.translations,
                                                        [lang]: { ...prev.translations[lang], howToReadGraphTitle: e.target.value },
                                                    },
                                                }))
                                            }
                                            className="w-full rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm"
                                        />
                                    </label>
                                </div>

                                <label className="block space-y-1">
                                    <span className="text-[11px] text-muted-foreground">Graph Description</span>
                                    <textarea
                                        value={form.translations[lang].howToReadGraphDescription}
                                        onChange={e =>
                                            setForm(prev => ({
                                                ...prev,
                                                translations: {
                                                    ...prev.translations,
                                                    [lang]: { ...prev.translations[lang], howToReadGraphDescription: e.target.value },
                                                },
                                            }))
                                        }
                                        className="w-full rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm min-h-[60px] resize-none"
                                    />
                                </label>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="rounded-lg border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300"
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
                        className="rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                    >
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}