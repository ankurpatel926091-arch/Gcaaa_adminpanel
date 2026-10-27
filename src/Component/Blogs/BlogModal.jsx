import React, { useState, useEffect } from 'react'
import { X, Check, Upload, Image as ImageIcon } from 'lucide-react'

const BlogModal = ({ isOpen, onClose, onSave, editingBlog }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Heritage & Architecture',
    author: 'GCAAA Editorial Board',
    date: '',
    excerpt: '',
    content: '',
    status: 'Published',
    image: '',
    tags: '',
  })
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    if (editingBlog) {
      setFormData({
        ...editingBlog,
        category: editingBlog.category || 'Heritage & Architecture',
        author: typeof editingBlog.author === 'object' ? editingBlog.author.name : editingBlog.author || 'GCAAA Editorial Board',
        tags: Array.isArray(editingBlog.tags) ? editingBlog.tags.join(', ') : editingBlog.tags || '',
        image: editingBlog.image || '',
      })
    } else {
      setFormData({
        title: '',
        category: 'Heritage & Architecture',
        author: 'GCAAA Editorial Board',
        date: '',
        excerpt: '',
        content: '',
        status: 'Published',
        image: '',
        tags: '',
      })
    }
  }, [editingBlog, isOpen])

  if (!isOpen) return null

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP, etc.)')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Image file size must be under 10MB')
      return
    }

    setUploadingImage(true)
    const reader = new FileReader()
    reader.onload = (uploadEvent) => {
      setFormData((prev) => ({
        ...prev,
        image: uploadEvent.target.result,
      }))
      setUploadingImage(false)
    }
    reader.onerror = () => {
      alert('Failed to read file')
      setUploadingImage(false)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl transition-all animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-gray-900">
              {editingBlog ? 'Edit Blog Article' : 'Write New Blog Article'}
            </h3>
            <p className="text-xs text-gray-500">
              Share alumni stories, architecture trends and campus life memories (synced with Cloudinary & MongoDB)
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
              Article Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g. Transforming Urban Landscapes: Journey of Ar. Sunita Roy"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
              >
                <option value="Heritage & Architecture">Heritage & Architecture</option>
                <option value="Alumni Reunion">Alumni Reunion</option>
                <option value="Urban Planning">Urban Planning</option>
                <option value="Career & Mentorship">Career & Mentorship</option>
                <option value="Archives & Publications">Archives & Publications</option>
                <option value="Sustainable Design">Sustainable Design</option>
                <option value="Alumni Spotlight">Alumni Spotlight</option>
                <option value="Campus Memories">Campus Memories</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Author Name
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                placeholder="e.g. Ar. Rajiv Kacker or GCAAA Editorial Board"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Publish Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                placeholder="e.g. Heritage, Lucknow, Alumni"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
              />
            </div>
          </div>

          {/* Cover Image Upload (Cloudinary Supported) */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-700">
              Blog Cover Image (Auto-saved to Cloudinary) *
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-xl text-xs font-bold text-neutral-800 cursor-pointer transition-colors shadow-2xs">
                <Upload size={14} className="text-[#800018]" />
                <span>Upload From Computer</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </label>
              <span className="text-xs text-neutral-400">or paste URL below</span>
            </div>

            <input
              type="text"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              placeholder="https://res.cloudinary.com/... or paste image URL"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#800018]"
            />

            {/* Image Preview */}
            {formData.image && (
              <div className="relative mt-2 w-full max-h-44 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 flex items-center justify-center">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-44 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, image: '' })}
                  className="absolute top-2 right-2 p-1 bg-black/75 hover:bg-red-600 text-white rounded-full transition-colors"
                  title="Remove image"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Short Excerpt / Summary *
            </label>
            <textarea
              rows={2}
              required
              value={formData.excerpt}
              onChange={(e) =>
                setFormData({ ...formData, excerpt: e.target.value })
              }
              placeholder="Brief 1-2 sentence preview for feed listings..."
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Article Content * (Markdown / Multi-paragraph supported)
            </label>
            <textarea
              rows={6}
              required
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="Write or paste full article content. You can use markdown like ### Subheadings and - Bullet points."
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploadingImage}
              className="flex items-center gap-2 rounded-xl bg-[#800018] px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-[#a00020] cursor-pointer disabled:opacity-50"
            >
              <Check size={16} />
              {editingBlog ? 'Update Article' : 'Publish Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BlogModal
