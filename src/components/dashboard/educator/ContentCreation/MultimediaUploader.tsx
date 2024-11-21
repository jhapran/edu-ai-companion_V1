import { type FC, useState, useRef, type ChangeEvent, type DragEvent } from 'react';
import Button from '../../../ui/Button';
import Card from '../../../ui/Card';
import Progress from '../../../ui/Progress';
import Alert from '../../../ui/Alert';

interface FileWithPreview extends File {
  preview?: string;
}

interface MultimediaUploaderProps {
  onUpload: (files: File[]) => void;
  maxFileSize?: number; // in MB
  acceptedFileTypes?: string[];
  maxFiles?: number;
}

const MultimediaUploader: FC<MultimediaUploaderProps> = ({
  onUpload,
  maxFileSize = 10, // Default 10MB
  acceptedFileTypes = ['image/*', 'video/*', 'audio/*', 'application/pdf'],
  maxFiles = 5,
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      setError(`File size exceeds ${maxFileSize}MB limit`);
      return false;
    }

    // Check file type
    const fileType = file.type;
    const isValidType = acceptedFileTypes.some(type => {
      if (type.endsWith('/*')) {
        return fileType.startsWith(type.replace('/*', ''));
      }
      return type === fileType;
    });

    if (!isValidType) {
      setError('File type not supported');
      return false;
    }

    return true;
  };

  const createPreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        // For non-image files, use type-specific icons
        const iconMap: { [key: string]: string } = {
          'video/': '🎥',
          'audio/': '🎵',
          'application/pdf': '📄',
        };
        
        const icon = Object.entries(iconMap).find(([key]) => file.type.startsWith(key))?.[1] || '📁';
        resolve(`data:text/plain;charset=UTF-8,${icon}`);
      }
    });
  };

  const handleFiles = async (newFiles: FileList | File[]) => {
    if (files.length + newFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const validFiles: FileWithPreview[] = [];
    setError(null);

    for (const file of newFiles) {
      if (validateFile(file)) {
        const preview = await createPreview(file);
        validFiles.push(Object.assign(file, { preview }));
      }
    }

    setFiles(prev => [...prev, ...validFiles]);
  };

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    await handleFiles(droppedFiles);
  };

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await handleFiles(e.target.files);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (files.length === 0) {
      setError('Please select files to upload');
      return;
    }

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        onUpload(files);
        setFiles([]);
        setUploadProgress(0);
      }
    }, 200);
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card>
        <div
          className={`
            p-8 border-2 border-dashed rounded-lg text-center
            ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}
            transition-colors duration-200
          `}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="text-gray-600">
              <p className="text-lg font-medium">
                Drag and drop your files here
              </p>
              <p className="text-sm">
                or click to select files
              </p>
            </div>

            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="secondary"
            >
              Select Files
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              multiple
              accept={acceptedFileTypes.join(',')}
              onChange={handleFileSelect}
            />

            <div className="text-xs text-gray-500">
              <p>Maximum file size: {maxFileSize}MB</p>
              <p>Accepted file types: Images, Videos, Audio, PDF</p>
              <p>Maximum files: {maxFiles}</p>
            </div>
          </div>
        </div>
      </Card>

      {files.length > 0 && (
        <Card title="Selected Files">
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="relative group border rounded-lg p-2 hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span className="sr-only">Remove</span>
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100">
                    {file.type.startsWith('image/') ? (
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center text-4xl">
                        {file.preview}
                      </div>
                    )}
                  </div>

                  <p className="mt-2 text-xs text-gray-500 truncate">
                    {file.name}
                  </p>
                </div>
              ))}
            </div>

            {uploadProgress > 0 && (
              <Progress
                value={uploadProgress}
                max={100}
                size="md"
                variant="primary"
                showValue
              />
            )}

            <div className="flex justify-end">
              <Button onClick={handleUpload}>
                Upload Files
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default MultimediaUploader;
