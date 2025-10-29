"use client"
import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Users, CalendarCheck2, IndianRupee, Building2 } from 'lucide-react'
import MetricCard from '../../../components/MetricCard'
import { LineTrend, BarCompare } from '../../../components/TrendChart'
import PerformanceGauge from '../../../components/PerformanceGauge'
import ComparisonTable from '../../../components/ComparisonTable'
import { getCurrent, getHistory, getCompare } from '../../../lib/api'
import { formatNumber } from '../../../lib/utils'
import { useLocale } from '../../../store/useLocale'
import { t, relativeTimeLocalized } from '../../../lib/i18n'

export default function DashboardPage(){
  const params = useParams()
  const router = useRouter()
  const code = params?.districtCode
  const [current, setCurrent] = useState(null)
  const [history, setHistory] = useState([])
  const [compare, setCompare] = useState(null)
  const { lang } = useLocale()

  useEffect(()=>{
    let c=false
    async function load(){
      const [a,b,cx] = await Promise.all([
        getCurrent(code).catch(()=>null),
        getHistory(code).catch(()=>({history:[]})),
        getCompare(code).catch(()=>null)
      ])
      if(!c){ setCurrent(a); setHistory(b?.history||[]); setCompare(cx) }
    }
    if(code) load()
    return ()=>{c=true}
  },[code])

  const monthLabel = (h)=> h.map(it=> it.month || it.label || '')
  const lineData = useMemo(()=> history.map(h=> ({ label: `${h.month}-${h.fin_year}`, value: Number(h.total_households_worked||0) })), [history])
  const barData = useMemo(()=> history.map(h=> ({ label: `${h.month}-${h.fin_year}`, value: Number(h.total_expenditure||0) })), [history])

  if(!current) return <main className="max-w-6xl mx-auto p-4">{t('loading', lang)}</main>

  const latest = current.latest
  const lastUpdated = latest?.last_updated || latest?.updatedAt
  const completionRate = latest && (Number(latest.completed_works||0) / (Number(latest.completed_works||0)+Number(latest.ongoing_works||0) || 1))*100
  const stateCompare = compare?.state_compare

  const colorFor = (key)=> {
    if (!stateCompare || stateCompare[key]==null) return 'yellow'
    return stateCompare[key] >= 0 ? 'green' : 'red'
  }

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <div className="text-3xl font-extrabold">{latest.district_name}</div>
          <div className="text-gray-600 text-sm">{t('lastUpdated', lang)}: {relativeTimeLocalized(lastUpdated, lang)}</div>
        </div>
        <button onClick={()=> router.push('/')} className="px-4 py-2 rounded-lg bg-gray-100">{t('changeDistrict', lang)}</button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={<Users className="w-8 h-8 text-green-600"/>} value={latest.total_households_worked} label={t('metrics.totalFamilies', lang)} trend={current.comparisons.total_households_worked} color={colorFor('total_households_worked')} />
        <MetricCard icon={<CalendarCheck2 className="w-8 h-8 text-blue-600"/>} value={latest.average_days_employment} label={t('metrics.avgDays', lang)} trend={current.comparisons.average_days_employment} color={colorFor('average_days_employment')} />
        <MetricCard icon={<IndianRupee className="w-8 h-8 text-emerald-600"/>} value={latest.total_expenditure} label={t('metrics.totalSpent', lang)} trend={current.comparisons.total_expenditure} color={colorFor('total_expenditure')} />
        <MetricCard icon={<Building2 className="w-8 h-8 text-orange-600"/>} value={latest.completed_works} label={t('metrics.completedWorks', lang)} trend={current.comparisons.completed_works} color={colorFor('completed_works')} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LineTrend data={lineData} lineKey="value" />
        <BarCompare data={barData} barKey="value" />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PerformanceGauge value={isFinite(completionRate)? completionRate : 0} label={t('gauge.workCompletionRate', lang)} />
        <ComparisonTable top={compare?.top_districts||[]} peers={compare?.peer_compare||[]} highlightCode={code} />
      </section>

      <section>
        <details className="bg-white rounded-xl shadow p-4">
          <summary className="font-bold cursor-pointer">{t('details.viewMore', lang)}</summary>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
            <div className="p-3 bg-gray-50 rounded">{t('details.scPersondays', lang)}: {formatNumber(latest.sc_persondays)}</div>
            <div className="p-3 bg-gray-50 rounded">{t('details.stPersondays', lang)}: {formatNumber(latest.st_persondays)}</div>
            <div className="p-3 bg-gray-50 rounded">{t('details.womenPersondays', lang)}: {formatNumber(latest.women_persondays)}</div>
            <div className="p-3 bg-gray-50 rounded">{t('details.hh100Days', lang)}: {formatNumber(latest.households_completed_100_days)}</div>
          </div>
        </details>
      </section>
    </main>
  )
}
