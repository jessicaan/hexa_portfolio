'use client';

import { motion } from 'framer-motion';
import * as SimpleIcons from 'simple-icons/icons';
import { getTechById } from '@/lib/technologies';

interface Props {
    techId: string;
    onRemove?: () => void;
    size?: 'sm' | 'md' | 'lg';
}

export default function TechBadge({ techId, onRemove, size = 'md' }: Props) {
    const tech = getTechById(techId);
    if (!tech) return null;

    const iconKey = tech.icon.replace('Si', 'si');
    const iconData = SimpleIcons[iconKey as keyof typeof SimpleIcons];

    const sizeClasses = {
        sm: 'px-2 py-1 text-xs gap-1.5',
        md: 'px-3 py-1.5 text-sm gap-2',
        lg: 'px-4 py-2 text-base gap-2.5',
    };

    const iconSizes = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
    };

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className={`inline-flex items-center rounded-lg border border-border-subtle/70 bg-background/60 backdrop-blur-sm ${sizeClasses[size]}`}
            style={{
                borderColor: `${tech.color}40`,
                backgroundColor: `${tech.color}15`,
            }}
        >
            {iconData && (
                <svg
                    className={iconSizes[size]}
                    fill={tech.color}
                    viewBox="0 0 24 24"
                    dangerouslySetInnerHTML={{ __html: iconData.svg }}
                />
            )}
            <span className="font-medium" style={{ color: tech.color }}>
                {tech.name}
            </span>
            {onRemove && (
                <button
                    type="button"
                    onClick={onRemove}
                    className="ml-1 rounded hover:bg-surface-soft/50 p-0.5 transition-colors"
                >
                    <svg className={iconSizes[size]} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </motion.div>
    );
}