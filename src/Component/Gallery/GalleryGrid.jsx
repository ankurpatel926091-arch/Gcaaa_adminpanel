import React from 'react'
import { Trash2, Eye, Calendar, Tag } from 'lucide-react'

const GalleryGrid = ({ photos, onDelete, onPreview }) => {
  if (photos.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-xs">
        <p className="text-sm font-medium text-gray-500">
          No photos found in this category.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {photos.map((item) => (
        <div
          key={item.id}
          className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          {/* Photo Frame */}
          <div className="relative aspect-4/3 w-full overflow-hidden bg-gray-100">
            <img
              src={item.url}
              alt={item.caption}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />

            {/* Dark Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Quick Actions in Overlay */}
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => onPreview(item)}
                title="Preview"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-gray-800 shadow-md backdrop-blur-xs transition hover:bg-white hover:text-[#800018]"
              >
                <Eye size={15} />
              </button>
              <button
                type="button"
                onClick={() => onDelete(item.id)}
                title="Delete"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600/90 text-white shadow-md backdrop-blur-xs transition hover:bg-red-700"
              >
                <Trash2 size={15} />
              </button>
            </div>

            {/* Album tag at bottom of overlay */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="inline-block rounded-md bg-[#800018] px-2 py-0.5 text-[10px] font-bold text-white">
                {item.album}
              </span>
            </div>
          </div>

          {/* Photo Details */}
          <div className="p-3.5">
            <h4 className="font-semibold text-xs text-gray-900 truncate">
              {item.caption}
            </h4>
            <div className="mt-1 flex items-center justify-between text-[11px] text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {item.date}
              </span>
              <span>{item.resolution || 'HD Photo'}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default GalleryGrid
