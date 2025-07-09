'use client';

import { useState, useRef, useEffect } from 'react';

import {BellIcon} from '@heroicons/react/24/outline';
import axios from 'axios';
import useApiNotifications from '@/hooks/Notifications/useApiNotifications';
import useNotificationsChannel from '@/hooks/useNotificationsChannel';
import useAuthStore from '@/store/authStore';
import { showToast } from '@/utils/toast';

export default function NotificationDropdown() {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { notifications, fetchNotifications, setNotifications } = useApiNotifications();

    const { user } = useAuthStore();
    const userId = user?.id;

    useNotificationsChannel(userId, (newNotification) => {
        // Mostrar toast
        showToast({
            type: 'info',
            message: newNotification.title,
            description: newNotification.body
        });

        // Actualizar lista
        setNotifications(prev => [newNotification, ...prev]);
    });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
            });
            fetchNotifications();
        } catch (err) {
            console.error('Error al marcar como leída', err);
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/notifications/mark-all-read`, {}, {
                headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
            });
            fetchNotifications();
        } catch (err) {
            console.error('Error al marcar todas como leídas', err);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const count = notifications.filter(n => !n.read_at).length;
        setUnreadCount(count);
    }, [notifications]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                className="p-2 rounded-full hover:bg-white/20 relative"
                onClick={() => setOpen(!open)}
            >
                <BellIcon className="w-6 h-6 text-gray-700" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div
                    className="
        fixed top-16 left-1/2 -translate-x-1/2 z-50
        bg-white border rounded-lg shadow-xl
        w-11/12 max-w-sm
        sm:absolute sm:top-auto sm:left-auto sm:right-0 sm:translate-x-0 sm:w-80
      "
                >
                    <div className="flex justify-between items-center px-4 py-2 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                        <span className="font-semibold">Notificaciones</span>
                        <button
                            onClick={markAllAsRead}
                            className="text-xs hover:underline"
                        >
                            Marcar todo como leído
                        </button>
                    </div>

                    <ul className="max-h-96 overflow-y-auto divide-y">
                        {notifications.length === 0 ? (
                            <li className="px-4 py-3 text-sm text-gray-500 text-center">
                                No hay notificaciones
                            </li>
                        ) : (
                            notifications.map((n) => (
                                <li
                                    key={n.id}
                                    onClick={() => markAsRead(n.id)}
                                    className={`flex items-start gap-2 p-3 cursor-pointer hover:bg-gray-50 ${n.read_at ? 'opacity-70' : 'bg-blue-50'
                                        }`}
                                >
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-800 text-sm break-words">
                                            {n.title}
                                        </p>
                                        <p className="text-xs text-gray-600 break-words">
                                            {n.body}
                                        </p>
                                        <p className="text-[10px] text-green-700 mt-1">
                                            {formatDate(n.created_at)}
                                        </p>
                                    </div>
                                    {!n.read_at && (
                                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-1"></span>
                                    )}
                                </li>
                            ))
                        )}
                    </ul>

                    <div className="border-t">
                        <button className="w-full text-sm text-blue-600 py-2 hover:bg-gray-100">
                            Ver todas
                        </button>
                    </div>
                </div>
            )}
        </div>

    );


}
