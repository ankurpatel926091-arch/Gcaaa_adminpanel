import React, { useState, useRef } from 'react';
import { X, Upload, Check, Loader2, Image as ImageIcon } from 'lucide-react';

const GalleryUploadModal = ({ isOpen, onClose, onUpload }) => {
  const [formData, setFormData] = useState({
    caption: '',
    album: 'GBM 2025',
    url: '',
    imageFile: null,
    imagePreview: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('Image file size must be less than 10MB.');
      return;
    }

    setErrorMsg('');
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const imageToSend = formData.imagePreview || formData.url;
    if (!imageToSend) {
      setErrorMsg('Please select an image file or provide an image URL.');
      return;
    }

    setIsSubmitting(true);
    try {
      const categoryKey = formData.album.toLowerCase().includes('gbm') ? 'gbm' : 'dharohar';
      await onUpload({
        title: formData.caption,
        caption: formData.caption,
        album: formData.album,
        category: categoryKey,
        categoryLabel: formData.album,
        date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        imageUrl: imageToSend,
      });

      // Reset form
      setFormData({
        caption: '',
        album: 'GBM 2025',
        url: '',
        imageFile: null,
        imagePreview: '',
      });
      onClose();
    } catch (err) {
      setErrorMsg(err.friendlyMessage || err.message || 'Failed to upload photo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition-all animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-gray-900">
              Upload New Photograph
            </h3>
            <p className="text-xs text-gray-500">
              Add photographs to the alumni gallery archive via Cloudinary
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
          <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Photo Caption / Title *
            </label>
            <input
              type="text"
              required
              value={formData.caption}
              onChange={(e) =>
                setFormData({ ...formData, caption: e.target.value })
              }
              placeholder="e.g. Batch of 1995 Campus Gathering"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Album Category *
            </label>
            <select
              value={formData.album}
              onChange={(e) =>
                setFormData({ ...formData, album: e.target.value })
              }
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
            >
              <option value="GBM 2025">GBM 2025</option>
              <option value="Dharohar & Reunions">Dharohar & Reunions</option>
            </select>
          </div>

          {/* Upload Dropzone Preview */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Select Image File *
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {formData.imagePreview ? (
              <div className="relative rounded-xl overflow-hidden border border-gray-200 aspect-16/9 bg-gray-50 flex items-center justify-center">
                <img
                  src={formData.imagePreview}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      imageFile: null,
                      imagePreview: '',
                    }))
                  }
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl border-2 border-dashed border-gray-200 p-6 text-center hover:border-[#800018]/50 transition cursor-pointer"
              >
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#800018] mb-2">
                  <Upload size={20} />
                </div>
                <p className="text-xs font-semibold text-gray-700">
                  Click to select high-resolution photograph
                </p>
                <p className="text-[11px] text-gray-400 mt-1">
                  Supports JPG, PNG, WEBP up to 10MB (Uploads to Cloudinary)
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Or Image URL (Alternative)
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
              placeholder="https://images.unsplash.com/..."
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
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
                  Saving &amp; Uploading...
                </>
              ) : (
                <>
                  <Check size={16} />
                  Save to Gallery
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GalleryUploadModal;
