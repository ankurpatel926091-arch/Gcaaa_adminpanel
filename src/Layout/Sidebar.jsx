import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Image,
  BookOpen,
  FileText,
  X,
  UserCheck,
  Vote,
  ContactRound,
  Inbox,
  FileSignature,
} from 'lucide-react'
import logo from '../assets/logo.png'

export const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Lifetime Members', path: '/registered-members', icon: UserCheck },
  // { name: 'All Batches of GCAAA', path: '/all-batches', icon: Users },
  { name: 'All Batches of GCAAA', path: '/batches', icon: Users },
  { name: 'Election Nominations', path: '/election-nominations', icon: Vote },
  { name: 'Blogs & Articles', path: '/blogs', icon: FileText },
  // { name: 'Contact Page', path: '/contact-page', icon: ContactRound },
  { name: 'Contact Messages', path: '/contact-messages', icon: Inbox },
  { name: 'Election Withdrawals', path: '/withdrawals', icon: FileSignature },
  // { name: 'Events', path: '/events', icon: CalendarDays },
  { name: 'Gallery', path: '/gallery', icon: Image },
  { name: 'Publications', path: '/publications', icon: BookOpen },
]

const Sidebar = ({ isOpen, setIsOpen }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity duration-300 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Aside Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen flex-col bg-[#700018] text-white transition-all duration-300 ease-in-out lg:sticky lg:top-0 lg:z-20 ${
          isOpen
            ? 'w-64 translate-x-0 shadow-2xl lg:shadow-none'
            : '-translate-x-full lg:w-20 lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div
          className={`flex h-[78px] shrink-0 items-center border-b border-white/10 px-4 transition-all duration-300 ${
            isOpen ? 'justify-between px-5' : 'justify-center px-2'
          }`}
        >
          {isOpen ? (
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white p-1 shadow-md ring-2 ring-[#fca5a5]/70">
                <img src={logo} alt="GCAAA Logo" className="h-full w-full object-contain" />
              </div>
              <div className="min-w-0">
                <h2 className="font-serif text-2xl font-bold tracking-wide text-white">
                  GCAAA
                </h2>
                <p className="text-[9px] font-semibold tracking-[0.2em] text-[#fca5a5]">
                  ADMINISTRATION
                </p>
              </div>
            </div>
          ) : (
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-white p-1.5 ring-2 ring-[#fca5a5]/70 shadow-md transition-transform hover:scale-105"
              title="GCAAA Administration"
            >
              <img src={logo} alt="GCAAA Logo" className="h-full w-full object-contain" />
            </div>
          )}

          {/* Close button for mobile drawer */}
          {isOpen && (
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close sidebar"
              className="rounded-lg p-2 text-white/80 transition hover:bg-white/10 hover:text-white lg:hidden"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto overflow-x-hidden px-3 py-5 scrollbar-thin">
          {isOpen && (
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
              Main Menu
            </p>
          )}

          {menuItems.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setIsOpen(false)
                }
              }}
              className={({ isActive }) =>
                `group relative flex items-center rounded-xl transition-all duration-200 ${
                  isOpen
                    ? 'gap-3 px-3.5 py-3 text-sm'
                    : 'h-12 w-12 justify-center mx-auto my-1 text-sm'
                } ${
                  isActive
                    ? 'bg-[#800018] font-semibold text-white shadow-md shadow-black/20'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={21}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    className="shrink-0 transition-transform duration-200 group-hover:scale-110"
                  />

                  {isOpen ? (
                    <span className="truncate font-medium tracking-wide">
                      {name}
                    </span>
                  ) : (
                    /* Floating Tooltip when collapsed */
                    <div className="pointer-events-none absolute left-full z-50 ml-3 hidden items-center opacity-0 transition-all duration-150 group-hover:opacity-100 lg:group-hover:flex">
                      <div className="relative rounded-lg bg-[#39000b] px-3 py-1.5 text-xs font-semibold tracking-wide text-white shadow-xl ring-1 ring-white/15 whitespace-nowrap">
                        {name}
                        {/* Little triangle arrow */}
                        <div className="absolute -left-1 top-1/2 -translate-y-1/2 border-y-4 border-r-4 border-y-transparent border-r-[#39000b]" />
                      </div>
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="shrink-0 border-t border-white/10 p-3">
          {isOpen ? (
            <div className="px-2 py-1">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-medium text-white/70">
                  Portal Active
                </span>
              </div>
              <p className="mt-1.5 text-[10px] text-white/50 leading-tight">
                © 2026 GCAAA Association
              </p>
            </div>
          ) : (
            <div className="flex justify-center py-2" title="System Online">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-400/30 animate-pulse" />
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

export default Sidebar
