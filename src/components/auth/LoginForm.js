import { useState } from 'react';
import useAuthStore from '@/store/authStore';
import AuthLogo from './AuthLogo';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function LoginForm({ onSwitchForm }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login, loading, error } = useAuthStore();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    login(form);
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-2xl border p-9 sm:p-8">
      <AuthLogo />
      <h2 className="text-sm sm:text-lg font-semibold text-center text-gray-900 mb-4">
        Inicia sesión en tu cuenta
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Correo electrónico"
          type="email"
          name="email"
          placeholder="correo@empresa.com"
          value={form.email}
          onChange={handleChange}
          required
        />
        <Input
          label="Contraseña"
          type="password"
          name="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" variant="primary" size="md" loading={loading} className="w-full">
          Iniciar sesión
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-gray-500">
        ¿No tienes una cuenta?{' '}
        <button onClick={onSwitchForm} className="text-indigo-600 hover:underline">
          Regístrate gratis
        </button>
      </p>
    </div>
  );
}
