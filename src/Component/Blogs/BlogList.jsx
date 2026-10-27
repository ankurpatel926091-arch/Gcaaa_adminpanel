import React from 'react'
import { Edit3, Trash2, Calendar, User, Eye, CheckCircle2, Clock, Tag, ArrowRight } from 'lucide-react'

const BlogList = ({ blogs, onView, onEdit, onDelete, onToggleStatus }) => {
  if (blogs.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-xs">
        <p className="text-sm font-medium text-gray-500">
          No blog articles found matching your criteria.
        </p>
      </div>
    )
  }

  const getAuthorName = (author) => {
    if (!author) return 'GCAAA Editorial Board'
    if (typeof author === 'object') return author.name || 'GCAAA Editorial Board'
    return author
  }

  const getAuthorRole = (author) => {
    if (!author) return 'Alumni Member'
    if (typeof author === 'object') return author.role || 'Alumni Member'
    return 'Alumni Member'
  }

  const getAuthorAvatar = (author) => {
    if (typeof author === 'object' && author?.avatar) return author.avatar
    return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {blogs.map((blog) => {
        const blogId = blog._id || blog.id
        const authorName = getAuthorName(blog.author)
        const authorRole = getAuthorRole(blog.author)
        const authorAvatar = getAuthorAvatar(blog.author)

        const tagsList = Array.isArray(blog.tags)
          ? blog.tags
          : typeof blog.tags === 'string'
          ? blog.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : []

        return (
          <article
            key={blogId}
            className="group bg-white rounded-2xl border border-gray-200/90 shadow-xs hover:shadow-xl hover:border-[#800018]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            <div>
              {/* Card Cover Image Header */}
              <div
                onClick={() => onView && onView(blog)}
                className="relative aspect-[16/10] overflow-hidden bg-neutral-900 cursor-pointer"
                title="Click to view details"
              >
                <img
                  src={
                    blog.image ||
                    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80'
                  }
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Category Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-black uppercase tracking-wider bg-white/95 text-[#800018] shadow-sm border border-white">
                    {blog.category || 'Heritage & Architecture'}
                  </span>
                </div>

                {/* Status Toggle Button on Image */}
                <div className="absolute top-3 right-3 z-10">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleStatus && onToggleStatus(blogId)
                    }}
                    title="Click to toggle status"
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold shadow-md cursor-pointer transition ${
                      blog.status === 'Published'
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                  >
                    {blog.status === 'Published' ? (
                      <CheckCircle2 size={11} />
                    ) : (
                      <Clock size={11} />
                    )}
                    <span>{blog.status}</span>
                  </button>
                </div>

                {/* Read Info Overlay */}
                <div className="absolute bottom-3 right-3 z-10">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold">
                    <Eye size={11} className="text-red-300" />
                    <span>{blog.reads || 0} reads</span>
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3">
                {/* Date and Read Time */}
                <div className="flex items-center justify-between text-[11px] text-gray-500 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-[#800018]" />
                    {blog.date || 'Recent'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {blog.readTime || '5 min read'}
                  </span>
                </div>

                {/* Title */}
                <h3
                  onClick={() => onView && onView(blog)}
                  className="font-serif text-base sm:text-lg font-bold text-gray-900 group-hover:text-[#800018] transition-colors line-clamp-2 leading-snug cursor-pointer"
                  title={blog.title}
                >
                  {blog.title}
                </h3>

                {/* Excerpt */}
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {blog.excerpt}
                </p>

                {/* Tags */}
                {tagsList.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tagsList.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md"
                      >
                        <Tag size={10} className="text-gray-400" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Section: Author + Action Controls */}
            <div className="border-t border-gray-100 px-5 pt-3.5 pb-4 space-y-3 bg-neutral-50/50">
              {/* Author Strip */}
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={authorAvatar}
                  alt={authorName}
                  className="w-7 h-7 rounded-full object-cover border border-gray-300 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-gray-900 truncate">
                    {authorName}
                  </p>
                  <p className="text-[10px] text-gray-500 truncate">
                    {authorRole}
                  </p>
                </div>
              </div>

              {/* Action Controls Toolbar at the bottom */}
              <div className="flex items-center gap-2 pt-1 border-t border-gray-200/60">
                {/* View Details Primary Button */}
                <button
                  type="button"
                  onClick={() => onView && onView(blog)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#800018] hover:bg-[#a00020] text-white text-xs font-bold py-2 px-3 rounded-xl shadow-xs transition-all cursor-pointer active:scale-98"
                  title="View Full Details"
                >
                  <Eye size={14} />
                  <span>View Details</span>
                  <ArrowRight size={13} />
                </button>

                {/* Edit Button */}
                <button
                  type="button"
                  onClick={() => onEdit && onEdit(blog)}
                  title="Edit Blog"
                  className="p-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:border-[#800018] hover:text-[#800018] transition shadow-2xs cursor-pointer shrink-0"
                >
                  <Edit3 size={15} />
                </button>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => onDelete && onDelete(blogId)}
                  title="Delete Blog"
                  className="p-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-red-50 hover:border-red-500 hover:text-red-600 transition shadow-2xs cursor-pointer shrink-0"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

export default BlogList
