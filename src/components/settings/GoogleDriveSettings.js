'use client';

import { useEffect, useState } from 'react';
import  Button  from '@/components/ui/Button';
import { toast } from 'sonner';
import {
  getGoogleDriveStatus,
  redirectToGoogleOAuth,
  revokeGoogleDrive,
  fetchDriveFolders,
  setRootFolder,
} from '@/services/google/driveService';
import { CheckCircle } from 'lucide-react';

export default function GoogleDriveSettings() {
  const [isLinked, setIsLinked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authInProgress, setAuthInProgress] = useState(false);
  const [email, setEmail] = useState('');
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('');
  const [savedFolderId, setSavedFolderId] = useState('');

  const fetchStatus = async () => {
    try {
      const status = await getGoogleDriveStatus();
      setIsLinked(status?.linked ?? false);
      setEmail(status?.email || '');

      if (status?.root_folder_id) {
        setSelectedFolder(status.root_folder_id);
        setSavedFolderId(status.root_folder_id);
      }
    } catch (err) {
      console.error('Error al obtener estado:', err);
      setIsLinked(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchFolders = async () => {
    try {
      const folders = await fetchDriveFolders();
      setFolders(folders);
    } catch (err) {
      console.error('Error al obtener carpetas:', err);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  useEffect(() => {
    if (isLinked) {
      fetchFolders();
    }
  }, [isLinked]);

  const handleLink = async () => {
    setAuthInProgress(true);
    const toastId = toast.loading('🔄 Abriendo autenticación con Google...');

    try {
      const authUrl = await redirectToGoogleOAuth();

      const popup = window.open(
        authUrl,
        'google_drive_oauth',
        `width=500,height=600,left=${window.screenX + 200},top=${window.screenY + 100}`
      );

      if (!popup) {
        toast.dismiss(toastId);
        toast.error('❌ El popup fue bloqueado.');
        setAuthInProgress(false);
        return;
      }

      const interval = setInterval(() => {
        if (popup.closed) {
          clearInterval(interval);
          toast.dismiss(toastId);

          const params = new URLSearchParams(window.location.search);
          const status = params.get('google');

          const messages = {
            drive_success: { type: 'success', msg: '✅ Google Drive vinculado correctamente.' },
            drive_token_error: { type: 'error', msg: '❌ Error al obtener token.' },
            drive_expired: { type: 'warning', msg: '⚠️ Token expirado. Reautentica.' },
            drive_invalid_token: { type: 'error', msg: '🔐 Token inválido.' },
          };

          const info = messages[status];

          if (info) {
            toast[info.type](info.msg);
            window.location.href = '/dashboard/settings';
          } else {
            toast.warning('⚠️ No se completó la vinculación.');
          }

          fetchStatus();
          setAuthInProgress(false);
        }
      }, 1000);
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('❌ Error inesperado al iniciar autenticación.');
      setAuthInProgress(false);
    }
  };

  const handleUnlink = async () => {
    const confirm = window.confirm('¿Estás seguro de que deseas desvincular tu cuenta de Google Drive?');
    if (!confirm) return;

    try {
      await revokeGoogleDrive();
      toast.success('✅ Cuenta desvinculada correctamente');
      fetchStatus();
    } catch (error) {
      console.error('Error al desvincular:', error);
      toast.error('❌ Error al desvincular la cuenta');
    }
  };

  const handleSave = async () => {
    try {
      await setRootFolder(selectedFolder);
      setSavedFolderId(selectedFolder);
      toast.success('📂 Carpeta raíz actualizada');
    } catch (err) {
      toast.error('❌ Error al guardar carpeta raíz');
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow">
      <h2 className="text-xl font-semibold mb-2">Google Drive</h2>

      {loading ? (
        <div className="text-gray-500 animate-pulse">Verificando estado...</div>
      ) : (
        <div className="space-y-2">
          {isLinked ? (
            <div className="flex items-center justify-between gap-3">
              <p className="text-green-700 flex items-center gap-2">
                <CheckCircle size={18} className="text-green-600" />
                Cuenta vinculada con Google Drive
              </p>
              <p className="text-sm text-gray-500 ml-6">{email}</p>

              <Button disabled variant="secondary" className="bg-green-50 text-green-700 border border-green-300">
                Vinculado
              </Button>
              <Button variant="destructive" onClick={handleUnlink}>
                Desvincular
              </Button>
            </div>
          ) : (
            <>
              <p className="text-gray-600">Tu cuenta no está vinculada.</p>
              <Button onClick={handleLink} disabled={authInProgress}>
                {authInProgress ? 'Vinculando...' : 'Vincular con Google'}
              </Button>
            </>
          )}

          {isLinked && (
            <div className="mt-4 space-y-2">
              <label className="block text-sm font-medium text-gray-700">Selecciona carpeta raíz</label>
              <select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="">-- Selecciona una carpeta --</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                    {folder.id === savedFolderId ? ' ✅' : ''}
                  </option>
                ))}
              </select>

              {savedFolderId && (
                <p className="text-sm text-green-600 mt-1">
                  📂 Carpeta raíz guardada: <strong>{folders.find(f => f.id === savedFolderId)?.name || 'Sin nombre'}</strong>
                </p>
              )}

              <Button onClick={handleSave} disabled={!selectedFolder}>
                Guardar carpeta raíz
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
