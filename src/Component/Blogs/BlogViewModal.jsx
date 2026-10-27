import React from 'react'
import { X, Calendar, Clock, User, Tag, Eye, Edit3, ExternalLink } from 'lucide-react'

const BlogViewModal = ({ isOpen, onClose, blog, onEdit }) => {
  if (!isOpen || !blog) return null

  const getAuthorName = (author) =>
    typeof author === 'object' ? author?.name || 'GCAAA Editorial Board' : author || 'GCAAA Editorial Board'
  const getAuthorRole = (author) =>
    typeof author === 'object' ? author?.role || 'Alumni Member' : 'Alumni Member'
  const getAuthorAvatar = (author) =>
    (typeof author === 'object' && author?.avatar)
      ? author.avatar
      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'

  const tagsList = Array.isArray(blog.tags)
    ? blog.tags
    : typeof blog.tags === 'string'
    ? blog.tags.split(',').map((t) => t.trim()).filter(Boolean)
    : []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div
        className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl transition-all animate-scaleUp my-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cover Image Header */}
        <div className="relative aspect-[16/8] sm:aspect-[16/7] w-full bg-neutral-900 overflow-hidden shrink-0">
          <img
            src={
              blog.image ||
              'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80'
            }
            alt={blog.title}
            className="w-full h-full object-cover"
          />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/75 hover:bg-[#800018] text-white flex items-center justify-center transition-all shadow-lg cursor-pointer"
          >
            <X size={18} />
          </button>

          {/* Top badges */}
          <div className="absolute bottom-4 left-4 z-10 flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-white/95 text-[#800018] shadow-md border border-white">
              {blog.category || 'Heritage & Architecture'}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-md ${
                blog.status === 'Published'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-red-500 text-white'
              }`}
            >
              {blog.status}
            </span>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 sm:p-8 space-y-5 flex-1">
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100 text-xs text-gray-500">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar size={14} className="text-[#800018]" />
                {blog.date || 'Recent'}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Clock size={14} className="text-[#800018]" />
                {blog.readTime || '5 min read'}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Eye size={14} className="text-[#800018]" />
                {blog.reads || 0} Total Reads
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose()
                  if (onEdit) onEdit(blog)
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-[#800018] hover:text-[#800018] text-gray-700 text-xs font-semibold transition cursor-pointer shadow-2xs"
              >
                <Edit3 size={13} />
                <span>Edit Article</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-snug">
            {blog.title}
          </h2>

          {/* Author Card */}
          <div className="flex items-center gap-3.5 p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/90">
            <img
              src={getAuthorAvatar(blog.author)}
              alt={getAuthorName(blog.author)}
              className="w-11 h-11 rounded-full object-cover border border-neutral-300"
            />
            <div>
              <h4 className="text-sm font-bold text-gray-900">
                {getAuthorName(blog.author)}
              </h4>
              <p className="text-xs text-gray-500">
                {getAuthorRole(blog.author)}
              </p>
            </div>
          </div>

          {/* Excerpt callout */}
          {blog.excerpt && (
            <div className="p-4 bg-red-50/70 border-l-4 border-[#800018] rounded-r-xl text-xs sm:text-sm text-neutral-800 leading-relaxed font-medium">
              {blog.excerpt}
            </div>
          )}

          {/* Full Content */}
          <div className="text-xs sm:text-sm text-neutral-700 leading-relaxed space-y-4 pt-2">
            {(blog.content || '').split('\n\n').map((paragraph, index) => {
              const trimmed = paragraph.trim()
              if (!trimmed) return null
              if (trimmed.startsWith('### ')) {
                return (
                  <h3
                    key={index}
                    className="text-base sm:text-lg font-bold text-gray-900 pt-3 border-b border-gray-100 pb-1"
                  >
                    {trimmed.replace('### ', '')}
                  </h3>
                )
              }
              if (trimmed.startsWith('- ')) {
                const items = trimmed.split('\n').map((item) => item.replace('- ', '').trim())
                return (
                  <ul key={index} className="list-disc pl-5 space-y-1 text-neutral-700">
                    {items.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                )
              }
              return (
                <p key={index} className="text-neutral-700">
                  {trimmed}
                </p>
              )
            })}
          </div>

          {/* Tags */}
          {tagsList.length > 0 && (
            <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-2">
              {tagsList.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg"
                >
                  <Tag size={12} className="text-[#800018]" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
          <span className="text-xs text-gray-500 font-mono">
            Slug: {blog.slug || blog._id}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-neutral-900 hover:bg-[#800018] text-white text-xs font-semibold rounded-xl transition cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  )
}

export default BlogViewModal
