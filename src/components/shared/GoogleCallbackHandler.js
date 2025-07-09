'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function GoogleCallbackHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const googleStatus = searchParams.get('google');

    if (googleStatus === 'success') {
      alert('✅ Cuenta de Google conectada exitosamente');
      router.replace('/dashboard/profile'); // Limpia los parámetros
    } else if (googleStatus === 'error') {
      alert('❌ Error al conectar con Google');
      router.replace('/dashboard/profile');
    } else if (googleStatus === 'invalid_token') {
      alert('⚠️ Tu sesión expiró. Intenta conectar de nuevo.');
      router.replace('/dashboard/profile');
    } else if (googleStatus === 'exception') {
      alert('🚨 Ocurrió un error inesperado al procesar la conexión con Google.');
      router.replace('/dashboard/profile');
    }
  }, [searchParams, router]);

  return null;
}
