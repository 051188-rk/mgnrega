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
    const labels = data.map(d => `${d.month} '${d.year.slice(-2)}`)
    return {
      labels,
      datasets: [
        {
          type: 'bar',
          label: 'Expenditure (₹ Cr)',
          data: data.map(d => d.expenditure),
          backgroundColor: 'rgba(74, 222, 128, 0.7)', // Green for financial data
          borderColor: 'rgba(22, 163, 74, 1)',
          borderWidth: 1,
          borderRadius: 4,
          yAxisID: 'y1',
          order: 2,
        },
        {
          type: 'line',
          label: 'Households (thousands)',
          data: data.map(d => d.households / 1000), // Convert to thousands
          borderColor: 'rgba(59, 130, 246, 1)', // Blue for households
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 3,
          pointRadius: 4,
          pointBackgroundColor: '#fff',
          pointBorderColor: 'rgba(59, 130, 246, 1)',
          pointHoverRadius: 6,
          fill: false,
          tension: 0.3,
          yAxisID: 'y',
          order: 1,
        },
        {
          type: 'line',
          label: 'Person Days (thousands)',
          data: data.map(d => d.personDays / 100), // Already in thousands, adjust if needed
          borderColor: 'rgba(245, 158, 11, 1)', // Amber for person days
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 3,
          pointBackgroundColor: '#fff',
          pointBorderColor: 'rgba(245, 158, 11, 1)',
          pointHoverRadius: 5,
          yAxisID: 'y',
          order: 3,
        },
      ],
    }
  }, [data, lang])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { 
            family: 'Inter, system-ui, sans-serif',
            size: 12,
          },
          padding: 20,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: 'MGNREGA Performance Overview',
        font: { 
          size: 16, 
          family: 'Inter, system-ui, sans-serif', 
          weight: '600' 
        },
        padding: { bottom: 10 },
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(30, 41, 59, 0.95)',
        titleFont: { 
          family: 'Inter, system-ui, sans-serif', 
          weight: '600',
          size: 12,
        },
        bodyFont: { 
          family: 'Inter, system-ui, sans-serif',
          size: 12,
        },
        padding: 12,
        cornerRadius: 8,
        boxPadding: 6,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (label.includes('₹')) {
                label += '₹' + context.parsed.y.toLocaleString('en-IN') + ' Cr';
              } else if (label.includes('thousand')) {
                label += context.parsed.y.toLocaleString('en-IN') + 'K';
              } else {
                label += context.parsed.y.toLocaleString('en-IN');
              }
            }
            return label;
          }
        }
      },
    },
    scales: {
      x: {
        grid: { 
          display: false,
          drawBorder: false,
        },
        ticks: { 
          font: { 
            family: 'Inter, system-ui, sans-serif',
            size: 11,
          },
          color: '#64748b',
        },
      },
      y: { // Left Y-Axis (Households & Person Days)
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'Count (in thousands)',
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 11,
            weight: '500',
          },
        },
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