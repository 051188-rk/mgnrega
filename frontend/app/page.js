"use client"
import LocationDetector from '../components/LocationDetector'
import DistrictSelector from '../components/DistrictSelector'
import LanguageSelector from '../components/LanguageSelector' // Changed component
import { useLocale } from '../store/useLocale'
import { t } from '../lib/i18n'
import { MdOutlineDashboardCustomize } from 'react-icons/md'

export default function Home() {
  const { lang } = useLocale()
  return (
    <main className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 min-h-screen flex flex-col justify-center">
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-end">
        <LanguageSelector />
      </header>
      
      <section className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-4 bg-primary/10 rounded-full inline-block">
             <MdOutlineDashboardCustomize className="w-12 h-12 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-primary-dark mb-3">
          {t('portal.title', lang)}
        </h1>
        
        <div className="max-w-3xl mx-auto space-y-6">
          <LocationDetector />
        </div>
        
        <div className="text-text-secondary font-medium text-lg mb-4">{t('portal.subtitle', lang)}</div>
        
        <DistrictSelector />
      </section>
    </main>
  )
}