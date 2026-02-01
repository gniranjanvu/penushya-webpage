import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Award, Plus, Edit, Trash2, Save, X, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Certification } from '../../types';

interface CertificationFormData {
  certificate_name: string;
  provider: string;
  issue_date: string;
  expiry_date?: string;
  certificate_image_url?: string;
  certificate_url?: string;
  display_order: number;
}

const CertificationManager: React.FC = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
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
  } = useForm<CertificationFormData>();

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setCertifications(data || []);
    } catch (error: any) {
      console.error('Error fetching certifications:', error);
      toast.error('Failed to load certifications');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (formData: CertificationFormData) => {
    try {
      setSubmitting(true);

      // Convert empty strings to null for optional fields
      const certificationData = {
        ...formData,
        expiry_date: formData.expiry_date || null,
        certificate_image_url: formData.certificate_image_url || null,
        certificate_url: formData.certificate_url || null,
      };

      if (editingId) {
        const { error } = await supabase
          .from('certifications')
          .update(certificationData)
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Certification updated successfully');
      } else {
        const { error } = await supabase
          .from('certifications')
          .insert([certificationData]);

        if (error) throw error;
        toast.success('Certification added successfully');
      }

      fetchCertifications();
      handleCancelForm();
    } catch (error: unknown) {
      console.error('Error saving certification:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save certification';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (cert: Certification) => {
    setEditingId(cert.id);
    setValue('certificate_name', cert.certificate_name);
    setValue('provider', cert.provider);
    setValue('issue_date', cert.issue_date);
    setValue('expiry_date', cert.expiry_date || '');
    setValue('certificate_image_url', cert.certificate_image_url || '');
    setValue('certificate_url', cert.certificate_url || '');
    setValue('display_order', cert.display_order);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certification?')) return;

    try {
      const { error } = await supabase
        .from('certifications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Certification deleted successfully');
      fetchCertifications();
    } catch (error: any) {
      console.error('Error deleting certification:', error);
      toast.error('Failed to delete certification');
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
      certificate_name: '',
      provider: '',
      issue_date: '',
      expiry_date: '',
      certificate_image_url: '',
      certificate_url: '',
      display_order: certifications.length + 1,
    });
    setShowForm(true);
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
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
          <Award className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Certification Manager
          </h2>
        </div>
        {!showForm && (
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Certification
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            {editingId ? 'Edit Certification' : 'Add New Certification'}
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Certificate Name *
                </label>
                <input
                  type="text"
                  {...register('certificate_name', { required: 'Certificate name is required' })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                {errors.certificate_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.certificate_name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Provider *
                </label>
                <input
                  type="text"
                  {...register('provider', { required: 'Provider is required' })}
                  placeholder="e.g., Coursera, Google, AWS"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                {errors.provider && (
                  <p className="text-red-500 text-sm mt-1">{errors.provider.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Issue Date *
                </label>
                <input
                  type="date"
                  {...register('issue_date', { required: 'Issue date is required' })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                {errors.issue_date && (
                  <p className="text-red-500 text-sm mt-1">{errors.issue_date.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expiry Date (optional)
                </label>
                <input
                  type="date"
                  {...register('expiry_date')}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Certificate Image URL
                </label>
                <input
                  type="url"
                  {...register('certificate_image_url')}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Verification URL
                </label>
                <input
                  type="url"
                  {...register('certificate_url')}
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
                {submitting ? 'Saving...' : 'Save Certification'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <Award className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No certifications found. Click "Add Certification" to create one.
            </p>
          </div>
        ) : (
          certifications.map((cert) => (
            <div
              key={cert.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {cert.certificate_image_url && (
                <div className="relative h-40 bg-gray-200 dark:bg-gray-700">
                  <img
                    src={cert.certificate_image_url}
                    alt={cert.certificate_name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  {cert.certificate_name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  by {cert.provider}
                </p>
                <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <p>Issued: {new Date(cert.issue_date).toLocaleDateString()}</p>
                  {cert.expiry_date && (
                    <p className={isExpired(cert.expiry_date) ? 'text-red-500' : ''}>
                      {isExpired(cert.expiry_date) ? 'Expired' : 'Expires'}: {new Date(cert.expiry_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  {cert.certificate_url ? (
                    <a
                      href={cert.certificate_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center gap-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Verify
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400">Order: {cert.display_order}</span>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(cert)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cert.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CertificationManager;
