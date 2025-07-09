'use client';

import { useRef } from 'react';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
export default function FileUpload({
  value,
  onChange,
  accept = '*',
  preview = true,
  height = 'h-48',
  label = 'Haz clic para subir o arrastra y suelta',
  description = 'Archivos permitidos: PDF, PNG, JPG, etc.',
}) {
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) onChange(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) onChange(file);
  };

  const isImage = (file) =>
    typeof file === 'object' && file?.type?.startsWith('image');

  return (
    <div
      onClick={() => fileInputRef.current.click()}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className={`w-full ${height} flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 text-gray-600 transition`}
    >
      {preview && value && isImage(value) && (
        <div className="relative w-full h-full">
          <Image
            src={URL.createObjectURL(value)}
            alt="Preview"
            fill
            className="object-cover rounded-md"
            sizes="100vw"
          />
        </div>

      )}

      {preview && value && typeof value === 'string' && value.includes('http') && (
        <div className="relative w-full h-full">
          <Image
            src={value}
            alt="Preview"
            fill
            className="object-cover rounded-md"
            sizes="100vw"
          />
        </div>

      )}

      {!value && (
        <div className="flex flex-col items-center text-center px-4">
          <CloudArrowUpIcon className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm font-medium text-blue-600">{label}</p>
          <p className="text-xs text-gray-400 mt-1">{description}</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
