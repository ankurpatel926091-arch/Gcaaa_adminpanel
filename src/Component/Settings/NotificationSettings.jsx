import React, { useState } from 'react'
import { Bell, Mail, Check, Save } from 'lucide-react'

const NotificationSettings = () => {
  const [saved, setSaved] = useState(false)
  const [notifications, setNotifications] = useState({
    newAlumniRegistration: true,
    eventRsvps: true,
    blogSubmissions: false,
    systemUpdates: true,
    weeklyDigest: true,
  })

  const handleToggle = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
      <div className="border-b border-gray-100 pb-4">
        <h3 className="font-serif text-lg font-bold text-gray-900">
          Email & Alert Notifications
        </h3>
        <p className="text-xs text-gray-500">
          Control which notifications are sent to the administrative team
        </p>
      </div>

      <form onSubmit={handleSave} className="mt-6 space-y-4">
        <div className="divide-y divide-gray-100">
          <div className="flex items-center justify-between py-3.5">
            <div>
              <p className="text-sm font-semibold text-gray-800">
                New Alumni Registrations
              </p>
              <p className="text-xs text-gray-500">
                Receive instant email alerts whenever a graduate submits verification
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifications.newAlumniRegistration}
              onChange={() => handleToggle('newAlumniRegistration')}
              className="h-5 w-5 accent-[#800018] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-3.5">
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Event RSVP Thresholds
              </p>
              <p className="text-xs text-gray-500">
                Get notified when an upcoming event hits 50%, 80% and 100% capacity
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifications.eventRsvps}
              onChange={() => handleToggle('eventRsvps')}
              className="h-5 w-5 accent-[#800018] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-3.5">
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Blog Article Submissions
              </p>
              <p className="text-xs text-gray-500">
                Alert when alumni submit guest architecture essays for review
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifications.blogSubmissions}
              onChange={() => handleToggle('blogSubmissions')}
              className="h-5 w-5 accent-[#800018] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-3.5">
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Weekly Association Digest
              </p>
              <p className="text-xs text-gray-500">
                Summary of active alumni, new publications, and downloads every Monday
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifications.weeklyDigest}
              onChange={() => handleToggle('weeklyDigest')}
              className="h-5 w-5 accent-[#800018] cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          {saved && (
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 animate-in fade-in">
              <Check size={14} /> Preferences saved!
            </span>
          )}
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-[#800018] px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#a00020] active:scale-95 transition"
          >
            <Bell size={15} />
            Save Notifications
          </button>
        </div>
      </form>
    </div>
  )
}

export default NotificationSettings
