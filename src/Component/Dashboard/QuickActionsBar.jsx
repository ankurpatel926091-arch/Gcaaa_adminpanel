import React from 'react'
import { Link } from 'react-router-dom'
import { UserCheck, Users, Vote, FileText } from 'lucide-react'

const actions = [
  {
    title: 'Registered Members',
    desc: 'Verify and manage members',
    icon: UserCheck,
    path: '/registered-members',
    color: 'bg-[#700018]',
  },
  {
    title: 'Batch Directory',
    desc: 'Explore all cohorts',
    icon: Users,
    path: '/all-batches',
    color: 'bg-[#800018]',
  },
  {
    title: 'Election Scrutiny',
    desc: 'Review 2026-28 nominations',
    icon: Vote,
    path: '/election-nominations',
    color: 'bg-[#9f1239]',
  },
  {
    title: 'Publish Article',
    desc: 'Post news or blog',
    icon: FileText,
    path: '/blogs',
    color: 'bg-[#800018]',
  },
]

const QuickActionsBar = () => {
  return (
    <div className="rounded-2xl border border-[#e9e2dc] bg-gradient-to-r from-[#700018] via-[#85001c] to-[#45000f] p-5 sm:p-6 text-white shadow-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#fca5a5]">
            Direct Operations
          </span>
          <h3 className="font-serif text-lg sm:text-xl font-bold mt-1">
            GCAAA Quick Administration Actions
          </h3>
          <p className="text-xs text-white/80 mt-1 max-w-xl">
            Access portal operations: manage registered alumni records, batch cohort directories, verify election nominations, or manage association articles.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {actions.map((act) => {
            const Icon = act.icon
            return (
              <Link
                key={act.title}
                to={act.path}
                className="group flex flex-col items-center justify-center rounded-xl bg-white/10 p-3 text-center backdrop-blur-xs border border-white/10 hover:bg-white/20 transition-all hover:scale-105"
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${act.color} text-white shadow-sm transition-transform group-hover:scale-110 mb-1.5`}>
                  <Icon size={18} />
                </div>
                <span className="text-xs font-bold leading-tight block">
                  {act.title}
                </span>
                <span className="text-[10px] text-white/60 line-clamp-1 mt-0.5">
                  {act.desc}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default QuickActionsBar
