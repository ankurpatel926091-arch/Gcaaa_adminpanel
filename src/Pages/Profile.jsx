import React, { useState, useEffect } from 'react'
import ProfileHeader from '../Component/Profile/ProfileHeader'
import ProfileDetailsCard from '../Component/Profile/ProfileDetailsCard'
import ProfileEditModal from '../Component/Profile/ProfileEditModal'
import adminAuth from '../Api/adminAuthApi'

const defaultProfile = {
  name: 'Ar. Alok Nath Srivastava',
  avatarInitials: 'AS',
  role: 'Chief Administrator & Registrar',
  department: 'Alumni Affairs & External Relations',
  email: 'admin@gcaaa.org',
  phone: '+91 94151 89765',
  joinedDate: 'July 2021',
}

const Profile = () => {
  const [profile, setProfile] = useState(() => {
    const stored = adminAuth.getStoredAdmin()
    return stored
      ? {
          name: stored.name || defaultProfile.name,
          avatarInitials: stored.avatarInitials || defaultProfile.avatarInitials,
          role: stored.designation || stored.role || defaultProfile.role,
          department: stored.department || defaultProfile.department,
          email: stored.email || defaultProfile.email,
          phone: stored.phone || defaultProfile.phone,
          joinedDate: stored.createdAt
            ? new Date(stored.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })
            : defaultProfile.joinedDate,
        }
      : defaultProfile
  })
  const [modalOpen, setModalOpen] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState('')

  useEffect(() => {
    if (adminAuth.isAuthenticated()) {
      adminAuth.getMe()
        .then((res) => {
          if (res?.admin) {
            const u = res.admin
            setProfile({
              name: u.name || defaultProfile.name,
              avatarInitials: u.avatarInitials || defaultProfile.avatarInitials,
              role: u.designation || u.role || defaultProfile.role,
              department: u.department || defaultProfile.department,
              email: u.email || defaultProfile.email,
              phone: u.phone || defaultProfile.phone,
              joinedDate: u.createdAt
                ? new Date(u.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })
                : defaultProfile.joinedDate,
            })
          }
        })
        .catch((err) => console.error('Error fetching admin profile:', err))
    }
  }, [])

  const handleSave = async (updated) => {
    try {
      const response = await adminAuth.updateProfile({
        name: updated.name,
        designation: updated.role,
        phone: updated.phone,
      })

      if (response?.admin) {
        const u = response.admin
        setProfile({
          ...profile,
          name: u.name,
          avatarInitials: u.avatarInitials,
          role: u.designation || u.role,
          phone: u.phone,
        })
      } else {
        setProfile({
          ...profile,
          ...updated,
          avatarInitials: updated.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase(),
        })
      }
      setSaveSuccess('Profile updated successfully!')
      setTimeout(() => setSaveSuccess(''), 4000)
    } catch (err) {
      console.error('Failed to update profile:', err)
      alert(err.response?.data?.message || 'Failed to update profile.')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#800018]">
          Account & Credentials
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Admin Profile
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Personal identification, role assignments, and security permission scopes.
        </p>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs sm:text-sm font-medium text-emerald-800 shadow-sm animate-in fade-in">
          <span>✓</span>
          <span>{saveSuccess}</span>
        </div>
      )}

      <ProfileHeader
        profile={profile}
        onEditClick={() => setModalOpen(true)}
      />

      <ProfileDetailsCard profile={profile} />

      <ProfileEditModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        profile={profile}
        onSave={handleSave}
      />
    </div>
  )
}

export default Profile
