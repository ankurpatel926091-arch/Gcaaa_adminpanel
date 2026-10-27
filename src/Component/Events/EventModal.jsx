import React, { useState, useEffect } from 'react'
import { X, Calendar, Check } from 'lucide-react'

const EventModal = ({ isOpen, onClose, onSave, editingEvent }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Reunion',
    date: '',
    time: '10:00 AM - 4:00 PM',
    venue: '',
    description: '',
    attendees: '0',
    status: 'Upcoming',
  })

  useEffect(() => {
    if (editingEvent) {
      setFormData(editingEvent)
    } else {
      setFormData({
        title: '',
        category: 'Reunion',
        date: 'April 20, 2026',
        time: '10:00 AM - 4:00 PM',
        venue: 'GCA Main Auditorium, Lucknow',
        description: '',
        attendees: '0',
        status: 'Upcoming',
      })
    }
  }, [editingEvent, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition-all animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-gray-900">
              {editingEvent ? 'Edit Event' : 'Create New Event'}
            </h3>
            <p className="text-xs text-gray-500">
              Configure event dates, venue and registration settings
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Event Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g. Annual Alumni Convention 2026"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
              >
                <option value="Reunion">Reunion</option>
                <option value="Symposium">Symposium</option>
                <option value="Exhibition">Exhibition</option>
                <option value="Workshop">Workshop</option>
                <option value="Lecture">Lecture</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Event Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Event Date *
              </label>
              <input
                type="text"
                required
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                placeholder="e.g. May 15, 2026"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Time Interval
              </label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                placeholder="10:00 AM - 5:00 PM"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Venue / Location *
            </label>
            <input
              type="text"
              required
              value={formData.venue}
              onChange={(e) =>
                setFormData({ ...formData, venue: e.target.value })
              }
              placeholder="Auditorium, GCA Campus, Lucknow"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Description / Itinerary
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Brief description about the event schedule, guest speakers, and highlights..."
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#800018]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-[#800018] px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-[#a00020]"
            >
              <Check size={16} />
              {editingEvent ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EventModal
