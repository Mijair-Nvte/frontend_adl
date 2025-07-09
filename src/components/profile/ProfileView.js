'use client';
import Image from "next/image";
import { useState, useEffect, useMemo } from 'react';
import Input from '@/components/ui/Input';
import { FaGoogle } from 'react-icons/fa';
import useApiMyProfile from '@/hooks/profile/useApiMyProfile';
import { updateMyProfile } from '@/services/profile/profileService';
import FileUpload from '../ui/FileUpload';
import { Home, KeyRound } from 'lucide-react';
import { updateUserPassword } from '@/services/profile/passwordService';
import { redirectToGoogleOAuth } from '@/services/google/driveService';
import GoogleCallbackHandler from '@/components/shared/GoogleCallbackHandler';


export default function ProfileView() {
  const { profileData, loadingProfile } = useApiMyProfile();
  const [activeTab, setActiveTab] = useState('Personal Details');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    state: '',
    bio: '',
    avatar: '',
  });

  const [initialForm, setInitialForm] = useState(null);

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (profileData) {
      const filled = {
        name: profileData.name || '',
        email: profileData.email || '',
        phone: profileData.profile?.phone || '',
        address: profileData.profile?.address || '',
        state: profileData.profile?.state || '',
        bio: profileData.profile?.bio || '',
        avatar: profileData.profile?.avatar || '',
      };
      setForm(filled);
      setInitialForm(filled);
    }
  }, [profileData]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleAvatarChange = (file) => setForm({ ...form, avatar: file });

  const hasChanges = useMemo(() => {
    if (!initialForm) return false;
    return Object.keys(initialForm).some((key) =>
      key === 'avatar' ? form.avatar instanceof File : form[key] !== initialForm[key]
    );
  }, [form, initialForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (form.name) formData.append('name', form.name);
      if (form.email) formData.append('email', form.email);
      if (form.phone) formData.append('phone', form.phone);
      if (form.address) formData.append('address', form.address);
      if (form.state) formData.append('state', form.state);
      if (form.bio) formData.append('bio', form.bio);
      if (form.avatar && typeof form.avatar !== 'string') {
        formData.append('avatar', form.avatar);
      }

      await updateMyProfile(formData);
      alert('Perfil actualizado con éxito');
      setInitialForm(form);
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      alert('Ocurrió un error al guardar');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      setPasswordError('');
      await updateUserPassword({
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
        new_password_confirmation: passwordForm.new_password_confirmation,
      });
      alert('Contraseña actualizada correctamente');
      setPasswordForm({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      });
    } catch (error) {
      console.error(error);
      setPasswordError(
        error.response?.data?.error ||
        'No se pudo actualizar la contraseña. Verifica los campos.'
      );
      window.scrollTo(0, 0);
    }
  };

  const isPasswordValid =
    passwordForm.current_password &&
    passwordForm.new_password &&
    passwordForm.new_password_confirmation &&
    passwordForm.new_password === passwordForm.new_password_confirmation;

  if (loadingProfile) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">Cargando perfil...</p>
      </div>
    );
  }


  const handleConnectGoogle = async () => {
    try {
      const url = await redirectToGoogleOAuth();

      window.location.href = url; // Redirige a la página de consentimiento
    } catch (error) {
      console.error('Error al conectar con Google Drive:', error);
      alert('No se pudo conectar con Google Drive');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      <GoogleCallbackHandler />
      {/* Sidebar */}
      <aside className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center text-center">
          <div className="relative w-28 h-28">
            {form.avatar instanceof File ? (
              <Image
                src={URL.createObjectURL(form.avatar)}
                alt="avatar"
                fill
                sizes="112px"
                className="rounded-full border-4 border-blue-100 object-cover shadow-md"
              />
            ) : (
              <Image
                src={
                  form.avatar ||
                  'https://flowbite.com/docs/images/people/profile-picture-5.jpg'
                }
                alt="avatar"
                fill
                sizes="112px"
                className="rounded-full border-4 border-blue-100 object-cover shadow-md"
              />
            )}
          </div>
          <h2 className="text-black text-lg font-semibold mt-4">{form.name || 'Nombre'}</h2>
          <p className="text-gray-500 text-sm">{form.email}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Integraciones</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FaGoogle className="text-red-500" />
                Google Drive
              </div>

              {profileData?.google_account ? (
                <div className="text-right text-xs">
                  <div className="bg-green-600 text-white px-3 py-1 rounded">
                    Vinculado ✅
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">
                    {profileData.google_account.email}
                  </div>

                </div>
              ) : (
                <button
                  onClick={handleConnectGoogle}
                  className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Conectar con Google Drive
                </button>
              )}
            </li>
          </ul>
        </div>

      </aside>

      {/* Main */}
      <main className="md:col-span-2 bg-white p-6 rounded-2xl shadow-md max-w-3xl mx-auto w-full">
        {/* Tabs */}
        <div className="flex flex-wrap justify-center md:justify-start border mb-6 rounded-xl bg-gray-100 px-2 py-1 gap-2 text-sm font-medium">
          {[
            { key: 'Personal Details', label: 'Cuenta', icon: <Home size={16} /> },
            { key: 'Change Password', label: 'Contraseña', icon: <KeyRound size={16} /> },
          ].map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium transition ${isActive
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-gray-600 hover:text-purple-600'
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Formulario Perfil */}
        {activeTab === 'Personal Details' && (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
            <Input name="name" label="Nombre completo" value={form.name} onChange={handleChange} />
            <Input name="email" label="Correo electrónico" type="email" value={form.email} onChange={handleChange} />
            <Input name="phone" label="Teléfono" value={form.phone} onChange={handleChange} />
            <Input name="address" label="Dirección" value={form.address} onChange={handleChange} />
            <Input name="state" label="Estado" value={form.state} onChange={handleChange} />

            <FileUpload
              value={form.avatar}
              onChange={handleAvatarChange}
              accept="image/*"
              preview={true}
              label="Sube tu avatar"
              description="JPG, PNG, SVG máx. 2MB"
            />

            <div className="md:col-span-2">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Biografía
              </label>
              <textarea
                id="bio"
                name="bio"
                rows="3"
                value={form.bio}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg text-sm focus:ring focus:ring-blue-100"
              ></textarea>
            </div>

            <div className="md:col-span-2 flex justify-end mt-6 gap-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!hasChanges}
                className={`px-4 py-2 rounded-lg font-medium transition ${hasChanges
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                Guardar cambios
              </button>
            </div>
          </form>
        )}

        {/* Formulario Cambio Contraseña */}
        {activeTab === 'Change Password' && (
          <form onSubmit={handlePasswordSubmit} className="grid grid-cols-1 gap-5 text-sm max-w-lg mx-auto">
            <Input
              name="current_password"
              label="Contraseña actual"
              type="password"
              placeholder="Ingresa tu contraseña actual"
              value={passwordForm.current_password}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, current_password: e.target.value })
              }
            />
            <Input
              name="new_password"
              label="Nueva contraseña"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={passwordForm.new_password}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, new_password: e.target.value })
              }
            />
            <Input
              name="new_password_confirmation"
              label="Confirmar nueva contraseña"
              type="password"
              placeholder="Repite la nueva contraseña"
              value={passwordForm.new_password_confirmation}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  new_password_confirmation: e.target.value,
                })
              }
            />

            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}

            <div className="flex justify-end mt-4 gap-2">
              <button
                type="button"
                onClick={() =>
                  setPasswordForm({
                    current_password: '',
                    new_password: '',
                    new_password_confirmation: '',
                  })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!isPasswordValid}
                className={`px-4 py-2 rounded-lg font-medium transition ${isPasswordValid
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                Actualizar contraseña
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
