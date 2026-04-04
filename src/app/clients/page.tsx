'use client';

import Sidebar from '@/components/Sidebar';
import { FiUsers, FiSearch, FiPlus, FiMail } from 'react-icons/fi';

export default function ClientsPage() {
  return (
    <div className="flex w-full min-h-screen">
      <Sidebar />
      <main className="flex-1 min-h-screen p-4 lg:p-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">
              Client <span className="neon-text">Management</span>
            </h1>
            <p className="text-gray-500 mt-1">View and manage your client directory.</p>
          </div>
          <button className="neon-btn flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm">
            <FiPlus size={16} /> Add Client
          </button>
        </div>

        {/* Search */}
        <div className="card-dark p-4 mb-6">
          <div className="flex items-center gap-3">
            <FiSearch className="text-gray-500 flex-shrink-0" size={18} />
            <input
              type="text"
              placeholder="Search clients by name, case ID, or country..."
              className="input-dark flex-1 px-4 py-2 text-sm bg-transparent border-0"
            />
          </div>
        </div>

        {/* Client Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[
            { name: 'Ahmed Khan', phone: '+92 300 1234567', country: 'Australia', visa: '482 TSS', status: 'active', cases: 1 },
            { name: 'Sara Ali', phone: '+92 333 9876543', country: 'Canada', visa: 'Express Entry', status: 'completed', cases: 1 },
            { name: 'Omar Farooq', phone: '+92 345 1122334', country: 'UK', visa: 'Skilled Worker', status: 'appeals', cases: 2 },
            { name: 'Fatima Noor', phone: '+92 321 5566778', country: 'Germany', visa: 'Schengen Visit', status: 'active', cases: 1 },
            { name: 'Bilal Ahmed', phone: '+92 309 6136080', country: 'UAE', visa: 'Labour Card', status: 'active', cases: 1 },
            { name: 'Hassan Malik', phone: '+92 311 2233445', country: 'USA', visa: 'EB-2 NIW', status: 'active', cases: 1 },
          ].map((client) => (
            <div key={client.name} className="card-dark p-5 hover:border-[#39ff14]/40 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#39ff14]/10 flex items-center justify-center text-[#39ff14] font-bold text-sm">
                  {client.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-white font-semibold truncate">{client.name}</h3>
                  <p className="text-xs text-gray-500">{client.phone}</p>
                </div>
              </div>
              <div className="space-y-1 text-sm mb-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Country</span>
                  <span className="text-gray-300">{client.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Visa Type</span>
                  <span className="text-gray-300">{client.visa}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Cases</span>
                  <span className="text-gray-300">{client.cases}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase
                  ${client.status === 'active' ? 'bg-[#39ff14]/10 text-[#39ff14]' : ''}
                  ${client.status === 'completed' ? 'bg-blue-500/10 text-blue-400' : ''}
                  ${client.status === 'appeals' ? 'bg-red-500/10 text-red-400' : ''}
                `}>
                  {client.status}
                </span>
                <div className="flex gap-1 ml-auto">
                  <button className="p-2 rounded bg-[#1a1a1a] hover:bg-[#2a2a2a] text-gray-400 hover:text-[#39ff14] transition-colors" title="Email">
                    <FiMail size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
