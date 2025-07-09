'use client';
import Image from 'next/image';

export default function AuthLogo() {
  return (
    <div className="flex justify-center mb-4">
      <Image
        src="/logo_solvex_b.png"
        alt="Logo"
        width={150}
        height={150}
        className="rounded-full object-contain"
        priority
      />
    </div>
  );
}
