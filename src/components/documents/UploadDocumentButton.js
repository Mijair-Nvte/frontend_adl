'use client';

import { useRef } from 'react';
import { UploadCloud } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function UploadDocumentButton({ onUpload, uploading, caseId = null,
  taskId = null, }) {
  const fileInputRef = useRef();

  const handleClick = () => {
    if (!uploading) fileInputRef.current.click();
  };

  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    if (file && onUpload) {
      await onUpload(file);
    }
  };

  return (
    <>
       <Button
        onClick={handleClick}
        disabled={uploading}
        loading={uploading}
        icon={UploadCloud}
        iconPosition="left"
        variant="primary"
        size="md"
      >
        Subir archivo
      </Button>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleChange}
        accept="*/*"
      />
    </>
  );
}
