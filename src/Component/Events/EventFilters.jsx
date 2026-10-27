import React from 'react'
import { Search, Plus, Calendar } from 'lucide-react'

const EventFilters = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  onOpenAddModal,
}) => {
  const categories = [
    'All Categories',
    'Reunion',
    'Symposium',
    'Exhibition',
    'Workshop',
    'Lecture',
  ]

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search events by title, venue, speaker..."
          className="w-full rounded-xl border border-gray-200 bg-[#fdfcfb] py-2.5 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-[#800018] focus:ring-2 focus:ring-[#800018]/10"
        />
      </div>

      {/* Filters and Action */}
      <div className="flex flex-wrap items-center gap-2.5">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-medium text-gray-700 outline-none focus:border-[#800018]"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-medium text-gray-700 outline-none focus:border-[#800018]"
        >
          <option value="All Status">All Status</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
        </select>

        <button
          type="button"
          onClick={onOpenAddModal}
          className="flex items-center gap-2 rounded-xl bg-[#800018] px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-[#800018]/15 transition hover:bg-[#a00020] active:scale-95"
        >
          <Plus size={16} />
          Create Event
        </button>
      </div>
    </div>
  )
}

export default EventFilters
