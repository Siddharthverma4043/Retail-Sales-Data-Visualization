"use client"

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import 'chartjs-adapter-date-fns'
import { Line } from 'react-chartjs-2'

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend, Filler)

export default function Charts({ data }: { data: { x: Date; y: number }[] }) {
  const chartData = {
    datasets: [
      {
        label: 'P/L (last 30d)',
        data,
        fill: true,
        borderColor: '#1EE5FF',
        backgroundColor: 'rgba(30, 229, 255, 0.15)',
        tension: 0.35,
      },
    ],
  }

  const options = {
    responsive: true,
    interaction: { intersect: false, mode: 'index' as const },
    scales: {
      x: { type: 'time' as const, time: { unit: 'day' as const } },
      y: { beginAtZero: true }
    },
    plugins: { legend: { display: false } },
    animation: { duration: 700 }
  }

  return <Line data={chartData} options={options} />
}