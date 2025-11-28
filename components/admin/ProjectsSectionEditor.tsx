'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSave, FiLoader, FiPlus, FiTrash, FiRefreshCw, FiFolder, FiStar } from 'react-icons/fi';
import FileUploader from '@/components/admin/FileUploader';
import {
    autoTranslateProjects,
    saveProjectsContent,
} from '@/app/admin/projects/actions';
import type { ProjectsContent, ProjectItem } from '@/lib/content/schema';

interface Props {
    initial: ProjectsContent;
}

export default function ProjectsSectionEditor({ initial }: Props) {
    const [tab, setTab] = useState<'pt' | 'translations'>('pt');
    const [form, setForm] = useState<ProjectsContent>(initial);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, startSave] = useTransition();
    const [isTranslating, startTranslate] = useTransition();

    const addProject = () => {
        setForm(prev => ({
            ...prev,
            projects: [...prev.projects, {
                title: '',
                description: '',
                thumbnail: '',
                images: [],
                tags: [''],
                demoUrl: '',
                repoUrl: '',
                featured: false,
            }],
        }));
    };

    const removeProject = (index: number) => {
        setForm(prev => ({ ...prev, projects: prev.projects.filter((_, i) => i !== index) }));
    };

    const updateProject = (
        index: number,
        key: keyof ProjectItem,
        value: ProjectItem[keyof ProjectItem],
    ) => {
        setForm(prev => {
            const projects = [...prev.projects];
            projects[index] = { ...projects[index], [key]: value };
            return { ...prev, projects };
        });
    };

    const addImage = (projIndex: number) => {
        setForm(prev => {
            const projects = [...prev.projects];
            projects[projIndex].images = [...projects[projIndex].images, ''];
            return { ...prev, projects };
        });
    };

    const removeImage = (projIndex: number, imgIndex: number) => {
        setForm(prev => {
            const projects = [...prev.projects];
            projects[projIndex].images = projects[projIndex].images.filter((_, i) => i !== imgIndex);
            return { ...prev, projects };
        });
    };

    const addTag = (projIndex: number) => {
        setForm(prev => {
            const projects = [...prev.projects];
            projects[projIndex].tags = [...projects[projIndex].tags, ''];
            return { ...prev, projects };
        });
    };

    const removeTag = (projIndex: number, tagIndex: number) => {
        setForm(prev => {
            const projects = [...prev.projects];
            projects[projIndex].tags = projects[projIndex].tags.filter((_, i) => i !== tagIndex);
            return { ...prev, projects };
        });
    };

    const handleSave = () => {
        setMessage(null);
        setError(null);
        startSave(async () => {
            try {
                await saveProjectsContent(form);
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
                const translations = await autoTranslateProjects({
                    summary: form.summary,
                    projects: form.projects,
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
                    <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground-subtle">Projects</p>
                    <h1 className="text-xl font-semibold text-foreground">Projetos</h1>
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
                                <motion.div layoutId="projects-tab" className="absolute inset-x-1 bottom-0 h-0.5 rounded-full bg-primary" />
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
                                        placeholder="Introdução sobre seus projetos"
                                        className="w-full rounded-lg border border-border-subtle/70 bg-background/60 px-3 py-2 text-sm min-h-[60px]"
                                    />
                                </label>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                            <FiFolder className="w-4 h-4" />
                                            Projetos
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={addProject}
                                            className="inline-flex items-center gap-2 rounded-lg border border-border-subtle px-3 py-1.5 text-sm hover:border-primary/60 transition-colors"
                                        >
                                            <FiPlus className="w-4 h-4" />
                                            Adicionar
                                        </button>
                                    </div>

                                    {form.projects.map((proj, index) => (
                                        <ProjectCard
                                            key={index}
                                            index={index}
                                            data={proj}
                                            onChange={updateProject}
                                            onRemove={() => removeProject(index)}
                                            onAddImage={() => addImage(index)}
                                            onRemoveImage={(imgIdx) => removeImage(index, imgIdx)}
                                            onAddTag={() => addTag(index)}
                                            onRemoveTag={(tagIdx) => removeTag(index, tagIdx)}
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

interface ProjectCardProps {
    index: number;
    data: ProjectItem;
    onChange: (index: number, key: keyof ProjectItem, value: ProjectItem[keyof ProjectItem]) => void;
    onRemove: () => void;
    onAddImage: () => void;
    onRemoveImage: (imgIndex: number) => void;
    onAddTag: () => void;
    onRemoveTag: (tagIndex: number) => void;
}

function ProjectCard({ index, data, onChange, onRemove, onAddImage, onRemoveImage, onAddTag, onRemoveTag }: ProjectCardProps) {
    return (
        <div className="rounded-xl border border-border-subtle/70 bg-background/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">#{index + 1}</p>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={data.featured}
                            onChange={(e) => onChange(index, 'featured', e.target.checked)}
                            className="accent-primary"
                        />
                        <FiStar className={`w-4 h-4 ${data.featured ? 'text-yellow-400' : 'text-muted-foreground'}`} />
                        <span className="text-xs text-muted-foreground">Destaque</span>
                    </label>
                </div>
                <button type="button" onClick={onRemove} className="text-red-300 hover:text-red-200 text-sm">
                    <FiTrash className="w-4 h-4" />
                </button>
            </div>

            <FileUploader
                value={data.thumbnail}
                onChange={(url) => onChange(index, 'thumbnail', url)}
                accept="image/*"
                label="Thumbnail"
                folder="projects"
            />

            <Input label="Título" value={data.title} onChange={(v) => onChange(index, 'title', v)} />
            <Input label="Descrição" value={data.description} onChange={(v) => onChange(index, 'description', v)} multiline />

            <div className="grid gap-3 sm:grid-cols-2">
                <Input label="URL Demo" value={data.demoUrl ?? ''} onChange={(v) => onChange(index, 'demoUrl', v)} />
                <Input label="URL Repo" value={data.repoUrl ?? ''} onChange={(v) => onChange(index, 'repoUrl', v)} />
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle">Tags</span>
                    <button type="button" onClick={onAddTag} className="text-xs text-primary hover:underline">+ Adicionar</button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {data.tags.map((tag, tagIdx) => (
                        <div key={tagIdx} className="flex items-center gap-1 rounded-full border border-border-subtle px-3 py-1">
                            <input
                                value={tag}
                                onChange={(e) => onChange(index, 'tags', data.tags.map((t, i) => i === tagIdx ? e.target.value : t))}
                                className="w-16 bg-transparent text-sm outline-none"
                            />
                            <button type="button" onClick={() => onRemoveTag(tagIdx)} className="text-red-300">
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
                <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${className} min-h-[60px]`} />
            ) : (
                <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={className} />
            )}
        </label>
    );
}
