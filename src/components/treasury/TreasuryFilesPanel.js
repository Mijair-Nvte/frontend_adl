"use client";
import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  uploadTreasuryFile,
  getTreasuryFiles,
  deleteTreasuryFile,
} from "@/services/treasury/treasuryService";
import { FaTrashAlt, FaFileUpload, FaTimes } from "react-icons/fa";
import { Download, FileText, File, FileArchive, FileType2 } from "lucide-react";
import { getStorageUrl } from "@/helpers/getStorageUrl";

// Detecta tipos de archivo
const isImage = (fileType) => /image\/(jpg|jpeg|png|gif|webp)/.test(fileType);
const isPdf = (fileType) => fileType === "application/pdf";
const isText = (fileType) => /text\/.*/.test(fileType);
const isZip = (fileType) => /zip|rar|tar|gz/.test(fileType);

// Elige el ícono/preview correcto
function FileThumb({ file, onClick }) {
  if (isImage(file.file_type)) {
    return (
      <Image
        src={getStorageUrl(file)}
        alt={file.original_name}
        fill
        sizes="48px"
        className="object-cover rounded"
      />
    );
  }
  if (isPdf(file.file_type)) {
    return (
      <div
        className="w-12 h-12 flex items-center justify-center rounded border bg-red-50 text-red-500 cursor-pointer hover:scale-105 transition"
        title="Ver PDF"
        onClick={onClick}
      >
        <FileType2 className="w-8 h-8 text-red-500" />
      </div>
    );
  }
  if (isText(file.file_type)) {
    return (
      <div
        className="w-12 h-12 flex items-center justify-center rounded border bg-blue-50 text-blue-400"
        title="Archivo de texto"
      >
        <FileText className="w-7 h-7" />
      </div>
    );
  }
  if (isZip(file.file_type)) {
    return (
      <div
        className="w-12 h-12 flex items-center justify-center rounded border bg-yellow-50 text-yellow-500"
        title="Archivo comprimido"
      >
        <FileArchive className="w-7 h-7" />
      </div>
    );
  }
  // Default genérico
  return (
    <div
      className="w-12 h-12 flex items-center justify-center rounded border bg-gray-100 text-gray-400"
      title="Archivo"
    >
      <File className="w-7 h-7" />
    </div>
  );
}

export default function TreasuryFilesPanel({ movementId }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  // Cargar archivos al montar
  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const filesList = await getTreasuryFiles(movementId);
      setFiles(filesList || []);
    } catch {
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, [movementId]);

  useEffect(() => {
    if (movementId) fetchFiles();
  }, [movementId, fetchFiles]);

  // Cierra modal con Esc
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setPreview(null);
    };
    if (preview) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [preview]);

  // Subir archivo
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      await uploadTreasuryFile({ movementId, file });
      fetchFiles();
    } catch {
      alert("❌ Error al subir archivo");
    }
    setUploading(false);
    e.target.value = "";
  };

  // Eliminar archivo
  const handleDelete = async (fileId) => {
    if (!confirm("¿Seguro que deseas eliminar este archivo?")) return;
    try {
      await deleteTreasuryFile(fileId);
      fetchFiles();
    } catch {
      alert("❌ Error al eliminar archivo");
    }
  };

  // Previsualización modal
  const renderPreview = () => {
    if (!preview) return null;

    // Imagen
    if (isImage(preview.file_type)) {
      return (
        <Image
          src={getStorageUrl(preview)}
          alt={preview.original_name}
          fill
          sizes="(max-width: 768px) 100vw, 700px"
          className="object-contain rounded-xl border shadow-lg"
        />
      );
    }

    // PDF
    if (isPdf(preview.file_type)) {
      return (
        <iframe
          src={getStorageUrl(preview)}
          title={preview.original_name}
          className="w-full h-[60vh] rounded-xl border bg-white"
        />
      );
    }

    // Otro tipo de archivo
    return (
      <div className="text-center w-full">
        <div className="mb-4 text-gray-500">
          No se puede previsualizar este tipo de archivo.
        </div>
        <a
          href={getStorageUrl(preview)}
          download={preview.original_name}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50 transition"
          title="Descargar"
        >
          <Download className="w-5 h-5" />
          <span className="hidden sm:inline">Descargar</span>
        </a>
      </div>
    );
  };

  return (
    <div className="space-y-6 mt-8">
      {/* Subir archivo */}
      <div className="flex items-center gap-4">
        <label className="cursor-pointer flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          <FaFileUpload />
          {uploading ? "Subiendo..." : "Subir comprobante"}
          <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      {/* Lista de archivos */}
      {loading ? (
        <p className="text-gray-500">Cargando archivos...</p>
      ) : files.length === 0 ? (
        <div className="p-3 text-sm text-gray-500 border rounded bg-gray-50">
          No hay archivos adjuntos.
        </div>
      ) : (
        <ul className="divide-y divide-gray-100 rounded border bg-white">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex items-center gap-3 px-4 py-3 group hover:bg-gray-50 transition"
            >
              {/* Thumbnail dependiente de tipo */}
              <FileThumb file={file} onClick={() => setPreview(file)} />

              {/* Nombre del archivo */}
              <button
                className="text-blue-600 underline text-left font-medium truncate max-w-[200px] sm:max-w-[320px]"
                onClick={() => setPreview(file)}
                title="Previsualizar"
              >
                {file.original_name}
              </button>
              <span className="text-xs text-gray-500 ml-1">{file.file_type}</span>

              {/* Acciones: Descargar + Eliminar alineados a la derecha */}
              <div className="flex items-center gap-1 ml-auto">
                <a
                  href={getStorageUrl(file)}
                  download={file.original_name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50 transition"
                  title="Descargar"
                >
                  <Download className="w-5 h-5" />
                </a>
                <button
                  className="text-red-500 hover:text-red-700 px-2 py-1"
                  onClick={() => handleDelete(file.id)}
                  title="Eliminar"
                >
                  <FaTrashAlt size={19} />
                </button>
              </div>

            </li>
          ))}
        </ul>
      )}

      {/* Modal de previsualización */}
      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all"
          onClick={() => setPreview(null)}
          tabIndex={-1}
          aria-modal="true"
          role="dialog"
          style={{ animation: "fadeIn .2s" }}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-2 sm:p-6 flex flex-col items-center animate-fadeIn"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 bg-white rounded-full p-1 transition"
              onClick={() => setPreview(null)}
              title="Cerrar"
            >
              <FaTimes size={22} />
            </button>
            <h3 className="text-lg font-semibold mb-2 sm:mb-4 text-center break-words">
              {preview.original_name}
            </h3>
            <div className="w-full h-[60vh] flex items-center justify-center border rounded-xl bg-gray-50 overflow-auto">
              {renderPreview()}
            </div>
          </div>
          <style jsx>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: scale(.97);}
              to { opacity: 1; transform: scale(1);}
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
