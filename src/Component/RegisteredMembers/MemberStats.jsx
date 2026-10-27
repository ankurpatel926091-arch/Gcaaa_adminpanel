import React from 'react'
import { Users, CheckCircle2, UserCheck, ShieldCheck, Clock } from 'lucide-react'

const MemberStats = ({ total = 0, verified = 0, active = 0, cohortsCount = 5 }) => {
  const stats = [
    {
      title: 'Total Members',
      value: total.toLocaleString(),
      subtitle: 'Official Life Membership Roll',
      icon: Users,
      accent: '#800018',
    },
    {
      title: 'Paid Members',
      value: verified.toLocaleString(),
      subtitle: 'Membership Fee Confirmed',
      icon: ShieldCheck,
      accent: '#047857',
    },
    {
      title: 'Active Alumni',
      value: active.toLocaleString(),
      subtitle: 'Enrolled & Verified Records',
      icon: UserCheck,
      accent: '#800018',
    },
    {
      title: 'Active Cohorts',
      value: cohortsCount,
      subtitle: 'B.Arch, M.Arch, MURP, etc.',
      icon: Clock,
      accent: '#800018',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.title}
            className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-xs transition hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {stat.title}
                </p>
                <h3 className="mt-1 font-serif text-2xl font-bold text-gray-900">
                  {stat.value}
                </h3>
                <p className="mt-1 text-[11px] text-gray-400">{stat.subtitle}</p>
              </div>

              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-xs transition-transform group-hover:scale-110"
                style={{ backgroundColor: stat.accent }}
              >
                <Icon size={20} strokeWidth={2} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default MemberStats
