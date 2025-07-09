'use client';

import { FileText, ImageIcon, Trash2, Download } from 'lucide-react';
import Preloader from '@/components/ui/Preloader';
import Table from '@/components/ui/Table';

const getFileIcon = (mimeType) => {
  if (mimeType?.includes('image')) return <ImageIcon className="w-4 h-4 text-blue-500" />;
  if (mimeType?.includes('pdf')) return <FileText className="w-4 h-4 text-red-500" />;
  return <FileText className="w-4 h-4 text-gray-400" />;
};

async function handleDownload(id, filename) {
  const token = localStorage.getItem('token');
  const url = `${process.env.NEXT_PUBLIC_API_URL}/documents/${id}/download`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Error al descargar el archivo');

    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename || 'documento.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error(error);
    alert('No se pudo descargar el archivo');
  }
}

export default function DocumentsList({ documents = [], loading = false, onDelete, onView }) {
  if (loading) return <Preloader message="Cargando documentos..." />;

  const columns = [
    {
      label: '',
      key: 'icon',
      render: (doc) => getFileIcon(doc.mime_type)
    },
    {
      label: 'Nombre',
      key: 'file_name',
      render: (doc) => (
        <span className="text-sm font-medium text-gray-800 truncate max-w-[200px] block" title={doc.file_name}>
          {doc.file_name}
        </span>
      )
    },
    {
      label: 'Tipo MIME',
      key: 'mime_type',
      render: (doc) => <span className="text-sm text-gray-500">{doc.mime_type}</span>
    },
    {
      label: 'Acciones',
      key: 'actions',
      render: (doc) => (
        <div className="flex gap-3">
          <button
            onClick={() => onView(doc)}
            className="text-blue-600 hover:underline text-sm flex items-center gap-1"
            title="Ver documento"
          >
            <FileText className="w-4 h-4" />
            Ver
          </button>
          <button
            onClick={() => handleDownload(doc.id, doc.file_name)}
            className="text-green-600 hover:underline text-sm flex items-center gap-1"
            title="Descargar documento"
          >
            <Download className="w-4 h-4" />
            Descargar
          </button>
          {onDelete && (
            <button
              onClick={() => onDelete(doc.id)}
              className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
              title="Eliminar"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <section className="p-2 mt-4">
      <Table columns={columns} data={documents} />
    </section>
  );
}
