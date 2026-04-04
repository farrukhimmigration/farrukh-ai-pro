'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { FiExternalLink, FiCheckCircle, FiSend, FiAlertCircle, FiClock } from 'react-icons/fi';

interface CaseRecord {
  id: string;
  clientName: string;
  visaType: string;
  country: string;
  status: 'pending' | 'assessed' | 'forwarded' | 'completed';
  assessment: string;
  probability: string;
  date: string;
  aiAdvice?: string;
}

const sampleCases: CaseRecord[] = [
  {
    id: 'AUS-2026-0014',
    clientName: 'Ahmed Khan',
    visaType: 'Subclass 482 TSS',
    country: 'Australia',
    status: 'assessed',
    assessment: 'Strong case - eligible occupation on MLTSSL, 3 years experience, IELTS 6.0. Employer has valid sponsorship. TSMIT met at AUD 70,000.',
    probability: '78%',
    date: '2026-04-03',
    aiAdvice: 'Proceed with skills assessment through relevant authority. Gather 3 years of employment references with detailed duties matching ANZSCO. Ensure SAF Levy is budgeted.',
  },
  {
    id: 'CAN-2026-0087',
    clientName: 'Sara Ali',
    visaType: 'Express Entry FSW',
    country: 'Canada',
    status: 'completed',
    assessment: 'CRS score 487 with PNP. IELTS 8.0, Masters degree, 5 years experience, age 29. WES ECA completed.',
    probability: '92%',
    date: '2026-04-01',
    aiAdvice: 'Client received ITA at CRS 487. Awaiting final PR application submission. All documents verified.',
  },
  {
    id: 'GB-2026-0033',
    clientName: 'Omar Farooq',
    visaType: 'Skilled Worker',
    country: 'UK',
    status: 'pending',
    assessment: 'Initial refusal due to maintenance requirement. Pre-Action Protocol filed. Financial evidence needs stronger proof for 28-day rule.',
    probability: '64%',
    date: '2026-03-30',
  },
  {
    id: 'SCH-2026-0021',
    clientName: 'Fatima Noor',
    visaType: 'Schengen Visit',
    country: 'Germany',
    status: 'assessed',
    assessment: 'Employed at MNC with PKR 350,000/month salary. 3-month tenure is a minor weakness. Bank balance PKR 2.8M. Prior Schengen visa (France 2024) approved.',
    probability: '71%',
    date: '2026-03-28',
  },
  {
    id: 'UAE-2026-0055',
    clientName: 'Bilal Ahmed',
    visaType: 'MOL Labour Card',
    country: 'UAE',
    status: 'assessed',
    assessment: 'Employer confirmed MOHRE registration. Attestation chain complete: HEC-MOFA-UAE Embassy. Document translation done.',
    probability: '85%',
    date: '2026-03-25',
  },
];

export default function CasesPage() {
  const [cases, setCases] = useState<CaseRecord[]>(sampleCases);
  const [selectedCase, setSelectedCase] = useState<CaseRecord | null>(null);
  const [forwardStatus, setForwardStatus] = useState<string>('');

  const forwardToGoogleSheets = async (caseData: CaseRecord) => {
    setForwardStatus('forwarding');
    try {
      const res = await fetch('/api/forward-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: caseData.clientName,
          caseType: caseData.visaType,
          visaCountry: caseData.country,
          caseResult: caseData.aiAdvice || caseData.assessment,
          documents: [],
          assessment: caseData.assessment,
          recommendations: caseData.aiAdvice || 'Proceed with case as planned.',
          successProbability: caseData.probability,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setForwardStatus('error');
        alert(`Failed: ${data.error}`);
        return;
      }

      setCases(prev =>
        prev.map(c => c.id === caseData.id ? { ...c, status: 'forwarded' as const } : c)
      );
      setForwardStatus('success');
    } catch (err) {
      setForwardStatus('error');
      alert('Failed to forward case result to Google Sheets.');
    }
  };

  return (
    <div className="flex w-full min-h-screen">
      <Sidebar />
      <main className="flex-1 min-h-screen p-4 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-white">
            Case <span className="neon-text">Results</span>
          </h1>
          <p className="text-gray-500 mt-1">Manage and forward AI-analyzed case results to Google Sheets.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cases List */}
          <div className="lg:col-span-1">
            <div className="card-dark p-4">
              <h3 className="font-bold text-white mb-4">All Cases</h3>
              <div className="space-y-2 max-h-[600px] overflow-y-auto scrollbar-thin">
                {cases.map(c => (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedCase(c); setForwardStatus(''); }}
                    className={`w-full text-left p-3 rounded-lg transition-all text-sm
                      ${selectedCase?.id === c.id
                        ? 'bg-[#39ff14]/10 border border-[#39ff14]/30'
                        : 'bg-[#1a1a1a] hover:bg-[#1a1a1a]/80 border border-transparent'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono text-[#39ff14]/60">{c.id}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium
                        ${c.status === 'completed' ? 'bg-[#39ff14]/10 text-[#39ff14]' : ''}
                        ${c.status === 'forwarded' ? 'bg-blue-500/10 text-blue-400' : ''}
                        ${c.status === 'assessed' ? 'bg-yellow-500/10 text-yellow-400' : ''}
                        ${c.status === 'pending' ? 'bg-gray-500/10 text-gray-400' : ''}
                      `}>
                        {c.status}
                      </span>
                    </div>
                    <p className="text-white font-medium text-sm truncate">{c.clientName}</p>
                    <p className="text-gray-500 text-xs truncate">{c.visaType} — {c.country}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">{c.date}</span>
                      <span className={`text-xs font-bold
                        ${parseInt(c.probability) >= 80 ? 'text-[#39ff14]' :
                          parseInt(c.probability) >= 60 ? 'text-yellow-400' : 'text-red-400'}
                      `}>{c.probability}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Case Detail Panel */}
          <div className="lg:col-span-2">
            {selectedCase ? (
              <div className="space-y-4">
                {/* Case Header */}
                <div className="card-dark p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-mono text-[#39ff14]/60">{selectedCase.id}</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium
                          ${selectedCase.status === 'completed' ? 'bg-[#39ff14]/10 text-[#39ff14]' : ''}
                          ${selectedCase.status === 'forwarded' ? 'bg-blue-500/10 text-blue-400' : ''}
                          ${selectedCase.status === 'assessed' ? 'bg-yellow-500/10 text-yellow-400' : ''}
                          ${selectedCase.status === 'pending' ? 'bg-gray-500/10 text-gray-400' : ''}
                        `}>
                          {selectedCase.status === 'completed' && <FiCheckCircle size={10} />}
                          {selectedCase.status === 'forwarded' && <FiSend size={10} />}
                          {selectedCase.status === 'assessed' && <FiAlertCircle size={10} />}
                          {selectedCase.status}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-white">{selectedCase.clientName}</h2>
                      <p className="text-gray-400 text-sm">{selectedCase.visaType} — {selectedCase.country}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-[#39ff14]">{selectedCase.probability}</p>
                      <p className="text-xs text-gray-500">Success Probability</p>
                    </div>
                  </div>

                  <div className="border-t border-[#1a1a1a] pt-4 mt-4">
                    <h3 className="text-sm font-bold text-white mb-2">Case Assessment</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">{selectedCase.assessment}</p>
                  </div>

                  {selectedCase.aiAdvice && (
                    <div className="border-t border-[#1a1a1a] pt-4 mt-4">
                      <h3 className="text-sm font-bold text-white mb-2">AI Recommendations</h3>
                      <p className="text-sm text-gray-300 leading-relaxed">{selectedCase.aiAdvice}</p>
                    </div>
                  )}

                  {/* Forward to Google Sheets */}
                  <div className="border-t border-[#1a1a1a] pt-4 mt-4 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => forwardToGoogleSheets(selectedCase)}
                      className="neon-btn flex items-center gap-2 px-5 py-2 rounded-lg text-sm"
                    >
                      <FiSend size={14} />
                      Forward to Google Sheets
                    </button>
                    {forwardStatus === 'forwarding' && (
                      <span className="flex items-center gap-2 text-sm text-yellow-400">
                        <FiClock className="animate-spin" size={14} /> Forwarding...
                      </span>
                    )}
                    {forwardStatus === 'success' && (
                      <span className="flex items-center gap-2 text-sm text-[#39ff14]">
                        <FiCheckCircle size={14} /> Sent to Google Sheets successfully!
                      </span>
                    )}
                    {forwardStatus === 'error' && (
                      <span className="flex items-center gap-2 text-sm text-red-400">
                        <FiAlertCircle size={14} /> Failed to send. Check Google Apps Script URL.
                      </span>
                    )}
                    <span className="text-xs text-gray-600">
                      Sends client data, assessment, and recommendations to your Google Sheet.
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card-dark p-12 text-center">
                <FiExternalLink size={48} className="mx-auto text-gray-700 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Select a Case</h3>
                <p className="text-gray-500 text-sm">Choose a case from the sidebar to view details and forward results.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
