import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FileText, Upload, Download, Trash2, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Resume } from '../../types';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ResumeManager: React.FC = () => {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('resume')
        .select('*')
        .order('uploaded_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "not found" error
        throw error;
      }
      
      setResume(data || null);
    } catch (error: unknown) {
      console.error('Error fetching resume:', error);
      // Don't show error if no resume exists yet
      if (error && typeof error === 'object' && 'code' in error && error.code !== 'PGRST116') {
        toast.error('Failed to load resume');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      toast.error('Please select a PDF file');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    try {
      setUploading(true);

      // Upload to Supabase Storage
      const fileName = `resume-${Date.now()}.pdf`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('resumes')
        .getPublicUrl(uploadData.path);

      // Delete old resume from storage if exists
      if (resume) {
        const oldFileName = resume.file_url.split('/').pop();
        if (oldFileName) {
          await supabase.storage.from('resumes').remove([oldFileName]);
        }

        // Delete old resume record from database
        await supabase.from('resume').delete().eq('id', resume.id);
      }

      // Save resume record to database
      const { error: dbError } = await supabase.from('resume').insert([
        {
          file_url: urlData.publicUrl,
          filename: selectedFile.name,
        },
      ]);

      if (dbError) throw dbError;

      toast.success('Resume uploaded successfully');
      setSelectedFile(null);
      fetchResume();

      // Reset file input
      const fileInput = document.getElementById('resume-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error: unknown) {
      console.error('Error uploading resume:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload resume';
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!resume) return;
    if (!confirm('Are you sure you want to delete the current resume?')) return;

    try {
      setLoading(true);

      // Delete from storage
      const fileName = resume.file_url.split('/').pop();
      if (fileName) {
        const { error: storageError } = await supabase.storage
          .from('resumes')
          .remove([fileName]);

        if (storageError) throw storageError;
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('resume')
        .delete()
        .eq('id', resume.id);

      if (dbError) throw dbError;

      toast.success('Resume deleted successfully');
      setResume(null);
    } catch (error: unknown) {
      console.error('Error deleting resume:', error);
      toast.error('Failed to delete resume');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!resume) return;
    window.open(resume.file_url, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <FileText className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Resume Manager
        </h2>
      </div>

      {/* Current Resume */}
      {resume && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Current Resume
          </h3>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <FileText className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {resume.filename}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Uploaded on {new Date(resume.uploaded_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload New Resume */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {resume ? 'Upload New Resume' : 'Upload Resume'}
        </h3>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="resume-file"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Select PDF File (Max 5MB)
            </label>
            <input
              id="resume-file"
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-400"
            />
          </div>

          {selectedFile && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-5 h-5" />
              {uploading ? 'Uploading...' : 'Upload Resume'}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
            Guidelines:
          </h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <li>Only PDF files are accepted</li>
            <li>Maximum file size is 5MB</li>
            <li>Uploading a new resume will replace the existing one</li>
            <li>The resume will be publicly accessible for download</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResumeManager;
