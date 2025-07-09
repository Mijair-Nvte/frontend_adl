'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useApiDashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [loadingDashboard, setLoadingDashboard] = useState(true);
    const [errorDashboard, setErrorDashboard] = useState(null);

    const fetchDashboardData = async () => {
        setLoadingDashboard(true);
        setErrorDashboard(null);

        try {
            const token = localStorage.getItem('token');

            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard-summary`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                }
            });
           console.log("📊 Respuesta dashboard:", res.data);

            setDashboardData(res.data);
        } catch (error) {
            console.error('Error al obtener datos del dashboard:', error);
            setErrorDashboard(error.response?.data?.message || 'Error desconocido');
        } finally {
            setLoadingDashboard(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return { dashboardData, loadingDashboard, errorDashboard, fetchDashboardData };
}
