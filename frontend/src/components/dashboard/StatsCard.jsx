import React from 'react'

function StatsCard({ title, value, icon, color = 'blue', trend, subtitle }) {
  const colorClasses = {
    blue: {
      bg: 'bg-gradient-to-br from-blue-500 to-cyan-600',
      shadow: 'shadow-blue-500/30',
      trend: 'text-cyan-400'
    },
    green: {
      bg: 'bg-gradient-to-br from-green-500 to-emerald-600',
      shadow: 'shadow-green-500/30',
      trend: 'text-green-400'
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-500 to-pink-600',
      shadow: 'shadow-purple-500/30',
      trend: 'text-purple-400'
    },
    yellow: {
      bg: 'bg-gradient-to-br from-yellow-500 to-orange-500',
      shadow: 'shadow-yellow-500/30',
      trend: 'text-yellow-400'
    },
    red: {
      bg: 'bg-gradient-to-br from-red-500 to-rose-600',
      shadow: 'shadow-red-500/30',
      trend: 'text-red-400'
    },
  }

  const selectedColor = colorClasses[color] || colorClasses.blue

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1 font-medium">{subtitle}</p>
          )}
          {trend && (
            <p className={`text-xs font-bold mt-2 ${selectedColor.trend}`}>{trend}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${selectedColor.bg} shadow-lg ${selectedColor.shadow}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

export default StatsCard