'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { FiTrash, FiMove, FiMaximize2, FiX, FiUpload, FiLoader } from 'react-icons/fi';
import NextImage from 'next/image';
import type { ProjectImage } from '@/lib/content/schema';
import { generateProjectImageId } from '@/lib/content/schema';

interface Props {
    images: ProjectImage[];
    onChange: (images: ProjectImage[]) => void;
    folder?: string;
}

export default function ImageGalleryEditor({ images, onChange, folder = 'projects' }: Props) {
    const [previewIndex, setPreviewIndex] = useState<number | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleRemove = useCallback((id: string) => {
        onChange(images.filter((img) => img.id !== id));
    }, [images, onChange]);

    const handleReorder = useCallback((newOrder: ProjectImage[]) => {
        onChange(newOrder);
    }, [onChange]);

    const handleDescriptionChange = useCallback((id: string, description: string) => {
        onChange(images.map((img) => img.id === id ? { ...img, description } : img));
    }, [images, onChange]);

    const convertToWebp = useCallback((file: File) => {
        return new Promise<File>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const img = new window.Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        reject(new Error('N�o foi poss�vel processar a imagem'));
                        return;
                    }
                    ctx.drawImage(img, 0, 0);
                    canvas.toBlob(
                        (blob) => {
                            if (!blob) {
                                reject(new Error('Falha ao converter para WebP'));
                                return;
                            }
                            const webpFile = new File(
                                [blob],
                                file.name.replace(/\.[^.]+$/, '') + '.webp',
                                { type: 'image/webp' }
                            );
                            resolve(webpFile);
                        },
                        'image/webp',
                        0.82
                    );
                };
                img.onerror = () => reject(new Error('Falha ao carregar a imagem'));
                img.src = reader.result as string;
            };
            reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
            reader.readAsDataURL(file);
        });
    }, []);

    const uploadFile = useCallback(async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) throw new Error('Falha no upload');
        const data = await response.json();
        return data.url as string;
    }, [folder]);

    const handleFilesSelected = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setError(null);
        setUploading(true);
        try {
            const uploads: ProjectImage[] = [];
            for (let i = 0; i < files.length; i++) {
                const original = files.item(i);
                if (!original) continue;
                const webp = await convertToWebp(original);
                const url = await uploadFile(webp);
                uploads.push({
                    id: generateProjectImageId(),
                    url,
                    description: '',
                    translations: {},
                });
            }
            onChange([...images, ...uploads]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao enviar imagens');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    }, [convertToWebp, uploadFile, images, onChange]);

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle">
                    Galeria de Imagens
                </span>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{images.length} imagem{images.length !== 1 && 'ns'}</span>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1 rounded-md border border-border-subtle px-2 py-1 text-[11px] font-medium hover:border-primary/60 transition-colors"
                        disabled={uploading}
                    >
                        {uploading ? <FiLoader className="w-3.5 h-3.5 animate-spin" /> : <FiUpload className="w-3.5 h-3.5" />}
                        {uploading ? 'Enviando...' : 'Adicionar imagens'}
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFilesSelected}
                        className="hidden"
                    />
                </div>
            </div>

            {images.length > 0 && (
                <Reorder.Group
                    axis="x"
                    values={images}
                    onReorder={handleReorder}
                    className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
                >
                    {images.map((img, index) => (
                        <Reorder.Item
                            key={img.id}
                            value={img}
                            className="shrink-0 cursor-grab active:cursor-grabbing"
                        >
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="group relative w-36 h-28 rounded-lg overflow-hidden border border-border-subtle bg-surface-soft"
                            >
                                <NextImage
                                    src={img.url}
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
                                        onClick={() => handleRemove(img.id)}
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
                            <input
                                type="text"
                                value={img.description ?? ''}
                                onChange={(e) => handleDescriptionChange(img.id, e.target.value)}
                                placeholder="Descri��ǜo da imagem"
                                className="mt-2 w-full rounded-md border border-border-subtle bg-background/60 px-2 py-1 text-xs"
                            />
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            )}

            {!images.length && (
                <div className="rounded-lg border border-dashed border-border-subtle py-6 text-center text-sm text-muted-foreground">
                    Nenhuma imagem adicionada ainda
                </div>
            )}

            <AnimatePresence>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="text-xs text-red-400"
                    >
                        {error}
                    </motion.p>
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
                            <NextImage
                                src={images[previewIndex]?.url}
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
