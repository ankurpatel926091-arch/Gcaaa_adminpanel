import React from 'react'
import { Megaphone, Pin, Download, ExternalLink } from 'lucide-react'

const notices = [
  {
    id: 1,
    title: 'Call for Papers: Annual Journal Vol. 16',
    date: 'Due April 30, 2026',
    badge: 'Academic',
    badgeColor: 'bg-red-50 text-[#800018]',
  },
  {
    id: 2,
    title: 'GCA Golden Jubilee Scholarship Applications Open',
    date: 'Due May 10, 2026',
    badge: 'Grant',
    badgeColor: 'bg-red-50 text-red-700',
  },
  {
    id: 3,
    title: 'Nomination for Distinguished Alumnus Award 2026',
    date: 'Due June 01, 2026',
    badge: 'Honor',
    badgeColor: 'bg-emerald-50 text-emerald-700',
  },
]

const AssociationNoticeBoard = () => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#800018]/10 text-[#800018]">
            <Megaphone size={16} />
          </div>
          <div>
            <h4 className="font-serif text-sm font-bold text-gray-900">
              Secretariat Notice Board
            </h4>
            <p className="text-[11px] text-gray-400">
              Official circulars and announcements
            </p>
          </div>
        </div>

        <span className="flex h-2 w-2 rounded-full bg-[#800018]" />
      </div>

      <div className="mt-3.5 space-y-3">
        {notices.map((n) => (
          <div
            key={n.id}
            className="flex items-start justify-between gap-3 rounded-xl border border-gray-100 p-3 hover:bg-[#faf9f6] transition-colors"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${n.badgeColor}`}>
                  {n.badge}
                </span>
                <span className="text-[11px] text-gray-400">{n.date}</span>
              </div>
              <p className="mt-1 text-xs font-semibold text-gray-800 leading-snug">
                {n.title}
              </p>
            </div>
            <Pin size={14} className="shrink-0 text-gray-400 rotate-45" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default AssociationNoticeBoard
