import React from 'react'
import { Activity, UserCheck, CalendarCheck, BookMarked, MessageSquare } from 'lucide-react'

const activities = [
  {
    id: 1,
    title: 'New Alumni Membership Approved',
    description: 'Ar. Neha Sinha (Batch 2017) verification completed by Admin.',
    time: '25 mins ago',
    icon: UserCheck,
    color: 'text-emerald-600 bg-emerald-50',
  },
  {
    id: 2,
    title: 'Event Registration Target Reached',
    description: 'Annual Meet 2026 passed 300 confirmed alumni attendees.',
    time: '2 hours ago',
    icon: CalendarCheck,
    color: 'text-red-600 bg-red-50',
  },
  {
    id: 3,
    title: 'Journal Publication Released',
    description: 'Volume 14: "Vernacular Architecture in Northern India" uploaded.',
    time: '5 hours ago',
    icon: BookMarked,
    color: 'text-[#800018] bg-red-50',
  },
  {
    id: 4,
    title: 'New Blog Comment & Inquiry',
    description: 'Feedback received on "Urban Redevelopment in Lucknow" article.',
    time: 'Yesterday',
    icon: MessageSquare,
    color: 'text-blue-600 bg-blue-50',
  },
]

const RecentActivityFeed = () => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <h3 className="font-serif text-lg font-bold text-gray-900">
            System Activity Log
          </h3>
          <p className="text-xs text-gray-500">
            Real-time association events and updates
          </p>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
          Live
        </span>
      </div>

      <div className="mt-5 space-y-4">
        {activities.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.id} className="flex items-start gap-3.5">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.color} shadow-xs`}
              >
                <Icon size={18} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-800">
                    {item.title}
                  </h4>
                  <span className="text-[11px] text-gray-400">{item.time}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RecentActivityFeed
