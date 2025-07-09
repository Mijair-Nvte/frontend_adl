'use client';

import EmailSettingsForm from './EmailSettingsForm';

export default function EmailSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Configuración de correo SMTP</h2>
      <EmailSettingsForm />
    </div>
  );
}
