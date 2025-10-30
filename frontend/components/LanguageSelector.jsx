"use client"
import { useLocale } from '../store/useLocale'
import { languages } from '../lib/i18n'
import { MdLanguage } from 'react-icons/md'

export default function LanguageSelector() {
  const { lang, setLang } = useLocale()

  const onSelectChange = (e) => {
    setLang(e.target.value)
  }

  return (
    <div className="flex items-center gap-2 bg-surface shadow-sm rounded-full border border-gray-200 p-2">
      <MdLanguage className="w-5 h-5 text-text-secondary ml-2" />
      <select
        value={lang}
        onChange={onSelectChange}
        className="bg-transparent text-sm font-semibold text-text-primary focus:outline-none rounded-full pr-4"
        aria-label="Select language"
      >
        {languages.map(l => (
          <option key={l.code} value={l.code}>
            {l.name}
          </option>
        ))}
      </select>
    </div>
  )
}