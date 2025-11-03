import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function ProgressChart({ data }) {
  if (!data) {
    return (
      <div className="text-center py-8 text-gray-500">
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
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="level" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="completed" fill="#3B82F6" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default ProgressChart