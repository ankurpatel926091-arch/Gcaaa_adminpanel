import React from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, ArrowUpRight, Layers } from 'lucide-react'

const COHORT_COLORS = [
  'bg-[#700018]',
  'bg-[#9f1239]',
  'bg-[#800018]',
  'bg-[#800018]',
  'bg-emerald-700',
  'bg-indigo-700',
  'bg-cyan-700',
  'bg-red-600',
]

const formatCohortLabel = (id = '') => {
  if (!id || id === 'all') return 'B.Arch & Foundation'
  if (id === 'b-arch') return 'Bachelor of Architecture'
  if (id === 'm-arch') return 'Master of Architecture'
  if (id === 'murp') return 'Master of Urban & Regional Planning'
  if (id === 'miend') return 'Master in Environmental Design'
  if (id === 'mind') return 'Master in Interior Design'
  if (id.endsWith('s')) return `${id} Cohort`
  return id.toUpperCase()
}

const BatchDistributionChart = ({ cohorts = [], totalRecords = 0, loading = false }) => {
  // Sort cohorts by count descending, ignore empty
  const validCohorts = cohorts
    .filter((c) => c && c.count > 0 && c._id)
    .sort((a, b) => b.count - a.count)

  const effectiveTotal =
    totalRecords > 0
      ? totalRecords
      : validCohorts.reduce((acc, curr) => acc + (curr.count || 0), 0)

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#800018]/10 text-[#800018]">
            <GraduationCap size={18} />
          </div>
          <div>
            <h4 className="font-serif text-sm font-bold text-gray-900">
              Alumni Distribution by Cohort / Program
            </h4>
            <p className="text-[11px] text-gray-400">
              Live breakdown of records in the alumni directory
            </p>
          </div>
        </div>

        <Link
          to="/all-batches"
          className="flex items-center gap-1 text-xs font-semibold text-[#800018] hover:text-[#bd0929] transition"
        >
          View All <ArrowUpRight size={13} />
        </Link>
      </div>

      <div className="mt-4 space-y-3.5">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse space-y-1.5">
              <div className="flex justify-between">
                <div className="h-3 w-32 bg-gray-200 rounded" />
                <div className="h-3 w-16 bg-gray-200 rounded" />
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full" />
            </div>
          ))
        ) : validCohorts.length === 0 ? (
          <div className="py-6 text-center text-gray-400">
            <Layers className="mx-auto h-6 w-6 text-gray-300 mb-1" />
            <p className="text-xs">No cohort breakdown data available.</p>
          </div>
        ) : (
          validCohorts.slice(0, 6).map((item, idx) => {
            const pct =
              effectiveTotal > 0
                ? Math.min(100, Math.round(((item.count || 0) / effectiveTotal) * 100))
                : 0
            const colorClass = COHORT_COLORS[idx % COHORT_COLORS.length]

            return (
              <div key={item._id}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-gray-700">
                    {formatCohortLabel(item._id)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">
                      {Number(item.count || 0).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium w-8 text-right">
                      {pct}%
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${colorClass} transition-all duration-500`}
                    style={{ width: `${Math.max(pct, 2)}%` }}
                  />
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default BatchDistributionChart
