import React from 'react'
import { CalendarDays, Clock, CheckCircle, Users } from 'lucide-react'

const EventStats = ({ totalEvents, upcomingEvents, attendeesCount }) => {
  const stats = [
    {
      label: 'Total Events',
      value: totalEvents || 18,
      icon: CalendarDays,
      bg: 'bg-[#800018]',
    },
    {
      label: 'Upcoming Events',
      value: upcomingEvents || 6,
      icon: Clock,
      bg: 'bg-red-600',
    },
    {
      label: 'Past Completed',
      value: '12',
      icon: CheckCircle,
      bg: 'bg-emerald-700',
    },
    {
      label: 'Total RSVPs & Attendees',
      value: attendeesCount || 850,
      icon: Users,
      bg: 'bg-[#800018]',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => {
        const Icon = s.icon
        return (
          <div
            key={s.label}
            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-xs"
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
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-white ${s.bg}`}
              >
                <Icon size={20} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default EventStats
