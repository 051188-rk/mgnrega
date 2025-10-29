"use client"
import { cn, formatNumber } from '../lib/utils'

export default function MetricCard({ icon, value, label, hindiLabel, trend, color='green', onClick }){
  const border = color==='green'?'border-green-500':color==='yellow'?'border-warning':'border-danger'
  const text = color==='green'?'text-green-600':color==='yellow'?'text-warning':'text-danger'
  return (
    <div onClick={onClick} className={cn("bg-white rounded-xl shadow-lg p-6 border-l-4 hover:shadow-xl transition-shadow cursor-pointer", border)}>
      <div className="flex items-center justify-between mb-4">
        <div className="bg-gray-100 p-3 rounded-full">{icon}</div>
        <div className="text-right">{trend?.pct!=null && <span className={cn("text-sm font-semibold", text)}>{trend.pct>0?'↑':'↓'} {Math.abs(trend.pct).toFixed(1)}%</span>}</div>
      </div>
      <div className="text-4xl font-bold text-gray-900 mb-2">{formatNumber(value)}</div>
      <div className="text-gray-600 text-sm">{label}</div>
      {hindiLabel ? <div className="text-gray-500 text-xs mt-1">{hindiLabel}</div> : null}
    </div>
  )
}
