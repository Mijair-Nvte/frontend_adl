import ReactSelect from "react-select";

export default function MultiSelect({
  label,
  name,
  value,
  options,
  onChange,
  placeholder = "Select...",
  isMulti = true,
  isLoading = false,
}) {
  // Personaliza el render de cada usuario seleccionado
 const customComponents = {
  MultiValue: ({ data, removeProps }) => (
    <div className="flex items-center bg-indigo-100 text-indigo-700 rounded-full px-3 py-1 text-sm mr-2 mb-1 transition-all duration-150 hover:bg-indigo-200 shadow-sm hover:shadow-md">
      <span className="truncate max-w-[100px]">{data.label}</span>
      <button
        type="button"
        onClick={removeProps.onClick}
        className="ml-2 text-indigo-500 hover:text-red-500 transition-colors"
      >
        ×
      </button>
    </div>
  ),
};


  return (
    <div className="mb-4">
      {label && (
        <label
          className="text-sm font-medium text-gray-700 mb-1 block"
          htmlFor={name}
        >
          {label}
        </label>
      )}
      <ReactSelect
        inputId={name}
        name={name}
        isMulti={isMulti}
        value={value}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        isLoading={isLoading}
        classNamePrefix="select"
        className="text-sm text-gray-800"
        components={customComponents}
      />
    </div>
  );
}
