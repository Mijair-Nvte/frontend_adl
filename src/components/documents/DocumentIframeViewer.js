'use client';
import { useEffect, useState } from 'react';

export default function DocumentIframeViewer({ document, onClose }) {
  const [blobUrl, setBlobUrl] = useState(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  const filename = document.file_url.split('/').pop();

  useEffect(() => {
    const fetchSecureFile = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/${filename}/secure-view`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('No se pudo cargar el documento');

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSecureFile();
  }, [filename, token]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="w-[90vw] h-[90vh] rounded-lg shadow-lg relative ">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Cerrar
        </button>

        {blobUrl ? (
          <iframe
            src={blobUrl}
            className="w-full h-full rounded-b-lg"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="text-white text-center mt-4">Cargando documento...</div>
        )}
      </div>
    </div>
  );
}
