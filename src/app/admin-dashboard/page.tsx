'use client';

import { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import {
  FiShield, FiTrash2, FiPlus, FiRefreshCw, FiCopy, FiEye,
  FiX, FiCheck, FiAlertCircle, FiUsers, FiLock, FiActivity
} from 'react-icons/fi';

interface StaffMember {
  code: string;
  name: string;
  status: 'Active' | 'Revoked';
  usesLeft: number;
  maxUses: number;
  createdDate: string;
  lastUsed?: string;
  revokedAt?: string;
  notes?: string;
}

export default function AdminDashboardPage() {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [gasConnected, setGasConnected] = useState(false);
  const [totalActive, setTotalActive] = useState(0);
  const [totalRevoked, setTotalRevoked] = useState(0);

  // Generate form state
  const [showGen, setShowGen] = useState(false);
  const [genName, setGenName] = useState('');
  const [genMaxUses, setGenMaxUses] = useState(1);
  const [genNotes, setGenNotes] = useState('');
  const [genStatus, setGenStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [generatedCode, setGeneratedCode] = useState('');

  // Delete form state
  const [deleteInput, setDeleteInput] = useState('');
  const [deleteStatus, setDeleteStatus] = useState<'idle' | 'deleting' | 'success' | 'error'>('idle');

  // ── Load staff data from Google Sheets ──
  const loadStaff = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sheet-data?sheet=Staff_Auth&action=read');
      const data = await res.json();

      if (data.error && !data.gasUrl) {
        setGasConnected(false);
      } else if (data.rows) {
        setGasConnected(true);
        const staff: StaffMember[] = data.rows.map((row: any) => ({
          code: row.Code || row.code || '',
          name: row.Name || row.assigned_to || row.name || 'Unknown',
          status: (row.Status || row.status || 'Active') as any,
          usesLeft: parseInt(row.Uses_Left || row.uses_left || row.max_uses || '0'),
          maxUses: parseInt(row.Max_Uses || row.max_uses || '1'),
          createdDate: row.Created_At || row.created_at || row.created || new Date().toISOString(),
          lastUsed: row.Last_Used || row.last_used || undefined,
          revokedAt: row.Revoked_At || row.revoked_at || undefined,
          notes: row.Notes || row.notes || '',
        }));
        setStaffList(staff);
        setTotalActive(staff.filter(s => s.status === 'Active').length);
        setTotalRevoked(staff.filter(s => s.status === 'Revoked').length);
      }
    } catch {
      setGasConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadStaff(); }, [loadStaff]);

  // ── Generate New Staff Code ──
  const handleGenerate = async () => {
    if (!genName.trim()) return;
    setGenStatus('saving');
    try {
      const res = await fetch('/api/sheet-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sheet: 'Staff_Auth',
          action: 'addStaffCode',
          data: {
            Code: generateCode(),
            Name: genName,
            Status: 'Active',
            Created_At: new Date().toISOString(),
            Max_Uses: genMaxUses,
            Uses_Left: genMaxUses,
            Notes: genNotes,
          },
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setGeneratedCode(data.code || generateCode());
      setGenStatus('success');

      // Update local state
      setStaffList(prev => [...prev, {
        code: data.code || generateCode(),
        name: genName,
        status: 'Active',
        usesLeft: genMaxUses,
        maxUses: genMaxUses,
        createdDate: new Date().toISOString(),
        notes: genNotes,
      }]);
      setTotalActive(prev => prev + 1);

      setGenName('');
      setGenMaxUses(1);
      setGenNotes('');
      setTimeout(() => { setGenStatus('idle'); }, 2000);
    } catch {
      setGenStatus('error');
    }
  };

  function generateCode(): string {
    // Generate a random 8-digit code
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  }

  // ── Revoke Staff Code ──
  const handleRevoke = async (code: string) => {
    try {
      const res = await fetch('/api/sheet-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sheet: 'Staff_Auth',
          action: 'revokeStaffCode',
          data: { Code: code },
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setStaffList(prev =>
        prev.map(s => s.code === code ? { ...s, status: 'Revoked' as const, revokedAt: new Date().toISOString() } : s)
      );
      setTotalRevoked(prev => prev + 1);
      setTotalActive(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Revoke error:', err);
    }
  };

  // ── Manual Delete (Master types code) ──
  const handleDelete = async () => {
    if (!deleteInput.trim()) return;
    setDeleteStatus('deleting');
    try {
      const res = await fetch('/api/sheet-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sheet: 'Staff_Auth',
          action: 'revokeStaffCode',
          data: { Code: deleteInput.trim() },
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setDeleteStatus('success');
      setStaffList(prev =>
        prev.map(s => s.code === deleteInput.trim() ? { ...s, status: 'Revoked' as const } : s)
      );
      setDeleteInput('');
      setTimeout(() => setDeleteStatus('idle'), 2000);
    } catch {
      setDeleteStatus('error');
    }
  };

  return (
    <div className="flex w-full min-h-screen">
      <Sidebar />
      <main className="flex-1 min-h-screen p-4 lg:p-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FiShield className="text-[#39ff14]" size={28} />
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">
                Master <span className="neon-text">Dashboard</span>
              </h1>
              <p className="text-gray-500 text-sm">Farrukh AI Pro — Administrative Control</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${gasConnected ? 'bg-[#39ff14]/10 text-[#39ff14]' : 'bg-red-500/10 text-red-400'}`}>
              {gasConnected ? '● Google Sheets Connected' : '● Local Mode'}
            </span>
            <button onClick={loadStaff} className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#39ff14] transition-colors">
              <FiRefreshCw size={14} /> Sync
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="card-dark p-5 flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-[#39ff14]">{totalActive}</p>
              <p className="text-xs text-gray-400">Active Codes</p>
            </div>
            <FiUsers size={32} className="text-[#39ff14]/30" />
          </div>
          <div className="card-dark p-5 flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-red-400">{totalRevoked}</p>
              <p className="text-xs text-gray-400">Revoked Codes</p>
            </div>
            <FiLock size={32} className="text-red-400/30" />
          </div>
          <div className="card-dark p-5 flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-blue-400">{staffList.length}</p>
              <p className="text-xs text-gray-400">Total Issued</p>
            </div>
            <FiActivity size={32} className="text-blue-400/30" />
          </div>
        </div>

        {/* Staff Codes Table */}
        <div className="card-dark p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Staff Access Codes</h2>
            <button onClick={() => setShowGen(true)} className="neon-btn flex items-center gap-2 px-4 py-2 rounded-lg text-sm">
              <FiPlus size={14} /> Generate New Code
            </button>
          </div>

          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading staff codes from Google Sheets...</div>
          ) : staffList.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No staff codes found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-800">
                  <th className="py-2 px-3 text-left text-gray-500 text-xs uppercase">Code</th>
                  <th className="py-2 px-3 text-left text-gray-500 text-xs uppercase">Assigned To</th>
                  <th className="py-2 px-3 text-left text-gray-500 text-xs uppercase">Status</th>
                  <th className="py-2 px-3 text-left text-gray-500 text-xs uppercase">Uses</th>
                  <th className="py-2 px-3 text-left text-gray-500 text-xs uppercase">Created</th>
                  <th className="py-2 px-3 text-left text-gray-500 text-xs uppercase">Action</th>
                </tr></thead>
                <tbody>{staffList.filter(s => s.code).map((staff, i) => (
                  <tr key={staff.code + i} className="border-b border-gray-800/50 hover:bg-[#1a1a1a] transition-colors">
                    <td className="py-2 px-3 font-mono text-[#39ff14]">{staff.code}</td>
                    <td className="py-2 px-3 text-white">{staff.name}</td>
                    <td className="py-2 px-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase
                        ${staff.status === 'Active' ? 'bg-[#39ff14]/10 text-[#39ff14]' : 'bg-red-500/10 text-red-400'}`}>
                        {staff.status}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-gray-300">{staff.usesLeft}/{staff.maxUses}</td>
                    <td className="py-2 px-3 text-gray-400 text-xs">
                      {staff.createdDate ? new Date(staff.createdDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="py-2 px-3">
                      {staff.status === 'Active' ? (
                        <button onClick={() => handleRevoke(staff.code)}
                          className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 text-xs">
                          <FiTrash2 size={14} /> Revoke
                        </button>
                      ) : (
                        <span className="text-gray-700 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </div>

        {/* Master Verification Panel */}
        <div className="card-dark p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-4">
            <FiEye className="inline mr-2" size={18} /> Master Verification
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Enter a staff code to immediately revoke access. Staff members with this code will be denied login.
          </p>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={deleteInput}
              onChange={e => { setDeleteInput(e.target.value.replace(/[^\d]/g, '')); setDeleteStatus('idle'); }}
              placeholder="Enter 8-digit staff code"
              maxLength={8}
              className="input-dark flex-1 px-4 py-2.5 text-sm font-mono text-center tracking-widest"
            />
            <button onClick={handleDelete} disabled={deleteStatus === 'deleting' || deleteInput.length !== 8}
              className="neon-btn flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm disabled:opacity-50">
              {deleteStatus === 'deleting' ? <FiLock className="animate-spin" size={14} /> : <FiCheck size={14} />}
              Revoke Access
            </button>
          </div>
          {deleteStatus === 'success' && (
            <p className="mt-3 text-sm text-[#39ff14] flex items-center gap-2"><FiCheck size={14} /> Code revoked successfully.</p>
          )}
          {deleteStatus === 'error' && (
            <p className="mt-3 text-sm text-red-400 flex items-center gap-2"><FiAlertCircle size={14} /> Failed to revoke. Check connection.</p>
          )}
        </div>
      </main>

      {/* Generate New Code Modal */}
      {showGen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setShowGen(false)}>
          <div className="card-dark w-full max-w-lg mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FiPlus className="text-[#39ff14]" size={18} /> Generate Staff Code
              </h2>
              <button onClick={() => setShowGen(false)} className="text-gray-500 hover:text-white"><FiX size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Staff Member Name</label>
                <input type="text" value={genName} onChange={e => setGenName(e.target.value)}
                  className="input-dark w-full px-4 py-2.5 text-sm" placeholder="e.g. Ali Hassan" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Max Uses</label>
                <input type="number" value={genMaxUses} onChange={e => setGenMaxUses(Math.max(1, parseInt(e.target.value) || 1))}
                  className="input-dark w-full px-4 py-2.5 text-sm" min={1} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Notes (optional)</label>
                <input type="text" value={genNotes} onChange={e => setGenNotes(e.target.value)}
                  className="input-dark w-full px-4 py-2.5 text-sm" placeholder="e.g. Karachi branch staff" />
              </div>
            </div>
            {genStatus === 'success' && (
              <div className="mt-4 p-4 rounded-lg bg-[#39ff14]/5 border border-[#39ff14]/20 text-center">
                <p className="text-sm text-[#39ff14] mb-2">Code generated!</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl font-mono font-bold text-white">{generatedCode}</span>
                  <button onClick={() => navigator.clipboard.writeText(generatedCode)}
                    className="p-2 rounded bg-[#1e1e1e] text-gray-400 hover:text-[#39ff14] transition-colors">
                    <FiCopy size={14} />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Share this code with the staff member. They use it to log in.</p>
              </div>
            )}
            {genStatus === 'error' && (
              <p className="mt-3 text-sm text-red-400 flex items-center gap-2"><FiAlertCircle size={14} /> Failed to generate. Check Google Sheets config.</p>
            )}
            <button onClick={handleGenerate} disabled={genStatus === 'saving' || !genName.trim()}
              className="neon-btn w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm disabled:opacity-50">
              {genStatus === 'saving' ? <FiLock size={14} className="animate-spin" /> : <FiShield size={14} />}
              Generate & Save to Google Sheets
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
