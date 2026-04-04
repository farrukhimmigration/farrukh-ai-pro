'use client';

import { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import { FiSearch, FiPlus, FiRefreshCw, FiX, FiCheck, FiAlertCircle, FiLoader, FiMail, FiPhone, FiEdit2 } from 'react-icons/fi';

interface Client {
  id?: string;
  name: string;
  phone: string;
  email: string;
  country: string;
  visaType: string;
  status: 'active' | 'completed' | 'appeals' | 'pending';
  cases: number;
  createdAt?: string;
  updatedAt?: string;
  documents?: string[];
  notes?: string;
}

// Fallback sample data if Google Sheets is not connected
const FALLBACK_CLIENTS: Client[] = [
  { name: 'Ahmed Khan', phone: '+92 300 1234567', email: '', country: 'Australia', visaType: '482 TSS', status: 'active', cases: 1 },
  { name: 'Sara Ali', phone: '+92 333 9876543', email: '', country: 'Canada', visaType: 'Express Entry', status: 'completed', cases: 1 },
  { name: 'Omar Farooq', phone: '+92 345 1122334', email: '', country: 'UK', visaType: 'Skilled Worker', status: 'appeals', cases: 2 },
  { name: 'Fatima Noor', phone: '+92 321 5566778', email: '', country: 'Germany', visaType: 'Schengen Visit', status: 'active', cases: 1 },
  { name: 'Bilal Ahmed', phone: '+92 309 6136080', email: '', country: 'UAE', visaType: 'Labour Card', status: 'active', cases: 1 },
  { name: 'Hassan Malik', phone: '+92 311 2233445', email: '', country: 'USA', visaType: 'EB-2 NIW', status: 'active', cases: 1 },
];

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [gasConnected, setGasConnected] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newClient, setNewClient] = useState<Client>({ name: '', phone: '', email: '', country: '', visaType: '', status: 'pending', cases: 0 });
  const [addStatus, setAddStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  // ── Fetch clients from Google Sheets on mount ──
  const fetchClients = useCallback(async (showSync = false) => {
    if (showSync) setSyncing(true);
    else setLoading(true);

    try {
      const res = await fetch('/api/sheet-data?sheet=Clients&action=read');
      const data = await res.json();

      if (data.error && !data.gasUrl) {
        // Google Sheets not connected — use fallback
        setGasConnected(false);
        setClients(FALLBACK_CLIENTS);
      } else if (data.error) {
        // Connected but error fetching — use fallback
        setGasConnected(true);
        setClients(FALLBACK_CLIENTS);
      } else {
        setGasConnected(true);
        const rows: Client[] = (data.rows || []).map((r: any) => ({
          id: r.CaseID || r.id || `FC-${Date.now()}`,
          name: r.Name || r.ClientName || r.name || 'Unknown',
          phone: r.Phone || r.phone || '',
          email: r.Email || r.email || '',
          country: r.Country || r.Destination || r.country || '',
          visaType: r.VisaType || r.visa_type || r.visaType || '',
          status: (r.Status || r.status || 'pending').toLowerCase(),
          cases: parseInt(r.Cases || r.cases || '1'),
          createdAt: r.CreatedAt || r.createdAt || r.created_at || '',
          updatedAt: r.UpdatedAt || r.updatedAt || r.updated_at || '',
          notes: r.Notes || r.notes || '',
        }));
        setClients(rows.length > 0 ? rows : FALLBACK_CLIENTS);
      }
    } catch {
      setGasConnected(false);
      setClients(FALLBACK_CLIENTS);
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, []);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  // ── Add new client ──
  const handleAddClient = async () => {
    if (!newClient.name.trim()) return;
    setAddStatus('saving');
    try {
      const res = await fetch('/api/sheet-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sheet: 'Clients',
          action: 'add',
          data: {
            Name: newClient.name,
            Phone: newClient.phone,
            Email: newClient.email,
            Country: newClient.country,
            VisaType: newClient.visaType,
            Status: newClient.status,
            DateAdded: new Date().toISOString(),
          },
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setAddStatus('success');
      setClients(prev => [...prev, { ...newClient, id: `FC-${Date.now()}` }]);
      setNewClient({ name: '', phone: '', email: '', country: '', visaType: '', status: 'pending', cases: 0 });
      setTimeout(() => { setShowAdd(false); setAddStatus('idle'); }, 2000);
    } catch {
      setAddStatus('error');
    }
  };

  // ── Filter ──
  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.country.toLowerCase().includes(search.toLowerCase()) ||
    c.visaType.toLowerCase().includes(search.toLowerCase()) ||
    (c.id || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex w-full min-h-screen">
      <Sidebar />
      <main className="flex-1 min-h-screen p-4 lg:p-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">
              Client <span className="neon-text">Management</span>
            </h1>
            <p className="text-gray-500 mt-1">Real-time data synced from Google Sheets.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${gasConnected ? 'bg-[#39ff14]/10 text-[#39ff14]' : 'bg-red-500/10 text-red-400'}`}>
              {gasConnected ? '● Google Sheets Connected' : '● Local Mode'}
            </span>
            <button onClick={() => fetchClients(true)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#39ff14] transition-colors">
              {syncing ? <FiLoader className="animate-spin" size={14} /> : <FiRefreshCw size={14} />}
              Sync
            </button>
            <button onClick={() => setShowAdd(true)} className="neon-btn flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm">
              <FiPlus size={16} /> Add Client
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="card-dark p-4 mb-6">
          <div className="flex items-center gap-3">
            <FiSearch className="text-gray-500 flex-shrink-0" size={18} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search clients by name, case ID, country, or visa type..."
              className="input-dark flex-1 px-4 py-2 text-sm bg-transparent border-0"
            />
            <span className="text-xs text-gray-600">{filtered.length} clients</span>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <FiLoader className="animate-spin text-[#39ff14] mr-3" size={20} />
            <span className="text-gray-400">Loading clients from Google Sheets...</span>
          </div>
        )}

        {/* Client Cards */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((client, i) => (
              <div key={client.id || i} className="card-dark p-5 hover:border-[#39ff14]/40 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#39ff14]/10 flex items-center justify-center text-[#39ff14] font-bold text-sm">
                    {client.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-white font-semibold truncate">{client.name}</h3>
                    {client.id && <p className="text-[10px] text-gray-600 font-mono">{client.id}</p>}
                    {client.createdAt && <p className="text-[10px] text-gray-600">Since {new Date(client.createdAt).toLocaleDateString()}</p>}
                  </div>
                </div>
                <div className="space-y-1 text-sm mb-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Country</span>
                    <span className="text-gray-300">{client.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Visa Type</span>
                    <span className="text-gray-300">{client.visaType}</span>
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
                    ${client.status === 'pending' ? 'bg-gray-500/10 text-gray-400' : ''}
                  `}>
                    {client.status}
                  </span>
                  <div className="flex gap-1 ml-auto">
                    {client.phone && (
                      <button className="p-2 rounded bg-[#1a1a1a] hover:bg-[#2a2a2a] text-gray-400 hover:text-[#39ff14] transition-colors" title="Call">
                        <FiPhone size={14} />
                      </button>
                    )}
                    {client.email && (
                      <button className="p-2 rounded bg-[#1a1a1a] hover:bg-[#2a2a2a] text-gray-400 hover:text-[#39ff14] transition-colors" title="Email">
                        <FiMail size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Client Modal */}
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setShowAdd(false)}>
            <div className="card-dark w-full max-w-lg mx-4 p-6" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">Add New Client</h2>
                <button onClick={() => setShowAdd(false)} className="text-gray-500 hover:text-white"><FiX size={20} /></button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs text-gray-400 mb-1">Client Name *</label>
                  <input type="text" value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})}
                    className="input-dark w-full px-4 py-2.5 text-sm" placeholder="e.g., Muhammad Ali" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Phone</label>
                  <input type="text" value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})}
                    className="input-dark w-full px-4 py-2.5 text-sm" placeholder="+92 3XX XXXXXXX" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Email</label>
                  <input type="email" value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})}
                    className="input-dark w-full px-4 py-2.5 text-sm" placeholder="client@email.com" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Country</label>
                  <input type="text" value={newClient.country} onChange={e => setNewClient({...newClient, country: e.target.value})}
                    className="input-dark w-full px-4 py-2.5 text-sm" placeholder="e.g., Australia" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Visa Type</label>
                  <select value={newClient.visaType} onChange={e => setNewClient({...newClient, visaType: e.target.value})}
                    className="input-dark w-full px-4 py-2.5 text-sm">
                    <option value="">Select</option>
                    <option value="482 TSS">482 TSS</option>
                    <option value="Express Entry">Express Entry</option>
                    <option value="Skilled Worker">Skilled Worker</option>
                    <option value="Schengen Visit">Schengen Visit</option>
                    <option value="EB-2 NIW">EB-2 NIW</option>
                    <option value="Labour Card">Labour Card</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Status</label>
                  <select value={newClient.status} onChange={e => setNewClient({...newClient, status: e.target.value as any})}
                    className="input-dark w-full px-4 py-2.5 text-sm">
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="appeals">Appeals</option>
                  </select>
                </div>
              </div>

              {addStatus === 'success' && (
                <div className="mt-4 flex items-center gap-2 text-sm text-[#39ff14]"><FiCheck size={14} /> Client saved to Google Sheets!</div>
              )}
              {addStatus === 'error' && (
                <div className="mt-4 flex items-center gap-2 text-sm text-red-400"><FiAlertCircle size={14} /> Failed to save. Check GAS config.</div>
              )}

              <button onClick={handleAddClient} disabled={addStatus === 'saving'}
                className="neon-btn w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm disabled:opacity-50">
                {addStatus === 'saving' ? <FiLoader className="animate-spin" size={14} /> : <FiCheck size={14} />}
                Save to Google Sheets
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
