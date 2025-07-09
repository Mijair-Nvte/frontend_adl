// store/authStore.js
import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const useAuthStore = create((set) => ({
  token: null,
  user: null,
  loading: true, // true hasta que verifiquemos sesión
  error: null,

  setToken: (token) => set({ token }),

  initializeAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ user: null, token: null, loading: false });
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({ user: res.data, token, loading: false });
    } catch (err) {
      console.error('Error al cargar sesión:', err);
      localStorage.removeItem('token');
      set({ user: null, token: null, loading: false });
    }
  },

  login: async ({ email, password }) => {
    set({ loading: true, error: null });

    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      const { access_token } = res.data;

      localStorage.setItem('token', access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      set({ token: access_token });

      // Cargar usuario
      const userRes = await axios.get(`${API_URL}/me`);
      set({ user: userRes.data, loading: false });

    } catch (err) {
      console.error('Login error:', err);
      set({ error: 'Credenciales inválidas', loading: false });
    }
  },

  logout: async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${API_URL}/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.warn('Error cerrando sesión', err);
    } finally {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      set({ user: null, token: null, loading: false });
    }
  }
}));

export default useAuthStore;
