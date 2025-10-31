"use client"
import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
// Import new react-icons
import { FaUsers, FaCalendarCheck, FaRupeeSign, FaBuilding } from 'react-icons/fa'
import { MdBarChart, MdShowChart, MdPeopleAlt, MdWoman } from 'react-icons/md'
// Import new components
import MetricCard from '../../../components/MetricCard'
import DetailedChart from '../../../components/DetailedChart'
import PerformanceGauge from '../../../components/PerformanceGauge'
import ComparisonTable from '../../../components/ComparisonTable'
import LanguageSelector from '../../../components/LanguageSelector' // Added selector here
import Spinner from '../../../components/Spinner'
import TopDistrictsChart from '../../../components/TopDistrictsChart'
// Import new lib functions
import { getCurrent, getHistory, getCompare } from '../../../lib/api'
import { formatNumber } from '../../../lib/utils'
import { useLocale } from '../../../store/useLocale'
import { t, relativeTimeLocalized } from '../../../lib/i18n'
import { Button } from '../../../components/ui/button'

export default function DashboardPage() {
  const params = useParams()
  const router = useRouter()
  const code = params?.districtCode
  const [current, setCurrent] = useState(null)
  const [history, setHistory] = useState([])
  const [compare, setCompare] = useState(null)
  const [loading, setLoading] = useState(true)
  const { lang } = useLocale()

  useEffect(() => {
    let c = false
    async function load() {
      setLoading(true)
      const [a, b, cx] = await Promise.all([
        getCurrent(code).catch(() => null),
        getHistory(code).catch(() => ({ history: [] })),
        getCompare(code).catch(() => null)
      ])
      if (!c) {
        setCurrent(a)
        setHistory(b?.history || [])
        setCompare(cx)
        setLoading(false)
      }
    }
    if (code) load()
    return () => { c = true }
  }, [code])

  // New combined chart data
  const chartData = useMemo(() => history.map(h => ({
    month: h.month,
    year: h.fin_year ? h.fin_year.toString() : '',
    households: Number(h.total_households_worked || 0),
    expenditure: Number(h.total_expenditure || 0)
  })).filter(d => d.year), [history]) // Filter out any entries without a year

  if (loading || !current) return (
    <main className="max-w-6xl mx-auto p-4 h-screen flex flex-col items-center justify-center gap-4">
      <Spinner />
      <div className="font-semibold text-lg text-text-secondary">{t('common.loading', lang)}</div>
    </main>
  )

  const latest = current.latest
  const lastUpdated = latest?.last_updated || latest?.updatedAt
  const completionRate = latest && (Number(latest.completed_works || 0) / (Number(latest.completed_works || 0) + Number(latest.ongoing_works || 0) || 1)) * 100
  const stateCompare = compare?.state_compare

  const colorFor = (key) => {
    if (!stateCompare || stateCompare[key] == null) return 'yellow' // Use 'yellow' for accent
    return stateCompare[key] >= 0 ? 'green' : 'red'
  }

  const DetailItem = ({ icon, label, value }) => (
    <div className="p-4 bg-background rounded-xl flex items-center gap-3">
      <div className="p-3 bg-secondary/10 text-secondary rounded-full">
        {icon}
      </div>
      <div>
        <div className="text-sm text-text-secondary">{label}</div>
        <div className="text-xl font-semibold">{formatNumber(value)}</div>
      </div>
    </div>
  )

  return (
    <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-primary-dark">{latest.district_name}</h1>
          <div className="text-text-secondary text-sm font-medium mt-1">
            {t('common.lastSync', lang)}: {relativeTimeLocalized(lastUpdated, lang)}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSelector />
          <Button variant="outline" onClick={() => router.push('/')}>
            {t('common.changeDistrict', lang)}
          </Button>
        </div>
      </header>

      {/* --- METRICS --- */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard 
          icon={<FaUsers className="w-7 h-7" />} 
          value={latest.total_households_worked} 
          label={t('stats.familiesImpacted', lang)} 
          trend={colorFor('total_households_worked')}
          trendColor="pink"
        />
        <MetricCard 
          icon={<FaCalendarCheck className="w-7 h-7" />} 
          value={latest.average_days_employment} 
          label={t('stats.avgWorkDays', lang)} 
          trend={colorFor('average_days_employment')}
          trendColor="violet"
        />
        <MetricCard 
          icon={<FaRupeeSign className="w-7 h-7" />} 
          value={latest.total_expenditure} 
          label={t('stats.fundsDisbursed', lang)} 
          trend={colorFor('total_expenditure')}
          trendColor="green"
        />
        <MetricCard 
          icon={<FaBuilding className="w-7 h-7" />} 
          value={latest.completed_works} 
          label={t('stats.projectsFinished', lang)} 
          trend={colorFor('completed_works')}
          trendColor="amber"
        />
      </section>

      {/* --- CHARTS --- */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          {/* Use the new detailed chart */}
          <DetailedChart data={chartData} />
        </div>
        <div className="flex flex-col gap-5">
          <PerformanceGauge value={isFinite(completionRate) ? completionRate : 0} label={t('charts.workCompletion', lang)} />
        </div>
      </section>

      {/* --- COMPARISON & TOP DISTRICTS SIDE BY SIDE --- */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div>
          <h2 className="font-semibold text-text-primary mb-4 text-lg">Performance Comparison</h2>
          <ComparisonTable 
            top={compare?.top_districts || []} 
            peers={compare?.peer_compare || []} 
            highlightCode={code} 
          />
        </div>
        <div>
          <h2 className="font-semibold text-text-primary mb-4 text-lg">Top Districts</h2>
          <TopDistrictsChart 
            districtCode={code} 
            stateCode={latest?.state_code} 
          />
        </div>
      </section>

      {/* --- DETAILS --- */}
      <section className="bg-surface rounded-2xl shadow-card p-4 md:p-6">
         <h2 className="font-semibold text-text-primary mb-4 text-base">{t('details.title', lang)}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DetailItem icon={<MdPeopleAlt className="w-6 h-6" />} label={t('details.sc', lang)} value={latest.sc_persondays} />
            <DetailItem icon={<MdPeopleAlt className="w-6 h-6" />} label={t('details.st', lang)} value={latest.st_persondays} />
            <DetailItem icon={<MdWoman className="w-6 h-6" />} label={t('details.women', lang)} value={latest.women_persondays} />
            <DetailItem icon={<MdShowChart className="w-6 h-6" />} label={t('details.hh100', lang)} value={latest.households_completed_100_days} />
          </div>
      </section>
    </main>
  )
}