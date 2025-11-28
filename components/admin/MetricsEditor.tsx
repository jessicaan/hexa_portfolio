'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash, FiTrendingUp } from 'react-icons/fi';

interface Metric {
    label: string;
    value: string;
}

interface Props {
    metrics: Metric[];
    onChange: (metrics: Metric[]) => void;
}

const METRIC_SUGGESTIONS = [
    { label: 'Usuários ativos', value: '' },
    { label: 'Downloads', value: '' },
    { label: 'Performance', value: '' },
    { label: 'Uptime', value: '' },
    { label: 'Tempo de resposta', value: '' },
    { label: 'Redução de custos', value: '' },
    { label: 'Aumento de conversão', value: '' },
    { label: 'Satisfação do cliente', value: '' },
];

export default function MetricsEditor({ metrics, onChange }: Props) {
    const addMetric = () => {
        onChange([...metrics, { label: '', value: '' }]);
    };

    const removeMetric = (index: number) => {
        onChange(metrics.filter((_, i) => i !== index));
    };

    const updateMetric = (index: number, field: keyof Metric, value: string) => {
        const updated = [...metrics];
        updated[index] = { ...updated[index], [field]: value };
        onChange(updated);
    };

    const addSuggestion = (suggestion: Metric) => {
        if (!metrics.some(m => m.label === suggestion.label)) {
            onChange([...metrics, suggestion]);
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle flex items-center gap-1.5">
                    <FiTrendingUp className="w-3.5 h-3.5" />
                    Métricas
                </span>
                <button
                    type="button"
                    onClick={addMetric}
                    className="text-xs text-primary hover:underline"
                >
                    + Adicionar
                </button>
            </div>

            <AnimatePresence mode="popLayout">
                {metrics.map((metric, index) => (
                    <motion.div
                        key={index}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex gap-2 items-start"
                    >
                        <div className="flex-1 grid grid-cols-2 gap-2">
                            <input
                                type="text"
                                value={metric.label}
                                onChange={e => updateMetric(index, 'label', e.target.value)}
                                placeholder="Ex: Usuários ativos"
                                className="w-full rounded-lg border border-border-subtle/70 bg-background/60 px-3 py-2 text-sm"
                            />
                            <input
                                type="text"
                                value={metric.value}
                                onChange={e => updateMetric(index, 'value', e.target.value)}
                                placeholder="Ex: 10.000+"
                                className="w-full rounded-lg border border-border-subtle/70 bg-background/60 px-3 py-2 text-sm"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => removeMetric(index)}
                            className="p-2 text-red-300 hover:text-red-200 transition-colors"
                        >
                            <FiTrash className="w-4 h-4" />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>

            {metrics.length === 0 && (
                <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                        Sugestões de métricas:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {METRIC_SUGGESTIONS.map((suggestion, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => addSuggestion(suggestion)}
                                className="rounded-full border border-border-subtle/70 px-2.5 py-1 text-xs text-muted-foreground hover:border-primary/60 hover:text-foreground transition-colors"
                            >
                                {suggestion.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}