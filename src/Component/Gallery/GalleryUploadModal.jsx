import React, { useState } from 'react'
import { X, Upload, Check, Image as ImageIcon } from 'lucide-react'

const GalleryUploadModal = ({ isOpen, onClose, onUpload }) => {
  const [formData, setFormData] = useState({
    caption: '',
    album: 'Annual Alumni Meet',
    url: '',
    date: 'March 2026',
  })

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpload({
      ...formData,
      id: Date.now(),
      url:
        formData.url ||
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition-all animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-gray-900">
              Upload New Photograph
            </h3>
            <p className="text-xs text-gray-500">
              Add photographs to the alumni gallery archive
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <option value="Annual Alumni Meet">Annual Alumni Meet</option>
                <option value="Campus Architecture">Campus Architecture</option>
                <option value="Design Exhibition">Design Exhibition</option>
                <option value="Convocation Day">Convocation Day</option>
                <option value="Faculty & Founders">Faculty & Founders</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Event Date / Month
              </label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                placeholder="e.g. March 2026"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Image URL / File Link
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
              placeholder="https://... (or leave blank for demo placeholder)"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
            />
          </div>

          {/* Upload Dropzone Preview */}
          <div className="rounded-xl border-2 border-dashed border-gray-200 p-6 text-center hover:border-[#800018]/50 transition cursor-pointer">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#800018] mb-2">
              <Upload size={20} />
            </div>
            <p className="text-xs font-semibold text-gray-700">
              Drag & Drop high-resolution images or click to browse
            </p>
            <p className="text-[11px] text-gray-400 mt-1">
              Supports JPG, PNG, WEBP up to 10MB
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-[#800018] px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-[#a00020]"
            >
              <Check size={16} />
              Save to Gallery
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default GalleryUploadModal
