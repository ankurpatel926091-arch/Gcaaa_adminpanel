import React from 'react'
import { Link } from 'react-router-dom'
import { Users, UserCheck, Vote, FileText, ArrowUpRight } from 'lucide-react'

const DashboardStats = ({ stats = {}, loading = false }) => {
  const statsData = [
    {
      title: 'Registered Members',
      value: stats.membersTotal ?? 0,
      change: `${stats.membersVerified ?? 0} verified`,
      subtitle: 'official registered members',
      icon: UserCheck,
      accent: '#700018',
      link: '/registered-members',
      badge: 'Live Database',
    },
    {
      title: 'Batch Directory',
      value: stats.batchTotal ?? 0,
      change: `${stats.batchCount || stats.totalBatches || 0} batches`,
      subtitle: 'alumni directory records',
      icon: Users,
      accent: '#9f1239',
      link: '/all-batches',
      badge: 'All Batches',
    },
    {
      title: 'Election Nominations',
      value: stats.nominationsTotal ?? 0,
      change: `${stats.nominationsPending ?? 0} to review`,
      subtitle: 'Executive Body 2026–2028',
      icon: Vote,
      accent: '#800018',
      link: '/election-nominations',
      badge: 'Election 2026',
    },
    {
      title: 'Blogs & Articles',
      value: stats.blogsTotal ?? 0,
      change: `${stats.blogsPublished ?? 0} published`,
      subtitle: `${stats.blogsReads ?? 0} total reads`,
      icon: FileText,
      accent: '#800018',
      link: '/blogs',
      badge: 'Editorial',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat) => {
        const Icon = stat.icon
        return (
          <Link
            key={stat.title}
            to={stat.link}
            className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md block"
          >
            {/* Top red corner accent */}
            <div className="absolute top-0 right-0 h-16 w-16 -mr-8 -mt-8 rounded-full bg-[#800018]/10 transition-transform group-hover:scale-150" />

            <div className="flex items-center justify-between">
              <div>
                <span className="inline-block rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  {stat.badge}
                </span>
                <p className="text-xs font-semibold tracking-wider uppercase text-gray-500">
                  {stat.title}
                </p>
                <h3 className="mt-1 font-serif text-3xl font-bold text-gray-900">
                  {loading ? (
                    <span className="inline-block h-8 w-16 animate-pulse rounded bg-gray-200" />
                  ) : (
                    Number(stat.value).toLocaleString('en-IN')
                  )}
                </h3>
              </div>

              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-md transition-transform group-hover:scale-110 shrink-0"
                style={{ backgroundColor: stat.accent }}
              >
                <Icon size={22} strokeWidth={2} />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
              <span className="truncate">
                <strong className="text-gray-800 font-semibold">{stat.change}</strong>
                <span className="mx-1 text-gray-300">•</span>
                <span className="text-gray-500 text-[11px]">{stat.subtitle}</span>
              </span>
              <ArrowUpRight size={14} className="text-gray-400 group-hover:text-gray-700 transition shrink-0 ml-1" />
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default DashboardStats
