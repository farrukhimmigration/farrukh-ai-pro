'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { useSidebar } from '@/components/SidebarContext';
import {
  FiUploadCloud,
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiActivity,
  FiGlobe,
  FiMessageCircle,
} from 'react-icons/fi';

const stats = [
  { label: 'Active Cases', value: '24', icon: FiActivity, color: 'text-[#39ff14]' },
  { label: 'Clients This Month', value: '47', icon: FiUsers, color: 'text-blue-400' },
  { label: 'Successful Visas', value: '189', icon: FiCheckCircle, color: 'text-[#39ff14]' },
  { label: 'Pending Reviews', value: '8', icon: FiClock, color: 'text-yellow-400' },
];

const recentCases = [
  { id: 'AUS-2026-0014', name: 'Ahmed Khan', type: 'Subclass 482 TSS', country: 'Australia', status: 'In Progress', probability: '78%' },
  { id: 'CAN-2026-0087', name: 'Sara Ali', type: 'Express Entry FSW', country: 'Canada', status: 'Approved', probability: '92%' },
  { id: 'GB-2026-0033', name: 'Omar Farooq', type: 'Skilled Worker', country: 'UK', status: 'Refusal Appeals', probability: '64%' },
  { id: 'SCH-2026-0021', name: 'Fatima Noor', type: 'Schengen Visit', country: 'Germany', status: 'Document Prep', probability: '71%' },
  { id: 'UAE-2026-0055', name: 'Bilal Ahmed', type: 'MOL Labour Card', country: 'UAE', status: 'Processing', probability: '85%' },
];

export default function DashboardPage() {
  const { isOpen } = useSidebar();
  const [mounted, setMounted] = useState(false);

  if (!mounted) setMounted(true);
  return (
    <div className="flex w-full min-h-screen">
      <Sidebar />
      <main className="flex-1 min-h-screen p-4 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-white">
            Welcome back, <span className="neon-text">Farrukh</span>
          </h1>
          <p className="text-gray-500 mt-1">Here is what is happening at your consultancy today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="card-dark p-5">
                <div className="flex items-center justify-between mb-3">
                  <Icon size={20} className={stat.color} />
                  <span className="text-[10px] uppercase tracking-wider text-gray-500">
                    Last 30 days
                  </span>
                </div>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Cases Table */}
          <div className="lg:col-span-2 card-dark p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FiGlobe className="text-[#39ff14]" size={18} />
                Recent Cases
              </h2>
              <span className="text-xs text-gray-500">Live</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1a1a1a] text-left text-xs text-gray-500 uppercase tracking-wider">
                    <th className="pb-3 pr-4">Case ID</th>
                    <th className="pb-3 pr-4">Client</th>
                    <th className="pb-3 pr-4 hidden md:table-cell">Visa Type</th>
                    <th className="pb-3 pr-4">Country</th>
                    <th className="pb-3 pr-4 hidden sm:table-cell">Status</th>
                    <th className="pb-3 text-right">Probability</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCases.map((c) => (
                    <tr key={c.id} className="border-b border-[#1a1a1a] text-sm hover:bg-[#1a1a1a]/50 transition-colors">
                      <td className="py-3 pr-4 font-mono text-xs text-[#39ff14]/80">{c.id}</td>
                      <td className="py-3 pr-4 text-white font-medium">{c.name}</td>
                      <td className="py-3 pr-4 text-gray-400 hidden md:table-cell">{c.type}</td>
                      <td className="py-3 pr-4 text-gray-400">{c.country}</td>
                      <td className="py-3 pr-4 hidden sm:table-cell">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium
                          ${c.status === 'Approved' ? 'bg-[#39ff14]/10 text-[#39ff14]' : ''}
                          ${c.status === 'In Progress' ? 'bg-yellow-500/10 text-yellow-400' : ''}
                          ${c.status === 'Document Prep' ? 'bg-blue-500/10 text-blue-400' : ''}
                          ${c.status === 'Processing' ? 'bg-purple-500/10 text-purple-400' : ''}
                          ${c.status === 'Refusal Appeals' ? 'bg-red-500/10 text-red-400' : ''}
                        `}>
                          {c.status === 'Approved' && <FiCheckCircle size={10} />}
                          {c.status === 'Refusal Appeals' && <FiAlertCircle size={10} />}
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className={`font-bold ${
                          parseInt(c.probability) >= 80 ? 'text-[#39ff14]' :
                          parseInt(c.probability) >= 60 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {c.probability}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            {/* Quick Actions Card */}
            <div className="card-dark p-6">
              <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <a href="/upload" className="flex items-center gap-3 p-3 rounded-lg bg-[#1a1a1a] hover:bg-[#1a1a1a]/80 text-sm text-gray-300 hover:text-[#39ff14] transition-all group">
                  <FiUploadCloud size={16} className="text-[#39ff14]/60 group-hover:text-[#39ff14]" />
                  Upload Client Documents
                </a>
                <a href="/consultation" className="flex items-center gap-3 p-3 rounded-lg bg-[#1a1a1a] hover:bg-[#1a1a1a]/80 text-sm text-gray-300 hover:text-[#39ff14] transition-all group">
                  <FiMessageCircle size={16} className="text-[#39ff14]/60 group-hover:text-[#39ff14]" />
                  AI Consultation
                </a>
                <a href="/cases" className="flex items-center gap-3 p-3 rounded-lg bg-[#1a1a1a] hover:bg-[#1a1a1a]/80 text-sm text-gray-300 hover:text-[#39ff14] transition-all group">
                  <FiCheckCircle size={16} className="text-[#39ff14]/60 group-hover:text-[#39ff14]" />
                  View Case Results
                </a>
              </div>
            </div>

            {/* Top Countries */}
            <div className="card-dark p-6">
              <h2 className="text-lg font-bold text-white mb-4">Top Destinations</h2>
              <div className="space-y-3">
                {[
                  { country: 'Australia', pct: 32, cases: 15 },
                  { country: 'Canada', pct: 28, cases: 13 },
                  { country: 'UK', pct: 18, cases: 8 },
                  { country: 'Schengen', pct: 12, cases: 6 },
                  { country: 'GCC / Other', pct: 10, cases: 5 },
                ].map((d) => (
                  <div key={d.country}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">{d.country}</span>
                      <span className="text-white font-medium">{d.cases} cases</span>
                    </div>
                    <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#39ff14] rounded-full transition-all duration-1000"
                        style={{ width: `${d.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
