import React from 'react'
import { Landmark, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react'

const ProfileHeader = ({ profile, onEditClick }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs">
      {/* Banner */}
      <div className="h-32 bg-gradient-to-r from-[#700018] via-[#850020] to-[#800018] relative">
        <div className="absolute right-4 bottom-3 opacity-20">
          <Landmark size={90} className="text-white" />
        </div>
      </div>

      {/* Avatar and basic info */}
      <div className="px-6 pb-6 pt-0 relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12">
          <div className="flex items-end gap-4">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-[#800018] text-3xl font-serif font-bold text-white ring-4 ring-white shadow-lg">
              {profile.avatarInitials}
            </div>

            <div className="mb-1">
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-2xl font-bold text-gray-900">
                  {profile.name}
                </h2>
                <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-600/20">
                  <ShieldCheck size={13} />
                  Super Admin
                </span>
              </div>
              <p className="text-xs font-medium text-gray-500">
                {profile.role} • {profile.department}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onEditClick}
            className="rounded-xl bg-[#800018] px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-[#a00020] transition active:scale-95 cursor-pointer self-start sm:self-end"
          >
            Edit Profile
          </button>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-6 border-t border-gray-100 pt-4 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <Mail size={15} className="text-[#800018]" />
            <span>{profile.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={15} className="text-[#800018]" />
            <span>{profile.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={15} className="text-[#800018]" />
            <span>Member since: {profile.joinedDate}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader
