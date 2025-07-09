'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  getDocumentsByCaseId,
  getDocumentsByTaskId,
  uploadDocument,
  deleteDocument,
} from '@/services/documents/documentService';
import UploadDocumentButton from './UploadDocumentButton';
import DocumentsList from './DocumentsList';
import DocumentIframeViewer from './DocumentIframeViewer';

export default function DocumentLinkedList({ caseId = null, taskId = null }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const isCase = Boolean(caseId);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      console.log('📦 caseId:', caseId, 'taskId:', taskId); // 👈 log adicional
      const docs = isCase
        ? await getDocumentsByCaseId(caseId)
        : await getDocumentsByTaskId(taskId);
      setDocuments(docs);
    } catch (err) {
      console.error('❌ Error al obtener documentos:', err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, [caseId, taskId, isCase]);


  useEffect(() => {
    if (caseId || taskId) fetchDocuments();
  }, [fetchDocuments]);

  const handleUpload = async (file) => {
    setUploading(true);
    try {
      await uploadDocument(file, setProgress, { caseId, taskId });
      await fetchDocuments(); // recarga los documentos
    } catch (err) {
      alert('❌ Error al subir documento');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDelete = async (docId) => {
    if (!confirm('¿Eliminar este documento?')) return;
    try {
      await deleteDocument(docId);
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
    } catch (err) {
      alert('❌ Error al eliminar documento');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-700">
          Documentos {isCase ? 'del proyecto' : 'de la tarea'}
        </h3>
        <UploadDocumentButton
          onUpload={handleUpload}
          uploading={uploading}
        />
      </div>

      {uploading && progress > 0 && (
        <div className="text-sm text-gray-600 mb-2">
          Subiendo: {progress}%
        </div>
      )}

      <DocumentsList
        documents={documents}
        loading={loading}
        onDelete={handleDelete}
        onView={(doc) => setSelectedDoc(doc)} // 👈 ahora usa el visor
      />

      {selectedDoc && (
        <DocumentIframeViewer
          document={selectedDoc}
          onClose={() => setSelectedDoc(null)}
        />
      )}
    </div>
  );
}
