import React, { useState, useEffect, useCallback } from 'react'
import {
  Vote,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  User,
  Users,
  Download,
  Printer,
  ChevronDown,
  AlertCircle,
  X,
  FileText,
  Loader2,
  Phone,
  Mail,
  MapPin,
  IdCard,
  ExternalLink,
  FileSignature,
} from 'lucide-react'
import {
  fetchElectionNominations,
  updateNominationStatus,
  deleteNomination,
} from '../Api/electionNominationAdminApi'

const POST_OPTIONS = [
  'All Posts',
  'President',
  'Vice President',
  'General Secretary',
  'Joint Secretary',
  'Treasurer',
  'Executive Member (i)',
  'Executive Member (ii)',
  'Executive Member (iii)',
]

const STATUS_OPTIONS = [
  'All Status',
  'Submitted',
  'Under Review',
  'Verified',
  'Approved',
  'Rejected',
]

const ElectionNominations = () => {
  const [nominations, setNominations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPost, setSelectedPost] = useState('All Posts')
  const [selectedStatus, setSelectedStatus] = useState('All Status')

  // Modals state
  const [selectedNomination, setSelectedNomination] = useState(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [remarks, setRemarks] = useState('')
  const [feedbackMsg, setFeedbackMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // Load nominations from backend
  const loadNominations = useCallback(async () => {
    setLoading(true)
    setErrorMsg('')
    try {
      const params = {}
      if (selectedPost !== 'All Posts') params.post = selectedPost
      if (selectedStatus !== 'All Status') params.status = selectedStatus
      if (searchQuery.trim()) params.search = searchQuery.trim()

      const res = await fetchElectionNominations(params)
      if (res && res.success) {
        setNominations(res.data || [])
      } else {
        setNominations([])
      }
    } catch (err) {
      console.warn('Failed to load nominations:', err)
      setErrorMsg(
        err.response?.data?.message ||
          'Failed to connect to backend server. Make sure server is running on port 5000.'
      )
      setNominations([])
    } finally {
      setLoading(false)
    }
  }, [selectedPost, selectedStatus, searchQuery])

  useEffect(() => {
    loadNominations()
  }, [loadNominations])

  // Clear notifications after 5 seconds
  useEffect(() => {
    if (!feedbackMsg && !errorMsg) return
    const timer = setTimeout(() => {
      setFeedbackMsg('')
      setErrorMsg('')
    }, 5000)
    return () => clearTimeout(timer)
  }, [feedbackMsg, errorMsg])

  // Open Detail Modal
  const handleOpenDetail = (nomination) => {
    setSelectedNomination(nomination)
    setNewStatus(nomination.status || 'Submitted')
    setRemarks(nomination.remarks || '')
    setDetailModalOpen(true)
  }

  // Update Status Handler
  const handleUpdateStatus = async () => {
    if (!selectedNomination) return
    setIsUpdating(true)
    try {
      const res = await updateNominationStatus(selectedNomination._id || selectedNomination.nominationId, {
        status: newStatus,
        remarks,
      })
      if (res.success) {
        setFeedbackMsg(`Nomination status updated to '${newStatus}' successfully!`)
        setDetailModalOpen(false)
        loadNominations()
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update nomination status')
    } finally {
      setIsUpdating(false)
    }
  }

  // Delete Handler
  const handleDelete = async (id) => {
    try {
      const res = await deleteNomination(id)
      if (res.success) {
        setFeedbackMsg('Nomination record deleted successfully')
        setDeleteConfirmId(null)
        loadNominations()
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to delete nomination')
    }
  }

  // Export to CSV
  const handleExportCSV = () => {
    if (!nominations.length) {
      alert('No nominations available to export')
      return
    }

    const headers = [
      'Nomination ID',
      'Post',
      'Term',
      'Candidate Name',
      'Candidate Membership No',
      'Candidate Mobile',
      'Candidate Email',
      'Candidate Address',
      'Candidate Signature',
      'Proposer Name',
      'Proposer Membership No',
      'Proposer Mobile',
      'Seconder Name',
      'Seconder Membership No',
      'Seconder Mobile',
      'Status',
      'Remarks',
      'Submitted Date',
    ]

    const rows = nominations.map((n) => [
      `"${n.nominationId || ''}"`,
      `"${n.post || ''}"`,
      `"${n.term || '2026-2028'}"`,
      `"${n.candidate?.fullName || ''}"`,
      `"${n.candidate?.membershipNo || ''}"`,
      `"${n.candidate?.mobile || ''}"`,
      `"${n.candidate?.email || ''}"`,
      `"${(n.candidate?.address || '').replace(/"/g, '""')}"`,
      `"${n.candidate?.signature || ''}"`,
      `"${n.proposer?.fullName || ''}"`,
      `"${n.proposer?.membershipNo || ''}"`,
      `"${n.proposer?.mobile || ''}"`,
      `"${n.seconder?.fullName || ''}"`,
      `"${n.seconder?.membershipNo || ''}"`,
      `"${n.seconder?.mobile || ''}"`,
      `"${n.status || 'Submitted'}"`,
      `"${(n.remarks || '').replace(/"/g, '""')}"`,
      `"${new Date(n.createdAt).toLocaleDateString('en-IN')}"`,
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `GCAAA_Election_Nominations_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Filter nominations in memory for instant responsiveness
  const filteredNominations = nominations.filter((n) => {
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      !q ||
      n.nominationId?.toLowerCase().includes(q) ||
      n.candidate?.fullName?.toLowerCase().includes(q) ||
      n.candidate?.membershipNo?.toLowerCase().includes(q) ||
      n.candidate?.mobile?.includes(q) ||
      n.candidate?.email?.toLowerCase().includes(q) ||
      n.proposer?.fullName?.toLowerCase().includes(q) ||
      n.seconder?.fullName?.toLowerCase().includes(q)

    const matchesPost = selectedPost === 'All Posts' || n.post === selectedPost
    const matchesStatus = selectedStatus === 'All Status' || n.status === selectedStatus

    return matchesSearch && matchesPost && matchesStatus
  })

  // Status counts
  const totalCount = nominations.length
  const submittedCount = nominations.filter((n) => n.status === 'Submitted' || !n.status).length
  const underReviewCount = nominations.filter((n) => n.status === 'Under Review').length
  const approvedCount = nominations.filter((n) => n.status === 'Approved' || n.status === 'Verified').length
  const rejectedCount = nominations.filter((n) => n.status === 'Rejected').length

  // Helper badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
      case 'Verified':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'Under Review':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      default:
        return 'bg-red-100 text-red-800 border-red-300'
    }
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 bg-neutral-50 min-h-screen">
      {/* Alerts */}
      {feedbackMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between shadow-sm animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
          <button onClick={() => setFeedbackMsg('')} className="text-emerald-700 hover:text-emerald-950">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center justify-between shadow-sm animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')} className="text-red-700 hover:text-red-950">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-[#700018] text-xs font-bold uppercase tracking-wider mb-2">
            <Vote className="w-3.5 h-3.5" />
            <span>Executive Body Election 2026 – 2028</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-serif text-neutral-900 tracking-tight">
            Election Nominations
          </h1>
          <p className="text-neutral-500 text-xs sm:text-sm mt-1">
            Review, scrutinize, approve and manage alumni candidate nominations submitted from the public portal.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadNominations}
            disabled={loading}
            className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-[#700018] hover:bg-red-800 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition shadow-md cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
          <span className="text-xs font-semibold text-neutral-500 block uppercase">Total Nominations</span>
          <span className="text-2xl font-black text-neutral-900 mt-1 block">{totalCount}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-red-200 bg-red-50/30 shadow-sm">
          <span className="text-xs font-semibold text-red-700 block uppercase">Submitted / New</span>
          <span className="text-2xl font-black text-red-900 mt-1 block">{submittedCount}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/30 shadow-sm">
          <span className="text-xs font-semibold text-blue-700 block uppercase">Under Review</span>
          <span className="text-2xl font-black text-blue-900 mt-1 block">{underReviewCount}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 shadow-sm">
          <span className="text-xs font-semibold text-emerald-700 block uppercase">Verified / Approved</span>
          <span className="text-2xl font-black text-emerald-900 mt-1 block">{approvedCount}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-red-200 bg-red-50/30 shadow-sm">
          <span className="text-xs font-semibold text-red-700 block uppercase">Rejected</span>
          <span className="text-2xl font-black text-red-900 mt-1 block">{rejectedCount}</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by candidate name, membership no, mobile, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-50 rounded-lg border border-neutral-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#700018]"
          />
        </div>

        {/* Post Filter */}
        <div className="w-full md:w-56">
          <select
            value={selectedPost}
            onChange={(e) => setSelectedPost(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-50 rounded-lg border border-neutral-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#700018]"
          >
            {POST_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-44">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-50 rounded-lg border border-neutral-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#700018]"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Nominations Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#faf9f6] text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                <th className="py-3 px-3 w-12 text-center">S.No</th>
                <th className="py-3 px-3 w-20 text-center">Actions</th>
                <th className="py-3 px-4 whitespace-nowrap">Ref. ID</th>
                <th className="py-3 px-4 whitespace-nowrap">Post Applied For</th>
                <th className="py-3 px-4 min-w-[220px]">Candidate Details</th>
                <th className="py-3 px-4 min-w-[170px]">Proposer</th>
                <th className="py-3 px-4 min-w-[170px]">Seconder</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Status</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Submitted At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-3 border-[#800018] border-t-transparent" />
                    <p className="mt-3 text-xs font-semibold text-gray-500">
                      Loading nominations records from database...
                    </p>
                  </td>
                </tr>
              ) : filteredNominations.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center">
                    <AlertCircle size={36} className="mx-auto text-gray-300 mb-2" />
                    <h4 className="font-semibold text-gray-800 text-sm">No Nomination Records Found</h4>
                    <p className="text-xs text-gray-400 mt-1">
                      Submitted nominations from the public portal will appear here automatically.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredNominations.map((nomination, idx) => (
                  <tr
                    key={nomination._id || nomination.nominationId}
                    className="transition-colors hover:bg-red-50/20"
                  >
                    {/* S.No */}
                    <td className="py-3 px-3 text-center font-mono text-xs text-gray-500 font-medium">
                      {idx + 1}
                    </td>

                    {/* Actions (Brought Forward to Front) */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(nomination)}
                          title="View Full Application"
                          className="rounded-lg p-1.5 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition cursor-pointer"
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(nomination._id || nomination.nominationId)}
                          title="Delete Nomination"
                          className="rounded-lg p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>

                    {/* Ref ID */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-block font-mono text-xs font-bold tracking-wide text-[#700018] bg-[#800018]/15 px-2.5 py-0.5 rounded-md">
                        {nomination.nominationId || 'GCA-NOM-2026'}
                      </span>
                    </td>

                    {/* Post Applied For */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-block px-2.5 py-0.5 rounded bg-gray-100 text-[11px] font-semibold text-gray-700">
                        {nomination.post}
                      </span>
                    </td>

                    {/* Candidate Details (Clear rows for Name, Membership No, and Contact No) */}
                    <td className="py-3 px-4 min-w-[220px]">
                      <div className="flex items-start gap-3">
                        <div
                          onClick={() => handleOpenDetail(nomination)}
                          className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl overflow-hidden border border-gray-100 shadow-2xs mt-0.5 ${
                            nomination.candidate?.photo
                              ? 'cursor-pointer hover:ring-2 hover:ring-[#800018]/40 transition'
                              : 'bg-[#800018]/10 text-[#800018]'
                          }`}
                          title={nomination.candidate?.photo ? 'Click to view photo & details' : ''}
                        >
                          {nomination.candidate?.photo ? (
                            <img
                              src={nomination.candidate.photo}
                              alt={nomination.candidate.fullName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-bold uppercase">
                              {(nomination.candidate?.fullName?.replace(/^Ar\.\s*/i, '')?.[0] || 'C').toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          {/* Row 1: Candidate Name */}
                          <p className="font-semibold text-gray-900 text-sm whitespace-nowrap">
                            {nomination.candidate?.fullName}
                          </p>

                          {/* Row 2: Membership Number */}
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] uppercase font-bold text-gray-400">Mem No:</span>
                            <span className="font-mono text-xs font-bold text-[#700018] bg-[#800018]/15 px-1.5 py-0.2 rounded">
                              {nomination.candidate?.membershipNo}
                            </span>
                          </div>

                          {/* Row 3: Contact Number */}
                          {nomination.candidate?.mobile && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-600 mt-1">
                              <Phone size={11} className="text-gray-400 shrink-0" />
                              <span className="font-mono text-[11px] font-medium text-gray-600">
                                {nomination.candidate?.mobile}
                              </span>
                            </div>
                          )}

                          {/* Row 4: Signature Badge (if uploaded) */}
                          {nomination.candidate?.signature && (
                            <div className="mt-1 flex items-center">
                              <a
                                href={nomination.candidate.signature}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 px-1.5 py-0.5 rounded transition cursor-pointer"
                                title="View candidate signature in new tab"
                              >
                                <FileSignature size={10} className="text-blue-600" />
                                <span>Signature</span>
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Proposer */}
                    <td className="py-3 px-4 min-w-[170px] whitespace-nowrap">
                      <p className="font-semibold text-gray-800 text-xs">
                        {nomination.proposer?.fullName}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[10px] uppercase font-semibold text-gray-400">Mem:</span>
                        <span className="font-mono text-[11px] font-bold text-[#700018]">
                          {nomination.proposer?.membershipNo}
                        </span>
                      </div>
                      {nomination.proposer?.mobile && (
                        <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5">
                          <Phone size={10} className="text-gray-400 shrink-0" />
                          <span className="font-mono">{nomination.proposer?.mobile}</span>
                        </div>
                      )}
                    </td>

                    {/* Seconder */}
                    <td className="py-3 px-4 min-w-[170px] whitespace-nowrap">
                      <p className="font-semibold text-gray-800 text-xs">
                        {nomination.seconder?.fullName}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[10px] uppercase font-semibold text-gray-400">Mem:</span>
                        <span className="font-mono text-[11px] font-bold text-[#700018]">
                          {nomination.seconder?.membershipNo}
                        </span>
                      </div>
                      {nomination.seconder?.mobile && (
                        <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5">
                          <Phone size={10} className="text-gray-400 shrink-0" />
                          <span className="font-mono">{nomination.seconder?.mobile}</span>
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          nomination.status === 'Approved' || nomination.status === 'Verified'
                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20'
                            : nomination.status === 'Under Review'
                            ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20'
                            : nomination.status === 'Rejected'
                            ? 'bg-red-50 text-red-700 ring-1 ring-red-600/20'
                            : 'bg-red-50 text-red-700 ring-1 ring-red-600/20'
                        }`}
                      >
                        {nomination.status === 'Approved' || nomination.status === 'Verified' ? (
                          <ShieldCheck size={12} />
                        ) : nomination.status === 'Under Review' ? (
                          <Clock size={12} />
                        ) : nomination.status === 'Rejected' ? (
                          <AlertCircle size={12} />
                        ) : (
                          <Clock size={12} />
                        )}
                        <span>{nomination.status || 'Submitted'}</span>
                      </span>
                    </td>

                    {/* Date & Time */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {nomination.createdAt ? (
                        <div className="font-mono text-xs">
                          <p className="font-medium text-gray-800">
                            {new Date(nomination.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                          <p className="text-[11px] text-gray-400 font-medium">
                            {new Date(nomination.createdAt).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
                            })}
                          </p>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">Recent</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100 bg-[#faf9f6] px-4 py-3 text-xs text-gray-500">
          <div>
            Showing <strong className="text-gray-900 font-semibold">{filteredNominations.length}</strong> of{' '}
            <strong className="text-gray-900 font-semibold">{nominations.length}</strong> nominations
          </div>
        </div>
      </div>

      {/* ========================================================
          DETAIL & SCRUTINY MODAL
      ======================================================== */}
      {detailModalOpen && selectedNomination && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-3xl bg-white text-neutral-900 rounded-2xl shadow-2xl border border-neutral-300 overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="bg-[#700018] text-white p-5 flex items-center justify-between shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-bold text-[#fca5a5]">
                    Nomination Scrutiny &amp; Details
                  </span>
                  <span className="font-mono text-xs bg-white/10 px-2 py-0.5 rounded">
                    {selectedNomination.nominationId}
                  </span>
                </div>
                <h3 className="text-lg font-bold mt-0.5">
                  Post: {selectedNomination.post}
                </h3>
              </div>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
              {/* Candidate Card */}
              <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50/50 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#700018] flex items-center gap-1.5 border-b pb-2">
                  <User className="w-4 h-4" />
                  Candidate Information
                </h4>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  {/* Photo & Signature visual column */}
                  <div className="flex flex-row sm:flex-col items-center gap-3 shrink-0">
                    {/* Candidate Photograph */}
                    <div className="text-center">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                        Photograph
                      </span>
                      {selectedNomination.candidate?.photo ? (
                        <>
                          <img
                            src={selectedNomination.candidate.photo}
                            alt="Candidate"
                            className="w-24 h-28 object-cover rounded-xl border border-neutral-300 shadow-xs"
                          />
                          <a
                            href={selectedNomination.candidate.photo}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] font-bold text-[#700018] hover:underline inline-flex items-center gap-1 mt-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            View Photo
                          </a>
                        </>
                      ) : (
                        <div className="w-24 h-28 bg-neutral-200 rounded-xl flex items-center justify-center text-neutral-400 font-bold text-xs">
                          No Photo
                        </div>
                      )}
                    </div>

                    {/* Candidate Signature */}
                    <div className="text-center">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                        Signature
                      </span>
                      {selectedNomination.candidate?.signature ? (
                        <>
                          <div className="w-24 h-16 bg-white rounded-xl border border-neutral-300 p-1 flex items-center justify-center shadow-2xs overflow-hidden">
                            <img
                              src={selectedNomination.candidate.signature}
                              alt="Candidate Signature"
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                          <a
                            href={selectedNomination.candidate.signature}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] font-bold text-blue-700 hover:underline inline-flex items-center gap-1 mt-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            View Sig
                          </a>
                        </>
                      ) : (
                        <div className="w-24 h-16 bg-neutral-200/80 rounded-xl flex items-center justify-center text-neutral-400 font-medium text-[11px]">
                          No Signature
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 text-xs">
                    <div>
                      <span className="text-neutral-500 block text-[11px]">Full Name:</span>
                      <strong className="text-neutral-900 text-sm">
                        {selectedNomination.candidate?.fullName}
                      </strong>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[11px]">GCAAA Membership No:</span>
                      <strong className="font-mono text-neutral-900 text-sm">
                        {selectedNomination.candidate?.membershipNo}
                      </strong>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[11px]">Mobile No:</span>
                      <span className="text-neutral-800 font-medium">{selectedNomination.candidate?.mobile}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[11px]">Email Address:</span>
                      <span className="text-neutral-800">{selectedNomination.candidate?.email}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-neutral-500 block text-[11px]">Complete Address:</span>
                      <span className="text-neutral-800">
                        {selectedNomination.candidate?.address || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Endorsements (Proposer & Seconder) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Proposer */}
                <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50/50 space-y-2.5 text-xs">
                  <h5 className="font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1 border-b pb-1.5">
                    <Users className="w-3.5 h-3.5 text-[#700018]" />
                    Proposer Particulars
                  </h5>
                  <div className="flex items-start gap-3">
                    {selectedNomination.proposer?.photo ? (
                      <div className="shrink-0 text-center">
                        <div className="w-16 h-20 bg-white rounded-lg border border-neutral-300 p-1 flex items-center justify-center shadow-xs overflow-hidden">
                          <img
                            src={selectedNomination.proposer.photo}
                            alt="Proposer Signature"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <a
                          href={selectedNomination.proposer.photo}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[9px] text-blue-700 font-bold hover:underline block mt-0.5"
                        >
                          View Sig ↗
                        </a>
                      </div>
                    ) : (
                      <div className="w-16 h-20 bg-neutral-200/80 rounded-lg flex items-center justify-center text-neutral-400 font-medium shrink-0 text-[10px]">
                        No Sig
                      </div>
                    )}
                    <div className="space-y-1 flex-1">
                      <p>
                        <span className="text-neutral-500 block text-[10px]">Name:</span>{' '}
                        <strong className="text-neutral-900">{selectedNomination.proposer?.fullName}</strong>
                      </p>
                      <p>
                        <span className="text-neutral-500 block text-[10px]">Mem No:</span>{' '}
                        <strong className="font-mono text-[#700018]">{selectedNomination.proposer?.membershipNo}</strong>
                      </p>
                      <p>
                        <span className="text-neutral-500 block text-[10px]">Mobile:</span>{' '}
                        <span className="text-neutral-800">{selectedNomination.proposer?.mobile}</span>
                      </p>
                      {selectedNomination.proposer?.email && (
                        <p>
                          <span className="text-neutral-500 block text-[10px]">Email:</span>{' '}
                          <span className="text-neutral-800">{selectedNomination.proposer?.email}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="border-t pt-1.5">
                    <span className="text-neutral-500 block text-[10px]">Address:</span>{' '}
                    <span className="text-neutral-800 text-[11px]">{selectedNomination.proposer?.address}</span>
                  </div>
                </div>

                {/* Seconder */}
                <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50/50 space-y-2.5 text-xs">
                  <h5 className="font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1 border-b pb-1.5">
                    <Users className="w-3.5 h-3.5 text-[#700018]" />
                    Seconder Particulars
                  </h5>
                  <div className="flex items-start gap-3">
                    {selectedNomination.seconder?.photo ? (
                      <div className="shrink-0 text-center">
                        <div className="w-16 h-20 bg-white rounded-lg border border-neutral-300 p-1 flex items-center justify-center shadow-xs overflow-hidden">
                          <img
                            src={selectedNomination.seconder.photo}
                            alt="Seconder Signature"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <a
                          href={selectedNomination.seconder.photo}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[9px] text-blue-700 font-bold hover:underline block mt-0.5"
                        >
                          View Sig ↗
                        </a>
                      </div>
                    ) : (
                      <div className="w-16 h-20 bg-neutral-200/80 rounded-lg flex items-center justify-center text-neutral-400 font-medium shrink-0 text-[10px]">
                        No Sig
                      </div>
                    )}
                    <div className="space-y-1 flex-1">
                      <p>
                        <span className="text-neutral-500 block text-[10px]">Name:</span>{' '}
                        <strong className="text-neutral-900">{selectedNomination.seconder?.fullName}</strong>
                      </p>
                      <p>
                        <span className="text-neutral-500 block text-[10px]">Mem No:</span>{' '}
                        <strong className="font-mono text-[#700018]">{selectedNomination.seconder?.membershipNo}</strong>
                      </p>
                      <p>
                        <span className="text-neutral-500 block text-[10px]">Mobile:</span>{' '}
                        <span className="text-neutral-800">{selectedNomination.seconder?.mobile}</span>
                      </p>
                      {selectedNomination.seconder?.email && (
                        <p>
                          <span className="text-neutral-500 block text-[10px]">Email:</span>{' '}
                          <span className="text-neutral-800">{selectedNomination.seconder?.email}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="border-t pt-1.5">
                    <span className="text-neutral-500 block text-[10px]">Address:</span>{' '}
                    <span className="text-neutral-800 text-[11px]">{selectedNomination.seconder?.address}</span>
                  </div>
                </div>
              </div>

              {/* Declaration Status */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-900 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Candidate has digitally agreed to the official declaration and election rules.
                </span>
              </div>

              {/* Scrutiny & Status Controls */}
              <div className="p-4 bg-neutral-100 rounded-xl border border-neutral-300 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-800">
                  Returning Officer / Admin Scrutiny
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Change Nomination Status:
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-lg border border-neutral-300 text-xs font-bold"
                    >
                      <option value="Submitted">Submitted (Pending)</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Verified">Verified</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Scrutiny Remarks:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Verified residential proof, Lucknow valid"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-lg border border-neutral-300 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between gap-3 shrink-0">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border border-neutral-300 hover:bg-neutral-100 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Application</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDetailModalOpen(false)}
                  className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 rounded-lg text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStatus}
                  disabled={isUpdating}
                  className="px-5 py-2 bg-[#700018] hover:bg-red-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer"
                >
                  {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Save Status</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-neutral-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-base">Delete Nomination?</h3>
              <p className="text-xs text-neutral-500 mt-1">
                Are you sure you want to delete this nomination record? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 rounded-lg text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ElectionNominations
