'use client';

import Sidebar from '@/components/Sidebar';
import { FiBarChart2 } from 'react-icons/fi';

export default function AnalyticsPage() {
  return (
    <div className="flex w-full min-h-screen">
      <Sidebar />
      <main className="flex-1 min-h-screen p-4 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-white">
            <span className="neon-text">Analytics</span> Dashboard
          </h1>
          <p className="text-gray-500 mt-1">Consultancy performance metrics and case analytics.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Approval Rate', value: '78.3%', change: '+12%', color: 'text-[#39ff14]', bg: 'bg-[#39ff14]/10', icon: '\u2705' },
            { label: 'Monthly Revenue', value: 'PKR 2.4M', change: '+8%', color: 'text-blue-400', bg: 'bg-blue-500/10', icon: '\ud83d\udcb5' },
            { label: 'Avg Processing Time', value: '4.2 wks', change: '-3%', color: 'text-yellow-400', bg: 'bg-yellow-500/10', icon: '\u23f1' },
            { label: 'Active Appeals', value: '8', change: '3', color: 'text-red-400', bg: 'bg-red-500/10', icon: '\u26a0' },
          ].map(kpi => (
            <div key={kpi.label} className="card-dark p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${kpi.bg} flex items-center justify-center text-lg`}>
                  {kpi.icon}
                </div>
                <span className={`text-xs font-medium ${kpi.color}`}>{kpi.change}</span>
              </div>
              <p className={`text-2xl font-bold text-white`}>{kpi.value}</p>
              <p className="text-sm text-gray-400 mt-1">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Countries Chart */}
          <div className="card-dark p-6">
            <h2 className="text-lg font-bold text-white mb-6">Cases by Country</h2>
            <div className="space-y-4">
              {[
                { country: 'Australia', cases: 47, pct: 32 },
                { country: 'Canada', cases: 41, pct: 28 },
                { country: 'United Kingdom', cases: 26, pct: 18 },
                { country: 'Schengen (EU)', cases: 18, pct: 12 },
                { country: 'GCC Countries', cases: 10, pct: 7 },
                { country: 'USA', cases: 4, pct: 3 },
              ].map(row => (
                <div key={row.country}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-300">{row.country}</span>
                    <span className="text-white font-medium">{row.cases} ({row.pct}%)</span>
                  </div>
                  <div className="h-3 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#39ff14] rounded-full transition-all duration-700"
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visa Success Rates */}
          <div className="card-dark p-6">
            <h2 className="text-lg font-bold text-white mb-6">Visa Success Rates</h2>
            <div className="space-y-4">
              {[
                { visa: 'Express Entry (Canada)', rate: 92 },
                { visa: 'UAE MOL Labour', rate: 85 },
                { visa: 'Subclass 482 TSS', rate: 78 },
                { visa: 'Schengen Visit', rate: 71 },
                { visa: 'UK Skilled Worker', rate: 64 },
                { visa: 'USA EB-2 NIW', rate: 45 },
              ].map(row => (
                <div key={row.visa}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-300">{row.visa}</span>
                    <span className={`font-bold ${
                      row.rate >= 80 ? 'text-[#39ff14]' :
                      row.rate >= 60 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>{row.rate}%</span>
                  </div>
                  <div className="h-3 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        row.rate >= 80 ? 'bg-[#39ff14]' :
                        row.rate >= 60 ? 'bg-yellow-500' :
                        'bg-red-500'
                      } rounded-full transition-all duration-700`}
                      style={{ width: `${row.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="card-dark p-6">
          <h2 className="text-lg font-bold text-white mb-6">Monthly Case Volume (2026)</h2>
          <div className="flex items-end gap-2 h-40">
            {['Jan', 'Feb', 'Mar', 'Apr'].map((month, i) => {
              const heights = [55, 70, 85, 47][i];
              return (
                <div key={month} className="flex-1 flex flex-col items-center">
                  <span className="text-xs text-gray-500 mb-1">{heights}</span>
                  <div className="w-full max-w-12 h-full bg-[#1a1a1a] rounded-t-lg relative overflow-hidden">
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-[#39ff14]/60 rounded-t transition-all duration-700"
                      style={{ height: `${(heights / 100) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 mt-2">{month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card-dark p-6 mt-6">
          <h2 className="text-lg font-bold text-white mb-6">Recent Activity</h2>
          <div className="space-y-3">
            {[
              { time: '2 hours ago', text: 'Case AUS-2026-0014 — Ahmed Khan, 482 TSS assessment completed (78%)', dot: 'bg-blue-400' },
              { time: '5 hours ago', text: 'Client Bilal Ahmed documents uploaded to UAE Labour Card case.', dot: 'bg-purple-400' },
              { time: '1 day ago', text: 'Case CAN-2026-0087 — Sara Ali, Express Entry approved! CRS: 487.', dot: 'bg-[#39ff14]' },
              { time: '2 days ago', text: 'Google Sheets sync: 3 case results forwarded to master tracker.', dot: 'bg-gray-400' },
              { time: '3 days ago', text: 'AI Consultation: 3 models analyzed Omar Farooq UK appeals case.', dot: 'bg-yellow-400' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-[#1a1a1a] last:border-0">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${item.dot}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-300">{item.text}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
