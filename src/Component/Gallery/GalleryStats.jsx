import React from 'react';
import { Image, Layers, Sparkles, FolderArchive } from 'lucide-react';

const GalleryStats = ({ stats = {}, isLoading = false }) => {
  const cards = [
    {
      label: 'Archived Photos',
      value: typeof stats.totalPhotos === 'number' ? stats.totalPhotos : 99,
      icon: Image,
      color: 'bg-[#800018]',
    },
    {
      label: 'Photo Albums',
      value: typeof stats.albumCount === 'number' ? `${stats.albumCount} Albums` : '2 Albums',
      icon: Layers,
      color: 'bg-[#800018] text-white',
    },
    {
      label: 'GBM 2025 Photos',
      value: typeof stats.gbmCount === 'number' ? stats.gbmCount : 72,
      icon: Sparkles,
      color: 'bg-red-600',
    },
    {
      label: 'Dharohar & Reunions',
      value: typeof stats.dharoharCount === 'number' ? stats.dharoharCount : 27,
      icon: FolderArchive,
      color: 'bg-[#5c0011]',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((s) => {
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
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-white ${s.color}`}
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

export default GalleryStats;
