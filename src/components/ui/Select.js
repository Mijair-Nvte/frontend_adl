export default function CustomSelect({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Selecciona una opción..."
}) {
  return (
    <div className="mb-2">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="block w-full rounded border border-gray-300 bg-white text-gray-800 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        <option value="" disabled>{placeholder}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
