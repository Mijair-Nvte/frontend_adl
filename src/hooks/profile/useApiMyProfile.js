'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useApiMyProfile() {
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorProfile, setErrorProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoadingProfile(true);
      setErrorProfile(null);

      try {
        const token = localStorage.getItem('token');

        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
 console.log('📡 Datos del perfil recibidos:', res.data);
        setProfileData(res.data);
      } catch (error) {
        console.error('Error al obtener el perfil:', error);
        setErrorProfile(error.message || 'Error desconocido');
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  return { profileData, loadingProfile, errorProfile };
}
