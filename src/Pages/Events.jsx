import React, { useState } from 'react'
import EventStats from '../Component/Events/EventStats'
import EventFilters from '../Component/Events/EventFilters'
import EventCardGrid from '../Component/Events/EventCardGrid'
import EventModal from '../Component/Events/EventModal'

const initialEvents = [
  {
    id: 1,
    title: 'Annual Grand Alumni Meet 2026',
    category: 'Reunion',
    date: 'March 28, 2026',
    time: '10:00 AM - 6:00 PM',
    venue: 'Main Auditorium, GCA Campus, Lucknow',
    description:
      'Join hundreds of GCA architecture graduates across batches to celebrate our shared heritage, design excellence and networking dinner.',
    attendees: 320,
    status: 'Upcoming',
  },
  {
    id: 2,
    title: 'Heritage Conservation & Sustainable Design',
    category: 'Symposium',
    date: 'April 15, 2026',
    time: '2:30 PM - 5:30 PM',
    venue: 'Seminar Hall B & Online Hybrid',
    description:
      'A deep dive into vernacular materials and climate-resilient architecture with distinguished keynote alumni architects.',
    attendees: 145,
    status: 'Upcoming',
  },
  {
    id: 3,
    title: 'Batch of 2001 Silver Jubilee Gala',
    category: 'Reunion',
    date: 'May 02, 2026',
    time: '7:00 PM onwards',
    venue: 'Taj Mahal Hotel Ballroom, Lucknow',
    description:
      'Exclusive 25th-year celebratory milestone dinner for the Class of 2001, featuring commemorative yearbook launch.',
    attendees: 88,
    status: 'Upcoming',
  },
  {
    id: 4,
    title: 'Parametric Design in Urban Habitats',
    category: 'Workshop',
    date: 'January 20, 2026',
    time: '9:00 AM - 5:00 PM',
    venue: 'Design Studio 3, Architecture Wing',
    description:
      'Hands-on computational design workshop using algorithmic generative modeling for sustainable urban facades.',
    attendees: 64,
    status: 'Completed',
  },
  {
    id: 5,
    title: 'GCA Annual Student & Alumni Design Expo',
    category: 'Exhibition',
    date: 'February 10, 2026',
    time: '11:00 AM - 7:00 PM',
    venue: 'Campus Open Quadrangle',
    description:
      'Showcasing thesis projects, professional portfolio models, and architectural drawings from alumni firms.',
    attendees: 210,
    status: 'Completed',
  },
]

const Events = () => {
  const [events, setEvents] = useState(initialEvents)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedStatus, setSelectedStatus] = useState('All Status')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)

  const handleOpenAdd = () => {
    setEditingEvent(null)
    setModalOpen(true)
  }

  const handleEdit = (event) => {
    setEditingEvent(event)
    setModalOpen(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents((prev) => prev.filter((e) => e.id !== id))
    }
  }

  const handleSaveEvent = (data) => {
    if (editingEvent) {
      setEvents((prev) =>
        prev.map((e) => (e.id === editingEvent.id ? { ...data, id: editingEvent.id } : e))
      )
    } else {
      const newEvent = {
        ...data,
        id: Date.now(),
      }
      setEvents([newEvent, ...events])
    }
  }

  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      selectedCategory === 'All Categories' || e.category === selectedCategory

    const matchesStatus =
      selectedStatus === 'All Status' || e.status === selectedStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  const upcomingCount = events.filter((e) => e.status === 'Upcoming').length
  const totalAttendees = events.reduce((sum, e) => sum + Number(e.attendees || 0), 0)

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#800018]">
          Gatherings & Lectures
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Events & Reunions
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Organize alumni meetups, architectural symposia, and heritage conferences.
        </p>
      </div>

      {/* KPI Stats */}
      <EventStats
        totalEvents={events.length}
        upcomingEvents={upcomingCount}
        attendeesCount={totalAttendees}
      />

      {/* Filters */}
      <EventFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        onOpenAddModal={handleOpenAdd}
      />

      {/* Event Cards Grid */}
      <EventCardGrid
        events={filteredEvents}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modal */}
      <EventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveEvent}
        editingEvent={editingEvent}
      />
    </div>
  )
}

export default Events
