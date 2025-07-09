export default function ReportCard({ title, value, Icon, change, positive }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col gap-2 hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        {Icon && <Icon className="text-gray-400 text-xl" />}
      </div>

      <div className="text-2xl font-bold text-gray-800">{value}</div>

      {change !== undefined && (
        <div className="text-xs text-gray-500">
          <span className={`font-semibold ${positive ? 'text-green-600' : 'text-red-600'}`}>
            {positive ? '▲' : '▼'} {change}
          </span>{' '}
          desde el mes anterior
        </div>
      )}
    </div>
  )
}
