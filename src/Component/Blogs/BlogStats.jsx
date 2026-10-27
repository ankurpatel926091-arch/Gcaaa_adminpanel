import React from 'react'
import { FileText, Eye, CheckCircle2, Clock } from 'lucide-react'

const BlogStats = ({ totalBlogs, publishedCount, draftCount }) => {
  const stats = [
    {
      label: 'Total Articles',
      value: totalBlogs || 24,
      icon: FileText,
      color: 'bg-[#800018]',
    },
    {
      label: 'Published Posts',
      value: publishedCount || 20,
      icon: CheckCircle2,
      color: 'bg-emerald-700',
    },
    {
      label: 'Drafts in Review',
      value: draftCount || 4,
      icon: Clock,
      color: 'bg-red-600',
    },
    {
      label: 'Total Article Reads',
      value: '42.8k',
      icon: Eye,
      color: 'bg-[#800018]',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => {
        const Icon = s.icon
        return (
          <div
            key={s.label}
            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {s.label}
                </p>
                <h4 className="mt-1 font-serif text-2xl font-bold text-gray-900">
                  {s.value}
                </h4>
              </div>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-white ${s.color}`}
              >
                <Icon size={20} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default BlogStats
