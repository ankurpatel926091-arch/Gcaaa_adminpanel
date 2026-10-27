import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react'

const events = [
  {
    id: 1,
    title: 'Annual Grand Alumni Meet 2026',
    date: 'March 28, 2026',
    time: '10:00 AM - 6:00 PM',
    venue: 'Main Auditorium, GCA Campus, Lucknow',
    category: 'Reunion',
    rsvpCount: 320,
    accent: '#800018',
  },
  {
    id: 2,
    title: 'Heritage Conservation & Sustainable Design',
    date: 'April 15, 2026',
    time: '2:30 PM - 5:30 PM',
    venue: 'Seminar Hall B & Online Hybrid',
    category: 'Symposium',
    rsvpCount: 145,
    accent: '#800018',
  },
  {
    id: 3,
    title: 'Batch of 2001 Silver Jubilee Gala',
    date: 'May 02, 2026',
    time: '7:00 PM onwards',
    venue: 'Taj Mahal Hotel Ballroom, Lucknow',
    category: 'Celebration',
    rsvpCount: 88,
    accent: '#800018',
  },
]

const UpcomingEventsSection = () => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <h3 className="font-serif text-lg font-bold text-gray-900">
            Upcoming Events
          </h3>
          <p className="text-xs text-gray-500">
            Scheduled reunions and architectural lectures
          </p>
        </div>

        <Link
          to="/events"
          className="flex items-center gap-1 text-xs font-semibold text-[#800018] hover:text-[#bd0929] transition"
        >
          Manage <ArrowRight size={15} />
        </Link>
      </div>

      <div className="mt-4 space-y-3.5">
        {events.map((event) => (
          <div
            key={event.id}
            className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-gray-100 p-4 transition-all hover:border-[#800018]/40 hover:bg-[#faf9f6]"
          >
            <div className="flex items-start gap-3.5">
              <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-[#800018] text-white">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#fca5a5]">
                  {event.date.split(' ')[0]}
                </span>
                <span className="font-serif text-base font-bold leading-none">
                  {event.date.split(' ')[1].replace(',', '')}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-block rounded-md bg-[#800018]/15 px-2 py-0.5 text-[10px] font-semibold text-[#800018]">
                    {event.category}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{event.time}</span>
                </div>

                <h4 className="mt-1 font-semibold text-gray-900 group-hover:text-[#800018] transition-colors">
                  {event.title}
                </h4>

                <div className="mt-1.5 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-[#800018]" />
                    {event.venue}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={13} className="text-[#800018]" />
                    {event.rsvpCount} Attending
                  </span>
                </div>
              </div>
            </div>

            <Link
              to="/events"
              className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-xs hover:border-[#800018] hover:text-[#800018] transition"
            >
              Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UpcomingEventsSection
