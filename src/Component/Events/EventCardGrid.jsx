import React from 'react'
import { Calendar, MapPin, Users, Edit3, Trash2, Clock, CheckCircle } from 'lucide-react'

const EventCardGrid = ({ events, onEdit, onDelete }) => {
  if (events.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-xs">
        <p className="text-sm font-medium text-gray-500">
          No events found matching your filter criteria.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <div
          key={event.id}
          className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
        >
          {/* Card Top / Banner */}
          <div className="relative h-44 w-full bg-[#39000b] overflow-hidden">
            {event.image ? (
              <img
                src={event.image}
                alt={event.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-[#700018] via-[#850020] to-[#39000b]">
                <Calendar size={48} className="text-[#fca5a5]/40" />
              </div>
            )}

            {/* Category Pill */}
            <span className="absolute top-3 left-3 rounded-lg bg-black/60 backdrop-blur-xs px-2.5 py-1 text-[11px] font-semibold text-[#fca5a5]">
              {event.category}
            </span>

            {/* Status Pill */}
            <span
              className={`absolute top-3 right-3 rounded-lg px-2.5 py-1 text-[11px] font-bold ${
                event.status === 'Upcoming'
                  ? 'bg-[#800018] text-white'
                  : event.status === 'Ongoing'
                  ? 'bg-emerald-500 text-white animate-pulse'
                  : 'bg-gray-800 text-gray-200'
              }`}
            >
              {event.status}
            </span>
          </div>

          {/* Card Content */}
          <div className="flex-1 p-5">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#800018]">
              <Calendar size={14} />
              <span>{event.date}</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-500">{event.time}</span>
            </div>

            <h3 className="mt-2 font-serif text-lg font-bold text-gray-900 group-hover:text-[#800018] transition-colors line-clamp-1">
              {event.title}
            </h3>

            <p className="mt-2 text-xs leading-relaxed text-gray-500 line-clamp-2">
              {event.description}
            </p>

            <div className="mt-4 space-y-1.5 border-t border-gray-100 pt-3 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="shrink-0 text-[#800018]" />
                <span className="truncate">{event.venue}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={14} className="shrink-0 text-[#800018]" />
                <span>{event.attendees} Registered Attendees</span>
              </div>
            </div>
          </div>

          {/* Card Footer Actions */}
          <div className="flex items-center justify-between border-t border-gray-100 bg-[#faf9f6] px-5 py-3">
            <span className="text-[11px] font-medium text-gray-400">
              ID: EVT-{event.id}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onEdit(event)}
                title="Edit Event"
                className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-200/60 hover:text-[#800018] transition"
              >
                <Edit3 size={15} />
              </button>
              <button
                type="button"
                onClick={() => onDelete(event.id)}
                title="Delete Event"
                className="rounded-lg p-1.5 text-gray-600 hover:bg-red-50 hover:text-red-600 transition"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default EventCardGrid
