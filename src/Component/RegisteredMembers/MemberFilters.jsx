import React from 'react'
import { Search, Filter, X, RefreshCw } from 'lucide-react'

const MemberFilters = ({
  searchQuery,
  setSearchQuery,
  selectedYear,
  setSelectedYear,
  selectedCourse,
  setSelectedCourse,
  courseCounts = {},
  selectedStatus,
  setSelectedStatus,
  pageSize,
  setPageSize,
  onRefresh,
  loading,
}) => {
  return (
    <div className="flex flex-col gap-3 mb-1 rounded-2xl border border-gray-100 bg-white p-2 shadow-xs lg:flex-row lg:items-center lg:justify-between">
  
  {/* Left Side: Heading */}
  <div>
    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#800018]">
      Official Member Directory
    </span>
    <h1 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
      Lifetime Membership
    </h1>
  </div>

  {/* Right Side: Search, Filters & Actions */}
  <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full lg:w-auto">
    {/* Search Input */}
    <div className="relative w-full sm:w-64 lg:max-w-xs">
      <Search
        size={18}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by name or membership no..."
        className="w-full rounded-xl border border-gray-200 bg-[#fdfcfb] py-2.5 pl-10 pr-10 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-[#800018] focus:ring-2 focus:ring-[#800018]/10"
      />
      {searchQuery && (
        <button
          type="button"
          onClick={() => setSearchQuery('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </button>
      )}
    </div>

    {/* Dropdown Filters & Actions */}
    <div className="flex flex-wrap items-center gap-2.5">
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
        aria-label="Filter by batch"
        className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-medium text-gray-700 outline-none focus:border-[#800018]"
      >
        <option value="">All Batches</option>
        {Array.from({ length: 2025 - 1985 + 1 }, (_, index) => 1985 + index).map((year) => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>

      <select
        value={selectedCourse}
        onChange={(e) => setSelectedCourse(e.target.value)}
        aria-label="Filter by course"
        className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-medium text-gray-700 outline-none focus:border-[#800018]"
      >
        <option value="all">All Courses ({courseCounts.all ?? 0})</option>
        <option value="b-arch">B.Arch. ({courseCounts['b-arch'] ?? 0})</option>
        <option value="d-arch">Diploma in Arch. ({courseCounts['d-arch'] ?? 0})</option>
        <option value="m-arch">M.Arch ({courseCounts['m-arch'] ?? 0})</option>
        <option value="murp">MURP ({courseCounts.murp ?? 0})</option>
        <option value="miend">MIEND ({courseCounts.miend ?? 0})</option>
        <option value="mind">MIND ({courseCounts.mind ?? 0})</option>
      </select>

      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-medium text-gray-700 outline-none focus:border-[#800018]"
      >
        <option value="">All Status</option>
        <option value="Paid">Paid</option>
        <option value="Pending">Pending</option>
      </select>

      <button
        type="button"
        onClick={onRefresh}
        disabled={loading}
        title="Refresh Data"
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 active:scale-95 transition"
      >
        <RefreshCw size={16} className={loading ? 'animate-spin text-[#800018]' : ''} />
      </button>
    </div>
  </div>
</div>
  )
}

export default MemberFilters
