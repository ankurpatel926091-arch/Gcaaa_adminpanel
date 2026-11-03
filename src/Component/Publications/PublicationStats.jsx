import React from 'react';
import { BookOpen, FileText, Calendar, Layers } from 'lucide-react';

const PublicationStats = ({ stats = {} }) => {
  const statItems = [
    {
      label: 'Total Publications',
      value: stats.totalPublications !== undefined ? stats.totalPublications : 3,
      icon: BookOpen,
      bg: 'bg-[#800018]',
    },
    {
      label: 'Documented Pages',
      value: stats.totalDocumentedPages !== undefined ? stats.totalDocumentedPages : 446,
      icon: FileText,
      bg: 'bg-[#800018]',
    },
    {
      label: 'Year Span',
      value: stats.yearRange || '2013 – 2025',
      icon: Calendar,
      bg: 'bg-emerald-700',
    },
    {
      label: 'Active Editions',
      value: stats.publishedCount !== undefined ? `${stats.publishedCount} Published` : '3 Published',
      icon: Layers,
      bg: 'bg-[#5c0011]',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((s) => {
        const Icon = s.icon;
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
        );
      })}
    </div>
  );
};

export default PublicationStats;
