import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Users,
  GraduationCap,
  Calendar,
  Search,
  X,
  RefreshCw,
  UserPlus,
  ShieldCheck,
  Clock,
  Layers,
  ArrowUpDown,
} from 'lucide-react'
import MemberTable from '../Component/RegisteredMembers/MemberTable'
import MemberModal from '../Component/RegisteredMembers/MemberModal'
import MemberDetailModal from '../Component/RegisteredMembers/MemberDetailModal'
import {
  fetchBatchAlumni,
  fetchBatchAlumniStats,
  createBatchAlumnus,
  updateBatchAlumnus,
  deleteBatchAlumnus,
  fetchBatchAlumnusById,
} from '../Api/batchAlumniApi'

// Official GCAAA Cohorts matching the public directory
const cohortTabs = [
  {
    id: 'all',
    label: 'All',
    course: 'Bachelor of Architecture & Foundation (Prior to 1985 - 2026)',
  },
  {
    id: 'b-arch',
    label: 'B.Arch',
    course: 'Bachelor of Architecture & Foundation (Prior to 1985 - 2026)',
  },
  {
    id: 'd-arch',
    label: 'D.Arch',
    course: 'Bachelor of Architecture',
  },
  {
    id: 'm-arch',
    label: 'M.Arch',
    course: 'Master of Architecture (M.Arch 2015-2026)',
  },
  {
    id: 'murp',
    label: 'MURP',
    course: 'Master of Urban & Regional Planning (MURP 2020-2026)',
  },
  {
    id: 'miend',
    label: 'MIEND',
    course: 'Master in Environmental Design (MIEND 2020-2026)',
  },
  {
    id: 'mind',
    label: 'MIND',
    course: 'Master in Interior Design (MIND 2023-2026)',
  },
]

