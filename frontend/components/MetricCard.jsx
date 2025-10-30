"use client"
import { cn, formatNumber } from '../lib/utils'
import { FaArrowTrendUp, FaArrowTrendDown } from 'react-icons/fa6'

export default function MetricCard({ icon, value, label, trend, trendColor = 'gray' }) {
  
  const isUp = trend?.pct > 0
  const trendVal = trend?.pct != null ? Math.abs(trend.pct).toFixed(1) : null

  const colorClasses = {
    green: {
      border: 'border-success',
      text: 'text-success',
      iconBg: 'bg-success/10',
      iconText: 'text-success'
    },
    pink: {
      border: 'border-primary',
      text: 'text-primary',
      iconBg: 'bg-primary/10',
      iconText: 'text-primary'
    },
    violet: {
      border: 'border-secondary',
      text: 'text-secondary',
      iconBg: 'bg-secondary/10',
      iconText: 'text-secondary'
    },
    amber: {
      border: 'border-accent',
      text: 'text-accent',
      iconBg: 'bg-accent/10',
      iconText: 'text-accent'
    },
    red: {
      border: 'border-danger',
      text: 'text-danger',
      iconBg: 'bg-danger/10',
      iconText: 'text-danger'
    },
    gray: {
      border: 'border-gray-400',
      text: 'text-gray-500',
      iconBg: 'bg-gray-100',
      iconText: 'text-gray-500'
    }
  }

  const trendColorClasses = {
    green: 'text-success',
    red: 'text-danger',
    yellow: 'text-accent-dark',
  }

  const klasses = colorClasses[trendColor] || colorClasses.gray

  return (
    <div className={cn(
      "bg-surface rounded-2xl shadow-card hover:shadow-card-hover p-5 border-t-4 transition-all duration-300",
      klasses.border
    )}>
      <div className="flex items-center justify-between mb-3">
        <div className={cn("p-3 rounded-full", klasses.iconBg, klasses.iconText)}>
          {/* Ensure icon has w-7 h-7 */}
          {icon}
        </div>
        {trendVal != null && (
          <div className={cn("flex items-center gap-1 text-sm font-semibold", trendColorClasses[trend])}>
            {isUp ? <FaArrowTrendUp /> : <FaArrowTrendDown />}
            <span>{trendVal}%</span>
          </div>
        )}
      </div>
      <div className="text-4xl font-semibold text-text-primary mb-1">{formatNumber(value)}</div>
      <div className="text-text-secondary text-sm font-medium">{label}</div>
    </div>
  )
}