import React from 'react'
import { Link } from 'react-router-dom'
import { Vote, ArrowUpRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react'

const RecentNominationsCard = ({ nominations = [], loading = false }) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-base font-bold text-gray-900">
              Election Nominations
            </h3>
            <span className="rounded-full bg-red-50 text-red-800 text-[10px] font-bold px-2 py-0.5 border border-red-200">
              2026–2028
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Executive Body election candidatures
          </p>
        </div>

        <Link
          to="/election-nominations"
          className="flex items-center gap-1 text-xs font-semibold text-[#800018] hover:text-[#bd0929] transition"
        >
          View All <ArrowUpRight size={14} />
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
        ) : nominations.length === 0 ? (
          <div className="py-8 text-center text-gray-400">
            <Vote className="mx-auto h-7 w-7 text-gray-300 mb-1" />
            <p className="text-xs font-medium">No election nominations submitted yet.</p>
          </div>
        ) : (
          nominations.slice(0, 5).map((nom) => {
            const cand = nom.candidate || {}
            const status = nom.status || 'Submitted'
            const isApproved = status === 'Approved' || status === 'Verified'
            const isReview = status === 'Under Review'

            return (
              <div
                key={nom._id || nom.id || nom.nominationId}
                className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 p-3 hover:bg-[#faf9f6] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {cand.photo ? (
                    <img
                      src={cand.photo}
                      alt={cand.fullName}
                      className="h-10 w-10 rounded-full object-cover border border-gray-200 shrink-0"
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#800018]/10 text-[#800018] font-bold text-xs">
                      {cand.fullName ? cand.fullName.slice(0, 2).toUpperCase() : 'NM'}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">
                      {cand.fullName || 'Candidate'}
                    </p>
                    <p className="text-[11px] font-semibold text-[#800018] truncate">
                      {nom.post || 'Executive Post'}
                    </p>
                    <p className="text-[10px] text-gray-400 font-mono">
                      Ref: {nom.nominationId || 'Pending'}
                    </p>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold shrink-0 ${
                    isApproved
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : isReview
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {isApproved ? (
                    <CheckCircle2 size={11} />
                  ) : isReview ? (
                    <Clock size={11} />
                  ) : (
                    <AlertCircle size={11} />
                  )}
                  {status}
                </span>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default RecentNominationsCard
