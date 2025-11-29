'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
    FiSave,
    FiLoader,
    FiPlus,
    FiTrash,
    FiRefreshCw,
    FiChevronDown,
    FiChevronUp,
    FiMove,
    FiTag,
} from 'react-icons/fi';
import TechBadge from './TechBadge';
import TechnologyPickerModal from './ThecnologyPickerModal';
import { autoTranslateSkills, saveSkillsContent } from '@/app/admin/skills/actions';
import type { SkillsContent, SkillCategory, Skill } from '@/lib/content/schema';

interface Props {
    initial: SkillsContent;
}

type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

interface ExtendedSkill extends Skill {
    techId?: string;
    skillLevel?: SkillLevel;
}

interface ExtendedCategory extends Omit<SkillCategory, 'skills'> {
    skills: ExtendedSkill[];
    id: string;
}

export default function ModernSkillsEditor({ initial }: Props) {
    const [categories, setCategories] = useState<ExtendedCategory[]>(
        initial.categories.map((cat, idx) => ({
            ...cat,
            id: `cat-${idx}-${Date.now()}`,
            skills: cat.skills.map(s => s as ExtendedSkill),
        }))
    );
    const [summary, setSummary] = useState(initial.summary);
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, startSave] = useTransition();
    const [isTranslating, startTranslate] = useTransition();
    const [techPickerState, setTechPickerState] = useState<{
        isOpen: boolean;
        categoryId?: string;
        skillIndex?: number;
    }>({ isOpen: false });

    const toggleCategory = (id: string) => {
        setExpandedCategories(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const addCategory = () => {
        const newCat: ExtendedCategory = {
            id: `cat-${Date.now()}`,
            name: '',
            skills: [],
        };
        setCategories(prev => [...prev, newCat]);
        setExpandedCategories(prev => new Set(prev).add(newCat.id));
    };

    const removeCategory = (id: string) => {
        setCategories(prev => prev.filter(c => c.id !== id));
        setExpandedCategories(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
    };

    const updateCategoryName = (id: string, name: string) => {
        setCategories(prev =>
            prev.map(c => (c.id === id ? { ...c, name } : c))
        );
    };

    const addSkill = (categoryId: string) => {
        setCategories(prev =>
            prev.map(c =>
                c.id === categoryId
                    ? {
                        ...c,
                        skills: [
                            ...c.skills,
                            { name: '', level: 50, skillLevel: 'intermediate' },
                        ],
                    }
                    : c
            )
        );
    };

    const removeSkill = (categoryId: string, skillIndex: number) => {
        setCategories(prev =>
            prev.map(c =>
                c.id === categoryId
                    ? { ...c, skills: c.skills.filter((_, i) => i !== skillIndex) }
                    : c
            )
        );
    };

    const updateSkill = (
        categoryId: string,
        skillIndex: number,
        updates: Partial<ExtendedSkill>
    ) => {
        setCategories(prev =>
            prev.map(c =>
                c.id === categoryId
                    ? {
                        ...c,
                        skills: c.skills.map((s, i) =>
                            i === skillIndex ? { ...s, ...updates } : s
                        ),
                    }
                    : c
            )
        );
    };

    const openTechPicker = (categoryId: string, skillIndex: number) => {
        setTechPickerState({ isOpen: true, categoryId, skillIndex });
    };

    const handleTechSelect = (techId: string) => {
        if (techPickerState.categoryId !== undefined && techPickerState.skillIndex !== undefined) {
            updateSkill(techPickerState.categoryId, techPickerState.skillIndex, { techId });
        }
        setTechPickerState({ isOpen: false });
    };

    const getSelectedTechIds = () => {
        const ids: string[] = [];
        categories.forEach(cat => {
            cat.skills.forEach(skill => {
                if (skill.techId) ids.push(skill.techId);
            });
        });
        return ids;
    };

    const handleSave = () => {
        setMessage(null);
        setError(null);
        startSave(async () => {
            try {
                const payload: SkillsContent = {
                    summary,
                    categories: categories.map(cat => ({
                        name: cat.name,
                        skills: cat.skills.map(s => ({
                            name: s.name,
                            level: s.level,
                        })),
                    })),
                    translations: initial.translations,
                };
                await saveSkillsContent(payload);
                setMessage('Skills salvos com sucesso.');
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
                const translations = await autoTranslateSkills({
                    summary,
                    categories: categories.map(cat => ({
                        name: cat.name,
                        skills: cat.skills.map(s => ({ name: s.name, level: s.level })),
                    })),
                });
                setMessage('Traduções geradas com sucesso.');
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro ao traduzir.');
            }
        });
    };

    const levelLabels: Record<SkillLevel, string> = {
        beginner: 'Iniciante',
        intermediate: 'Intermediário',
        advanced: 'Avançado',
    };

    const levelColors: Record<SkillLevel, string> = {
        beginner: '#3b82f6',
        intermediate: '#f59e0b',
        advanced: '#10b981',
    };

    return (
        <>
            <div className="min-h-screen bg-linear-to-br from-background via-background to-surface-soft/30">
                <div className="max-w-7xl mx-auto p-6 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between"
                    >
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground-subtle">
                                Gerenciamento
                            </p>
                            <h1 className="text-3xl font-bold text-foreground mt-1">
                                Habilidades Técnicas
                            </h1>
                        </div>
                        <div className="flex gap-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={handleAutoTranslate}
                                className="inline-flex items-center gap-2 rounded-xl border border-border-subtle/70 bg-surface-soft/60 backdrop-blur-sm px-4 py-2.5 text-sm font-medium hover:border-primary/60 transition-all shadow-sm"
                                disabled={isTranslating}
                            >
                                {isTranslating ? (
                                    <FiLoader className="w-4 h-4 animate-spin" />
                                ) : (
                                    <FiRefreshCw className="w-4 h-4" />
                                )}
                                Traduzir
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={handleSave}
                                className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-foreground shadow-glow hover:shadow-glow-lg transition-all"
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <FiLoader className="w-4 h-4 animate-spin" />
                                ) : (
                                    <FiSave className="w-4 h-4" />
                                )}
                                Salvar alterações
                            </motion.button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="rounded-2xl border border-border-subtle/70 bg-surface-soft/60 backdrop-blur-xl p-6 shadow-xl"
                    >
                        <label className="space-y-3 block">
                            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle font-medium">
                                Resumo geral
                            </span>
                            <textarea
                                value={summary}
                                onChange={e => setSummary(e.target.value)}
                                placeholder="Escreva uma introdução sobre suas habilidades técnicas..."
                                className="w-full rounded-xl border border-border-subtle/70 bg-background/60 backdrop-blur-sm px-4 py-3 text-sm min-h-[100px] focus:outline-none focus:border-primary/60 transition-colors resize-none"
                            />
                        </label>
                    </motion.div>

                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center justify-between"
                        >
                            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                                <FiTag className="w-5 h-5 text-primary" />
                                Categorias
                            </h2>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={addCategory}
                                className="inline-flex items-center gap-2 rounded-xl border border-border-subtle/70 bg-surface-soft/60 backdrop-blur-sm px-4 py-2 text-sm font-medium hover:border-primary/60 transition-all shadow-sm"
                            >
                                <FiPlus className="w-4 h-4" />
                                Nova categoria
                            </motion.button>
                        </motion.div>

                        <Reorder.Group
                            axis="y"
                            values={categories}
                            onReorder={setCategories}
                            className="space-y-3"
                        >
                            <AnimatePresence>
                                {categories.map((cat, catIdx) => (
                                    <Reorder.Item
                                        key={cat.id}
                                        value={cat}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        transition={{ delay: catIdx * 0.05 }}
                                        className="rounded-2xl border border-border-subtle/70 bg-surface-soft/60 backdrop-blur-xl shadow-lg overflow-hidden"
                                    >
                                        <div className="p-4 flex items-center gap-3 bg-linear-to-r from-background/40 to-transparent border-b border-border-subtle/50">
                                            <button
                                                type="button"
                                                className="cursor-grab active:cursor-grabbing p-1 hover:bg-background/60 rounded transition-colors"
                                            >
                                                <FiMove className="w-5 h-5 text-muted-foreground" />
                                            </button>
                                            <input
                                                value={cat.name}
                                                onChange={e => updateCategoryName(cat.id, e.target.value)}
                                                placeholder="Nome da categoria"
                                                className="flex-1 rounded-lg border border-border-subtle/70 bg-background/60 backdrop-blur-sm px-3 py-2 text-sm font-semibold focus:outline-none focus:border-primary/60 transition-colors"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => toggleCategory(cat.id)}
                                                className="p-2 rounded-lg hover:bg-background/60 transition-colors"
                                            >
                                                {expandedCategories.has(cat.id) ? (
                                                    <FiChevronUp className="w-5 h-5" />
                                                ) : (
                                                    <FiChevronDown className="w-5 h-5" />
                                                )}
                                            </button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                type="button"
                                                onClick={() => removeCategory(cat.id)}
                                                className="p-2 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors"
                                            >
                                                <FiTrash className="w-5 h-5" />
                                            </motion.button>
                                        </div>

                                        <AnimatePresence>
                                            {expandedCategories.has(cat.id) && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-4 space-y-3">
                                                        <AnimatePresence>
                                                            {cat.skills.map((skill, skillIdx) => (
                                                                <motion.div
                                                                    key={skillIdx}
                                                                    initial={{ opacity: 0, x: -20 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    exit={{ opacity: 0, x: 20 }}
                                                                    className="flex items-center gap-3 p-3 rounded-xl border border-border-subtle/50 bg-background/40 backdrop-blur-sm"
                                                                >
                                                                    <input
                                                                        value={skill.name}
                                                                        onChange={e =>
                                                                            updateSkill(cat.id, skillIdx, {
                                                                                name: e.target.value,
                                                                            })
                                                                        }
                                                                        placeholder="Nome da skill"
                                                                        className="flex-1 rounded-lg border border-border-subtle/70 bg-background/60 px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors"
                                                                    />

                                                                    <select
                                                                        value={skill.skillLevel || 'intermediate'}
                                                                        onChange={e =>
                                                                            updateSkill(cat.id, skillIdx, {
                                                                                skillLevel: e.target.value as SkillLevel,
                                                                            })
                                                                        }
                                                                        className="rounded-lg border border-border-subtle/70 bg-background/60 px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors"
                                                                        style={{
                                                                            color: levelColors[skill.skillLevel || 'intermediate'],
                                                                        }}
                                                                    >
                                                                        {(Object.keys(levelLabels) as SkillLevel[]).map(
                                                                            level => (
                                                                                <option key={level} value={level}>
                                                                                    {levelLabels[level]}
                                                                                </option>
                                                                            )
                                                                        )}
                                                                    </select>

                                                                    {skill.techId ? (
                                                                        <TechBadge
                                                                            techId={skill.techId}
                                                                            onRemove={() =>
                                                                                updateSkill(cat.id, skillIdx, {
                                                                                    techId: undefined,
                                                                                })
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                openTechPicker(cat.id, skillIdx)
                                                                            }
                                                                            className="px-3 py-2 rounded-lg border border-dashed border-border-subtle/70 text-xs text-muted-foreground hover:border-primary/60 hover:text-primary transition-all"
                                                                        >
                                                                            + Tech
                                                                        </button>
                                                                    )}

                                                                    <motion.button
                                                                        whileHover={{ scale: 1.1 }}
                                                                        whileTap={{ scale: 0.9 }}
                                                                        type="button"
                                                                        onClick={() =>
                                                                            removeSkill(cat.id, skillIdx)
                                                                        }
                                                                        className="p-2 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors"
                                                                    >
                                                                        <FiTrash className="w-4 h-4" />
                                                                    </motion.button>
                                                                </motion.div>
                                                            ))}
                                                        </AnimatePresence>

                                                        <button
                                                            type="button"
                                                            onClick={() => addSkill(cat.id)}
                                                            className="w-full py-2 rounded-lg border border-dashed border-border-subtle/70 text-sm text-muted-foreground hover:border-primary/60 hover:text-primary transition-all"
                                                        >
                                                            + Adicionar skill
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </Reorder.Item>
                                ))}
                            </AnimatePresence>
                        </Reorder.Group>

                        {categories.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-12 rounded-2xl border border-dashed border-border-subtle/50"
                            >
                                <p className="text-muted-foreground mb-4">
                                    Nenhuma categoria criada ainda
                                </p>
                                <button
                                    type="button"
                                    onClick={addCategory}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                >
                                    <FiPlus className="w-4 h-4" />
                                    Criar primeira categoria
                                </button>
                            </motion.div>
                        )}
                    </div>

                    <AnimatePresence>
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 backdrop-blur-sm px-4 py-3 text-sm text-emerald-100"
                            >
                                {message}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="rounded-xl border border-red-400/40 bg-red-500/10 backdrop-blur-sm px-4 py-3 text-sm text-red-100"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <TechnologyPickerModal
                isOpen={techPickerState.isOpen}
                onClose={() => setTechPickerState({ isOpen: false })}
                onSelect={handleTechSelect}
                selectedIds={getSelectedTechIds()}
            />
        </>
    );
}