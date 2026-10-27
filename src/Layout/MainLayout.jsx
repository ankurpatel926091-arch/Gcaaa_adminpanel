import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024)

  useEffect(() => {
    const handleResize = () => setSidebarOpen(window.innerWidth >= 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f7f5] text-slate-800 antialiased selection:bg-[#800018]/30 selection:text-[#700018]">
      {/* Sidebar - Handles both expanded and collapsed icon-only states */}
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main Content Area - Header and Footer are fixed, only main body scrolls */}
      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden transition-all duration-300">
        <Header
          sidebarOpen={sidebarOpen}
          onMenuClick={() => setSidebarOpen((prev) => !prev)}
        />

        <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default MainLayout
