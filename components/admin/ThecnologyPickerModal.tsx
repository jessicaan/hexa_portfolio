'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX } from 'react-icons/fi';
import * as SimpleIcons from 'simple-icons/icons';
import { TECHNOLOGIES, TECH_CATEGORIES, type TechCategory } from '@/lib/content/technologies';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (techId: string) => void;
    selectedIds?: string[];
}

export default function TechnologyPickerModal({ isOpen, onClose, onSelect, selectedIds = [] }: Props) {
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState<TechCategory | 'all'>('all');

    const filteredTechs = useMemo(() => {
        let techs = TECHNOLOGIES;

        if (activeCategory !== 'all') {
            techs = techs.filter(t => t.category === activeCategory);
        }

        if (search) {
            const query = search.toLowerCase();
            techs = techs.filter(t => t.name.toLowerCase().includes(query));
        }

        return techs;
    }, [search, activeCategory]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                    onClick={onClose}
                />

                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-4xl max-h-[85vh] rounded-2xl border border-border-subtle/70 bg-surface-soft/95 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden"
                >
                    <div className="p-6 border-b border-border-subtle/70">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-foreground">Selecionar Tecnologia</h2>
                            <button
                                type="button"
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-background/60 transition-colors"
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Buscar tecnologia..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border-subtle/70 bg-background/60 text-sm focus:outline-none focus:border-primary/60 transition-colors"
                            />
                        </div>

                        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-thin">
                            <button
                                type="button"
                                onClick={() => setActiveCategory('all')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${activeCategory === 'all'
                                    ? 'bg-primary/20 text-primary border border-primary/30'
                                    : 'border border-border-subtle/70 hover:border-primary/40'
                                    }`}
                            >
                                Todas
                            </button>
                            {(Object.keys(TECH_CATEGORIES) as TechCategory[]).map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${activeCategory === cat
                                        ? 'bg-primary/20 text-primary border border-primary/30'
                                        : 'border border-border-subtle/70 hover:border-primary/40'
                                        }`}
                                >
                                    {TECH_CATEGORIES[cat].label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {filteredTechs.map(tech => {
                                const iconKey = tech.icon.replace('Si', 'si');
                                const iconData = SimpleIcons[iconKey as keyof typeof SimpleIcons];
                                const isSelected = selectedIds.includes(tech.id);

                                return (
                                    <motion.button
                                        key={tech.id}
                                        type="button"
                                        onClick={() => onSelect(tech.id)}
                                        disabled={isSelected}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`p-4 rounded-xl border transition-all text-left ${isSelected
                                            ? 'border-border-subtle/30 bg-background/20 opacity-50 cursor-not-allowed'
                                            : 'border-border-subtle/70 bg-background/40 hover:bg-background/60 hover:border-primary/40 hover:scale-105'
                                            }`}
                                        style={{
                                            borderColor: isSelected ? undefined : `${tech.color}30`,
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            {iconData && (
                                                <svg
                                                    className="w-6 h-6 shrink-0"
                                                    fill={tech.color}
                                                    viewBox="0 0 24 24"
                                                    dangerouslySetInnerHTML={{ __html: iconData.svg }}
                                                />
                                            )}
                                            <div className="min-w-0">
                                                <p className="font-medium text-sm truncate" style={{ color: tech.color }}>
                                                    {tech.name}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                                    {TECH_CATEGORIES[tech.category].label}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>

                        {filteredTechs.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">Nenhuma tecnologia encontrada</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}