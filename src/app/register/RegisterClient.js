// app/register/RegisterClient.js
'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Image from 'next/image';

export default function RegisterClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });

  const [valid, setValid] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Validar invitación
  useEffect(() => {
    if (!token) return setValid(false);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/invitations/${token}`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        setForm(prev => ({ ...prev, email: data.email }));
        setValid(true);
      })
      .catch(() => setValid(false));
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/invitations/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, token }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Error al registrar');
      alert('🎉 Registro exitoso');
      window.location.href = '/';
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  if (valid === null) return null; // Se muestra el fallback de Suspense
  if (valid === false) return <p className="text-center text-red-500 mt-10">Token inválido o expirado.</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border">
        <div className="flex justify-center mb-6">
          <Image src="/logo_solvex_b.png" alt="Logo" width={60} height={60} />
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">Completa tu registro</h2>
        <p className="text-center text-gray-500 mb-6">Ingresa tus datos para crear tu cuenta</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="name"
            label="Nombre completo"
            placeholder="Juan Pérez"
            value={form.name}
            onChange={handleChange}
            required
          />

          <Input
            name="email"
            label="Correo electrónico"
            placeholder="usuario@email.com"
            value={form.email}
            disabled
          />

          <Input
            name="password"
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
          />

          <Input
            name="password_confirmation"
            label="Confirmar contraseña"
            type="password"
            placeholder="••••••••"
            value={form.password_confirmation}
            onChange={handleChange}
            required
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" loading={loading} className="w-full">
            Crear cuenta
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tienes una cuenta? <a href="/login" className="text-indigo-600 hover:underline">Inicia sesión</a>
        </p>
      </div>
    </div>
  );
}
