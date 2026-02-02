import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { BookOpen, Plus, Edit, Trash2, Save, X, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Publication } from '../../types';

interface PublicationFormData {
  title: string;
  authors: string;
  publication_venue?: string;
  publication_date?: string;
  abstract?: string;
  url?: string;
  display_order: number;
}

const PublicationManager: React.FC = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<PublicationFormData>();

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('publications')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setPublications(data || []);
    } catch (error: any) {
      console.error('Error fetching publications:', error);
      toast.error('Failed to load publications');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (formData: PublicationFormData) => {
    try {
      setSubmitting(true);

      // Convert empty strings to null for optional fields
      // Ensure publication_date is in YYYY-MM-DD format or null
      const publicationData = {
        ...formData,
        publication_venue: formData.publication_venue?.trim() || null,
        publication_date: formData.publication_date?.trim() || null,
        abstract: formData.abstract?.trim() || null,
        url: formData.url?.trim() || null,
      };

      if (editingId) {
        const { error } = await supabase
          .from('publications')
          .update(publicationData)
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Publication updated successfully');
      } else {
        const { error } = await supabase
          .from('publications')
          .insert([publicationData]);

        if (error) throw error;
        toast.success('Publication added successfully');
      }

      fetchPublications();
      handleCancelForm();
    } catch (error: unknown) {
      console.error('Error saving publication:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save publication';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (pub: Publication) => {
    setEditingId(pub.id);
    setValue('title', pub.title);
    setValue('authors', pub.authors);
    setValue('publication_venue', pub.publication_venue || '');
    setValue('publication_date', pub.publication_date || '');
    setValue('abstract', pub.abstract || '');
    setValue('url', pub.url || '');
    setValue('display_order', pub.display_order);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this publication?')) return;

    try {
      const { error } = await supabase
        .from('publications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Publication deleted successfully');
      fetchPublications();
    } catch (error: any) {
      console.error('Error deleting publication:', error);
      toast.error('Failed to delete publication');
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    reset();
  };

  const handleAddNew = () => {
    setEditingId(null);
    reset({
      title: '',
      authors: '',
      publication_venue: '',
      publication_date: '',
      abstract: '',
      url: '',
      display_order: publications.length + 1,
    });
    setShowForm(true);
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Publication Manager
          </h2>
        </div>
        {!showForm && (
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Publication
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            {editingId ? 'Edit Publication' : 'Add New Publication'}
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  {...register('title', { required: 'Title is required' })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Authors *
                </label>
                <input
                  type="text"
                  {...register('authors', { required: 'Authors are required' })}
                  placeholder="e.g., John Doe, Jane Smith, et al."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                {errors.authors && (
                  <p className="text-red-500 text-sm mt-1">{errors.authors.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Publication Venue
                </label>
                <input
                  type="text"
                  {...register('publication_venue')}
                  placeholder="e.g., IEEE Conference, Journal Name"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Publication Date
                </label>
                <input
                  type="date"
                  {...register('publication_date')}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  URL / DOI
                </label>
                <input
                  type="url"
                  {...register('url')}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Display Order *
                </label>
                <input
                  type="number"
                  {...register('display_order', { required: 'Display order is required', valueAsNumber: true })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                {errors.display_order && (
                  <p className="text-red-500 text-sm mt-1">{errors.display_order.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Abstract
                </label>
                <textarea
                  {...register('abstract')}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter the abstract of your publication..."
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={handleCancelForm}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 inline mr-2" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {submitting ? 'Saving...' : 'Save Publication'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List View */}
      <div className="space-y-4">
        {publications.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No publications found. Click "Add Publication" to create one.
            </p>
          </div>
        ) : (
          publications.map((pub) => (
            <div
              key={pub.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {pub.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {pub.authors}
                      </p>
                    </div>
                  </div>
                  <div className="ml-8 space-y-2">
                    {pub.publication_venue && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-medium">Venue:</span> {pub.publication_venue}
                      </p>
                    )}
                    {pub.publication_date && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-medium">Date:</span>{' '}
                        {new Date(pub.publication_date).toLocaleDateString()}
                      </p>
                    )}
                    {pub.abstract && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {pub.abstract}
                      </p>
                    )}
                    {pub.url && (
                      <a
                        href={pub.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Publication
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-8 md:ml-0">
                  <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                    Order: {pub.display_order}
                  </span>
                  <button
                    onClick={() => handleEdit(pub)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(pub.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PublicationManager;
