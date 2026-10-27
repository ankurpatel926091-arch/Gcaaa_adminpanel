import React, { useState, useEffect } from 'react'
import { X, BookOpen, Check } from 'lucide-react'

const PublicationModal = ({ isOpen, onClose, onSave, editingPub }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Research Journal',
    edition: 'Vol. 14, Issue 2',
    author: '',
    publishDate: '2026',
    fileSize: '4.8 MB',
    description: '',
  })

  useEffect(() => {
    if (editingPub) {
      setFormData(editingPub)
    } else {
      setFormData({
        title: '',
        category: 'Research Journal',
        edition: 'Vol. 15, Issue 1 (2026)',
        author: 'GCAAA Editorial Board',
        publishDate: 'March 2026',
        fileSize: '5.2 MB',
        description: '',
      })
    }
  }, [editingPub, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition-all animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-gray-900">
              {editingPub ? 'Edit Publication' : 'Add New Publication'}
            </h3>
            <p className="text-xs text-gray-500">
              Upload research papers, annual magazines and architectural reports
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
              Publication Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g. Vernacular Architecture & Climate Resilient Envelopes"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
              >
                <option value="Research Journal">Research Journal</option>
                <option value="Annual Magazine">Annual Magazine</option>
                <option value="Newsletter">Newsletter</option>
                <option value="Conference Proceedings">Conference Proceedings</option>
                <option value="Historical Monograph">Historical Monograph</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Volume / Edition
              </label>
              <input
                type="text"
                value={formData.edition}
                onChange={(e) =>
                  setFormData({ ...formData, edition: e.target.value })
                }
                placeholder="Vol. 15, Issue 1"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Author(s) / Editors
              </label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                placeholder="e.g. Prof. R.K. Mathur"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Publication Date
              </label>
              <input
                type="text"
                value={formData.publishDate}
                onChange={(e) =>
                  setFormData({ ...formData, publishDate: e.target.value })
                }
                placeholder="March 2026"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Abstract / Summary
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Provide a short synopsis or overview of this publication..."
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
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
              {editingPub ? 'Update Publication' : 'Save Publication'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PublicationModal
