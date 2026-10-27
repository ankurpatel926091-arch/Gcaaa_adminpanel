import React, { useState } from 'react'
import GalleryStats from '../Component/Gallery/GalleryStats'
import GalleryFilters from '../Component/Gallery/GalleryFilters'
import GalleryGrid from '../Component/Gallery/GalleryGrid'
import GalleryUploadModal from '../Component/Gallery/GalleryUploadModal'

const initialPhotos = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    caption: 'Heritage Courtyard - Historical Quadrangle',
    album: 'Campus Architecture',
    date: 'Feb 2026',
    resolution: '4K UHD',
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    caption: 'Annual Alumni Meet 2025 Keynote Session',
    album: 'Annual Alumni Meet',
    date: 'Nov 2025',
    resolution: '1080p',
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
    caption: 'Architectural Thesis Model Display',
    album: 'Design Exhibition',
    date: 'Jan 2026',
    resolution: '4K UHD',
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
    caption: '64th Convocation Ceremony Batch 2024',
    album: 'Convocation Day',
    date: 'Dec 2024',
    resolution: '1080p',
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    caption: 'Faculty & Founding Principals Tribute Hall',
    album: 'Faculty & Founders',
    date: 'Aug 2025',
    resolution: 'Archive 1980',
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    caption: 'Architecture Studio Late Night Reviews',
    album: 'Campus Architecture',
    date: 'Oct 2025',
    resolution: '1080p',
  },
  {
    id: 7,
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    caption: 'Silver Jubilee Gala Celebration Dinner',
    album: 'Annual Alumni Meet',
    date: 'Sep 2025',
    resolution: '4K UHD',
  },
  {
    id: 8,
    url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    caption: 'Urban Masterplanning Exhibition Showcase',
    album: 'Design Exhibition',
    date: 'Jan 2026',
    resolution: '1080p',
  },
]

const Gallery = () => {
  const [photos, setPhotos] = useState(initialPhotos)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAlbum, setSelectedAlbum] = useState('All Albums')
  const [uploadOpen, setUploadOpen] = useState(false)

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this photo?')) {
      setPhotos((prev) => prev.filter((p) => p.id !== id))
    }
  }

  const handlePreview = (item) => {
    window.open(item.url, '_blank')
  }

  const handleUpload = (newPhoto) => {
    setPhotos([newPhoto, ...photos])
  }

  const filteredPhotos = photos.filter((item) => {
    const matchesSearch =
      item.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.album.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesAlbum =
      selectedAlbum === 'All Albums' || item.album === selectedAlbum

    return matchesSearch && matchesAlbum
  })

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#800018]">
          Media & Memories
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Photo Gallery Archive
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Historical records, reunion snapshots, campus heritage, and architectural showcases.
        </p>
      </div>

      {/* KPI Stats */}
      <GalleryStats
        totalPhotos={photos.length}
        albumCount={new Set(photos.map((p) => p.album)).size}
      />

      {/* Filters */}
      <GalleryFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedAlbum={selectedAlbum}
        setSelectedAlbum={setSelectedAlbum}
        onOpenUpload={() => setUploadOpen(true)}
      />

      {/* Grid */}
      <GalleryGrid
        photos={filteredPhotos}
        onDelete={handleDelete}
        onPreview={handlePreview}
      />

      {/* Upload Modal */}
      <GalleryUploadModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={handleUpload}
      />
    </div>
  )
}

export default Gallery
