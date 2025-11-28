'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSave, FiLoader, FiPlus, FiTrash, FiRefreshCw, FiHeart } from 'react-icons/fi';
import FileUploader from '@/components/admin/FileUploader';
import {
    autoTranslatePersonal,
    savePersonalContent,
} from '@/app/admin/personal/actions';
import type { PersonalContent } from '@/lib/content/schema';

interface Props {
    initial: PersonalContent;
}

export default function PersonalSectionEditor({ initial }: Props) {
    const [form, setForm] = useState<PersonalContent>(initial);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, startSave] = useTransition();
    const [isTranslating, startTranslate] = useTransition();

    const addHobby = () => setForm(prev => ({ ...prev, hobbies: [...prev.hobbies, ''] }));
    const removeHobby = (index: number) => setForm(prev => ({ ...prev, hobbies: prev.hobbies.filter((_, i) => i !== index) }));
    const updateHobby = (index: number, value: string) => {
        setForm(prev => ({
            ...prev,
            hobbies: prev.hobbies.map((h, i) => i === index ? value : h),
        }));
    };

    const addValue = () => setForm(prev => ({ ...prev, values: [...prev.values, ''] }));
    const removeValue = (index: number) => setForm(prev => ({ ...prev, values: prev.values.filter((_, i) => i !== index) }));
    const updateValue = (index: number, value: string) => {
        setForm(prev => ({
            ...prev,
            values: prev.values.map((v, i) => i === index ? value : v),
        }));
    };

    const addPhoto = () => setForm(prev => ({ ...prev, photos: [...prev.photos, ''] }));
    const removePhoto = (index: number) => setForm(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }));
    const updatePhoto = (index: number, url: string) => {
        setForm(prev => ({
            ...prev,
            photos: prev.photos.map((p, i) => i === index ? url : p),
        }));
    };

    const addSocialLink = () => setForm(prev => ({ ...prev, socialLinks: [...prev.socialLinks, { platform: '', url: '' }] }));
    const removeSocialLink = (index: number) => setForm(prev => ({ ...prev, socialLinks: prev.socialLinks.filter((_, i) => i !== index) }));
    const updateSocialLink = (index: number, key: 'platform' | 'url', value: string) => {
        setForm(prev => ({
            ...prev,
            socialLinks: prev.socialLinks.map((s, i) => i === index ? { ...s, [key]: value } : s),
        }));
    };

    const handleSave = () => {
        setMessage(null);
        setError(null);
        startSave(async () => {
            try {
                await savePersonalContent(form);
                setMessage('Conteúdo pessoal salvo com sucesso.');
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
                    hobbies: form.hobbies,
                    values: form.values,
                });
                setForm(prev => ({ ...prev, translations }));
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
                    <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground-subtle">Personal</p>
                    <h1 className="text-xl font-semibold text-foreground">Informações pessoais</h1>
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

            <div className="space-y-4">
                <label className="space-y-2 block">
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle">Bio</span>
                    <textarea
                        value={form.bio}
                        onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Conte um pouco sobre você"
                        className="w-full rounded-lg border border-border-subtle/70 bg-background/60 px-3 py-2 text-sm min-h-[100px]"
                    />
                </label>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle flex items-center gap-2">
                            <FiHeart className="w-4 h-4" />
                            Hobbies
                        </span>
                        <button type="button" onClick={addHobby} className="text-xs text-primary hover:underline">
                            + Adicionar
                        </button>
                    </div>
                    {form.hobbies.map((hobby, idx) => (
                        <div key={idx} className="flex gap-2">
                            <input
                                value={hobby}
                                onChange={e => updateHobby(idx, e.target.value)}
                                placeholder="Ex: Fotografia, Viagens..."
                                className="flex-1 rounded-lg border border-border-subtle/70 bg-background/60 px-3 py-2 text-sm"
                            />
                            <button type="button" onClick={() => removeHobby(idx)} className="text-red-300">
                                <FiTrash className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle">Valores</span>
                        <button type="button" onClick={addValue} className="text-xs text-primary hover:underline">
                            + Adicionar
                        </button>
                    </div>
                    {form.values.map((value, idx) => (
                        <div key={idx} className="flex gap-2">
                            <input
                                value={value}
                                onChange={e => updateValue(idx, e.target.value)}
                                placeholder="Ex: Inovação, Colaboração..."
                                className="flex-1 rounded-lg border border-border-subtle/70 bg-background/60 px-3 py-2 text-sm"
                            />
                            <button type="button" onClick={() => removeValue(idx)} className="text-red-300">
                                <FiTrash className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle">Fotos pessoais</span>
                        <button type="button" onClick={addPhoto} className="text-xs text-primary hover:underline">
                            + Adicionar
                        </button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
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
                                    className="absolute top-0 right-0 text-red-300 hover:text-red-200 text-xs"
                                >
                                    Remover
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle">Redes sociais</span>
                        <button type="button" onClick={addSocialLink} className="text-xs text-primary hover:underline">
                            + Adicionar
                        </button>
                    </div>
                    {form.socialLinks.map((link, idx) => (
                        <div key={idx} className="flex gap-2">
                            <input
                                value={link.platform}
                                onChange={e => updateSocialLink(idx, 'platform', e.target.value)}
                                placeholder="Plataforma"
                                className="w-32 rounded-lg border border-border-subtle/70 bg-background/60 px-3 py-2 text-sm"
                            />
                            <input
                                value={link.url}
                                onChange={e => updateSocialLink(idx, 'url', e.target.value)}
                                placeholder="URL"
                                className="flex-1 rounded-lg border border-border-subtle/70 bg-background/60 px-3 py-2 text-sm"
                            />
                            <button type="button" onClick={() => removeSocialLink(idx)} className="text-red-300">
                                <FiTrash className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
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