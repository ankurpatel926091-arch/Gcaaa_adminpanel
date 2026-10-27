import React, { useState } from 'react'
import PublicationStats from '../Component/Publications/PublicationStats'
import PublicationFilters from '../Component/Publications/PublicationFilters'
import PublicationList from '../Component/Publications/PublicationList'
import PublicationModal from '../Component/Publications/PublicationModal'

const initialPublications = [
  {
    id: 1,
    title: 'Vernacular Architecture & Climate Resilient Envelopes',
    category: 'Research Journal',
    edition: 'Vol. 15, Issue 1 (2026)',
    author: 'Dr. Sameer Srivastava & GCAAA Research Cell',
    publishDate: 'Feb 2026',
    fileSize: '4.6 MB',
    description:
      'Empirical investigation on traditional passive cooling strategies in Awadh architectural monuments and modern application in institutional campuses.',
  },
  {
    id: 2,
    title: 'GCA Annual Alumni Chronicle 2025: Golden Impressions',
    category: 'Annual Magazine',
    edition: 'Yearly Edition 2025',
    author: 'GCAAA Editorial Committee',
    publishDate: 'Dec 2025',
    fileSize: '18.4 MB',
    description:
      'Compendium of alumni milestones, architectural firm profiles, award-winning building designs, and convocation retrospectives.',
  },
  {
    id: 3,
    title: 'Urban Heritage Conservation Guidelines for Historic Lucknow',
    category: 'Research Journal',
    edition: 'Special Monograph Series 4',
    author: 'Ar. Rajesh Verma & Prof. K.P. Saxena',
    publishDate: 'Nov 2025',
    fileSize: '8.2 MB',
    description:
      'Policy recommendations for revitalizing historic city centers while balancing commercial real-estate demands.',
  },
  {
    id: 4,
    title: 'GCAAA Quarterly Newsletter - Winter 2025',
    category: 'Newsletter',
    edition: 'Issue 48',
    author: 'Executive Secretariat',
    publishDate: 'Jan 2026',
    fileSize: '2.1 MB',
    description:
      'Updates on upcoming batch reunions, scholarship grants for underprivileged students, and alumni sports meets.',
  },
  {
    id: 5,
    title: 'Advances in Parametric Facade Optimization',
    category: 'Conference Proceedings',
    edition: 'Symposium 2025',
    author: 'Dept. of Computational Architecture',
    publishDate: 'Oct 2025',
    fileSize: '6.7 MB',
    description:
      'Selected peer-reviewed papers presented at the International Symposium on Digital Fabrication & Envelope Performance.',
  },
]

const Publications = () => {
  const [publications, setPublications] = useState(initialPublications)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingPub, setEditingPub] = useState(null)

  const handleOpenAdd = () => {
    setEditingPub(null)
    setModalOpen(true)
  }

  const handleEdit = (pub) => {
    setEditingPub(pub)
    setModalOpen(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this publication?')) {
      setPublications((prev) => prev.filter((p) => p.id !== id))
    }
  }

  const handleDownload = (pub) => {
    alert(`Downloading ${pub.title} (${pub.fileSize})...`)
  }

  const handleSave = (data) => {
    if (editingPub) {
      setPublications((prev) =>
        prev.map((p) => (p.id === editingPub.id ? { ...data, id: editingPub.id } : p))
      )
    } else {
      const newPub = {
        ...data,
        id: Date.now(),
      }
      setPublications([newPub, ...publications])
    }
  }

  const filteredPublications = publications.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      selectedCategory === 'All Categories' || p.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const journalCount = publications.filter((p) => p.category === 'Research Journal').length

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#800018]">
          Scholarly & Association Press
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Publications & Journals
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Catalog of architectural journals, research papers, newsletters, and annual magazines.
        </p>
      </div>

      {/* KPI Stats */}
      <PublicationStats
        totalCount={publications.length}
        journalCount={journalCount}
      />

      {/* Filters */}
      <PublicationFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onOpenAddModal={handleOpenAdd}
      />

      {/* List */}
      <PublicationList
        publications={filteredPublications}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDownload={handleDownload}
      />

      {/* Modal */}
      <PublicationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        editingPub={editingPub}
      />
    </div>
  )
}

export default Publications