const Alumni = () => {
  // State
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  console.log(`Active Cohort Tab: ${activeTab} }`)

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedYear, setSelectedYear] = useState('ALL')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [pageSize, setPageSize] = useState(50)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  // Modals & Feedback
  const [modalOpen, setModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [viewingMember, setViewingMember] = useState(null)
  const [feedbackMsg, setFeedbackMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // Available batch years for filter (from 2026 down to 1985 + Prior to 1985)
  const batchYears = useMemo(() => {
    const list = []
    const currentYear = new Date().getFullYear()
    for (let y = currentYear + 1; y >= 1985; y--) {
      list.push(String(y))
    }
    list.push('Prior to 1985')
    return list
  }, [])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim())
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Reset page when cohort tab or filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab, debouncedSearch, selectedYear, selectedStatus, pageSize])

  // Load Members from Backend API
  const loadMembers = useCallback(async () => {
    setLoading(true)
    try {
      const params = {
        cohort: activeTab,
        page: currentPage,
        limit: pageSize,
        search: debouncedSearch,
        sortBy: 'sno',
        order: 'asc',
      }

      if (selectedYear && selectedYear !== 'ALL') {
        params.year = selectedYear
      }

      if (selectedStatus) {
        params.status = selectedStatus
      }

      const res = await fetchBatchAlumni(params)
      if (res.success) {
        setMembers(res.data || [])
        setTotalPages(res.totalPages || 1)
        setTotalCount(res.total || 0)
        setErrorMsg('')
      }
    } catch (err) {
      console.error('Error fetching batch members:', err.message)
      setErrorMsg('Could not connect to backend database.')
    } finally {
      setLoading(false)
    }
  }, [activeTab, currentPage, pageSize, debouncedSearch, selectedYear, selectedStatus])

  useEffect(() => {
    loadMembers()
  }, [loadMembers])

  // Handlers
  const handleOpenAdd = () => {
    setEditingMember(null)
    setModalOpen(true)
  }

  const handleEdit = (member) => {
    setEditingMember(member)
    setModalOpen(true)
  }

  const handleView = async (member) => {
    setViewingMember(member)
    setDetailModalOpen(true)

    if (member._id) {
      try {
        const res = await fetchBatchAlumnusById(member._id)
        if (res.success && res.data) {
          setViewingMember(res.data)
        }
      } catch (err) {
        console.warn('Could not fetch full details, keeping cached record:', err)
      }
    }
  }

  const handleApprove = async (member) => {
    try {
      await updateBatchAlumnus(member._id, { status: 'Paid' })
      setFeedbackMsg(`Member ${member.name} has been verified and marked as Paid!`)
      setDetailModalOpen(false)
      loadMembers()
      setTimeout(() => setFeedbackMsg(''), 4000)
    } catch (err) {
      alert(`Approval failed: ${err.response?.data?.message || err.message}`)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this alumni record from the batch roll?')) return
    try {
      await deleteBatchAlumnus(id)
      setFeedbackMsg('Alumni record deleted successfully.')
      loadMembers()
      setTimeout(() => setFeedbackMsg(''), 3000)
    } catch (err) {
      alert(`Delete failed: ${err.response?.data?.message || err.message}`)
    }
  }

  const handleSave = async (formData) => {
    try {
      const payload = {
        ...formData,
        cohort: activeTab,
      }
      if (editingMember?._id) {
        await updateBatchAlumnus(editingMember._id, payload)
        setFeedbackMsg('Alumni batch record updated successfully.')
      } else {
        await createBatchAlumnus(payload)
        setFeedbackMsg('New alumnus added to batch record successfully.')
      }
      setModalOpen(false)
      loadMembers()
      setTimeout(() => setFeedbackMsg(''), 3000)
    } catch (err) {
      alert(`Save failed: ${err.response?.data?.message || err.message}`)
    }
  }

  // Calculate local stats for active cohort
  const paidCount = members.filter((m) => m.status === 'Paid' || m.status === 'Verified' || m.status === 'Active').length
  const pendingCount = members.filter((m) => m.status === 'Pending').length

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#800018]">
            Official Master Roll
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            All Batches of GCAAA
          </h1>
          <p className="text-xs sm:text-sm text-gr      ay-500 mt-1">
            Manage and verify alumni master directory across all cohorts and graduation batches.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 animate-in fade-in">
              <span>{errorMsg}</span>
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('')
                  loadMembers()
                }}
                className="underline hover:text-red-900 cursor-pointer font-bold"
              >
                Retry
              </button>
            </div>
          )}
          {feedbackMsg && (
            <span className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-800 animate-in fade-in">
              {feedbackMsg}
            </span>
          )}
        </div>
      </div>

      {/* 2. Cohort Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-gray-200 pb-1">
        {cohortTabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                setSelectedYear('ALL')
                setSearchQuery('')
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#800018] text-white shadow-md shadow-[#800018]/20'
                  : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200'
              }`}
            >
              <GraduationCap size={15} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* 3. KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Total in Cohort
              </p>
              <h4 className="mt-1 font-serif text-2xl font-bold text-gray-900">
                {totalCount.toLocaleString()}
              </h4>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {cohortTabs.find((t) => t.id === activeTab)?.course?.split('(')[0] || 'Active Cohort'}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#800018] text-white shadow-xs">
              <Users size={20} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Paid / Verified
              </p>
              <h4 className="mt-1 font-serif text-2xl font-bold text-emerald-700">
                {paidCount}
              </h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Membership fee confirmed</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
              <ShieldCheck size={20} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-red-100 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Pending Verification
              </p>
              <h4 className="mt-1 font-serif text-2xl font-bold text-red-700">
                {pendingCount}
              </h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Awaiting fee review</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 text-white shadow-xs">
              <Clock size={20} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Active Batch
              </p>
              <h4 className="mt-1 font-serif text-xl font-bold text-[#800018]">
                {selectedYear === 'ALL' ? 'All Batches' : `Batch of ${selectedYear}`}
              </h4>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Showing {members.length} records
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#800018] text-white shadow-xs">
              <Calendar size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Filter Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${cohortTabs.find((t) => t.id === activeTab)?.label} alumni by name, email, roll no...`}
            className="w-full rounded-xl border border-gray-200 bg-[#fdfcfb] py-2.5 pl-10 pr-10 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-[#800018] focus:ring-2 focus:ring-[#800018]/10"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Dropdown Filters & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Batch Year Select */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-semibold text-gray-700 outline-none focus:border-[#800018] cursor-pointer"
          >
            <option value="ALL">All Batches</option>
            {batchYears.map((yr) => (
              <option key={yr} value={yr}>
                {yr.includes('Prior') ? yr : `Batch of ${yr}`}
              </option>
            ))}
          </select>

          {/* Status Select: Paid vs Pending */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-semibold text-gray-700 outline-none focus:border-[#800018] cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>

          {/* Page Size */}
          <select
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-medium text-gray-700 outline-none focus:border-[#800018] cursor-pointer"
          >
            <option value={25}>Show 25</option>
            <option value={50}>Show 50</option>
            <option value={100}>Show 100</option>
            <option value={150}>Show 150</option>
            <option value="ALL">Show ALL</option>
          </select>

          {/* Refresh */}
          <button
            type="button"
            onClick={loadMembers}
            disabled={loading}
            title="Refresh Batch Records"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 active:scale-95 transition cursor-pointer"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin text-[#800018]' : ''} />
          </button>

          {/* Add Alumnus */}
          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-2 rounded-xl bg-[#800018] px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-[#800018]/15 transition hover:bg-[#a00020] active:scale-95 cursor-pointer"
          >
            <UserPlus size={16} />
            <span>Add to Batch</span>
          </button>
        </div>
      </div>

      {/* 5. Members Table */}
      <MemberTable
        members={members}
        loading={loading}
        total={totalCount}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={(p) => setCurrentPage(p)}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        showDownloadAction={false}
        showViewAction={false}
        showMembershipNo={false}
        showStatus={false}
        showEmail={false}
      />

      {/* 6. Add / Edit Modal */}
      <MemberModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        editingMember={editingMember}
      />

      {/* 7. View Full Registration Details Modal */}
      <MemberDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        member={viewingMember}
        onEdit={handleEdit}
        onApprove={handleApprove}
      />
    </div>
  )
}

export default Alumni
