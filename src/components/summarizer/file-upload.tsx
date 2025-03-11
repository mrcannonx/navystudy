'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SUMMARIZER_CONFIG } from '@/config/summarizer';
import { withRetry, handleApiError, getUserFriendlyErrorMessage } from '@/lib/api/error-handling';

interface UploadStatus {
  taskId?: string;
  progress: number;
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
  result?: string;
}

interface FileUploadProps {
  format: 'bullets' | 'tldr' | 'qa';
  onComplete: (summary: string) => void;
  onError: (error: string) => void;
}

export function FileUpload({ format, onComplete, onError }: FileUploadProps) {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    progress: 0,
    status: 'idle'
  });

  const uploadFile = async (file: File) => {
    try {
      setUploadStatus(prev => ({ ...prev, status: 'uploading', progress: 0 }));

      const formData = new FormData();
      formData.append('file', file);
      formData.append('format', format);

      // Use retry mechanism for file upload
      const { taskId } = await withRetry(async () => {
        const response = await fetch('/api/v1/summarize', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw handleApiError(new Error(errorData?.error || `Upload failed with status ${response.status}`));
        }

        return response.json();
      }, {
        maxRetries: 3,
        initialDelay: 2000,
        maxDelay: 10000,
      });

      setUploadStatus(prev => ({
        ...prev,
        taskId,
        status: 'processing',
        progress: 25
      }));

      // Poll for task completion with retry mechanism
      const pollTaskStatus = async () => {
        const statusResponse = await fetch(`/api/v1/summarize?taskId=${taskId}`);
        
        if (!statusResponse.ok) {
          throw handleApiError(new Error('Failed to check task status'));
        }

        const task = await statusResponse.json();

        if (task.status === 'completed') {
          setUploadStatus(prev => ({
            ...prev,
            status: 'completed',
            progress: 100,
            result: task.result
          }));
          onComplete(task.result);
          return true;
        } else if (task.status === 'error') {
          throw handleApiError(new Error(task.error || 'Processing failed'));
        } else {
          setUploadStatus(prev => ({
            ...prev,
            progress: Math.min(90, prev.progress + 5)
          }));
          return false;
        }
      };

      // Poll with exponential backoff
      let pollAttempt = 0;
      const maxPollAttempts = 30; // 1 minute total (with exponential backoff)
      
      while (pollAttempt < maxPollAttempts) {
        try {
          const isComplete = await withRetry(pollTaskStatus, {
            maxRetries: 2,
            initialDelay: 1000,
            maxDelay: 5000,
          });
          
          if (isComplete) break;
          
          // Exponential backoff for polling
          await new Promise(resolve => setTimeout(resolve, Math.min(2000 * Math.pow(1.5, pollAttempt), 10000)));
          pollAttempt++;
        } catch (error) {
          console.error('Polling error:', error);
          throw error;
        }
      }

      if (pollAttempt >= maxPollAttempts) {
        throw new Error('Processing timed out. Please try again.');
      }

    } catch (error) {
      console.error('Upload/processing error:', error);
      const errorMessage = getUserFriendlyErrorMessage(error);
      setUploadStatus(prev => ({
        ...prev,
        status: 'error',
        error: errorMessage
      }));
      onError(errorMessage);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > SUMMARIZER_CONFIG.maxFileSize) {
        const errorMessage = `File size must be less than ${SUMMARIZER_CONFIG.maxFileSize / (1024 * 1024)}MB`;
        setUploadStatus(prev => ({
          ...prev,
          status: 'error',
          error: errorMessage
        }));
        onError(errorMessage);
        return;
      }
      uploadFile(file);
    }
  }, [format, onComplete, onError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/*': ['.txt', '.md'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}
          ${uploadStatus.status !== 'idle' ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the file here...</p>
        ) : (
          <p>Drag and drop a file here, or click to select a file</p>
        )}
        <p className="text-sm text-gray-500 mt-2">
          Supported formats: TXT, PDF, DOC, DOCX, MD (Max size: {SUMMARIZER_CONFIG.maxFileSize / (1024 * 1024)}MB)
        </p>
      </div>

      {uploadStatus.status !== 'idle' && (
        <div className="space-y-4">
          <Progress 
            value={uploadStatus.progress} 
            className="h-2"
          />
          <p className="text-sm text-center text-gray-500">
            {uploadStatus.status === 'uploading' && 'Uploading file...'}
            {uploadStatus.status === 'processing' && 'Processing file...'}
            {uploadStatus.status === 'completed' && 'Processing complete!'}
          </p>
        </div>
      )}

      {uploadStatus.error && (
        <Alert variant="destructive">
          <AlertDescription>{uploadStatus.error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
} 