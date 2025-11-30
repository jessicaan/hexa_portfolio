'use client';

import { useState, useTransition, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
    FiSave,
    FiLoader,
    FiPlus,
    FiTrash,
    FiRefreshCw,
    FiFolder,
    FiStar,
    FiChevronDown,
    FiChevronUp,
    FiExternalLink,
    FiGithub,
    FiCalendar,
    FiUser,
    FiMove,
    FiCopy,
    FiEye,
} from 'react-icons/fi';
import FileUploader from './FileUploader';
import TechSelector from './TechSelectorAdmin';
import ImageGalleryEditor from './ImageGalleryEditor';
import MetricsEditor from './MetricsEditor';
import {
    autoTranslateProjects,
    saveProjectsContent,
} from '@/app/admin/projects/actions';
import {
    ProjectsContent,
    ProjectItem,
    ProjectStatus,
    ProjectType,
    LanguageCode,
} from '@/lib/content/schema';
import { generateProjectId, generateProjectImageId, generateSlug } from '@/lib/content/schema';
import { EditableTranslationInput } from './EditableTranslationInput';

interface Props {
    initial: ProjectsContent;
}

const STATUS_OPTIONS: { value: ProjectStatus; label: string; color: string }[] = [
    { value: 'completed', label: 'Concluído', color: 'bg-emerald-500' },
    { value: 'in-progress', label: 'Em andamento', color: 'bg-blue-500' },
    { value: 'archived', label: 'Arquivado', color: 'bg-gray-500' },
    { value: 'concept', label: 'Conceito', color: 'bg-purple-500' },
];

const TYPE_OPTIONS: { value: ProjectType; label: string }[] = [
    { value: 'web', label: 'Web App' },
    { value: 'mobile', label: 'Mobile App' },
    { value: 'desktop', label: 'Desktop App' },
    { value: 'api', label: 'API / Backend' },
    { value: 'library', label: 'Biblioteca' },
    { value: 'saas', label: 'SaaS' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'portfolio', label: 'Portfolio' },
    { value: 'other', label: 'Outro' },
];

