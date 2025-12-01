import type { ProjectStatus } from '@/lib/content/schema';
import type { StatusStyle } from './types';

export const STATUS_STYLES: Record<ProjectStatus, StatusStyle> = {
    completed: {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        dot: 'bg-emerald-400',
    },
    'in-progress': {
        bg: 'bg-blue-500/10',
        text: 'text-blue-400',
        dot: 'bg-blue-400',
    },
    archived: {
        bg: 'bg-gray-500/10',
        text: 'text-gray-400',
        dot: 'bg-gray-400',
    },
    concept: {
        bg: 'bg-purple-500/10',
        text: 'text-purple-400',
        dot: 'bg-purple-400',
    },
};
