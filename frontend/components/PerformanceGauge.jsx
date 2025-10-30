"use client"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function PerformanceGauge({ value = 0, label }) {
  const roundedValue = Math.round(value)
  
  const data = {
    datasets: [
      {
        data: [roundedValue, 100 - roundedValue],
        backgroundColor: [
          '#ec4899', // primary
          '#f3f4f6'  // gray-100
        ],
        borderColor: [
          '#ec4899',
          '#f3f4f6'
        ],
        borderWidth: 1,
        circumference: 180, // Half circle
        rotation: 270,      // Start from bottom
        cutout: '75%',
        borderRadius: 8,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  }

  return (
    <div className="bg-surface rounded-2xl shadow-card p-4 md:p-6 h-full flex flex-col justify-between">
      <div className="font-semibold text-text-primary text-base">{label}</div>
      <div className="relative w-full h-40 md:h-48 flex items-end justify-center">
        <Doughnut data={data} options={options} />
        <div className="absolute bottom-4 md:bottom-8 text-center">
          <div className="text-4xl md:text-5xl font-bold text-primary">
            {roundedValue}<span className="text-3xl">%</span>
          </div>
        </div>
      </div>
    </div>
  )
}