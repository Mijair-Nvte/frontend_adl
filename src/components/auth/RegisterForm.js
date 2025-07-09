'use client';
import { useState } from 'react';
import AuthLogo from './AuthLogo'; // Ajusta la ruta si estás fuera de /auth

export default function RegisterForm({ onSwitchForm }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Aquí va la lógica real de registro
    setTimeout(() => {
      setLoading(false);
      console.log(form);
    }, 1000);
  };

  return (
 <div className="w-full max-w-lg bg-white rounded-2xl border p-9 sm:p-8">
     <AuthLogo />

      <h2 className="text-sm sm:text-lg font-semibold text-center text-gray-900 mb-4">Crea tu cuenta</h2>

      <form onSubmit={handleSubmit} className="space-y-4 ">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
          <input
            type="text"
            name="name"
            placeholder="Juan Pérez"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
          <input
            type="email"
            name="email"
            placeholder="correo@empresa.com"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
          <input
            type="password"
            name="password_confirmation"
            placeholder="••••••••"
            value={form.password_confirmation}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white font-medium py-2 rounded-md"
        >
          {loading ? 'Creando cuenta...' : 'Registrarse'}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-gray-500">
        ¿Ya tienes una cuenta?{" "}
        <button onClick={onSwitchForm} className="text-indigo-600 hover:underline">
          Inicia sesión
        </button>
      </p>
    </div>
  );
}
