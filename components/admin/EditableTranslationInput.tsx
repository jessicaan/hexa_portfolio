import React from 'react';

interface EditableTranslationInputProps {
    label?: string;
    value: string;
    onChange: (newValue: string) => void;
    placeholder?: string;
    multiline?: boolean;
    rows?: number;
    className?: string;
}

export function EditableTranslationInput({
    label,
    value,
    onChange,
    placeholder,
    multiline = false,
    rows = 2,
    className = '',
}: EditableTranslationInputProps) {
    const inputClasses = `w-full rounded-lg border border-border-subtle/70 bg-background/60 px-3 py-2 text-sm transition-colors focus:border-primary/60 focus:outline-none ${className}`;

    return (
        <label className="space-y-1 block">
            {label && (
                <span className="text-xs uppercase tracking-widest text-muted-foreground-subtle">
                    {label}
                </span>
            )}
            {multiline ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    rows={rows}
                    className={`${inputClasses} resize-none`}
                />
            ) : (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={inputClasses}
                />
            )}
        </label>
    );
}
