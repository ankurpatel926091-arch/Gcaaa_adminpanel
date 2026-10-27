import React from 'react'
import { Landmark, Award, Shield, CheckCircle } from 'lucide-react'

const ProfileDetailsCard = ({ profile }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Account Info */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
        <h3 className="font-serif text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
          Administrative Privileges
        </h3>

        <div className="mt-4 space-y-3.5 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-gray-50">
            <span className="text-gray-500">Access Level</span>
            <span className="font-semibold text-[#800018]">
              Tier 1 - Full Administrator
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-gray-50">
            <span className="text-gray-500">College Chapter</span>
            <span className="font-semibold text-gray-800">
              Lucknow Central Campus
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-gray-50">
            <span className="text-gray-500">Assigned Modules</span>
            <span className="font-semibold text-gray-800">
              Alumni, Events, Publications, Gallery, Blogs
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-gray-50">
            <span className="text-gray-500">Two-Factor Authentication</span>
            <span className="font-semibold text-emerald-600">Active (SMS/OTP)</span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-gray-500">Last Login IP</span>
            <span className="font-mono text-gray-600">103.212.144.18 (Lucknow, UP)</span>
          </div>
        </div>
      </div>

      {/* Permissions Breakdown */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
        <h3 className="font-serif text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
          Operational Permissions
        </h3>

        <div className="mt-4 grid grid-cols-1 gap-2.5">
          {[
            'Approve and verify registered Alumni credentials',
            'Publish and broadcast official Reunions & Symposia',
            'Curate and moderate historical photo galleries',
            'Manage digital releases of research journals and newsletters',
            'Review, edit, and publish community articles',
            'Configure system security rules and export database CSVs',
          ].map((perm, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-gray-700">
              <CheckCircle size={15} className="shrink-0 text-emerald-600" />
              <span>{perm}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProfileDetailsCard
