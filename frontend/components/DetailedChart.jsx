"use client"
import { useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Chart } from 'react-chartjs-2'
import { useLocale } from '../store/useLocale'
import { t } from '../lib/i18n'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function DetailedChart({ data }) {
  const { lang } = useLocale()

  const chartData = useMemo(() => {
    const labels = data.map(d => d.label)
    return {
      labels,
      datasets: [
        {
          type: 'bar',
          label: t('charts.expenditure', lang),
          data: data.map(d => d.expenditure),
          backgroundColor: '#c4b5fd', // secondary-light
          borderColor: '#8b5cf6', // secondary
          borderWidth: 2,
          borderRadius: 6,
          yAxisID: 'y1',
        },
        {
          type: 'line',
          label: t('charts.households', lang),
          data: data.map(d => d.households),
          backgroundColor: 'rgba(236, 72, 153, 0.1)', // primary with alpha
          borderColor: '#ec4899', // primary
          borderWidth: 3,
          pointRadius: 4,
          pointBackgroundColor: '#fff',
          pointBorderColor: '#ec4899',
          pointHoverRadius: 6,
          fill: true,
          tension: 0.3,
          yAxisID: 'y',
        },
      ],
    }
  }, [data, lang])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { family: 'Poppins' },
        },
      },
      title: {
        display: true,
        text: t('charts.historicalTitle', lang),
        font: { size: 16, family: 'Poppins', weight: '600' },
        padding: { bottom: 20 },
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#333',
        titleFont: { family: 'Poppins', weight: '600' },
        bodyFont: { family: 'Poppins' },
        padding: 10,
        cornerRadius: 6,
      },
    },
    scales: {
      x: {
        ticks: { font: { family: 'Poppins' } },
        grid: { display: false },
      },
      y: { // Left Y-Axis (Households)
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: t('charts.households', lang),
          font: { family: 'Poppins', weight: '600' },
        },
        ticks: { font: { family: 'Poppins' } },
        grid: {
          color: '#e5e7eb', // gray-200
          dash: [3, 3],
        },
      },
      y1: { // Right Y-Axis (Expenditure)
        type: 'linear',
        position: 'right',
        title: {
          display: true,
          text: t('charts.expenditure', lang),
          font: { family: 'Poppins', weight: '600' },
        },
        ticks: {
          font: { family: 'Poppins' },
          callback: (value) => `₹${Number(value) / 10000000}Cr` // Format as Crores
        },
        grid: { display: false },
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  }

  return (
    <div className="bg-surface rounded-2xl shadow-card p-4 md:p-6">
      <div className="relative h-96">
        <Chart type="bar" data={chartData} options={options} />
      </div>
    </div>
  )
}