'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from './SidebarContext';
import {
  FiHome,
  FiUpload,
  FiMessageSquare,
  FiFileText,
  FiSettings,
  FiBarChart2,
  FiUsers,
  FiMenu,
  FiX,
} from 'react-icons/fi';

const navItems = [
  { icon: FiHome, label: 'Dashboard', href: '/' },
  { icon: FiUpload, label: 'Upload Documents', href: '/upload' },
  { icon: FiMessageSquare, label: 'AI Consultation', href: '/consultation' },
  { icon: FiFileText, label: 'Case Results', href: '/cases' },
  { icon: FiBarChart2, label: 'Analytics', href: '/analytics' },
  { icon: FiUsers, label: 'Clients', href: '/clients' },
  { icon: FiSettings, label: 'Settings', href: '/settings' },
];

export default function Sidebar() {
  const { isOpen, toggle } = useSidebar();
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={toggle}
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-30 h-screen
          flex flex-col justify-between
          bg-[#0d0d0d] border-r border-[#1a1a1a]
          transition-all duration-300 ease-in-out
          ${isOpen ? 'w-64' : 'w-20'}
          ${!isOpen ? 'lg:-translate-x-full lg:translate-x-0' : ''}
        `}
      >
        {/* Logo */}
        <div>
          <div className="flex items-center justify-between p-4 border-b border-[#1a1a1a]">
            {isOpen && (
              <div>
                <h1 className="text-[#39ff14] font-bold text-lg tracking-wide">
                  FARRUKH
                </h1>
                <p className="text-[10px] text-gray-500 tracking-widest uppercase">
                  Consultancy Pro
                </p>
              </div>
            )}
            <button
              onClick={toggle}
              className="p-2 rounded-lg hover:bg-[#1a1a1a] text-gray-400 hover:text-[#39ff14] transition-colors"
            >
              {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>

          {/* Nav links */}
          <nav className="mt-4 px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group
                    ${
                      isActive
                        ? 'bg-[#39ff14]/10 text-[#39ff14] neon-text'
                        : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-gray-200'
                    }
                  `}
                >
                  <Icon size={18} className={isActive ? 'text-[#39ff14]' : 'text-gray-500 group-hover:text-gray-300'} />
                  {isOpen && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                  {!isOpen && (
                    <div className="absolute left-16 bg-[#1a1a1a] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        {isOpen && (
          <div className="p-4 border-t border-[#1a1a1a]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#39ff14]/20 flex items-center justify-center text-[#39ff14] font-bold text-xs">
                FN
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">Farrukh Nadeem</p>
                <p className="text-[10px] text-gray-500">Lead Consultant</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
