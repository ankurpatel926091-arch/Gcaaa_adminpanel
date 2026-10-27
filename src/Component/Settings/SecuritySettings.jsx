import React, { useState } from 'react'
import { Shield, Lock, Key, Check } from 'lucide-react'

const SecuritySettings = () => {
  const [saved, setSaved] = useState(false)
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactor: true,
    sessionTimeout: '60',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      alert('New password and confirm password do not match!')
      return
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
      <div className="border-b border-gray-100 pb-4">
        <h3 className="font-serif text-lg font-bold text-gray-900">
          Security & Authentication
        </h3>
        <p className="text-xs text-gray-500">
          Protect portal admin access and manage credential policies
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Current Password
          </label>
          <input
            type="password"
            value={formData.currentPassword}
            onChange={(e) =>
              setFormData({ ...formData, currentPassword: e.target.value })
            }
            placeholder="••••••••••••"
            className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#800018]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              New Password
            </label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
              placeholder="Minimum 8 characters"
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#800018]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              placeholder="Re-enter new password"
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#800018]"
            />
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-[#faf9f6] p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-800">
                Two-Factor Authentication (2FA)
              </p>
              <p className="text-xs text-gray-500">
                Require OTP verification via registered admin mobile / email
              </p>
            </div>
            <input
              type="checkbox"
              checked={formData.twoFactor}
              onChange={(e) =>
                setFormData({ ...formData, twoFactor: e.target.checked })
              }
              className="h-5 w-5 accent-[#800018] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between border-t border-gray-200/60 pt-3">
            <div>
              <p className="text-xs font-bold text-gray-800">
                Auto Session Timeout
              </p>
              <p className="text-xs text-gray-500">
                Automatically logout inactive admin sessions
              </p>
            </div>
            <select
              value={formData.sessionTimeout}
              onChange={(e) =>
                setFormData({ ...formData, sessionTimeout: e.target.value })
              }
              className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs outline-none"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">60 minutes</option>
              <option value="120">2 hours</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          {saved && (
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 animate-in fade-in">
              <Check size={14} /> Security preferences updated!
            </span>
          )}
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-[#800018] px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#a00020] active:scale-95 transition"
          >
            <Shield size={15} />
            Update Security
          </button>
        </div>
      </form>
    </div>
  )
}

export default SecuritySettings
