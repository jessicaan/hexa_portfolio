'use client';

import { useState, useCallback, useMemo } from 'react';
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
import { LanguageCode } from '@/lib/content/schema';



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

interface HomeClientProps {}

export default function HomeClient({}: HomeClientProps) {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode | null>(null);
  const [currentSection, setCurrentSection] = useState('intro');
  const [transitionTrigger, setTransitionTrigger] = useState(0);
  const [networkCommand, setNetworkCommand] = useState<{ name: 'zoomOut'; key: number } | null>(null);

  const handleLanguageSelect = useCallback(
    (code: string) => {
      const lowerCode = code.toLowerCase() as LanguageCode;
      setSelectedLanguage(lowerCode);
      i18n.changeLanguage(lowerCode);
      setCurrentSection('about');
      setTransitionTrigger(prev => prev + 1);
    },
    [i18n]
  );

  const handleExplore = useCallback(
    (code: string) => {
      const lowerCode = code.toLowerCase() as LanguageCode;
      setSelectedLanguage(lowerCode);
      i18n.changeLanguage(lowerCode);
      setNetworkCommand({ name: 'zoomOut', key: Date.now() });
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

    

      

    

        const nodes = useMemo(() => [

    

          {

    

            id: 'intro',

    

            label: 'INICIO',

    

            position: { x: 0, y: 0 },

    

            connections: ['about'],

    

            content: <InitialSection onLanguageSelect={handleLanguageSelect} onExplore={handleExplore} />,

    

          },

    

          {

    

            id: 'about',

    

            label: 'SOBRE',

    

            position: { x: 420, y: 0 },

    

            connections: ['intro', 'education'],

    

            content: <AboutSection />,

    

          },

    

          {

    

            id: 'education',

    

            label: 'EDUCACAO',

    

            position: { x: 720, y: -200 },

    

            connections: ['about', 'experience'],

    

            content: <EducationSection />,

    

          },

    

          {

    

            id: 'experience',

    

            label: 'EXPERIENCE',

    

            position: { x: 1020, y: 0 },

    

            connections: ['education', 'projects'],

    

            content: <ExperienceSection />,

    

          },

    

          {

    

            id: 'projects',

    

            label: 'PROJETOS',

    

            position: { x: 720, y: 220 },

    

            connections: ['experience', 'skills'],

    

            content: <ProjectsSection />,

    

          },

    

          {

    

            id: 'skills',

    

            label: 'SKILLS',

    

            position: { x: 420, y: 300 },

    

            connections: ['projects', 'personal'],

    

            content: <SkillsSection />,

    

          },

    

          {

    

            id: 'personal',

    

            label: 'PESSOAL',

    

            position: { x: 270, y: 150 },

    

            connections: ['skills', 'contact'],

    

            content: <PersonalSection />,

    

          },

    

          {

    

            id: 'contact',

    

            label: 'CONTATO',

    

            position: { x: 120, y: 260 },

    

            connections: ['personal', 'intro'],

    

            content: <ContactSection />,

    

          },

    

        ], [handleLanguageSelect, handleExplore, selectedLanguage]);

    

      

    

        const showNav = currentSection !== 'intro';

    

      

    

        return (

    

          <>

    

            <HexaNetworkAdvanced

    

              nodes={nodes}

    

              initialNode="intro"

    

              nodeRadius={80}

    

              onNodeChange={handleNodeChange}

    

              command={networkCommand}

    

              colors={{

    

                line: '#9b5cff',

    

                node: '#3b1d72',

    

                nodeFill: 'rgba(7, 5, 16, 0.95)',

    

                glow: '#9b5cff',

    

                activeGlow: '#d0a6ff',

    

              }}

    

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
