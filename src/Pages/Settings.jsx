import React, { useState } from 'react'
import GeneralSettings from '../Component/Settings/GeneralSettings'
import SecuritySettings from '../Component/Settings/SecuritySettings'
import NotificationSettings from '../Component/Settings/NotificationSettings'
import { Settings as SettingsIcon, Shield, Bell } from 'lucide-react'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general')

  const tabs = [
    { id: 'general', label: 'General Info', icon: SettingsIcon },
    { id: 'security', label: 'Security & Access', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ]

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#800018]">
          Preferences & Controls
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          System Settings
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Manage association profile credentials, notification alerts, and security policies.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <div className="flex space-x-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  isActive
                    ? 'border-[#800018] text-[#800018]'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Active Tab Panel */}
      <div>
        {activeTab === 'general' && <GeneralSettings />}
        {activeTab === 'security' && <SecuritySettings />}
        {activeTab === 'notifications' && <NotificationSettings />}
      </div>
    </div>
  )
}

export default Settings
