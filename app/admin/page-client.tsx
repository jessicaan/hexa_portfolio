'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft } from 'react-icons/fa';
import HexaNetworkAdvanced from '@/components/hexagrid/HexaNetwork';
import InitialSection from '@/components/sections/initial/InitialSection';
import AboutSection from '@/components/sections/about/AboutSection';
import SectionNav from '@/components/layout/SectionNav';
import ProjectsSection from '@/components/sections/projects/ProjectsSection';
import EducationSection from '@/components/sections/education/EducationSection';
import ExperienceSection from '@/components/sections/experience/ExperienceSection';
import SkillsSection from '@/components/sections/skills/SkillsSection';
import PersonalSection from '@/components/sections/personal/PersonalSection';
import ContactSection from '@/components/sections/ContactSection';
import { LanguageCode } from '@/lib/content/schemas/common';
import { useTheme } from '@/components/theme/ThemeProvider';
import ExploreCategories from '@/components/layout/ExploreCategories';

interface HomeClientProps { }

export default function HomeClient({ }: HomeClientProps) {
  const { i18n, t } = useTranslation();
  const { animationsEnabled } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode | null>(
    null,
  );
  const [currentSection, setCurrentSection] = useState('intro');
  const [transitionTrigger, setTransitionTrigger] = useState(0);
  const [networkCommand, setNetworkCommand] = useState<{
    name: 'zoomOut';
    key: number;
  } | null>(null);
  const [showCategoryNavigation, setShowCategoryNavigation] = useState(false);
  const [showOverview, setShowOverview] = useState(false);

  const navItems = useMemo(
    () => [
      { id: 'intro', label: t('sections.intro') },
      { id: 'about', label: t('sections.about') },
      { id: 'education', label: t('sections.education') },
      { id: 'experience', label: t('sections.experience') },
      { id: 'projects', label: t('sections.projects') },
      { id: 'skills', label: t('sections.skills') },
      { id: 'personal', label: t('sections.personal') },
      { id: 'contact', label: t('sections.contact') },
    ],
    [t],
  );

  const handleLanguageSelect = useCallback(
    (code: string) => {
      const lowerCode = code.toLowerCase() as LanguageCode;
      setSelectedLanguage(lowerCode);
      i18n.changeLanguage(lowerCode);
      setCurrentSection('about');
      setTransitionTrigger((prev) => prev + 1);
    },
    [i18n],
  );

  const handleExplore = useCallback(
    (code: string) => {
      const lowerCode = code.toLowerCase() as LanguageCode;
      setSelectedLanguage(lowerCode);
      i18n.changeLanguage(lowerCode);
      if (animationsEnabled) {
        setNetworkCommand({ name: 'zoomOut', key: Date.now() });
        setShowOverview(true);
      } else {
        setShowCategoryNavigation(true);
      }
    },
    [i18n, animationsEnabled],
  );

  const handleNavigate = useCallback(
    (sectionId: string) => {
      setCurrentSection(sectionId);
      setTransitionTrigger((prev) => prev + 1);
      setShowOverview(false);
      if (showCategoryNavigation) {
        setShowCategoryNavigation(false);
      }
    },
    [showCategoryNavigation],
  );

  const handleCategorySelect = useCallback((categoryId: string) => {
    setCurrentSection(categoryId);
    setTransitionTrigger((prev) => prev + 1);
    setShowCategoryNavigation(false);
  }, []);

  const handleCloseCategories = useCallback(() => {
    setShowCategoryNavigation(false);
  }, []);

  const handleNodeChange = useCallback((nodeId: string) => {
    setCurrentSection(nodeId);
    setShowOverview(false);
  }, []);

  const handleBackToOverview = useCallback(() => {
    if (animationsEnabled) {
      setNetworkCommand({ name: 'zoomOut', key: Date.now() });
      setShowOverview(true);
    } else {
      setShowCategoryNavigation(true);
    }
  }, [animationsEnabled]);

  const nodes = useMemo(
    () => [
      {
        id: 'intro',
        label: t('sections.intro'),
        position: { x: 0, y: 0 },
        connections: ['about'],
        content: (
          <InitialSection
            onLanguageSelect={handleLanguageSelect}
            onExplore={handleExplore}
          />
        ),
      },

      {
        id: 'about',
        label: t('sections.about'),
        position: { x: 420, y: 0 },
        connections: ['intro', 'education'],
        content: <AboutSection />,
      },

      {
        id: 'education',
        label: t('sections.education'),
        position: { x: 720, y: -200 },
        connections: ['about', 'experience'],
        content: <EducationSection />,
      },

      {
        id: 'experience',
        label: t('sections.experience'),
        position: { x: 1020, y: 0 },
        connections: ['education', 'projects'],
        content: <ExperienceSection />,
      },

      {
        id: 'projects',
        label: t('sections.projects'),
        position: { x: 720, y: 220 },
        connections: ['experience', 'skills'],
        content: <ProjectsSection />,
      },

      {
        id: 'skills',
        label: t('sections.skills'),
        position: { x: 420, y: 300 },
        connections: ['projects', 'personal'],
        content: <SkillsSection />,
      },

      {
        id: 'personal',
        label: t('sections.personal'),
        position: { x: 270, y: 150 },
        connections: ['skills', 'contact'],
        content: <PersonalSection />,
      },

      {
        id: 'contact',
        label: t('sections.contact'),
        position: { x: 120, y: 260 },
        connections: ['personal', 'intro'],
        content: <ContactSection />,
      },
    ],
    [handleLanguageSelect, handleExplore, selectedLanguage, t],
  );

  const showNav = currentSection !== 'intro';
  const showBackButton = currentSection !== 'intro' && !showOverview && !showCategoryNavigation;

  const currentSectionContent = useMemo(() => {
    const node = nodes.find((node) => node.id === currentSection);
    return node ? node.content : null;
  }, [currentSection, nodes]);

  return (
    <>
      {showBackButton && (
        <button
          onClick={handleBackToOverview}
          className="fixed left-6 top-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-sm transition-all hover:bg-background hover:scale-105 border border-border/50"
          aria-label={t('navigation.back')}
        >
          <FaArrowLeft className="h-5 w-5" />
        </button>
      )}

      {animationsEnabled ? (
        <HexaNetworkAdvanced
          nodes={nodes}
          initialNode="intro"
          nodeRadius={80}
          onNodeChange={handleNodeChange}
          command={networkCommand}
          transitionToNode={
            transitionTrigger > 0
              ? {
                targetId: currentSection,
                triggerKey: transitionTrigger,
              }
              : undefined
          }
        />
      ) : showCategoryNavigation ? (
        <ExploreCategories
          onCategorySelect={handleCategorySelect}
          onClose={handleCloseCategories}
        />
      ) : (
        <div className="flex-1 overflow-auto">{currentSectionContent}</div>
      )}

      <SectionNav
        items={navItems}
        activeId={currentSection}
        onNavigate={handleNavigate}
        visible={showNav}
      />
    </>
  );
}