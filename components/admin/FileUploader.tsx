'use client';

import { useState, useRef } from 'react';
import { FiUpload, FiLoader, FiX, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploaderProps {
    value: string;
    onChange: (url: string) => void;
    accept?: string;
    label?: string;
    folder?: string;
    maxSize?: number;
}

export default function FileUploader({
    value,
    onChange,
    accept = 'image/*,video/*',
    label = 'Upload de arquivo',
    folder = 'media',
    maxSize = 50 * 1024 * 1024,
}: FileUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > maxSize) {
            setError(`Arquivo muito grande. Máximo: ${Math.round(maxSize / 1024 / 1024)}MB`);
            return;
        }

        setError(null);
        setUploading(true);
        setProgress(0);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', folder);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Falha no upload');

            const data = await response.json();
            onChange(data.url);
            setProgress(100);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao fazer upload');
        } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = '';
        }
    };

    const handleRemove = () => {
        onChange('');
        setProgress(0);
        setError(null);
    };

    const isImage = value && (value.includes('.jpg') || value.includes('.png') || value.includes('.webp') || value.includes('.gif'));
    const isVideo = value && (value.includes('.mp4') || value.includes('.webm'));

    return (
        <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle block">
                {label}
            </label>

            <div className="space-y-3">
                {!value ? (
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        disabled={uploading}
                        className="relative w-full rounded-xl border-2 border-dashed border-border-subtle/70 bg-background/60 px-4 py-8 text-center hover:border-primary/60 transition-colors disabled:opacity-60 group"
                    >
                        <div className="flex flex-col items-center gap-2">
                            {uploading ? (
                                <>
                                    <FiLoader className="w-8 h-8 text-primary animate-spin" />
                                    <p className="text-sm text-muted-foreground">Enviando... {progress}%</p>
                                    {progress > 0 && (
                                        <div className="w-full max-w-xs h-1 bg-surface-soft rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                className="h-full bg-linear-to-r from-primary to-secondary"
                                            />
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <FiUpload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                                    <p className="text-sm text-foreground">Clique para fazer upload</p>
                                    <p className="text-xs text-muted-foreground">
                                        Máximo {Math.round(maxSize / 1024 / 1024)}MB
                                    </p>
                                </>
                            )}
                        </div>
                    </button>
                ) : (
                    <div className="relative rounded-xl border border-border-subtle/70 bg-background/60 p-3 overflow-hidden">
                        {isImage && (
                            <img
                                src={value}
                                alt="Preview"
                                className="w-full h-48 object-cover rounded-lg"
                            />
                        )}
                        {isVideo && (
                            <video
                                src={value}
                                className="w-full h-48 object-cover rounded-lg"
                                controls
                            />
                        )}
                        {!isImage && !isVideo && (
                            <div className="flex items-center gap-3 p-4">
                                <FiCheck className="w-5 h-5 text-emerald-400" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-foreground truncate">{value.split('/').pop()}</p>
                                    <p className="text-xs text-muted-foreground">Arquivo carregado</p>
                                </div>
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute top-2 right-2 rounded-lg bg-red-500/90 p-2 text-white hover:bg-red-600 transition-colors"
                        >
                            <FiX className="w-4 h-4" />
                        </button>
                    </div>
                )}

                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </div>

            <AnimatePresence>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="text-xs text-red-400"
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}