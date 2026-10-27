import React from 'react'
import { Users, UserCheck, Clock, Award } from 'lucide-react'

const AlumniStats = ({ totalCount, verifiedCount, pendingCount }) => {
  const stats = [
    {
      label: 'Total Alumni Registered',
      value: totalCount || 4850,
      icon: Users,
      color: 'bg-[#800018] text-white',
      borderColor: 'border-[#800018]/20',
    },
    {
      label: 'Verified Members',
      value: verifiedCount || 4620,
      icon: UserCheck,
      color: 'bg-emerald-700 text-white',
      borderColor: 'border-emerald-600/20',
    },
    {
      label: 'Pending Approval',
      value: pendingCount || 230,
      icon: Clock,
      color: 'bg-red-600 text-white',
      borderColor: 'border-red-600/20',
    },
    {
      label: 'Honored Fellows',
      value: '48',
      icon: Award,
      color: 'bg-[#800018] text-white',
      borderColor: 'border-red-700/20',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => {
        const Icon = s.icon
        return (
          <div
            key={s.label}
            className={`rounded-2xl border ${s.borderColor} bg-white p-4 shadow-xs transition hover:shadow-sm`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {s.label}
                </p>
                <h4 className="mt-1 font-serif text-2xl font-bold text-gray-900">
                  {s.value}
                </h4>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}>
                <Icon size={20} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default AlumniStats
