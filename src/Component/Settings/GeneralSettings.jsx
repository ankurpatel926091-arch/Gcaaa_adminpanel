import React, { useState } from 'react'
import { Landmark, Save, Check } from 'lucide-react'

const GeneralSettings = () => {
  const [saved, setSaved] = useState(false)
  const [formData, setFormData] = useState({
    portalName: 'Government College of Architecture Alumni Association (GCAAA)',
    tagline: 'Connecting Generations of Architects & Designers',
    contactEmail: 'contact@gcaaa.org',
    contactPhone: '+91 522 2345678',
    campusAddress: 'Tagore Marg, Lucknow, Uttar Pradesh 226007',
    registrationNumber: 'UP/LKO/ALUMNI/2004/891',
    footerCopyright: '© 2026 GCAAA Alumni Association. All rights reserved.',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
      <div className="border-b border-gray-100 pb-4">
        <h3 className="font-serif text-lg font-bold text-gray-900">
          General Association Profile
        </h3>
        <p className="text-xs text-gray-500">
          Official details displayed across the public alumni portal and headers
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Portal Name / Title
          </label>
          <input
            type="text"
            value={formData.portalName}
            onChange={(e) =>
              setFormData({ ...formData, portalName: e.target.value })
            }
            className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#800018]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Motto / Tagline
          </label>
          <input
            type="text"
            value={formData.tagline}
            onChange={(e) =>
              setFormData({ ...formData, tagline: e.target.value })
            }
            className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#800018]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Official Contact Email
            </label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) =>
                setFormData({ ...formData, contactEmail: e.target.value })
              }
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#800018]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Secretariat Helpline
            </label>
            <input
              type="text"
              value={formData.contactPhone}
              onChange={(e) =>
                setFormData({ ...formData, contactPhone: e.target.value })
              }
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#800018]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Campus Address
          </label>
          <input
            type="text"
            value={formData.campusAddress}
            onChange={(e) =>
              setFormData({ ...formData, campusAddress: e.target.value })
            }
            className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#800018]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Society Registration No.
            </label>
            <input
              type="text"
              value={formData.registrationNumber}
              onChange={(e) =>
                setFormData({ ...formData, registrationNumber: e.target.value })
              }
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#800018]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Footer Copyright Text
            </label>
            <input
              type="text"
              value={formData.footerCopyright}
              onChange={(e) =>
                setFormData({ ...formData, footerCopyright: e.target.value })
              }
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#800018]"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          {saved && (
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 animate-in fade-in">
              <Check size={14} /> Changes saved successfully!
            </span>
          )}
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-[#800018] px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#a00020] active:scale-95 transition"
          >
            <Save size={15} />
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  )
}

export default GeneralSettings
