'use client';

import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import HexaNetworkAdvanced from '@/components/HexaNetwork';
import InitialSection from '@/components/InitialSection';
import AboutSection from '@/components/AboutSection';
import SectionNav from '@/components/SectionNav';
import ProjectsSection from '@/components/ProjectsSection';
import EducationSection from '@/components/EducationSection';
import ExperienceSection from '@/components/ExperienceSection';
import SkillsSection from '@/components/SkillsSection';
import PersonalSection from '@/components/PersonalSection';
import ContactSection from '@/components/ContactSection';
import { ExperienceContent, EducationContent, ProjectsContent, SkillsContent } from '@/lib/content/schema';

import type { LanguageCode } from '@/app/i18n';

const navItems = [
  { id: 'intro', label: 'INICIO' },
  { id: 'about', label: 'SOBRE' },
  { id: 'education', label: 'EDUCACAO' },
  { id: 'experience', label: 'EXPERIENCE' },
  { id: 'projects', label: 'PROJETOS' },
  { id: 'skills', label: 'SKILLS' },
  { id: 'personal', label: 'PESSOAL' },
  { id: 'contact', label: 'CONTATO' },
];

interface HomeClientProps {
    experienceContent: ExperienceContent;
    educationContent: EducationContent;
    projectsContent: ProjectsContent;
    skillsContent: SkillsContent;
}

export default function HomeClient({ experienceContent, educationContent, projectsContent, skillsContent }: HomeClientProps) {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode | null>(null);
  const [currentSection, setCurrentSection] = useState('intro');
  const [transitionTrigger, setTransitionTrigger] = useState(0);

  const handleLanguageSelect = useCallback(
    (code: LanguageCode) => {
      setSelectedLanguage(code);
      i18n.changeLanguage(code.toLowerCase());
      setCurrentSection('about');
      setTransitionTrigger(prev => prev + 1);
    },
    [i18n]
  );

  const handleNavigate = useCallback((sectionId: string) => {
    setCurrentSection(sectionId);
    setTransitionTrigger(prev => prev + 1);
  }, []);

  const handleNodeChange = useCallback((nodeId: string) => {
    setCurrentSection(nodeId);
  }, []);

  const nodes = [
    {
      id: 'intro',
      label: 'INICIO',
      position: { x: 0, y: 0 },
      connections: ['about'],
      content: <InitialSection onLanguageSelect={handleLanguageSelect} />,
    },
    {
      id: 'about',
      label: 'SOBRE',
      position: { x: 420, y: 0 },
      connections: ['intro', 'education'],
      content: <AboutSection language={selectedLanguage ?? 'en'} />,
    },
    {
      id: 'education',
      label: 'EDUCACAO',
      position: { x: 720, y: -200 },
      connections: ['about', 'experience'],
      content: <EducationSection content={educationContent} language={selectedLanguage ?? 'en'} />,
    },
    {
      id: 'experience',
      label: 'EXPERIENCE',
      position: { x: 1020, y: 0 },
      connections: ['education', 'projects'],
      content: <ExperienceSection content={experienceContent} language={selectedLanguage ?? 'en'} />,
    },
    {
      id: 'projects',
      label: 'PROJETOS',
      position: { x: 720, y: 220 },
      connections: ['experience', 'skills'],
      content: <ProjectsSection content={projectsContent} language={selectedLanguage ?? 'en'} />,
    },
    {
      id: 'skills',
      label: 'SKILLS',
      position: { x: 420, y: 300 },
      connections: ['projects', 'personal'],
      content: <SkillsSection content={skillsContent} language={selectedLanguage ?? 'en'} />,
    },
    {
      id: 'personal',
      label: 'PESSOAL',
      position: { x: 270, y: 150 },
      connections: ['skills', 'contact'],
      content: <PersonalSection language={selectedLanguage ?? 'en'} />,
    },
    {
      id: 'contact',
      label: 'CONTATO',
      position: { x: 120, y: 260 },
      connections: ['personal', 'intro'],
      content: <ContactSection language={selectedLanguage ?? 'en'} />,
    },
  ];

  const showNav = currentSection !== 'intro';

  return (
    <>
      <HexaNetworkAdvanced
        nodes={nodes}
        initialNode="intro"
        nodeRadius={80}
        colors={{
          line: '#9b5cff',
          node: '#3b1d72',
          nodeFill: 'rgba(7, 5, 16, 0.95)',
          glow: '#9b5cff',
          activeGlow: '#d0a6ff',
        }}
        onNodeChange={handleNodeChange}
        transitionToNode={
          transitionTrigger > 0
            ? {
                targetId: currentSection,
                triggerKey: transitionTrigger,
              }
            : undefined
        }
      />

      <SectionNav
        items={navItems}
        activeId={currentSection}
        onNavigate={handleNavigate}
        visible={showNav}
      />
    </>
  );
}
