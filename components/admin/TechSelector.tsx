'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiCheck } from 'react-icons/fi';
import * as Si from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
import {
    TECHNOLOGIES,
    TECH_CATEGORIES,
    getTechById,
    searchTechnologies,
    type Technology,
    type TechCategory,
} from '@/lib/content/technologies';

interface Props {
    selected: string[];
    onChange: (ids: string[]) => void;
    maxVisible?: number;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    ...Si,
    FaJava,
};

function TechIcon({ icon, className }: { icon: string; className?: string }) {
    const Icon = iconMap[icon];
    if (!Icon) return null;
    return <Icon className={className} />;
}

export default function TechSelector({ selected, onChange, maxVisible = 12 }: Props) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState<TechCategory | 'all'>('all');
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (open && inputRef.current) {
            inputRef.current.focus();
        }
    }, [open]);

    const filteredTechs = useMemo(() => {
        let techs = TECHNOLOGIES;

        if (activeCategory !== 'all') {
            techs = techs.filter(t => t.category === activeCategory);
        }

        if (search.trim()) {
            techs = searchTechnologies(search).filter(t =>
                activeCategory === 'all' || t.category === activeCategory
            );
        }

        return techs;
    }, [search, activeCategory]);

    const selectedTechs = useMemo(() => {
        return selected.map(id => getTechById(id)).filter((t): t is Technology => !!t);
    }, [selected]);

    const toggle = (id: string) => {
        if (selected.includes(id)) {
            onChange(selected.filter(s => s !== id));
        } else {
            onChange([...selected, id]);
        }
    };

    const remove = (id: string) => {
        onChange(selected.filter(s => s !== id));
    };

    const visibleTechs = selectedTechs.slice(0, maxVisible);
    const hiddenCount = selectedTechs.length - maxVisible;

    return (
        <div ref={containerRef} className="space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle">
                Tecnologias
            </span>

            <div className="flex flex-wrap gap-2">
                {visibleTechs.map(tech => (
                    <motion.div
                        key={tech.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex items-center gap-1.5 rounded-full border border-border-subtle bg-surface-soft px-2.5 py-1 text-sm"
                        style={{ borderColor: `${tech.color}40` }}
                    >
                        <TechIcon icon={tech.icon} className="w-3.5 h-3.5" />
                        <span>{tech.name}</span>
                        <button
                            type="button"
                            onClick={() => remove(tech.id)}
                            className="ml-0.5 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <FiX className="w-3 h-3" />
                        </button>
                    </motion.div>
                ))}
                {hiddenCount > 0 && (
                    <div className="flex items-center rounded-full border border-border-subtle bg-surface-soft px-2.5 py-1 text-sm text-muted-foreground">
                        +{hiddenCount}
                    </div>
                )}
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="flex items-center gap-1 rounded-full border border-dashed border-border-subtle px-3 py-1 text-sm text-muted-foreground hover:border-primary/60 hover:text-foreground transition-colors"
                >
                    <FiSearch className="w-3.5 h-3.5" />
                    Adicionar
                </button>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="rounded-xl border border-border-subtle bg-surface/95 backdrop-blur-xl shadow-xl overflow-hidden"
                    >
                        <div className="p-3 border-b border-border-subtle/60">
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Buscar tecnologia..."
                                    className="w-full rounded-lg border border-border-subtle/70 bg-background/60 pl-9 pr-3 py-2 text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex gap-1.5 px-3 py-2 border-b border-border-subtle/60 overflow-x-auto scrollbar-hide">
                            <CategoryButton
                                active={activeCategory === 'all'}
                                onClick={() => setActiveCategory('all')}
                            >
                                Todos
                            </CategoryButton>
                            {Object.entries(TECH_CATEGORIES).map(([key, { label }]) => (
                                <CategoryButton
                                    key={key}
                                    active={activeCategory === key}
                                    onClick={() => setActiveCategory(key as TechCategory)}
                                >
                                    {label}
                                </CategoryButton>
                            ))}
                        </div>

                        <div className="max-h-64 overflow-y-auto p-2">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                                {filteredTechs.map(tech => {
                                    const isSelected = selected.includes(tech.id);
                                    return (
                                        <button
                                            key={tech.id}
                                            type="button"
                                            onClick={() => toggle(tech.id)}
                                            className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-left transition-colors ${isSelected
                                                ? 'bg-primary/10 text-foreground'
                                                : 'hover:bg-surface-soft text-muted-foreground hover:text-foreground'
                                                }`}
                                        >
                                            <TechIcon
                                                icon={tech.icon}
                                                className="w-4 h-4 shrink-0"
                                            />
                                            <span className="truncate flex-1">{tech.name}</span>
                                            {isSelected && (
                                                <FiCheck className="w-4 h-4 text-primary shrink-0" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                            {filteredTechs.length === 0 && (
                                <p className="text-center text-sm text-muted-foreground py-6">
                                    Nenhuma tecnologia encontrada
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-between p-3 border-t border-border-subtle/60 bg-surface-soft/50">
                            <span className="text-xs text-muted-foreground">
                                {selected.length} selecionada{selected.length !== 1 && 's'}
                            </span>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="text-sm text-primary hover:underline"
                            >
                                Concluir
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function CategoryButton({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`shrink-0 rounded-full px-3 py-1 text-xs transition-colors ${active
                ? 'bg-primary/20 text-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-surface-soft'
                }`}
        >
            {children}
        </button>
    );
}
