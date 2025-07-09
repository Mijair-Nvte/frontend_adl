
import { Suspense } from 'react';
import RegisterClient from './RegisterClient';

export default function RegisterPage() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Verificando invitación...</p>}>
      <RegisterClient />
    </Suspense>
  );
}
