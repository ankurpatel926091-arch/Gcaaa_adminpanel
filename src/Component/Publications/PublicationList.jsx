import React from 'react'
import {
  FileText,
  Download,
  Calendar,
  User,
  Trash2,
  Edit3,
  ExternalLink,
} from 'lucide-react'

const PublicationList = ({ publications, onEdit, onDelete, onDownload }) => {
  if (publications.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-xs">
        <p className="text-sm font-medium text-gray-500">
          No publications match the selected criteria.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {publications.map((pub) => (
        <div
          key={pub.id}
          className="group flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-xs transition-all duration-300 hover:border-[#800018]/50 hover:shadow-md"
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="inline-block rounded-md bg-[#800018]/10 px-2.5 py-1 text-xs font-semibold text-[#800018]">
                {pub.category}
              </span>
              <span className="text-xs text-gray-400 font-medium">
                {pub.edition}
              </span>
            </div>

            <h3 className="mt-3 font-serif text-lg font-bold text-gray-900 group-hover:text-[#800018] transition-colors">
              {pub.title}
            </h3>

            <p className="mt-2 text-xs leading-relaxed text-gray-600 line-clamp-2">
              {pub.description}
            </p>

            <div className="mt-4 space-y-1.5 border-t border-gray-100 pt-3 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <User size={14} className="text-[#800018]" />
                <span className="font-medium text-gray-700">Author / Editor:</span>
                <span>{pub.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={14} className="text-[#800018]" />
                <span>Published: {pub.publishDate}</span>
                <span className="text-gray-300">•</span>
                <span>Size: {pub.fileSize}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-3">
            <button
              type="button"
              onClick={() => onDownload(pub)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#faf9f6] px-3 py-1.5 text-xs font-semibold text-[#800018] ring-1 ring-[#800018]/20 transition hover:bg-[#800018] hover:text-white"
            >
              <Download size={14} />
              Download PDF
            </button>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onEdit(pub)}
                title="Edit Publication"
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#800018] transition"
              >
                <Edit3 size={15} />
              </button>
              <button
                type="button"
                onClick={() => onDelete(pub.id)}
                title="Delete Publication"
                className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PublicationList
