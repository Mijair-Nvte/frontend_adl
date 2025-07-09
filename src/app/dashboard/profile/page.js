'use client';
import { useSearchParams } from 'next/navigation';
import ProfileView from '@/components/profile/ProfileView';

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const googleStatus = searchParams.get('google');

  return (
    <div className="p-6">
      {googleStatus === 'success' && (
        <p className="mb-4 text-sm text-green-600 font-medium">
          ✅ Google Drive conectado correctamente
        </p>
      )}
      <ProfileView />
    </div>
  );
}
