'use client';

import { useEffect, useState } from 'react';
import DocumentsList from '@/components/documents/DocumentsList';
import UploadDocumentButton from '@/components/documents/UploadDocumentButton';
import DocumentIframeViewer from '@/components/documents/DocumentIframeViewer';
import {
  listDocuments,
  uploadDocument,
  deleteDocument,
} from '@/services/documents/documentService';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedDoc, setSelectedDoc] = useState(null); // <-- visor

  const fetchDocuments = async () => {
    try {
      const res = await listDocuments();
      setDocuments(res);
    } catch (err) {
      console.error('Error al listar documentos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file) => {
    try {
      setUploading(true);
      await uploadDocument(file, setProgress);
      await fetchDocuments();
    } catch (error) {
      console.error('Error al subir documento:', error);
      alert('Error al subir documento');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDelete = async (fileId) => {
    if (!confirm('¿Estás seguro de eliminar este archivo?')) return;
    try {
      await deleteDocument(fileId);
      setDocuments((prev) => prev.filter((doc) => doc.id !== fileId));
    } catch (error) {
      console.error('Error al eliminar documento:', error);
      alert('No se pudo eliminar el archivo.');
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center ">
        <h2 className="text-xl font-bold text-gray-800">Documentos</h2>
        <UploadDocumentButton
          onUpload={handleUpload}
          uploading={uploading}
          progress={progress}
        />
      </div>

      {uploading && (
        <div className="px-6 mb-4">
          <div className="w-full h-2 bg-gray-200 rounded">
            <div
              className="h-2 bg-blue-500 rounded transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-right">{progress}%</p>
        </div>
      )}

      <DocumentsList
        documents={documents}
        loading={loading}
        onDelete={handleDelete}
        onView={(doc) => setSelectedDoc(doc)}
      />

      {selectedDoc && (
        <DocumentIframeViewer
          document={selectedDoc}
          onClose={() => setSelectedDoc(null)}
        />
      )}
    </>
  );
}
