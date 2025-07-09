'use client';

import React from 'react';

// Componente de botón reutilizable
export default function Button({
  children,
  type = 'button',
  variant = 'primary', // primary, secondary, outline, danger, ghost
  size = 'md',         // sm, md, lg
  icon: Icon,
  iconPosition = 'left',
  className = '',
  loading = false,
  disabled = false,
  ...props
}) {
  // Tamaños
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-5 py-3 text-lg gap-2',
  };

  // Variantes
  const variantClasses = {
    primary:   'bg-indigo-500 text-white hover:bg-indigo-700 focus:ring-indigo-200',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-400',
    outline:   'border border-gray-300 text-gray-800 bg-white hover:bg-gray-50 focus:ring-indigo-200',
    danger:    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-200',
    ghost:     'bg-transparent text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-100',
  };

  const baseClasses =
    'inline-flex items-center justify-center rounded-4xl  transition-colors focus:outline-none  disabled:opacity-60 disabled:pointer-events-none ';

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={[
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        className
      ].join(' ')}
      {...props}
    >
      {Icon && iconPosition === 'left' && (
        <Icon className="w-4 h-4 mr-2" />
      )}
      {loading ? (
        <span className="animate-pulse">Cargando...</span>
      ) : (
        children
      )}
      {Icon && iconPosition === 'right' && (
        <Icon className="w-4 h-4 ml-2" />
      )}
    </button>
  );
}
