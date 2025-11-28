'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { FiPlus, FiTrash, FiImage, FiMove, FiMaximize2, FiX } from 'react-icons/fi';
import Image from 'next/image';
import FileUploader from '@/components/admin/FileUploader';

interface Props {
    images: string[];
    onChange: (images: string[]) => void;
    folder?: string;
}

export default function ImageGalleryEditor({ images, onChange, folder = 'projects' }: Props) {
    const [showUploader, setShowUploader] = useState(false);
    const [previewIndex, setPreviewIndex] = useState<number | null>(null);

    const handleUpload = useCallback((url: string) => {
        onChange([...images, url]);
        setShowUploader(false);
    }, [images, onChange]);

    const handleRemove = useCallback((index: number) => {
        onChange(images.filter((_, i) => i !== index));
    }, [images, onChange]);

    const handleReorder = useCallback((newOrder: string[]) => {
        onChange(newOrder);
    }, [onChange]);

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle">
                    Galeria de Imagens
                </span>
                <span className="text-xs text-muted-foreground">
                    {images.length} imagem{images.length !== 1 && 'ns'}
                </span>
            </div>

            {images.length > 0 && (
                <Reorder.Group
                    axis="x"
                    values={images}
                    onReorder={handleReorder}
                    className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
                >
                    {images.map((url, index) => (
                        <Reorder.Item
                            key={url}
                            value={url}
                            className="shrink-0 cursor-grab active:cursor-grabbing"
                        >
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="group relative w-28 h-20 rounded-lg overflow-hidden border border-border-subtle bg-surface-soft"
                            >
                                <Image
                                    src={url}
                                    alt={`Imagem ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => setPreviewIndex(index)}
                                        className="p-1.5 rounded-md bg-white/20 hover:bg-white/30 transition-colors"
                                    >
                                        <FiMaximize2 className="w-3.5 h-3.5 text-white" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleRemove(index)}
                                        className="p-1.5 rounded-md bg-red-500/80 hover:bg-red-500 transition-colors"
                                    >
                                        <FiTrash className="w-3.5 h-3.5 text-white" />
                                    </button>
                                </div>
                                <div className="absolute top-1 left-1 p-1 rounded bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <FiMove className="w-3 h-3 text-white" />
                                </div>
                                <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-full bg-black/60 text-[10px] text-white">
                                    {index + 1}
                                </div>
                            </motion.div>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            )}

            <AnimatePresence mode="wait">
                {showUploader ? (
                    <motion.div
                        key="uploader"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="rounded-lg border border-border-subtle bg-background/60 p-3 space-y-2">
                            <FileUploader
                                value=""
                                onChange={handleUpload}
                                accept="image/*"
                                label=""
                                folder={folder}
                            />
                            <button
                                type="button"
                                onClick={() => setShowUploader(false)}
                                className="w-full text-sm text-muted-foreground hover:text-foreground"
                            >
                                Cancelar
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.button
                        key="add-button"
                        type="button"
                        onClick={() => setShowUploader(true)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full flex items-center justify-center gap-2 rounded-lg border border-dashed border-border-subtle py-6 text-sm text-muted-foreground hover:border-primary/60 hover:text-foreground transition-colors"
                    >
                        <FiPlus className="w-4 h-4" />
                        Adicionar imagem
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {previewIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                        onClick={() => setPreviewIndex(null)}
                    >
                        <button
                            type="button"
                            onClick={() => setPreviewIndex(null)}
                            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            <FiX className="w-5 h-5 text-white" />
                        </button>
                        <div className="relative max-w-4xl max-h-[80vh] w-full h-full">
                            <Image
                                src={images[previewIndex]}
                                alt={`Preview ${previewIndex + 1}`}
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {images.map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setPreviewIndex(i);
                                    }}
                                    className={`w-2 h-2 rounded-full transition-colors ${i === previewIndex ? 'bg-white' : 'bg-white/40'
                                        }`}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}