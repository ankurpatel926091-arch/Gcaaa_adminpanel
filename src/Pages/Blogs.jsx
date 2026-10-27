import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BlogStats from '../Component/Blogs/BlogStats'
import BlogFilters from '../Component/Blogs/BlogFilters'
import BlogList from '../Component/Blogs/BlogList'
import BlogModal from '../Component/Blogs/BlogModal'
import {
  fetchAdminBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleBlogStatus,
} from '../Api/blogAdminApi'
import { Loader2, RefreshCw, Plus } from 'lucide-react'

const Blogs = () => {
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedStatus, setSelectedStatus] = useState('All Status')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState(null)

  const loadBlogs = async () => {
    try {
      setLoading(true)
      const res = await fetchAdminBlogs()
      if (res?.success && Array.isArray(res.data)) {
        setBlogs(res.data)
        setError(null)
      }
    } catch (err) {
      console.error('Failed to load admin blogs:', err)
      setError(err?.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBlogs()
  }, [])

  const handleOpenAdd = () => {
    setEditingBlog(null)
    setModalOpen(true)
  }

  const handleView = (blog) => {
    const blogId = blog._id || blog.id
    navigate(`/blogs/${blogId}`)
  }

  const handleEdit = (blog) => {
    setEditingBlog(blog)
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return
    try {
      await deleteBlog(id)
      setBlogs((prev) => prev.filter((b) => b.id !== id && b._id !== id))
    } catch (err) {
      alert('Failed to delete blog: ' + (err?.response?.data?.message || err.message))
    }
  }

  const handleToggleStatus = async (id) => {
    try {
      const res = await toggleBlogStatus(id)
      setBlogs((prev) =>
        prev.map((b) =>
          b.id === id || b._id === id
            ? {
                ...b,
                status: res.status || (b.status === 'Published' ? 'Draft' : 'Published'),
              }
            : b
        )
      )
    } catch (err) {
      alert('Failed to toggle status: ' + (err?.response?.data?.message || err.message))
    }
  }

  const handleSave = async (data) => {
    try {
      setLoading(true)
      if (editingBlog) {
        const id = editingBlog._id || editingBlog.id
        const res = await updateBlog(id, data)
        if (res?.success && res.data) {
          setBlogs((prev) =>
            prev.map((b) => (b.id === id || b._id === id ? res.data : b))
          )
        }
      } else {
        const res = await createBlog(data)
        if (res?.success && res.data) {
          setBlogs((prev) => [res.data, ...prev])
        }
      }
      setModalOpen(false)
      loadBlogs()
    } catch (err) {
      alert('Failed to save blog: ' + (err?.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  const filteredBlogs = blogs.filter((b) => {
    const authorName = typeof b.author === 'object' ? b.author?.name || '' : b.author || ''
    const matchesSearch =
      (b.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      selectedCategory === 'All Categories' || b.category === selectedCategory

    const matchesStatus =
      selectedStatus === 'All Status' || b.status === selectedStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  const publishedCount = blogs.filter((b) => b.status === 'Published').length
  const draftCount = blogs.filter((b) => b.status === 'Draft').length

  return (
    <div className="space-y-6">
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#800018]">
            Stories &amp; Perspectives
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Articles &amp; Blog Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage, write and publish alumni blogs with MongoDB &amp; Cloudinary integration.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadBlogs}
            disabled={loading}
            className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer shadow-2xs"
            title="Refresh Blogs from Database"
          >
            <RefreshCw size={17} className={loading ? 'animate-spin text-[#800018]' : ''} />
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 bg-[#800018] hover:bg-[#a00020] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
          >
            <Plus size={16} />
            <span>Write New Blog</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <BlogStats
        totalBlogs={blogs.length}
        publishedCount={publishedCount}
        draftCount={draftCount}
      />

      {/* Controls & Filter Bar */}
      <BlogFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        onOpenAdd={handleOpenAdd}
      />

      {/* Loading state */}
      {loading && blogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
          <Loader2 className="w-8 h-8 text-[#800018] animate-spin mb-3" />
          <p className="text-sm font-semibold text-gray-700">Loading blogs from database...</p>
        </div>
      ) : (
        /* Blog List Table / Cards with View, Edit, Delete */
        <BlogList
          blogs={filteredBlogs}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* Create / Edit Modal (With Cloudinary File Upload) */}
      <BlogModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        editingBlog={editingBlog}
      />
    </div>
  )
}

export default Blogs
