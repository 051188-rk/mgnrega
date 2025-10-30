"use client"
import { useLocale } from '../store/useLocale'
import { t } from '../lib/i18n'
import { cn } from '../lib/utils'
import { FaArrowUp, FaArrowDown } from 'react-icons/fa'

export default function ComparisonTable({ top = [], peers = [], highlightCode }) {
  const { lang } = useLocale()

  const PeerRow = ({ p }) => {
    const diff = p.diffs?.total_households_worked
    const isUp = diff > 0
    const color = isUp ? 'text-success' : 'text-danger'
    const Icon = isUp ? FaArrowUp : FaArrowDown

    return (
      <tr className="border-t border-gray-100">
        <td className="p-3 text-text-secondary">—</td>
        <td className="p-3 font-medium">{p.district_name}</td>
        <td className="p-3 text-text-secondary">—</td>
        <td className="p-3">
          {diff != null ? (
            <span className={cn('flex items-center gap-1 text-sm font-semibold', color)}>
              <Icon className="w-3 h-3" />
              {diff.toFixed(1)}%
            </span>
          ) : '—'}
        </td>
      </tr>
    )
  }

  return (
    <div className="bg-surface rounded-2xl shadow-card p-4 md:p-6 overflow-x-auto">
      <div className="font-semibold text-text-primary mb-4 text-base">{t('compare.title', lang)}</div>
      <table className="min-w-full text-sm">
        <thead className="text-left">
          <tr className="text-text-secondary font-medium">
            <th className="p-3 pb-2">{t('table.rank', lang)}</th>
            <th className="p-3 pb-2">{t('table.district', lang)}</th>
            <th className="p-3 pb-2">{t('table.households', lang)}</th>
            <th className="p-3 pb-2">{t('table.vsYou', lang)}</th>
          </tr>
        </thead>
        <tbody>
          {top.map((t, i) => (
            <tr key={t.district_code} className={cn(
              "border-t border-gray-100",
              highlightCode === t.district_code ? 'bg-primary/5' : ''
            )}>
              <td className="p-3 font-semibold text-primary">{i + 1}</td>
              <td className="p-3 font-medium">{t.district_name}</td>
              <td className="p-3">{t.total_households_worked}</td>
              <td className="p-3 text-text-secondary">—</td>
            </tr>
          ))}
          {peers.length > 0 && (
            <tr>
              <td colSpan={4} className="p-3 pt-5 font-semibold text-text-secondary text-xs uppercase tracking-wider">
                {t('table.peers', lang)}
              </td>
            </tr>
          )}
          {peers.map((p) => <PeerRow key={p.district_code} p={p} />)}
        </tbody>
      </table>
    </div>
  )
}