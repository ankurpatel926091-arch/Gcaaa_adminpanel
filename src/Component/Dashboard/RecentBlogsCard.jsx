import React from 'react'
import { Link } from 'react-router-dom'
import { FileText, ArrowUpRight, Eye, Calendar } from 'lucide-react'

const RecentBlogsCard = ({ blogs = [], loading = false }) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-base font-bold text-gray-900">
              Published Articles
            </h3>
            <span className="rounded-full bg-blue-50 text-blue-800 text-[10px] font-bold px-2 py-0.5 border border-blue-200">
              Editorial
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Latest stories & architectural news
          </p>
        </div>

        <Link
          to="/blogs"
          className="flex items-center gap-1 text-xs font-semibold text-[#800018] hover:text-[#bd0929] transition"
        >
          Manage <ArrowUpRight size={14} />
        </Link>
      </div>

      <div className="mt-3.5 space-y-3">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-gray-100 p-3 space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-3 w-48 bg-gray-100 rounded" />
            </div>
          ))
        ) : blogs.length === 0 ? (
          <div className="py-8 text-center text-gray-400">
            <FileText className="mx-auto h-7 w-7 text-gray-300 mb-1" />
            <p className="text-xs font-medium">No published blogs found.</p>
          </div>
        ) : (
          blogs.slice(0, 4).map((blog) => {
            const author = blog.author?.name || blog.author || 'GCAAA Editorial'
            return (
              <Link
                key={blog._id || blog.id}
                to={`/blogs/${blog._id || blog.id}`}
                className="group flex flex-col gap-1 rounded-xl border border-gray-100 p-3 hover:bg-[#faf9f6] transition-colors block"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded bg-red-50 text-[#800018] font-bold text-[10px] px-2 py-0.5 uppercase tracking-wider">
                    {blog.category || 'Architecture'}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400">
                    <span className="flex items-center gap-0.5">
                      <Eye size={11} /> {blog.views || blog.readsCount || 0}
                    </span>
                    {blog.createdAt && (
                      <span className="flex items-center gap-0.5">
                        <Calendar size={11} />
                        {new Date(blog.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    )}
                  </div>
                </div>

                <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#800018] transition line-clamp-1 mt-1">
                  {blog.title}
                </h4>

                <p className="text-[11px] text-gray-400 truncate">
                  By {author}
                </p>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}

export default RecentBlogsCard
