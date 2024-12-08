import { useState } from 'react';
import { formatFileSize } from '../utils/formatters';

interface UseFileUploadReturn {
  file: File | null;
  fileUrl: string | null;
  error: string | null;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  resetFile: () => void;
}

export function useFileUpload(maxSizeMB = 10): UseFileUploadReturn {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    setFile(selectedFile);
    setFileUrl(URL.createObjectURL(selectedFile));
    setError(null);
  };

  const resetFile = () => {
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    setFile(null);
    setFileUrl(null);
    setError(null);
  };

  return { file, fileUrl, error, handleFileChange, resetFile };
}