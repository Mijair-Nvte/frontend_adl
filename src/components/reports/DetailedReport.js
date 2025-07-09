'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function DetailedReport({ data = [], loading }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-8">
      <h2 className="text-xl font-semibold mb-4">Informe detallado</h2>
      {loading
        ? <div>Cargando gráfica...</div>
        : (
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cases" fill="#3b82f6" name="Proyectos" />
                <Bar dataKey="clients" fill="#10b981" name="Clientes" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )
      }
    </div>
  )
}
