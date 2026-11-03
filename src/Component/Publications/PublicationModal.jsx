import React, { useState, useEffect, useRef } from 'react';
import { X, Check, Upload, Loader2 } from 'lucide-react';

const PublicationModal = ({ isOpen, onClose, onSave, editingPub }) => {
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    edition: '2025 Edition',
    sectionNumber: '01',
    year: '2025',
    pages: 150,
    fileSize: '50 MB',
    pdfUrl: '',
    publisher: 'Alumni Association, Government College of Architecture Lucknow (GCAAA)',
    description: '',
    highlightsText: '',
    coverImg: '',
    imagePreview: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (editingPub) {
      setFormData({
        title: editingPub.title || '',
        tagline: editingPub.tagline || '',
        edition: editingPub.edition || '',
        sectionNumber: editingPub.sectionNumber || '01',
        year: editingPub.year || '2025',
        pages: editingPub.pages || 0,
        fileSize: editingPub.fileSize || '',
        pdfUrl: editingPub.pdfUrl || '',
        publisher: editingPub.publisher || 'Alumni Association, Government College of Architecture Lucknow (GCAAA)',
        description: editingPub.description || '',
        highlightsText: Array.isArray(editingPub.highlights) ? editingPub.highlights.join('\n') : '',
        coverImg: editingPub.coverImg || '',
        imagePreview: editingPub.coverImg || '',
      });
    } else {
      setFormData({
        title: '',
        tagline: '',
        edition: '2026 Edition',
        sectionNumber: '04',
        year: '2026',
        pages: 120,
        fileSize: '40 MB',
        pdfUrl: '',
        publisher: 'Alumni Association, Government College of Architecture Lucknow (GCAAA)',
        description: '',
        highlightsText: '',
        coverImg: '',
        imagePreview: '',
      });
    }
    setErrorMsg('');
  }, [editingPub, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('Cover image file size must be less than 10MB.');
      return;
    }

    setErrorMsg('');
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        coverImg: reader.result,
        imagePreview: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMsg('Publication Title is required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const highlights = formData.highlightsText
        .split('\n')
        .map((h) => h.trim())
        .filter(Boolean);

      await onSave({
        ...formData,
        highlights,
        pages: Number(formData.pages) || 0,
      });
      onClose();
    } catch (err) {
      setErrorMsg(err.friendlyMessage || err.message || 'Failed to save publication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl transition-all animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-gray-900">
              {editingPub ? 'Edit Publication' : 'Add New Publication'}
            </h3>
            <p className="text-xs text-gray-500">
              Manage souvenir editions, yearbooks, and architectural publications
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Title & Tagline */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Publication Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Dharohar '26 Souvenir & Directory"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Tagline / Subtitle
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="e.g. Tying knots between the past and the future"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
            />
          </div>

          {/* Grid 1: Edition, Section, Year, Pages */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Edition Label
              </label>
              <input
                type="text"
                value={formData.edition}
                onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                placeholder="2025 Edition"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Section No.
              </label>
              <input
                type="text"
                value={formData.sectionNumber}
                onChange={(e) => setFormData({ ...formData, sectionNumber: e.target.value })}
                placeholder="01"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Year
              </label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="2025"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Total Pages
              </label>
              <input
                type="number"
                min="0"
                value={formData.pages}
                onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                placeholder="168"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
              />
            </div>
          </div>

          {/* PDF Link & File Size */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                PDF File Link / URL
              </label>
              <input
                type="text"
                value={formData.pdfUrl}
                onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                placeholder="/publications/dharohar_2025.pdf or https://..."
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                File Size
              </label>
              <input
                type="text"
                value={formData.fileSize}
                onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                placeholder="e.g. 186 MB"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
              />
            </div>
          </div>

          {/* Cover Image Upload (Cloudinary) */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Book Cover Image (Uploads to Cloudinary)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {formData.imagePreview ? (
              <div className="relative rounded-xl overflow-hidden border border-gray-200 h-36 bg-gray-50 flex items-center justify-center p-2">
                <img
                  src={formData.imagePreview}
                  alt="Cover Preview"
                  className="max-h-full max-w-full object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, coverImg: '', imagePreview: '' }))}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl border-2 border-dashed border-gray-200 p-4 text-center hover:border-[#800018]/50 transition cursor-pointer"
              >
                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-[#800018] mb-1">
                  <Upload size={18} />
                </div>
                <p className="text-xs font-semibold text-gray-700">
                  Click to select 3D Book Cover Image
                </p>
                <p className="text-[11px] text-gray-400">
                  Supports JPG, PNG, WEBP (Uploaded securely to Cloudinary)
                </p>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Description / Executive Summary
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide a comprehensive synopsis of this edition..."
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
            />
          </div>

          {/* Highlights */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Key Highlights (One point per line)
            </label>
            <textarea
              rows={3}
              value={formData.highlightsText}
              onChange={(e) => setFormData({ ...formData, highlightsText: e.target.value })}
              placeholder="Presidential & Patron addresses&#10;Comprehensive alumni directory&#10;Vintage photo archives"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-[#800018] px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-[#a00020] cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving to Cloudinary...
                </>
              ) : (
                <>
                  <Check size={16} />
                  {editingPub ? 'Update Edition' : 'Publish Publication'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PublicationModal;
