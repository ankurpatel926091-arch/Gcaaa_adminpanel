import React from 'react'
import { Search, Upload, Filter } from 'lucide-react'

const GalleryFilters = ({
  searchQuery,
  setSearchQuery,
  selectedAlbum,
  setSelectedAlbum,
  onOpenUpload,
}) => {
  const albums = [
    'All Albums',
    'Annual Alumni Meet',
    'Campus Architecture',
    'Design Exhibition',
    'Convocation Day',
    'Faculty & Founders',
  ]

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
      <div className="relative flex-1">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search photographs by caption, tag, year..."
          className="w-full rounded-xl border border-gray-200 bg-[#fdfcfb] py-2.5 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-[#800018] focus:ring-2 focus:ring-[#800018]/10"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <select
          value={selectedAlbum}
          onChange={(e) => setSelectedAlbum(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-medium text-gray-700 outline-none focus:border-[#800018]"
        >
          {albums.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onOpenUpload}
          className="flex items-center gap-2 rounded-xl bg-[#800018] px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-[#800018]/15 transition hover:bg-[#a00020] active:scale-95"
        >
          <Upload size={16} />
          Upload Photos
        </button>
      </div>
    </div>
  )
}

export default GalleryFilters
