import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChevronLeft, HiChevronRight, HiXMark } from 'react-icons/hi2';
import TechBadge from '@/components/TechBadge';
import ProjectActions from './ProjectActions';
import ProjectHighlights from './ProjectHighlights';
import ProjectInfoGrid from './ProjectInfoGrid';
import ProjectMetaChips from './ProjectMetaChips';
import type { ProjectDetailDesktopProps } from './types';

export default function ProjectDetailDesktop(props: ProjectDetailDesktopProps) {
    const {
        project,
        translation,
        allImages,
        currentImageIndex,
        onPrevImage,
        onNextImage,
        onSelectImage,
        primaryColor,
        primaryColorBg,
        statusStyle,
        timeline,
        descriptionHtml,
        metrics,
        technologies,
        unknownTechs,
        isDark,
        onClose,
    } = props;

    const currentImage = allImages[currentImageIndex];

    return (
        <>
            <style jsx global>{`
                :root {
                    --project-scroll-color: ${primaryColor};
                }

                .project-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .project-scrollbar::-webkit-scrollbar-thumb {
                    background-color: ${primaryColor}4d;
                    border-radius: 3px;
                }
                .project-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: ${primaryColor}cc;
                }
            `}</style>

            <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="h-full flex flex-col rounded-2xl border border-border-subtle overflow-hidden backdrop-blur-md"
                style={{
                    background: 'transparent',
                    boxShadow: `0 8px 32px rgba(0,0,0,${isDark ? 0.3 : 0.1})`,
                }}
            >
                <div
                    className="relative h-[50%] w-full aspect-video shrink-0 overflow-hidden flex flex-col group backdrop-blur-[2px]"
                    style={{ backgroundColor: primaryColorBg }}
                >
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm transition-colors text-white border border-white/10"
                        >
                            <HiXMark className="w-5 h-5" />
                        </button>
                    )}

                    <div className="flex-1 flex items-center justify-between w-full h-full relative px-2 sm:px-4 lg:px-8">
                        {allImages.length > 1 && (
                            <button
                                onClick={onPrevImage}
                                className="z-10 p-2 lg:p-3 rounded-full bg-black/60 hover:bg-black/90 transition-all border border-white/10 backdrop-blur-sm group/btn"
                            >
                                <HiChevronLeft
                                    className="w-5 h-5 lg:w-6 lg:h-6 transition-transform group-hover/btn:-translate-x-0.5"
                                    style={{ color: primaryColor }}
                                />
                            </button>
                        )}

                        <div className="relative h-full w-full max-w-[85%] lg:max-w-[60%] flex items-center justify-center p-4">
                            {allImages.length > 0 ? (
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentImageIndex}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="relative w-full h-full"
                                    >
                                        <Image
                                            src={currentImage?.url as string}
                                            alt={currentImage?.caption || project._title}
                                            fill
                                            className="object-contain drop-shadow-2xl"
                                            priority
                                        />
                                    </motion.div>
                                </AnimatePresence>
                            ) : (
                                <div className="flex items-center justify-center text-white/60">
                                    <p className="text-sm">{translation.noImageAvailable}</p>
                                </div>
                            )}
                        </div>

                        {allImages.length > 1 && (
                            <button
                                onClick={onNextImage}
                                className="z-10 p-2 lg:p-3 rounded-full bg-black/60 hover:bg-black/80 transition-all border border-white/10 backdrop-blur-sm group/btn"
                            >
                                <HiChevronRight
                                    className="w-5 h-5 lg:w-6 lg:h-6 transition-transform group-hover/btn:translate-x-0.5"
                                    style={{ color: primaryColor }}
                                />
                            </button>
                        )}
                    </div>

                    {allImages.length > 0 && (
                        <div className="w-full absolute bottom-0 left-0 flex flex-col items-center justify-end pointer-events-none pt-12 pb-6 bg-linear-to-t from-black/90 via-black/40 to-transparent">
                            <motion.div
                                key={`caption-${currentImageIndex}`}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4 px-8 text-center max-w-[90%]"
                            >
                                <p className="text-sm md:text-base text-white font-medium tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                                    {currentImage?.caption}
                                </p>
                            </motion.div>

                            {allImages.length > 1 && (
                                <div className="flex items-center gap-2 pointer-events-auto">
                                    {allImages.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => onSelectImage(idx)}
                                            className={`transition-all duration-300 rounded-full ${idx === currentImageIndex
                                                ? 'w-6 h-1.5 shadow-[0_0_8px_rgba(0,0,0,0.5)]'
                                                : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/80'
                                                }`}
                                            style={{
                                                backgroundColor:
                                                    idx === currentImageIndex ? primaryColor : undefined,
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden project-scrollbar bg-background/80 backdrop-blur-sm">
                    <div className="w-full lg:w-3/4 p-6 lg:p-8 lg:h-full lg:overflow-y-auto project-scrollbar lg:border-r border-border-subtle">
                        <div className="mb-6">
                            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-3 leading-tight">
                                {project._title}
                            </h2>
                            <ProjectMetaChips
                                translation={translation}
                                project={project}
                                statusStyle={statusStyle}
                                timeline={timeline}
                                primaryColor={primaryColor}
                                size="lg"
                            />
                        </div>

                        <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="h-px w-8 bg-linear-to-r from-primary/50 to-transparent" />
                                <p className="text-xs uppercase tracking-widest font-semibold text-foreground/80">
                                    {translation.descriptionLabel}
                                </p>
                            </div>

                            <div
                                className="leading-relaxed space-y-4"
                                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                            />

                            <ProjectHighlights
                                translation={translation}
                                project={project}
                                primaryColor={primaryColor}
                            />
                        </div>
                    </div>

                    <div className="w-full lg:w-1/4 flex flex-col bg-muted/20 border-t lg:border-t-0 border-border-subtle">
                        <div className="flex-1 lg:overflow-y-auto project-scrollbar flex flex-col">
                            <div className="p-6 border-b border-border-subtle">
                                <div className="flex items-center gap-2 mb-4">
                                    <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
                                        {translation.technologiesLabel}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {technologies.map((tech) => (
                                        <TechBadge key={tech.id} tech={tech} size="sm" />
                                    ))}
                                    {unknownTechs.map((tech) => (
                                        <span
                                            key={tech}
                                            className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border border-border-subtle bg-background/50 text-muted-foreground"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 flex-1">
                                <div className="flex items-center gap-2 mb-4">
                                    <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
                                        {translation.otherInfoLabel}
                                    </p>
                                </div>

                                <ProjectInfoGrid
                                    translation={translation}
                                    project={project}
                                    metrics={metrics}
                                    timeline={timeline}
                                    primaryColor={primaryColor}
                                />

                                <div className="mt-8 flex flex-col gap-3">
                                    <ProjectActions
                                        translation={translation}
                                        project={project}
                                        primaryColor={primaryColor}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
}
