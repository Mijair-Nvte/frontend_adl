'use client';

import React from 'react';

export default function Textarea({
  name,
  value,
  onChange,
  placeholder = '',
  className = '',
  label = '',
  required = false,
  disabled = false,
  rows = 4,
  autoComplete = 'off',
}) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        autoComplete={autoComplete}
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
          resize-y
          ${className}
        `}
      />
    </div>
  );
}
