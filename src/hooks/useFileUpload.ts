import { useState, useCallback, useRef } from 'react';
import useNotification from './useNotification';

export type FileStatus = 'idle' | 'uploading' | 'success' | 'error';

export interface FileValidation {
  maxSize?: number;
  allowedTypes?: string[];
  maxFiles?: number;
  minFiles?: number;
  customValidation?: (file: File) => boolean | string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadedFile {
  id: string;
  file: File;
  url?: string;
  status: FileStatus;
  progress: UploadProgress;
  error?: string;
}

export interface UseFileUploadOptions {
  validation?: FileValidation;
  autoUpload?: boolean;
  multiple?: boolean;
  onUploadStart?: (files: File[]) => void;
  onUploadProgress?: (progress: UploadProgress, file: File) => void;
  onUploadSuccess?: (response: any, file: File) => void;
  onUploadError?: (error: Error, file: File) => void;
  onValidationError?: (error: string, file: File) => void;
}

export interface UseFileUploadReturn {
  files: UploadedFile[];
  uploadFiles: (files: FileList | File[]) => Promise<void>;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  isUploading: boolean;
  uploadProgress: number;
  cancelUpload: (id: string) => void;
  retryUpload: (id: string) => Promise<void>;
  getInputProps: () => {
    accept?: string;
    multiple?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
}

const generateFileId = () => `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const useFileUpload = (
  uploadFn: (file: File, onProgress?: (progress: UploadProgress) => void) => Promise<any>,
  options: UseFileUploadOptions = {}
): UseFileUploadReturn => {
  const {
    validation = {},
    autoUpload = true,
    multiple = false,
    onUploadStart,
    onUploadProgress,
    onUploadSuccess,
    onUploadError,
    onValidationError,
  } = options;

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const abortControllers = useRef<Map<string, AbortController>>(new Map());
  const notification = useNotification();

  const validateFile = (file: File): string | null => {
    const {
      maxSize,
      allowedTypes,
      customValidation
    } = validation;

    if (maxSize && file.size > maxSize) {
      return `File size exceeds ${maxSize / (1024 * 1024)}MB limit`;
    }

    if (allowedTypes && !allowedTypes.includes(file.type)) {
      return `File type ${file.type} is not allowed`;
    }

    if (customValidation) {
      const result = customValidation(file);
      if (typeof result === 'string') {
        return result;
      }
      if (!result) {
        return 'File validation failed';
      }
    }

    return null;
  };

  const validateFiles = (newFiles: File[]): File[] => {
    const { maxFiles, minFiles } = validation;
    const totalFiles = files.length + newFiles.length;

    if (maxFiles && totalFiles > maxFiles) {
      throw new Error(`Maximum ${maxFiles} files allowed`);
    }

    if (minFiles && totalFiles < minFiles) {
      throw new Error(`Minimum ${minFiles} files required`);
    }

    return newFiles.filter(file => {
      const error = validateFile(file);
      if (error) {
        onValidationError?.(error, file);
        notification.error(`Validation failed for ${file.name}: ${error}`);
        return false;
      }
      return true;
    });
  };

  const uploadFile = async (uploadedFile: UploadedFile): Promise<void> => {
    const controller = new AbortController();
    abortControllers.current.set(uploadedFile.id, controller);

    try {
      setFiles(prev =>
        prev.map(f =>
          f.id === uploadedFile.id
            ? { ...f, status: 'uploading' }
            : f
        )
      );

      const onProgress = (progress: UploadProgress) => {
        setFiles(prev =>
          prev.map(f =>
            f.id === uploadedFile.id
              ? { ...f, progress }
              : f
          )
        );
        onUploadProgress?.(progress, uploadedFile.file);
      };

      const response = await uploadFn(uploadedFile.file, onProgress);

      setFiles(prev =>
        prev.map(f =>
          f.id === uploadedFile.id
            ? { ...f, status: 'success', url: response.url }
            : f
        )
      );

      onUploadSuccess?.(response, uploadedFile.file);
      notification.success(`Successfully uploaded ${uploadedFile.file.name}`);
    } catch (err) {
      const error = err as Error;
      if (error.name === 'AbortError') {
        setFiles(prev =>
          prev.map(f =>
            f.id === uploadedFile.id
              ? { ...f, status: 'idle', progress: { loaded: 0, total: 0, percentage: 0 } }
              : f
          )
        );
        return;
      }

      const errorMessage = error.message || 'Upload failed';
      setFiles(prev =>
        prev.map(f =>
          f.id === uploadedFile.id
            ? { ...f, status: 'error', error: errorMessage }
            : f
        )
      );

      onUploadError?.(error, uploadedFile.file);
      notification.error(`Failed to upload ${uploadedFile.file.name}: ${errorMessage}`);
    } finally {
      abortControllers.current.delete(uploadedFile.id);
    }
  };

  const uploadFiles = useCallback(async (fileList: FileList | File[]) => {
    const newFiles = Array.from(fileList);
    
    try {
      const validFiles = validateFiles(newFiles);
      if (validFiles.length === 0) return;

      onUploadStart?.(validFiles);

      const uploadedFiles: UploadedFile[] = validFiles.map(file => ({
        id: generateFileId(),
        file,
        status: 'idle',
        progress: { loaded: 0, total: file.size, percentage: 0 },
      }));

      setFiles(prev => [...prev, ...uploadedFiles]);
      setIsUploading(true);

      if (autoUpload) {
        await Promise.all(uploadedFiles.map(uploadFile));
      }
    } catch (err) {
      const error = err as Error;
      notification.error(error.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  }, [autoUpload, validateFiles, onUploadStart, notification]);

  const removeFile = useCallback((id: string) => {
    cancelUpload(id);
    setFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const clearFiles = useCallback(() => {
    abortControllers.current.forEach(controller => controller.abort());
    abortControllers.current.clear();
    setFiles([]);
  }, []);

  const cancelUpload = useCallback((id: string) => {
    const controller = abortControllers.current.get(id);
    if (controller) {
      controller.abort();
      abortControllers.current.delete(id);
    }
  }, []);

  const retryUpload = useCallback(async (id: string) => {
    const file = files.find(f => f.id === id);
    if (file) {
      await uploadFile(file);
    }
  }, [files]);

  const getInputProps = useCallback(() => ({
    accept: options.validation?.allowedTypes?.join(','),
    multiple: options.multiple,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        uploadFiles(e.target.files);
        e.target.value = ''; // Reset input
      }
    },
  }), [options.validation?.allowedTypes, options.multiple, uploadFiles]);

  const uploadProgress = files.length
    ? files.reduce((acc, file) => acc + file.progress.percentage, 0) / files.length
    : 0;

  return {
    files,
    uploadFiles,
    removeFile,
    clearFiles,
    isUploading,
    uploadProgress,
    cancelUpload,
    retryUpload,
    getInputProps,
  };
};

export default useFileUpload;