export default function ProjectsSectionEditor({ initial }: Props) {
    const [tab, setTab] = useState<'pt' | 'translations'>('pt');
    const [form, setForm] = useState<ProjectsContent>(initial);
    const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, startSave] = useTransition();
    const [isTranslating, startTranslate] = useTransition();

    const addProject = useCallback(() => {
        const newProject: ProjectItem = {
            id: generateProjectId(),
            title: '',
            slug: '',
            shortDescription: '',
            description: '',
            thumbnail: '',
            images: [],
            technologies: [],
            tags: [],
            demoUrl: '',
            repoUrl: '',
            featured: false,
            status: 'in-progress',
            type: 'web',
            highlights: [],
            metrics: [],
            order: form.projects.length,
        };
        setForm(prev => ({ ...prev, projects: [...prev.projects, newProject] }));
        setExpandedCards(prev => new Set([...prev, newProject.id]));
    }, [form.projects.length]);

    const duplicateProject = useCallback((index: number) => {
        const source = form.projects[index];
        const newId = generateProjectId();
        const newProject: ProjectItem = {
            ...source,
            id: newId,
            title: `${source.title} (copia)`,
            slug: `${source.slug}-copy`,
            order: form.projects.length,
            images: (source.images ?? []).map((img, imgIndex) => ({
                ...img,
                id: generateProjectImageId(newId, imgIndex),
            })),
        };
        setForm(prev => ({ ...prev, projects: [...prev.projects, newProject] }));
        setExpandedCards(prev => new Set([...prev, newProject.id]));
    }, [form.projects]);

    const removeProject = useCallback((index: number) => {
        const project = form.projects[index];
        setExpandedCards(prev => {
            const next = new Set(prev);
            next.delete(project.id);
            return next;
        });
        setForm(prev => ({
            ...prev,
            projects: prev.projects.filter((_, i) => i !== index),
        }));
    }, [form.projects]);

    const updateProject = useCallback((
        index: number,
        updates: Partial<ProjectItem>,
    ) => {
        setForm(prev => {
            const projects = [...prev.projects];
            projects[index] = { ...projects[index], ...updates };

            if (updates.title && !projects[index].slug) {
                projects[index].slug = generateSlug(updates.title);
            }

            return { ...prev, projects };
        });
    }, []);

    const handleReorder = useCallback((newOrder: ProjectItem[]) => {
        setForm(prev => ({
            ...prev,
            projects: newOrder.map((p, i) => ({ ...p, order: i })),
        }));
    }, []);

    const toggleCard = useCallback((id: string) => {
        setExpandedCards(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }, []);

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

    const handleTranslationsChange = useCallback((newTranslations: ProjectsContent['translations']) => {
        setForm(prev => ({ ...prev, translations: newTranslations }));
    }, []);

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
                    <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground-subtle">
                        Portfolio
                    </p>
                    <h1 className="text-xl font-semibold text-foreground">
                        Projetos
                    </h1>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={handleAutoTranslate}
                        className="inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-surface-soft px-3 py-2 text-sm hover:border-primary/60 transition-colors disabled:opacity-60"
                        disabled={isTranslating}
                    >
                        {isTranslating ? (
                            <FiLoader className="w-4 h-4 animate-spin" />
                        ) : (
                            <FiRefreshCw className="w-4 h-4" />
                        )}
                        Traduzir
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-primary to-secondary px-3 py-2 text-sm font-semibold text-foreground shadow-glow hover:shadow-glow-lg transition-all disabled:opacity-60"
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <FiLoader className="w-4 h-4 animate-spin" />
                        ) : (
                            <FiSave className="w-4 h-4" />
                        )}
                        Salvar
                    </button>
                </div>
            </div>

            <div className="rounded-xl border border-border-subtle/70 bg-surface/70 backdrop-blur-xl">
                <div className="flex gap-3 border-b border-border-subtle/60 px-4">
                    {['pt', 'translations'].map(value => (
                        <button
                            key={value}
                            onClick={() => setTab(value as 'pt' | 'translations')}
                            className={`relative px-3 py-2.5 text-sm transition-colors ${tab === value ? 'text-foreground' : 'text-muted-foreground'
                                }`}
                        >
                            {value === 'pt' ? 'Conteúdo PT' : 'Traduções'}
                            {tab === value && (
                                <motion.div
                                    layoutId="projects-tab"
                                    className="absolute inset-x-1 bottom-0 h-0.5 rounded-full bg-primary"
                                />
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
                                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle">
                                        Introdução
                                    </span>
                                    <textarea
                                        value={form.summary}
                                        onChange={e =>
                                            setForm(prev => ({
                                                ...prev,
                                                summary: e.target.value,
                                            }))
                                        }
                                        placeholder="Apresentação geral sobre seus projetos..."
                                        className="w-full rounded-lg border border-border-subtle/70 bg-background/60 px-3 py-2 text-sm min-h-20 resize-none"
                                    />
                                </label>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                            <FiFolder className="w-4 h-4" />
                                            Projetos ({form.projects.length})
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={addProject}
                                            className="inline-flex items-center gap-2 rounded-lg border border-border-subtle px-3 py-1.5 text-sm hover:border-primary/60 transition-colors"
                                        >
                                            <FiPlus className="w-4 h-4" />
                                            Novo Projeto
                                        </button>
                                    </div>

                                    <Reorder.Group
                                        axis="y"
                                        values={form.projects}
                                        onReorder={handleReorder}
                                        className="space-y-3"
                                    >
                                        {form.projects.map((proj, index) => (
                                            <Reorder.Item
                                                key={proj.id}
                                                value={proj}
                                                className="cursor-grab active:cursor-grabbing"
                                            >
                                                <ProjectCard
                                                    index={index}
                                                    data={proj}
                                                    expanded={expandedCards.has(proj.id)}
                                                    onToggle={() => toggleCard(proj.id)}
                                                    onChange={updates => updateProject(index, updates)}
                                                    onRemove={() => removeProject(index)}
                                                    onDuplicate={() => duplicateProject(index)}
                                                />
                                            </Reorder.Item>
                                        ))}
                                    </Reorder.Group>

                                    {form.projects.length === 0 && (
                                        <div className="rounded-lg border border-dashed border-border-subtle py-12 text-center">
                                            <FiFolder className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
                                            <p className="text-sm text-muted-foreground mb-3">
                                                Nenhum projeto cadastrado
                                            </p>
                                            <button
                                                type="button"
                                                onClick={addProject}
                                                className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm text-primary hover:bg-primary/20 transition-colors"
                                            >
                                                <FiPlus className="w-4 h-4" />
                                                Criar primeiro projeto
                                            </button>
                                        </div>
                                    )}
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
                                <TranslationsPreview
                                    translations={form.translations}
                                    onTranslationsChange={handleTranslationsChange}
                                />
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
        expanded: boolean;
        onToggle: () => void;
        onChange: (updates: Partial<ProjectItem>) => void;
        onRemove: () => void;
        onDuplicate: () => void;
    }

    function ProjectCard({
        index,
        data,
        expanded,
        onToggle,
        onChange,
        onRemove,
        onDuplicate,
    }: ProjectCardProps) {
        const statusInfo = STATUS_OPTIONS.find(s => s.value === data.status);

        return (
            <div className="rounded-xl border border-border-subtle/70 bg-background/60 overflow-hidden">
                <div
                    className="flex items-center gap-3 p-4 cursor-pointer hover:bg-surface-soft/50 transition-colors"
                    onClick={onToggle}
                >
                    <div className="flex items-center gap-2 shrink-0">
                        <FiMove className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground font-mono">
                            #{index + 1}
                        </span>
                    </div>

                    {data.thumbnail && (
                        <div className="w-12 h-8 rounded overflow-hidden shrink-0 bg-surface-soft">
                            <img
                                src={data.thumbnail}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            {data.featured && (
                                <FiStar className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                            )}
                            <span className="text-sm font-medium truncate">
                                {data.title || 'Sem título'}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                            {data.shortDescription || 'Sem descrição'}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {statusInfo && (
                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <span className={`w-2 h-2 rounded-full ${statusInfo.color}`} />
                                {statusInfo.label}
                            </span>
                        )}
                        {expanded ? (
                            <FiChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                            <FiChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                    </div>
                </div>

                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="border-t border-border-subtle/60 p-4 space-y-4">
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={e => {
                                            e.stopPropagation();
                                            onDuplicate();
                                        }}
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <FiCopy className="w-3.5 h-3.5" />
                                        Duplicar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={e => {
                                            e.stopPropagation();
                                            onRemove();
                                        }}
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-red-300 hover:text-red-200 transition-colors"
                                    >
                                        <FiTrash className="w-3.5 h-3.5" />
                                        Remover
                                    </button>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-4">
                                        <Input
                                            label="Título"
                                            value={data.title}
                                            onChange={v => onChange({ title: v })}
                                            placeholder="Nome do projeto"
                                        />
                                        <Input
                                            label="Slug"
                                            value={data.slug}
                                            onChange={v => onChange({ slug: v })}
                                            placeholder="url-amigavel"
                                        />
                                        <Input
                                            label="Descrição Curta"
                                            value={data.shortDescription}
                                            onChange={v => onChange({ shortDescription: v })}
                                            placeholder="Uma linha sobre o projeto"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <FileUploader
                                            value={data.thumbnail}
                                            onChange={url => onChange({ thumbnail: url })}
                                            accept="image/*"
                                            label="Thumbnail"
                                            folder="projects"
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                            <Select
                                                label="Status"
                                                value={data.status}
                                                onChange={v => onChange({ status: v as ProjectStatus })}
                                                options={STATUS_OPTIONS}
                                            />
                                            <Select
                                                label="Tipo"
                                                value={data.type}
                                                onChange={v => onChange({ type: v as ProjectType })}
                                                options={TYPE_OPTIONS}
                                            />
                                        </div>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={data.featured}
                                                onChange={e => onChange({ featured: e.target.checked })}
                                                className="accent-primary w-4 h-4"
                                            />
                                            <FiStar className={`w-4 h-4 ${data.featured ? 'text-yellow-400' : 'text-muted-foreground'}`} />
                                            <span className="text-sm">Projeto em destaque</span>
                                        </label>
                                    </div>
                                </div>

                                <Input
                                    label="Descrição Completa"
                                    value={data.description}
                                    onChange={v => onChange({ description: v })}
                                    placeholder="Descrição detalhada do projeto..."
                                    multiline
                                    rows={4}
                                />

                                <ImageGalleryEditor
                                    images={data.images}
                                    onChange={images => onChange({ images })}
                                    folder="projects"
                                />

                                <TechSelector
                                    selected={data.technologies}
                                    onChange={technologies => onChange({ technologies })}
                                />

                                <TagsEditor
                                    tags={data.tags}
                                    onChange={tags => onChange({ tags })}
                                />

                                <HighlightsEditor
                                    highlights={data.highlights || []}
                                    onChange={highlights => onChange({ highlights })}
                                />

                                <MetricsEditor
                                    metrics={data.metrics || []}
                                    onChange={metrics => onChange({ metrics })}
                                />

                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    <Input
                                        label="URL Demo"
                                        value={data.demoUrl || ''}
                                        onChange={v => onChange({ demoUrl: v })}
                                        placeholder="https://..."
                                        icon={<FiExternalLink className="w-4 h-4" />}
                                    />
                                    <Input
                                        label="Repositório"
                                        value={data.repoUrl || ''}
                                        onChange={v => onChange({ repoUrl: v })}
                                        placeholder="https://github.com/..."
                                        icon={<FiGithub className="w-4 h-4" />}
                                    />
                                    <Input
                                        label="Case Study"
                                        value={data.caseStudyUrl || ''}
                                        onChange={v => onChange({ caseStudyUrl: v })}
                                        placeholder="https://..."
                                        icon={<FiEye className="w-4 h-4" />}
                                    />
                                </div>

                                <div className="grid gap-3 sm:grid-cols-3">
                                    <Input
                                        label="Cliente"
                                        value={data.client || ''}
                                        onChange={v => onChange({ client: v })}
                                        placeholder="Nome do cliente"
                                        icon={<FiUser className="w-4 h-4" />}
                                    />
                                    <Input
                                        label="Data Início"
                                        value={data.startDate || ''}
                                        onChange={v => onChange({ startDate: v })}
                                        placeholder="2024-01"
                                        icon={<FiCalendar className="w-4 h-4" />}
                                    />
                                    <Input
                                        label="Data Fim"
                                        value={data.endDate || ''}
                                        onChange={v => onChange({ endDate: v })}
                                        placeholder="2024-06"
                                        icon={<FiCalendar className="w-4 h-4" />}
                                    />
                                </div>
                            </div>
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
        placeholder?: string;
        multiline?: boolean;
        rows?: number;
        icon?: React.ReactNode;
    }

    function Input({ label, value, onChange, placeholder, multiline, rows = 3, icon }: InputProps) {
        const baseClass = 'w-full rounded-lg border border-border-subtle/70 bg-background/60 px-3 py-2 text-sm transition-colors focus:border-primary/60 focus:outline-none';

        return (
            <label className="space-y-2 block">
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle">
                    {label}
                </span>
                <div className="relative">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {icon}
                        </div>
                    )}
                    {multiline ? (
                        <textarea
                            value={value}
                            onChange={e => onChange(e.target.value)}
                            placeholder={placeholder}
                            rows={rows}
                            className={`${baseClass} resize-none`}
                        />
                    ) : (
                        <input
                            type="text"
                            value={value}
                            onChange={e => onChange(e.target.value)}
                            placeholder={placeholder}
                            className={`${baseClass} ${icon ? 'pl-9' : ''}`}
                        />
                    )}
                </div>
            </label>
        );
    }

    interface SelectProps {
        label: string;
        value: string;
        onChange: (value: string) => void;
        options: { value: string; label: string; color?: string }[];
    }

    function Select({ label, value, onChange, options }: SelectProps) {
        return (
            <label className="space-y-2 block">
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle">
                    {label}
                </span>
                <select
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    className="w-full rounded-lg border border-border-subtle/70 bg-background/60 px-3 py-2 text-sm"
                >
                    {options.map(opt => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </label>
        );
    }

    interface TagsEditorProps {
        tags: string[];
        onChange: (tags: string[]) => void;
    }

    function TagsEditor({ tags, onChange }: TagsEditorProps) {
        const [input, setInput] = useState('');

        const addTag = () => {
            const trimmed = input.trim();
            if (trimmed && !tags.includes(trimmed)) {
                onChange([...tags, trimmed]);
                setInput('');
            }
        };

        const removeTag = (index: number) => {
            onChange(tags.filter((_, i) => i !== index));
        };

        return (
            <div className="space-y-2">
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle">
                    Tags
                </span>
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag, i) => (
                        <motion.div
                            key={i}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-1 rounded-full border border-border-subtle px-2.5 py-1 text-sm"
                        >
                            <span>{tag}</span>
                            <button
                                type="button"
                                onClick={() => removeTag(i)}
                                className="text-muted-foreground hover:text-red-300"
                            >
                                <FiTrash className="w-3 h-3" />
                            </button>
                        </motion.div>
                    ))}
                    <div className="flex items-center gap-1 rounded-full border border-dashed border-border-subtle px-2.5 py-1">
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                            placeholder="Nova tag"
                            className="w-20 bg-transparent text-sm outline-none"
                        />
                        <button
                            type="button"
                            onClick={addTag}
                            className="text-muted-foreground hover:text-primary"
                        >
                            <FiPlus className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    interface HighlightsEditorProps {
        highlights: string[];
        onChange: (highlights: string[]) => void;
    }

    function HighlightsEditor({ highlights, onChange }: HighlightsEditorProps) {
        const addHighlight = () => {
            onChange([...highlights, '']);
        };

        const removeHighlight = (index: number) => {
            onChange(highlights.filter((_, i) => i !== index));
        };

        const updateHighlight = (index: number, value: string) => {
            const updated = [...highlights];
            updated[index] = value;
            onChange(updated);
        };

        return (
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle">
                        Destaques
                    </span>
                    <button
                        type="button"
                        onClick={addHighlight}
                        className="text-xs text-primary hover:underline"
                    >
                        + Adicionar
                    </button>
                </div>
                <AnimatePresence>
                    {highlights.map((h, i) => (
                        <motion.div
                            key={i}
                            layout
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="flex gap-2"
                        >
                            <input
                                type="text"
                                value={h}
                                onChange={e => updateHighlight(i, e.target.value)}
                                placeholder="Ex: Redução de 40% no tempo de carregamento"
                                className="flex-1 rounded-lg border border-border-subtle/70 bg-background/60 px-3 py-2 text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => removeHighlight(i)}
                                className="p-2 text-red-300 hover:text-red-200"
                            >
                                <FiTrash className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        );
    }

    interface TranslationsPreviewProps {
        translations: ProjectsContent['translations'];
        onTranslationsChange: (newTranslations: ProjectsContent['translations']) => void;
    }

    function TranslationsPreview({ translations, onTranslationsChange }: TranslationsPreviewProps) {
        const languages: { code: LanguageCode; label: string; flag: string }[] = [
            { code: 'en', label: 'English', flag: '🇺🇸' },
            { code: 'es', label: 'Español', flag: '🇪🇸' },
            { code: 'fr', label: 'Français', flag: '🇫🇷' },
        ];

        return (
            <div className="space-y-4">
                {languages.map(lang => {
                    const data = translations[lang.code];
                    return (
                        <div
                            key={lang.code}
                            className="rounded-lg border border-border-subtle/70 bg-background/60 p-4 space-y-3"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-lg">{lang.flag}</span>
                                <span className="text-sm font-medium">{lang.label}</span>
                            </div>
                            <EditableTranslationInput
                                label="Resumo"
                                value={data.summary || ''}
                                onChange={(newValue) => {
                                    onTranslationsChange({
                                        ...translations,
                                        [lang.code]: {
                                            ...translations[lang.code],
                                            summary: newValue,
                                        },
                                    });
                                }}
                                placeholder={`Resumo em ${lang.label}`}
                                multiline
                                rows={2}
                            />
                            {data.projects.length > 0 && (
                                <div className="space-y-3 pt-2">
                                    <h4 className="text-sm font-semibold text-foreground">Projetos Traduzidos</h4>
                                    {data.projects.map((project, projectIndex) => (
                                        <div
                                            key={project.id}
                                            className="rounded border border-border-subtle/50 px-3 py-2 space-y-2"
                                        >
                                            <EditableTranslationInput
                                                label="Título"
                                                value={project.title || ''}
                                                onChange={(newValue) => {
                                                    const newProjects = [...data.projects];
                                                    newProjects[projectIndex] = { ...newProjects[projectIndex], title: newValue };
                                                    onTranslationsChange({
                                                        ...translations,
                                                        [lang.code]: {
                                                            ...translations[lang.code],
                                                            projects: newProjects,
                                                        },
                                                    });
                                                }}
                                                placeholder={`Título em ${lang.label}`}
                                            />
                                            <EditableTranslationInput
                                                label="Descrição Curta"
                                                value={project.shortDescription || ''}
                                                onChange={(newValue) => {
                                                    const newProjects = [...data.projects];
                                                    newProjects[projectIndex] = { ...newProjects[projectIndex], shortDescription: newValue };
                                                    onTranslationsChange({
                                                        ...translations,
                                                        [lang.code]: {
                                                            ...translations[lang.code],
                                                            projects: newProjects,
                                                        },
                                                    });
                                                }}
                                                placeholder={`Descrição curta em ${lang.label}`}
                                                multiline
                                                rows={2}
                                            />
                                            <EditableTranslationInput
                                                label="Descrição Completa"
                                                value={project.description || ''}
                                                onChange={(newValue) => {
                                                    const newProjects = [...data.projects];
                                                    newProjects[projectIndex] = { ...newProjects[projectIndex], description: newValue };
                                                    onTranslationsChange({
                                                        ...translations,
                                                        [lang.code]: {
                                                            ...translations[lang.code],
                                                            projects: newProjects,
                                                        },
                                                    });
                                                }}
                                                placeholder={`Descrição completa em ${lang.label}`}
                                                multiline
                                                rows={3}
                                            />
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs uppercase tracking-widest text-muted-foreground-subtle">
                                                        Destaques
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newProjects = [...data.projects];
                                                            const projectHighlights = [...(newProjects[projectIndex].highlights || []), ''];
                                                            newProjects[projectIndex] = { ...newProjects[projectIndex], highlights: projectHighlights };
                                                            onTranslationsChange({
                                                                ...translations,
                                                                [lang.code]: {
                                                                    ...translations[lang.code],
                                                                    projects: newProjects,
                                                                },
                                                            });
                                                        }}
                                                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                                                    >
                                                        <FiPlus className="w-3 h-3" /> Adicionar
                                                    </button>
                                                </div>
                                                {(project.highlights || []).map((highlight, highlightIndex) => (
                                                    <div key={highlightIndex} className="flex gap-2 items-center">
                                                        <EditableTranslationInput
                                                            value={highlight}
                                                            onChange={(newValue) => {
                                                                const newProjects = [...data.projects];
                                                                const currentProject = { ...newProjects[projectIndex] };
                                                                const newHighlights = [...(currentProject.highlights || [])];
                                                                newHighlights[highlightIndex] = newValue;
                                                                currentProject.highlights = newHighlights;
                                                                newProjects[projectIndex] = currentProject;
                                                                onTranslationsChange({
                                                                    ...translations,
                                                                    [lang.code]: {
                                                                        ...translations[lang.code],
                                                                        projects: newProjects,
                                                                    },
                                                                });
                                                            }}
                                                            placeholder={`Destaque ${highlightIndex + 1} em ${lang.label}`}
                                                            className="grow"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newProjects = [...data.projects];
                                                                const currentProject = { ...newProjects[projectIndex] };
                                                                const newHighlights = (currentProject.highlights || []).filter((_, i) => i !== highlightIndex);
                                                                currentProject.highlights = newHighlights;
                                                                newProjects[projectIndex] = currentProject;
                                                                onTranslationsChange({
                                                                    ...translations,
                                                                    [lang.code]: {
                                                                        ...translations[lang.code],
                                                                        projects: newProjects,
                                                                    },
                                                                });
                                                            }}
                                                            className="p-2 text-red-300 hover:text-red-200"
                                                        >
                                                            <FiTrash className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    }