import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function ProgressChart({ data }) {
  if (!data) {
    return (
      <div className="text-center py-8 text-gray-400">
        No progress data available yet.
      </div>
    )
  }

  const chartData = Object.entries(data).map(([key, value]) => ({
    level: key.replace('level', 'Level '),
    completed: value
  }))

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="level" 
          stroke="#9CA3AF"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#9CA3AF"
          style={{ fontSize: '12px' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1F2937', 
            border: '1px solid #374151',
            borderRadius: '8px',
            color: '#F3F4F6'
          }}
          labelStyle={{ color: '#F3F4F6' }}
        />
        <Bar 
          dataKey="completed" 
          fill="#06B6D4" 
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default ProgressChart