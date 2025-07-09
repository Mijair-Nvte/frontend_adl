'use client';

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Input({
  name,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  className = '',
  label = '',
  required = false,
  disabled = false,
  autoComplete = 'on',
    onKeyDown,        // 🔑 Añade esto
  onFocus,          // Opcional si quieres
  onBlur,           // Opcional si quieres
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="w-full relative"> {/* <- Importante: relative aquí */}
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={inputType}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
         onKeyDown={onKeyDown}      // 🔑 Propaga el evento
        onFocus={onFocus}          // Opcional
        onBlur={onBlur}            // Opcional
        className={`
          w-full px-4 py-2
          border border-gray-200
          rounded
          outline-none
          text-gray-900
          placeholder-gray-400
          focus:border-indigo-500
          focus:ring focus:ring-indigo-100
          transition
          ${isPassword ? 'pr-10' : ''}
          ${className}
        `}
      />

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 bottom-2.5 text-gray-500 hover:text-gray-700"
          title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
}
