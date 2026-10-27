import React from 'react'
import { BookOpen, FileText, Download, Award } from 'lucide-react'

const PublicationStats = ({ totalCount, journalCount }) => {
  const stats = [
    {
      label: 'Total Publications',
      value: totalCount || 96,
      icon: BookOpen,
      bg: 'bg-[#800018]',
    },
    {
      label: 'Peer-Reviewed Journals',
      value: journalCount || 34,
      icon: Award,
      bg: 'bg-[#800018]',
    },
    {
      label: 'Annual Magazines',
      value: '22',
      icon: FileText,
      bg: 'bg-emerald-700',
    },
    {
      label: 'Total PDF Downloads',
      value: '14.2k',
      icon: Download,
      bg: 'bg-[#5c0011]',
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

export default PublicationStats
