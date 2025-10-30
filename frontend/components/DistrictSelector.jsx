"use client"
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getStates, searchDistricts } from '../lib/api'
import { t } from '../lib/i18n'
import { useLocale } from '../store/useLocale'
import { Button } from './ui/button'
import { MdOutlineArrowDropDown } from 'react-icons/md'

export default function DistrictSelector() {
  const router = useRouter()
  const { lang } = useLocale()
  const [states, setStates] = useState([])
  const [state, setState] = useState('')
  const [districts, setDistricts] = useState([])
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let c = false
    async function loadStates() {
      const data = await getStates().catch(() => [])
      if (!c) { setStates(data); if (data.includes('ODISHA')) setState('ODISHA'); else setState(data[0] || '') }
    }
    loadStates()
    return () => { c = true }
  }, [])

  useEffect(() => {
    let c = false
    async function loadDistricts() {
      if (!state) { setDistricts([]); return }
      setLoading(true)
      const data = await searchDistricts(state).catch(() => [])
      if (!c) { setDistricts(data); setLoading(false) }
    }
    loadDistricts()
    return () => { c = true }
  }, [state])

  const selected = useMemo(() => districts.find(d => d.district_code === code) || null, [districts, code])

  const selectClassName = "w-full border border-gray-300 rounded-full p-3 pl-5 pr-10 appearance-none bg-surface text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"

  return (
    <div className="bg-surface rounded-3xl shadow-card p-6 max-w-4xl mx-auto">
      <div className="mb-4 font-semibold text-lg text-center">{t('location.prompt', lang)}</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <select value={state} onChange={e => { setState(e.target.value); setCode('') }} className={selectClassName}>
            <option value="" disabled>{t('common.state', lang)}</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <MdOutlineArrowDropDown className="w-6 h-6 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
         <div className="relative">
          <select value={code} onChange={e => setCode(e.target.value)} className={selectClassName}>
            <option value="" disabled>{loading ? t('common.loading', lang) : t('common.selectDistrict', lang)}</option>
            {districts.map(d => <option key={d.district_code} value={d.district_code}>{d.district_name}</option>)}
          </select>
          <MdOutlineArrowDropDown className="w-6 h-6 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        <Button disabled={!code} onClick={() => router.push(`/dashboard/${code}`)} size="lg" className="md:col-start-3">
          {t('common.viewReport', lang)}
        </Button>
      </div>
      {selected && <div className="text-xs text-text-secondary mt-3 text-center">{selected.state_name}</div>}
    </div>
  )
}