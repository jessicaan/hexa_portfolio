import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import ProjectActions from './ProjectActions';
import ProjectDescription from './ProjectDescription';
import ProjectHighlights from './ProjectHighlights';
import ProjectInfoGrid from './ProjectInfoGrid';
import ProjectMetaChips from './ProjectMetaChips';
import ProjectTechnologies from './ProjectTechnologies';
import type { ProjectDetailMobileProps } from './types';

export default function ProjectDetailMobile(props: ProjectDetailMobileProps) {
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
        onNavigate,
        currentIndex,
        totalProjects,
    } = props;

    const hasImages = allImages.length > 0;
    const currentImage = hasImages ? allImages[currentImageIndex] : null;

    return (
        <div className="h-full flex flex-col rounded-2xl border border-border-subtle overflow-hidden bg-background/90 backdrop-blur-xl shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
            <div
                className="relative shrink-0 aspect-16/10 w-full overflow-hidden"
                style={{ backgroundColor: primaryColorBg }}
            >
                {hasImages ? (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentImageIndex}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0"
                        >
                            <Image
                                src={currentImage?.url as string}
                                alt={currentImage?.caption || project._title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </motion.div>
                    </AnimatePresence>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/70 text-sm px-6 text-center">
                        {translation.noImageAvailable}
                    </div>
                )}


                {hasImages && allImages.length > 1 && (
                    <div className="absolute inset-x-0 bottom-3 flex items-center justify-between px-4 z-10">
                        <button
                            type="button"
                            onClick={onPrevImage}
                            className="p-2 rounded-full bg-black/50 border border-white/15 text-white active:scale-95 transition"
                            aria-label="Previous image"
                        >
                            <HiChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-1 pointer-events-auto">
                            {allImages.map((_, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => onSelectImage(idx)}
                                    className={`rounded-full transition-all duration-200 ${idx === currentImageIndex ? 'w-5 h-1.5' : 'w-1.5 h-1.5 bg-white/50'
                                        }`}
                                    style={{
                                        backgroundColor:
                                            idx === currentImageIndex ? primaryColor : undefined,
                                    }}
                                    aria-label={`Select image ${idx + 1}`}
                                />
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={onNextImage}
                            className="p-2 rounded-full bg-black/50 border border-white/15 text-white active:scale-95 transition"
                            aria-label="Next image"
                        >
                            <HiChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {hasImages && currentImage?.caption && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-[90%] text-center text-xs text-white/90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] px-4">
                        {currentImage.caption}
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto project-scrollbar">
                <div className="p-5 space-y-6">
                    <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
                                    {translation.descriptionLabel}
                                </p>
                                <h2 className="text-xl font-semibold text-foreground leading-snug">
                                    {project._title}
                                </h2>
                            </div>
                            {totalProjects > 0 && (
                                <span className="text-[11px] font-medium text-muted-foreground px-2 py-1 rounded-full border border-border-subtle">
                                    #{String(currentIndex + 1).padStart(2, '0')}
                                </span>
                            )}
                        </div>

                        <ProjectMetaChips
                            translation={translation}
                            project={project}
                            statusStyle={statusStyle}
                            timeline={timeline}
                            primaryColor={primaryColor}
                            size="sm"
                        />
                    </div>

                    <ProjectDescription
                        translation={translation}
                        descriptionHtml={descriptionHtml}
                    />
                    <ProjectHighlights
                        translation={translation}
                        project={project}
                        primaryColor={primaryColor}
                    />
                    <ProjectTechnologies
                        translation={translation}
                        technologies={technologies}
                        unknownTechs={unknownTechs}
                    />
                    <ProjectInfoGrid
                        translation={translation}
                        project={project}
                        metrics={metrics}
                        timeline={timeline}
                        primaryColor={primaryColor}
                    />
                    <ProjectActions
                        translation={translation}
                        project={project}
                        primaryColor={primaryColor}
                    />
                </div>
            </div>
        </div>
    );
}
