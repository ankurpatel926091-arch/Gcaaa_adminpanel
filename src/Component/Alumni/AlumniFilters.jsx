import React from 'react'
import { Search, Filter, Download, UserPlus } from 'lucide-react'

const AlumniFilters = ({
  searchQuery,
  setSearchQuery,
  selectedBatch,
  setSelectedBatch,
  selectedStatus,
  setSelectedStatus,
  onOpenAddModal,
}) => {
  const batches = [
    'All Batches',
    'Batch of 2024',
    'Batch of 2023',
    'Batch of 2022',
    'Batch of 2021',
    'Batch of 2020',
    'Batch of 2018',
    'Batch of 2015',
    'Batch of 2012',
    'Batch of 2005',
    'Batch of 2000',
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
          placeholder="Search by alumni name, email, roll no, firm..."
          className="w-full rounded-xl border border-gray-200 bg-[#fdfcfb] py-2.5 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-[#800018] focus:ring-2 focus:ring-[#800018]/10"
        />
      </div>

      {/* Dropdown Filters & Actions */}
      <div className="flex flex-wrap items-center gap-2.5">
        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-medium text-gray-700 outline-none transition hover:border-gray-300 focus:border-[#800018]"
        >
          {batches.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-medium text-gray-700 outline-none transition hover:border-gray-300 focus:border-[#800018]"
        >
          <option value="All Status">All Status</option>
          <option value="Verified">Verified</option>
          <option value="Pending">Pending</option>
        </select>

        <button
          type="button"
          onClick={() => alert('Exporting alumni directory CSV...')}
          className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 active:scale-95"
        >
          <Download size={15} />
          Export
        </button>

        <button
          type="button"
          onClick={onOpenAddModal}
          className="flex items-center gap-2 rounded-xl bg-[#800018] px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-[#800018]/15 transition hover:bg-[#a00020] active:scale-95"
        >
          <UserPlus size={16} />
          Add Alumni
        </button>
      </div>
    </div>
  )
}

export default AlumniFilters
