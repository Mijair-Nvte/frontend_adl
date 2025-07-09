import axios from 'axios';
import { showToast } from "@/utils/toast";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/google/calendar/events`;

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

export const redirectToGoogleOAuth = async () => {
  const token = localStorage.getItem('token');
  const service = 'calendar';
  const redirectTo = '/dashboard/calendar';

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/google/redirect`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { service, redirect_to: redirectTo },
      }
    );

    const { url } = response.data;
    return url; // devolvemos la URL al caller
  } catch (error) {
    console.error('❌ Error al generar la URL de Google OAuth:', error);
    throw new Error('Error al redirigir a Google');
  }
};

export async function createCalendarEvent(data) {
  const res = await axios.post(API_URL, data, getHeaders());
  return res.data;
}

export async function updateCalendarEvent(id, data) {
  const res = await axios.put(`${API_URL}/${id}`, data, getHeaders());
  return res.data;
}

export async function deleteCalendarEvent(id) {
  const res = await axios.delete(`${API_URL}/${id}`, getHeaders());
  return res.data;
}

export async function verifyGoogleCalendarLinked(showToasts = true) {
  const token = localStorage.getItem('token');

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/google/calendar/status`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const linked = response.data.linked;

    if (showToasts) {
      if (linked) {
        showToast({
          type: 'success',
          message: '¡Google Calendar vinculado!',
          description: 'Ya puedes sincronizar tus eventos.'
        });
      } else {
        showToast({
          type: 'error',
          message: 'No se vinculó Google Calendar',
          description: 'Intenta de nuevo o revisa tu conexión.'
        });
      }
    }

    return linked;
  } catch (err) {
    console.error('Error al verificar vinculación:', err);

    if (showToasts) {
      showToast({
        type: 'error',
        message: 'Error al verificar la vinculación',
        description: 'No pudimos confirmar si se vinculó correctamente.'
      });
    }

    return false;
  }
}


export async function disconnectGoogleCalendar() {
  const token = localStorage.getItem('token');

  try {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/google/calendar/disconnect`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    showToast({
      type: 'success',
      message: 'Google Calendar desvinculado',
      description: 'Puedes volver a vincularlo cuando lo necesites.',
    });

    return true;
  } catch (err) {
    console.error('Error al desvincular:', err);
    showToast({
      type: 'error',
      message: 'Error al desvincular',
      description: 'Intenta nuevamente más tarde.',
    });

    return false;
  }
}
