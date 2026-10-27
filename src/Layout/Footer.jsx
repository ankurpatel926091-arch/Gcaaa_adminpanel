import React from 'react'

const Footer = () => {
  return (
    <footer className="shrink-0 border-t border-gray-200 bg-white px-4 py-3 sm:px-6 z-20">
      <div className="flex flex-col items-center justify-between gap-1 text-center text-xs text-gray-500 sm:flex-row sm:text-left">
        <p>
          © 2026 GCAAA Alumni Association. All rights reserved.
        </p>

        <p className="text-[11px] text-gray-400">
          Admin Panel
          <span className="mx-2 text-[#800018]">|</span>
          Government College of Architecture
        </p>
      </div>
    </footer>
  )
}

export default Footer
