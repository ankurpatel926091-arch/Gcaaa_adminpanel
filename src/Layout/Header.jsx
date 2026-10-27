
import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Menu,
  ChevronDown,
  UserRound,
  LogOut,
} from 'lucide-react'
import adminAuth from '../Api/adminAuthApi'

const Header = ({ onMenuClick, sidebarOpen }) => {
  const [profileOpen, setProfileOpen] = useState(false)
  const [adminUser, setAdminUser] = useState(() => adminAuth.getStoredAdmin() || {})
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Sync current admin details from DB if authenticated
    if (adminAuth.isAuthenticated()) {
      adminAuth.getMe()
        .then((res) => {
          if (res?.admin) setAdminUser(res.admin)
        })
        .catch(() => {})
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    setProfileOpen(false)
    adminAuth.logout()
    navigate('/login')
  }

  const displayName = adminUser.name || 'Admin'
  const displayRole = adminUser.designation || 'Administrator'
  const displayEmail = adminUser.email || 'admin@gcaaa.org'
  const displayInitials =
    adminUser.avatarInitials ||
    displayName
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ||
    'A'

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex h-[78px] items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Left: Hamburger and Welcome Text */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Toggle sidebar"
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg text-gray-600 transition hover:bg-red-50 hover:text-[#800018]"
          >
            <Menu size={24} />
          </button>

          <div>
            <h2 className="font-serif text-lg font-bold tracking-tight text-gray-900 sm:text-xl">
              Welcome back, <span className="text-[#800018]">{displayName}</span>
            </h2>
            <p className="text-[11px] font-medium text-gray-400 hidden sm:block">
              Government College of Architecture Alumni Association
            </p>
          </div>
        </div>

        {/* Right: Admin Profile */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            aria-expanded={profileOpen}
            className="flex cursor-pointer items-center gap-2 rounded-lg p-1.5 transition hover:bg-gray-50 sm:gap-3 sm:px-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#800018] text-sm font-semibold text-white shadow-sm ring-2 ring-[#fca5a5]/80">
              {displayInitials}
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold leading-tight text-gray-800">
                {displayName}
              </p>

              <p className="text-xs text-gray-500">
                {displayRole}
              </p>
            </div>

            <ChevronDown
              size={17}
              className={`hidden text-gray-500 transition-transform duration-200 sm:block ${
                profileOpen ? 'rotate-180 text-[#800018]' : ''
              }`}
            />
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 top-14 z-50 w-56 overflow-hidden rounded-xl border border-gray-100 bg-white py-2 shadow-2xl">
              <div className="border-b border-gray-100 bg-[#faf9f6] px-4 py-3">
                <p className="text-sm font-semibold text-gray-800">
                  {displayName}
                </p>

                <p className="mt-0.5 text-xs text-gray-500">
                  {displayEmail}
                </p>
              </div>

              <Link
                to="/profile"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition hover:bg-red-50 hover:text-[#800018]"
              >
                <UserRound size={17} className="text-[#800018]" />
                My Profile
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full cursor-pointer items-center gap-3 border-t border-gray-100 px-4 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
              >
                <LogOut size={17} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Red Accent */}
      <div className="h-[2px] bg-gradient-to-r from-[#800018] via-[#800018] to-[#800018]" />
    </header>
  )
}

export default Header
