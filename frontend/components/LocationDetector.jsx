"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MdCheckCircle, MdError, MdGpsFixed } from 'react-icons/md'
import Spinner from './Spinner'
import { Button } from './ui/button'
import { detectByIp, reverseGeocode } from '../lib/api'
import { cn } from '../lib/utils'
import { useLocale } from '../store/useLocale'
import { t } from '../lib/i18n'

export default function LocationDetector() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [district, setDistrict] = useState(null)
  const [method, setMethod] = useState('')
  const [error, setError] = useState('')
  const [showManual, setShowManual] = useState(false)
  const { lang } = useLocale()

  useEffect(() => {
    let canceled = false
    async function detect() {
      setLoading(true); setError(''); setDistrict(null);
      try {
        if (navigator.geolocation) {
          const pos = await new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej, { enableHighAccuracy: false, timeout: 8000 }))
          const d = await reverseGeocode(pos.coords.latitude, pos.coords.longitude)
          if (!canceled && d) { setDistrict(d); setMethod('GPS'); setLoading(false); return }
        }
      } catch (e) { }
      try {
        const d = await detectByIp()
        if (!canceled && d) { setDistrict(d); setMethod('IP'); setLoading(false); return }
      } catch (e) { }
      if (!canceled) { setShowManual(true); setLoading(false); setError(t('location.prompt', lang)) }
    }
    detect()
    return () => { canceled = true }
  }, [lang])

  if (loading) return (
    <div className="flex items-center justify-center gap-3 text-text-secondary p-4">
      <Spinner />
      <div className="font-semibold text-lg">{t('location.discovering', lang)}</div>
    </div>
  )

  if (district) return (
    <div className="bg-surface rounded-3xl shadow-card p-6 border-t-4 border-success">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <MdCheckCircle className="w-10 h-10 text-success" />
        <div className="flex-1 text-center md:text-left">
          <div className="font-semibold text-xl">{district.district_name}</div>
          <div className="text-sm text-text-secondary">{t('location.confirm', lang)} (via {method})</div>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <Button variant="outline" onClick={() => { setDistrict(null); setShowManual(true); setError(t('common.manualSelect', lang)) }}>
            {t('common.no', lang)}
          </Button>
          <Button onClick={() => router.push(`/dashboard/${district.district_code}`)}>
            {t('common.yes', lang)}
          </Button>
        </div>
      </div>
    </div>
  )

  if (showManual) return (
    <div className={cn("flex items-center justify-center gap-3 text-accent-dark p-4 bg-accent/10 rounded-2xl")}>
      <MdError className="w-6 h-6" />
      <div>
        <div className="font-semibold">{error || t('location.prompt', lang)}</div>
        <div className="text-sm">{t('common.manualSelect', lang)}</div>
      </div>
    </div>
  )

  return null
}