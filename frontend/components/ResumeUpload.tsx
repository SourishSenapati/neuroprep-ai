'use client';

import React, { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { fetchResumeParser, APIError } from '@/lib/apiClient';

interface ResumeUploadProps {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  className?: string;
}

type LoadingStage = 'Uploading...' | 'Reading PDF...' | 'Extracting Skills...' | 'Parsing locally...';

export default function ResumeUpload({ onSuccess, onError, className = '' }: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStage, setUploadStage] = useState<LoadingStage>('Uploading...');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any | null>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');

    if (pdfFile) {
      handleFileUpload(pdfFile);
    } else {
      toast.error('Please upload a PDF file', {
        icon: '📄',
        style: {
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)'
        }
      });
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Only PDF files are supported', {
          icon: '⚠️',
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)'
          }
        });
        return;
      }
      handleFileUpload(file);
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsUploading(true);
    setParsedData(null);

    // Show upload toast
    const uploadToastId = toast.loading('Uploading resume...', {
      style: {
        background: '#1a1a1a',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.1)'
      }
    });

    try {
      const result = await fetchResumeParser(file, (stage) => {
        setUploadStage(stage as LoadingStage);
        // Update toast with current stage
        toast.loading(stage, {
          id: uploadToastId,
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)'
          }
        });
      });

      // Success!
      setParsedData(result.data);
      setIsUploading(false);

      // Dismiss loading toast
      toast.dismiss(uploadToastId);

      // Show success toast
      toast.success('Resume Analyzed! Profile Updated.', {
        icon: '✅',
        duration: 4000,
        style: {
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid rgba(34, 197, 94, 0.3)'
        }
      });

      // Call success callback
      if (onSuccess) {
        onSuccess(result.data);
      }

    } catch (error: any) {
      setIsUploading(false);
      
      // Dismiss loading toast
      toast.dismiss(uploadToastId);

      // Determine error message
      const errorMessage = error instanceof APIError 
        ? error.message 
        : 'Failed to parse resume. Please try again.';

      // Show error toast with specific message
      toast.error(errorMessage, {
        icon: '❌',
        duration: 5000,
        style: {
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid rgba(239, 68, 68, 0.3)'
        }
      });

      // Call error callback
      if (onError) {
        onError(error);
      }
    }
  };

  const handleRemove = () => {
    setUploadedFile(null);
    setParsedData(null);
  };

  return (
    <div className={className}>
      {!parsedData ? (
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed transition-all cursor-pointer
            ${isDragging 
              ? 'border-white bg-white/10' 
              : isUploading
              ? 'border-blue-500/50 bg-blue-500/5'
              : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
            }
          `}
        >
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileInput}
            disabled={isUploading}
            className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
            id="resume-upload"
          />

          <div className="p-8 md:p-12 text-center">
            <AnimatePresence mode="wait">
              {isUploading ? (
                <motion.div
                  key="uploading"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                    <div>
                      <p className="text-lg font-bold uppercase mb-2">
                        {uploadStage}
                      </p>
                      {uploadedFile && (
                        <p className="text-sm text-gray-500">
                          {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(0)} KB)
                        </p>
                      )}
                    </div>
                    {/* Progress Animation */}
                    <div className="w-64 h-1 bg-white/10 overflow-hidden">
                      <motion.div
                        className="h-full bg-blue-500"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity }}
                      />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                  <h3 className="text-lg font-bold uppercase mb-2">
                    Upload Resume (PDF)
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Drag & drop or click to browse
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-600">
                    <span>✓ Auto-fill profile</span>
                    <span>•</span>
                    <span>✓ Extract skills</span>
                    <span>•</span>
                    <span>✓ Detect role</span>
                  </div>
                  <p className="mt-4 text-xs text-gray-700">
                    Maximum file size: 5MB
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-green-500/30 bg-green-500/5 p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h4 className="font-bold uppercase text-sm">Resume Analyzed</h4>
                <p className="text-xs text-gray-500">
                  {uploadedFile?.name}
                </p>
              </div>
            </div>
            <button
              onClick={handleRemove}
              className="p-2 hover:bg-white/10 transition-colors"
              title="Remove"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Name:</span>
              <p className="font-mono">{parsedData.name || 'Not detected'}</p>
            </div>
            <div>
              <span className="text-gray-500">Email:</span>
              <p className="font-mono text-xs">{parsedData.email || 'Not detected'}</p>
            </div>
            <div>
              <span className="text-gray-500">Role:</span>
              <p className="font-mono">{parsedData.role || 'Not detected'}</p>
            </div>
            <div>
              <span className="text-gray-500">Experience:</span>
              <p className="font-mono">{parsedData.experienceLevel || 'Not detected'}</p>
            </div>
          </div>

          {parsedData.skills && parsedData.skills.length > 0 && (
            <div className="mt-4">
              <span className="text-gray-500 text-sm">Skills:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {parsedData.skills.slice(0, 10).map((skill: string, i: number) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-white/10 border border-white/10 text-xs font-mono"
                  >
                    {skill}
                  </span>
                ))}
                {parsedData.skills.length > 10 && (
                  <span className="px-2 py-1 text-xs text-gray-500">
                    +{parsedData.skills.length - 10} more
                  </span>
                )}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
