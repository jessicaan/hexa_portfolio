'use client'

import { useMemo, useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import * as SiIcons from 'react-icons/si'

import { loadSkillsContent } from '@/lib/content/client'
import type { LanguageCode, SkillsContent } from '@/lib/content/schema'
import { getTechById } from '@/lib/content/technologies'

import ReactiveGridBackground from '../background/ReactiveGridBackground'
import { useTheme } from '../theme/ThemeProvider'

const proficiencyLevels = [
  { name: 'Iniciante', width: '20%' },
  { name: 'Intermediário', width: '50%' },
  { name: 'Avançado', width: '100%' },
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
    return (
      skillsContent.translations[language] || skillsContent.translations['en']
    )
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
              background: isDark
                ? 'rgba(20, 20, 25, 0.7)'
                : 'rgba(255, 255, 255, 0.5)',
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
              background: isDark
                ? 'rgba(20, 20, 25, 0.7)'
                : 'rgba(255, 255, 255, 0.5)',
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
          background-color: rgba(
            ${primaryRgb.r},
            ${primaryRgb.g},
            ${primaryRgb.b},
            0.3
          );
          border-radius: 3px;
        }
        .skills-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(
            ${primaryRgb.r},
            ${primaryRgb.g},
            ${primaryRgb.b},
            0.5
          );
        }
      `}</style>

      <main className="relative h-screen w-screen overflow-hidden">
        <ReactiveGridBackground />

        <div className="skills-scrollbar relative z-10 h-full w-full overflow-y-auto overflow-x-hidden">
          <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 md:py-12 lg:px-12 lg:py-16">
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-10 lg:mb-14"
            >
              <div className="mb-4 flex items-center gap-3">
                <span
                  className="h-px w-10"
                  style={{
                    background: `linear-gradient(to right, ${primaryColor}, transparent)`,
                  }}
                />
                <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  {translation?.eyebrow || 'Skills'}
                </p>
              </div>
              <h1
                className="mb-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl"
                style={{ color: isDark ? '#fff' : 'var(--foreground)' }}
              >
                {translation?.title || 'Stack & Skills'}
              </h1>
              <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {translation?.description || ''}
              </p>
            </motion.header>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="lg:col-span-4"
              >
                <div
                  className="rounded-2xl border border-border-subtle p-5 backdrop-blur-md"
                  style={{
                    background: isDark
                      ? 'rgba(20, 20, 25, 0.7)'
                      : 'rgba(255, 255, 255, 0.5)',
                    boxShadow: `0 8px 32px rgba(0,0,0,${isDark ? 0.3 : 0.1
                      })`,
                  }}
                >
                  <div className="mb-4 flex items-center gap-2">
                    <span
                      className="h-4 w-1 rounded-full"
                      style={{ backgroundColor: primaryColor }}
                    />
                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      Categories
                    </p>
                  </div>

                  <div className="space-y-2">
                    {categories.map((category, index) => {
                      const isActive = index === activeCategoryIndex

                      return (
                        <button
                          key={category.name}
                          onClick={() => setActiveCategoryIndex(index)}
                          onMouseEnter={() => setActiveCategoryIndex(index)}
                          className="group w-full text-left"
                        >
                          <div
                            className="relative rounded-xl border p-4 transition-all duration-300"
                            style={{
                              background: isActive
                                ? `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.1)`
                                : isDark
                                  ? 'rgba(30, 30, 35, 0.5)'
                                  : 'rgba(255, 255, 255, 0.3)',
                              borderColor: isActive
                                ? `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.4)`
                                : 'var(--border-subtle)',
                            }}
                          >
                            <div
                              className="absolute left-0 top-0 h-full w-1 rounded-l-xl transition-all duration-300"
                              style={{
                                background: isActive
                                  ? `linear-gradient(to bottom, ${primaryColor}, hsl(var(--secondary)))`
                                  : 'transparent',
                              }}
                            />

                            <div className="pl-3">
                              <p
                                className="mb-1 text-sm font-medium transition-colors"
                                style={{
                                  color: isActive
                                    ? primaryColor
                                    : 'var(--foreground)',
                                }}
                              >
                                {category.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {category.skills.length} skills
                              </p>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  <div className="mt-6 border-t border-border-subtle pt-4">
                    <p className="mb-3 text-[10px] uppercase tracking-widest text-muted-foreground">
                      {translation?.legendTitle || 'Proficiency'}
                    </p>
                    <div className="space-y-2">
                      {proficiencyLevels.map((level) => (
                        <div key={level.name} className="flex items-center gap-3">
                          <div
                            className="h-1.5 w-16 overflow-hidden rounded-full"
                            style={{
                              background: isDark
                                ? 'rgba(255,255,255,0.1)'
                                : 'rgba(0,0,0,0.08)',
                            }}
                          >
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: level.width,
                                background: `linear-gradient(to right, ${primaryColor}, hsl(var(--secondary)))`,
                              }}
                            />
                          </div>
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            {level.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-8"
              >
                <AnimatePresence mode="wait">
                  {activeCategory && (
                    <motion.div
                      key={activeCategory.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden rounded-2xl border border-border-subtle backdrop-blur-md"
                      style={{
                        background: isDark
                          ? 'rgba(20, 20, 25, 0.7)'
                          : 'rgba(255, 255, 255, 0.5)',
                        boxShadow: `0 8px 32px rgba(0,0,0,${isDark ? 0.3 : 0.1
                          })`,
                      }}
                    >
                      <div
                        className="h-2 w-full"
                        style={{
                          background: `linear-gradient(to right, ${primaryColor}, hsl(var(--secondary)))`,
                        }}
                      />

                      <div className="p-6 lg:p-8">
                        <div className="mb-6 flex items-center gap-3">
                          <span
                            className="h-px w-8"
                            style={{
                              background: `linear-gradient(to right, ${primaryColor}, transparent)`,
                            }}
                          />
                          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                            {activeCategory.name}
                          </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          {activeCategory.skills.map((skill, idx) => {
                            const tech = getTechById(skill.name)
                            const Icon = tech?.icon
                              ? (SiIcons as any)[tech.icon]
                              : null

                            return (
                              <motion.div
                                key={skill.name}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  duration: 0.3,
                                  delay: idx * 0.05,
                                }}
                                className="group rounded-xl border border-border-subtle p-4 transition-all duration-300 hover:border-border"
                                style={{
                                  background: isDark
                                    ? 'rgba(30, 30, 35, 0.5)'
                                    : 'rgba(255, 255, 255, 0.3)',
                                }}
                              >
                                <div className="mb-3 flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    {Icon && (
                                      <Icon
                                        className="h-5 w-5 transition-colors"
                                        style={{ color: tech?.color }}
                                      />
                                    )}
                                    <span className="text-sm font-medium text-foreground">
                                      {tech?.name || skill.name}
                                    </span>
                                  </div>
                                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                    {skill.level}%
                                  </span>
                                </div>

                                <div
                                  className="h-1.5 w-full overflow-hidden rounded-full"
                                  style={{
                                    background: isDark
                                      ? 'rgba(255,255,255,0.1)'
                                      : 'rgba(0,0,0,0.08)',
                                  }}
                                >
                                  <motion.div
                                    className="h-full rounded-full"
                                    style={{
                                      background: `linear-gradient(to right, ${tech?.color || primaryColor
                                        }, hsl(var(--secondary)))`,
                                    }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${skill.level}%` }}
                                    transition={{
                                      duration: 0.6,
                                      delay: idx * 0.05 + 0.1,
                                    }}
                                  />
                                </div>
                              </motion.div>
                            )
                          })}
                        </div>
                      </div>
                    </motion.div>
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
