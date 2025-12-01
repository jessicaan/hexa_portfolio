'use client'

import { useMemo, useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

import { loadSkillsContent } from '@/lib/content/client'
import type { LanguageCode, SkillsContent } from '@/lib/content/schema'

import ReactiveGridBackground from '@/components/background/ReactiveGridBackground'
import { useTheme } from '@/components/theme/ThemeProvider'
import SkillsSectionHeader from './SkillsSectionHeader'
import SkillsCategoryList from './SkillsCategoryList'
import SkillsLegend from './SkillsLegend'
import SkillsCategoryPanel from './SkillsCategoryPanel'

const proficiencyLevels = [
  { name: 'Iniciante', width: '20%' },
  { name: 'Intermediario', width: '50%' },
  { name: 'Avancado', width: '100%' },
]

export default function SkillsSection() {
  const { i18n } = useTranslation()
  const language = i18n.language as LanguageCode

  const [skillsContent, setSkillsContent] = useState<SkillsContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0)

  const { primaryRgb, theme } = useTheme()
  const primaryColor = `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`
  const isDark = theme === 'dark'

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await loadSkillsContent()
        setSkillsContent(data)
      } catch (error) {
        console.error('Failed to load skills content:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSkills()
  }, [])

  const translation = useMemo(() => {
    if (!skillsContent) return null
    return skillsContent.translations[language] || skillsContent.translations['en']
  }, [skillsContent, language])

  const categories = useMemo(() => {
    if (!skillsContent?.categories) return []

    return skillsContent.categories.map((category, idx) => {
      const translatedCategory = translation?.categories?.[idx]
      const skills = (category.skills || []).map((skill, skillIdx) => ({
        ...skill,
        name: translatedCategory?.skills?.[skillIdx]?.name || skill.name,
      }))

      return {
        ...category,
        name: translatedCategory?.name || category.name,
        skills,
      }
    })
  }, [skillsContent, translation])

  const activeCategory = categories[activeCategoryIndex] || categories[0]

  if (loading) {
    return (
      <main className="relative h-screen w-screen overflow-hidden">
        <ReactiveGridBackground />
        <div className="relative z-10 flex h-full w-full items-center justify-center">
          <div
            className="rounded-2xl border border-border-subtle p-8 backdrop-blur-md"
            style={{
              background: isDark ? 'rgba(20, 20, 25, 0.7)' : 'rgba(255, 255, 255, 0.5)',
            }}
          >
            <p className="text-muted-foreground">Loading skills...</p>
          </div>
        </div>
      </main>
    )
  }

  if (!categories.length) {
    return (
      <main className="relative h-screen w-screen overflow-hidden">
        <ReactiveGridBackground />
        <div className="relative z-10 flex h-full w-full items-center justify-center">
          <div
            className="rounded-2xl border border-border-subtle p-8 text-center backdrop-blur-md"
            style={{
              background: isDark ? 'rgba(20, 20, 25, 0.7)' : 'rgba(255, 255, 255, 0.5)',
            }}
          >
            <p className="text-muted-foreground">No skills registered yet.</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <>
      <style jsx global>{`
        .skills-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .skills-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .skills-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.3);
          border-radius: 3px;
        }
        .skills-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.5);
        }
      `}</style>

      <main className="relative h-screen w-screen overflow-hidden">
        <ReactiveGridBackground />

        <div className="skills-scrollbar relative z-10 h-full w-full overflow-y-auto overflow-x-hidden">
          <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 md:py-12 lg:px-12 lg:py-16">
            <SkillsSectionHeader
              eyebrow={translation?.eyebrow || 'Skills'}
              title={translation?.title || 'Stack & Skills'}
              description={translation?.description || ''}
              primaryColor={primaryColor}
              isDark={isDark}
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="lg:col-span-4"
              >
                <SkillsCategoryList
                  categories={categories}
                  activeIndex={activeCategoryIndex}
                  onSelect={setActiveCategoryIndex}
                  primaryColor={primaryColor}
                  primaryRgb={primaryRgb}
                  isDark={isDark}
                  footer={
                    <SkillsLegend
                      levels={proficiencyLevels}
                      primaryColor={primaryColor}
                      isDark={isDark}
                      title={translation?.legendTitle || 'Proficiency'}
                    />
                  }
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-8"
              >
                <AnimatePresence mode="wait">
                  {activeCategory && (
                    <SkillsCategoryPanel
                      category={activeCategory}
                      primaryColor={primaryColor}
                      isDark={isDark}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
