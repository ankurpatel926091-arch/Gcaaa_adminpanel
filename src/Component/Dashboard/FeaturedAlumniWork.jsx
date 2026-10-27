import React from 'react'
import { Award, Building, ExternalLink, Calendar, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

const FeaturedAlumniWork = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-[#faf9f6]">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#800018] text-white">
            <Award size={16} />
          </div>
          <div>
            <h4 className="font-serif text-sm font-bold text-gray-900">
              Alumni Design Spotlight of the Month
            </h4>
            <p className="text-[11px] text-gray-400">
              National Architecture Excellence Recognition
            </p>
          </div>
        </div>

        <Link
          to="/gallery"
          className="text-xs font-semibold text-[#800018] hover:text-[#bd0929] flex items-center gap-1"
        >
          Explore Gallery <ExternalLink size={13} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5">
        <div className="relative h-40 md:h-auto overflow-hidden rounded-xl bg-gray-100">
          <img
            src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80"
            alt="Heritage Conservation Pavilion"
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-[#fca5a5] backdrop-blur-xs">
            Heritage Pavilion
          </span>
        </div>

        <div className="md:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-[#800018]/10 px-2 py-0.5 text-[11px] font-semibold text-[#800018]">
                Batch of 2008
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500 font-medium">
                National Heritage Award 2025
              </span>
            </div>

            <h3 className="mt-2 font-serif text-base font-bold text-gray-900">
              Awadh Vernacular Cultural Complex & Civic Plaza
            </h3>

            <p className="mt-1.5 text-xs text-gray-500 leading-relaxed line-clamp-3">
              Designed by Ar. Sameer Mathur (Studio Vistas), this restoration and cultural center integrates Lakhori brick vaulting with sustainable passive air cooling shafts, recognized by the Indian Institute of Architects.
            </p>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-500 border-t border-gray-100 pt-3">
            <span className="flex items-center gap-1">
              <Building size={13} className="text-[#800018]" />
              Client: Urban Arts Council
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={13} className="text-[#800018]" />
              Lucknow, Uttar Pradesh
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeaturedAlumniWork
