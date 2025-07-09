'use client';

import { useEffect, useState } from 'react';
import { getEmailSettings, updateEmailSettings } from '@/services/email/emailSettingsService';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { showToast } from '@/utils/toast';

// Función para comparar dos objetos shallow
const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export default function EmailSettingsForm() {
  const [form, setForm] = useState({
    mail_mailer: '',
    mail_host: '',
    mail_port: '',
    mail_username: '',
    mail_password: '',
    mail_encryption: '',
    mail_from_name: '',
    mail_from_address: '',
  });

  const [initialForm, setInitialForm] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSettings = async () => {
    try {
      const data = await getEmailSettings();
      setForm(data);
      setInitialForm(data); // Guarda los valores originales para comparar
    } catch {
      showToast({ type: 'error', message: 'Error al obtener configuración SMTP' });
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateEmailSettings(form);
      showToast({ type: 'success', message: 'Configuración actualizada' });
      setInitialForm(form); // Actualiza el estado original tras guardar
    } catch {
      showToast({ type: 'error', message: 'Error al guardar configuración' });
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = !isEqual(form, initialForm);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow rounded-lg border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input name="mail_mailer" label="Mailer" value={form.mail_mailer} onChange={handleChange} required />
        <Input name="mail_host" label="Host" value={form.mail_host} onChange={handleChange} required />
        <Input name="mail_port" label="Puerto" value={form.mail_port} onChange={handleChange} required />
        <Input name="mail_username" label="Usuario" value={form.mail_username} onChange={handleChange} required />
        <Input name="mail_password" label="Contraseña" type="password" value={form.mail_password} onChange={handleChange} required />
        <Input name="mail_encryption" label="Encriptación (tls/ssl)" value={form.mail_encryption} onChange={handleChange} />
        <Input name="mail_from_name" label="Nombre del remitente" value={form.mail_from_name} onChange={handleChange} required />
        <Input name="mail_from_address" label="Correo del remitente" value={form.mail_from_address} onChange={handleChange} required />
      </div>

      <Button
        type="submit"
        variant="primary"
        loading={loading}
        disabled={!hasChanges || loading}
      >
        Guardar configuración
      </Button>
    </form>
  );
}
