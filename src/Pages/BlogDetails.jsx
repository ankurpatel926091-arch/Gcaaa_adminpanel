import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Eye,
  CheckCircle2,
  Tag,
  Edit3,
  Trash2,
  ExternalLink,
  Share2,
  Loader2,
  AlertCircle,
  FileText,
} from 'lucide-react'
import {
  fetchBlogById,
  deleteBlog,
  toggleBlogStatus,
  updateBlog,
} from '../Api/blogAdminApi'
import BlogModal from '../Component/Blogs/BlogModal'

const BlogDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  const loadBlog = async () => {
    try {
      setLoading(true)
      const res = await fetchBlogById(id)
      if (res?.success && res.data) {
        setBlog(res.data)
        setError(null)
      } else {
        setError('Blog details not found.')
      }
    } catch (err) {
      console.error('Failed to load blog:', err)
      setError(err?.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBlog()
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this article?')) return
    try {
      await deleteBlog(blog._id || blog.id)
      navigate('/blogs')
    } catch (err) {
      alert('Failed to delete blog: ' + (err?.response?.data?.message || err.message))
    }
  }

  const handleToggleStatus = async () => {
    try {
      const res = await toggleBlogStatus(blog._id || blog.id)
      setBlog((prev) => ({
        ...prev,
        status: res.status || (prev.status === 'Published' ? 'Draft' : 'Published'),
      }))
    } catch (err) {
      alert('Failed to update status: ' + (err?.response?.data?.message || err.message))
    }
  }

  const handleSaveEdit = async (data) => {
    try {
      const blogId = blog._id || blog.id
      const res = await updateBlog(blogId, data)
      if (res?.success && res.data) {
        setBlog(res.data)
      }
      setEditModalOpen(false)
    } catch (err) {
      alert('Failed to update blog: ' + (err?.response?.data?.message || err.message))
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const getAuthorName = (author) =>
    typeof author === 'object' ? author?.name || 'GCAAA Editorial Board' : author || 'GCAAA Editorial Board'
  const getAuthorRole = (author) =>
    typeof author === 'object' ? author?.role || 'Alumni Member' : 'Alumni Member'
  const getAuthorAvatar = (author) =>
    (typeof author === 'object' && author?.avatar)
      ? author.avatar
      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-xs">
        <Loader2 className="w-10 h-10 text-[#800018] animate-spin mb-3" />
        <h3 className="font-serif text-lg font-bold text-gray-900">Loading Article Details...</h3>
        <p className="text-xs text-gray-500 mt-1">Retrieving Cloudinary media &amp; MongoDB records</p>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center max-w-lg mx-auto shadow-xs space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h3 className="font-serif text-xl font-bold text-gray-900">Article Not Found</h3>
        <p className="text-xs text-gray-500">{error || 'Could not retrieve this article.'}</p>
        <button
          onClick={() => navigate('/blogs')}
          className="inline-flex items-center gap-2 bg-[#800018] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-md hover:bg-[#a00020] transition"
        >
          <ArrowLeft size={16} />
          <span>Back to Articles</span>
        </button>
      </div>
    )
  }

  const tagsList = Array.isArray(blog.tags)
    ? blog.tags
    : typeof blog.tags === 'string'
    ? blog.tags.split(',').map((t) => t.trim()).filter(Boolean)
    : []

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Navigation & Action Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/90 shadow-xs">
        {/* Back Link */}
        <button
          onClick={() => navigate('/blogs')}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700 hover:text-[#800018] transition cursor-pointer self-start sm:self-auto"
        >
          <ArrowLeft size={16} />
          <span>Back to All Blogs</span>
        </button>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Toggle Button */}
          <button
            type="button"
            onClick={handleToggleStatus}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer ${
              blog.status === 'Published'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                : 'bg-red-50 text-red-700 border border-red-300 hover:bg-red-100'
            }`}
          >
            <CheckCircle2 size={13} />
            <span>Status: {blog.status}</span>
          </button>

          {/* Copy Share Link */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold transition cursor-pointer shadow-2xs"
          >
            <Share2 size={14} />
            <span>{copiedLink ? 'Copied!' : 'Share'}</span>
          </button>

          {/* Edit Button */}
          <button
            type="button"
            onClick={() => setEditModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gray-900 hover:bg-[#800018] text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Edit3 size={14} />
            <span>Edit Article</span>
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-600 hover:text-white text-red-600 border border-red-200 hover:border-red-600 text-xs font-bold transition shadow-2xs cursor-pointer"
          >
            <Trash2 size={14} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Blog Article Card Container */}
      <article className="bg-white rounded-3xl border border-gray-200/90 shadow-sm overflow-hidden">
        {/* Full-width High-Res Cover Image Banner */}
        <div className="relative aspect-[16/8] sm:aspect-[16/7] w-full bg-neutral-900 overflow-hidden">
          <img
            src={
              blog.image ||
              'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80'
            }
            alt={blog.title}
            className="w-full h-full object-cover"
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Badges on Banner */}
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-10 flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-white/95 text-[#800018] shadow-md border border-white">
              {blog.category || 'Heritage & Architecture'}
            </span>
            <span
              className={`px-3 py-1 rounded-lg text-xs font-bold shadow-md text-white ${
                blog.status === 'Published' ? 'bg-emerald-600' : 'bg-red-500'
              }`}
            >
              {blog.status}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 space-y-6">
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100 text-xs text-gray-500">
            <div className="flex flex-wrap items-center gap-5">
              <span className="flex items-center gap-1.5 font-semibold text-gray-700">
                <Calendar size={15} className="text-[#800018]" />
                {blog.date || 'Recent'}
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-gray-700">
                <Clock size={15} className="text-[#800018]" />
                {blog.readTime || '5 min read'}
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-gray-700">
                <Eye size={15} className="text-[#800018]" />
                {blog.reads || 0} Total Reads
              </span>
            </div>

            <div className="text-xs text-gray-400 font-mono">
              Slug: {blog.slug}
            </div>
          </div>

          {/* Title */}
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">
            {blog.title}
          </h1>

          {/* Author Card */}
          <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
            <img
              src={getAuthorAvatar(blog.author)}
              alt={getAuthorName(blog.author)}
              className="w-12 h-12 rounded-full object-cover border border-neutral-300 shrink-0"
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

          {/* Highlighted Excerpt Callout Box */}
          {blog.excerpt && (
            <div className="p-5 bg-red-50/80 border-l-4 border-[#800018] rounded-r-2xl text-sm sm:text-base text-neutral-800 leading-relaxed font-medium">
              <p className="text-xs uppercase font-bold tracking-widest text-[#800018] mb-1">
                Executive Excerpt
              </p>
              {blog.excerpt}
            </div>
          )}

          {/* Full Article Content */}
          <div className="text-sm sm:text-base text-neutral-800 leading-relaxed space-y-4 pt-2">
            {(blog.content || '').split('\n\n').map((paragraph, index) => {
              const trimmed = paragraph.trim()
              if (!trimmed) return null
              if (trimmed.startsWith('### ')) {
                return (
                  <h3
                    key={index}
                    className="font-serif text-lg sm:text-xl font-bold text-gray-900 pt-4 border-b border-gray-100 pb-1.5"
                  >
                    {trimmed.replace('### ', '')}
                  </h3>
                )
              }
              if (trimmed.startsWith('- ')) {
                const items = trimmed.split('\n').map((item) => item.replace('- ', '').trim())
                return (
                  <ul key={index} className="list-disc pl-6 space-y-1.5 text-neutral-700">
                    {items.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                )
              }
              return (
                <p key={index} className="text-neutral-700 leading-relaxed">
                  {trimmed}
                </p>
              )
            })}
          </div>

          {/* Tags */}
          {tagsList.length > 0 && (
            <div className="pt-6 border-t border-gray-100">
              <p className="text-xs uppercase font-bold tracking-wider text-gray-400 mb-2">
                Article Tags
              </p>
              <div className="flex flex-wrap gap-2">
                {tagsList.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-200"
                  >
                    <Tag size={12} className="text-[#800018]" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Date */}
          <div className="pt-6 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-500 font-medium">
            <Calendar size={16} className="text-[#800018]" />
            <span>Date: {blog.date || (blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A')}</span>
          </div>
        </div>
      </article>

      {/* Edit Modal */}
      <BlogModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveEdit}
        editingBlog={blog}
      />
    </div>
  )
}

export default BlogDetails
