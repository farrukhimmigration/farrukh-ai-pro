'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { FiSend, FiLoader, FiCopy, FiCheck, FiDownload, FiAlertCircle } from 'react-icons/fi';

type ResponseStatus = 'idle' | 'loading' | 'partial' | 'success' | 'error';

export default function ConsultationPage() {
  const [clientName, setClientName] = useState('');
  const [visaType, setVisaType] = useState('');
  const [country, setCountry] = useState('');
  const [question, setQuestion] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [status, setStatus] = useState<ResponseStatus>('idle');
  const [responses, setResponses] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (!clientName.trim() && !question.trim()) {
      setErrorMessage('Please enter a client name or a question.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');
    setResponses([]);

    try {
      const res = await fetch('/api/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: clientName.trim(),
          visaType,
          country: country.trim(),
          question: question.trim(),
          additionalInfo: additionalInfo.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || data.status === 'all_models_failed') {
        setStatus('error');
        setErrorMessage(data.message || data.error || 'All AI models failed. Please try again or check your API key.');
        if (data.fallback_advice) {
          setResponses([{ model: 'Farrukh Offline Guide', content: data.fallback_advice, latency_ms: 0 }]);
        }
        return;
      }

      setResponses(data.all_responses || []);
      setStatus(data.models_failed?.length > 0 ? 'partial' : 'success');
    } catch {
      setStatus('error');
      setErrorMessage('Failed to consult. Please check your network and API key config.');
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex w-full min-h-screen">
      <Sidebar />
      <main className="flex-1 min-h-screen p-4 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-white">
            AI <span className="neon-text">Consultation</span>
          </h1>
          <p className="text-gray-500 mt-1">
            Powered by Qwen 3.6 Plus, DeepSeek R1, and Llama 3.3 — running in parallel.
          </p>
        </div>

        {/* Input Panel */}
        <div className="card-dark p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-4">Case Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Client Name</label>
              <input type="text" value={clientName} onChange={e => setClientName(e.target.value)}
                placeholder="e.g., Muhammad Ali"
                className="input-dark w-full px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Visa Type</label>
              <select value={visaType} onChange={e => setVisaType(e.target.value)} className="input-dark w-full px-4 py-2.5 text-sm">
                <option value="">Select visa type</option>
                <option value="Subclass 482 TSS">Australia 482 TSS</option>
                <option value="Subclass 500 Student">Australia Student</option>
                <option value="Express Entry FSW">Canada Express Entry</option>
                <option value="Blue Collar LMIA">Canada Blue Collar</option>
                <option value="Skilled Worker">UK Skilled Worker</option>
                <option value="Schengen Visit">Schengen Visit</option>
                <option value="EB-2 NIW">USA EB-2 NIW</option>
                <option value="UAE Work Permit">UAE Work Permit</option>
                <option value="Saudi Work Permit">Saudi Work Permit</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Destination Country</label>
              <input type="text" value={country} onChange={e => setCountry(e.target.value)}
                placeholder="e.g., Australia"
                className="input-dark w-full px-4 py-2.5 text-sm" />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Your Question (optional)</label>
            <textarea
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="e.g., Is this client eligible for Australian Subclass 482? Analyze bank statement for anomalies."
              rows={3}
              className="input-dark w-full px-4 py-2.5 text-sm resize-y"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Additional Information</label>
            <textarea
              value={additionalInfo}
              onChange={e => setAdditionalInfo(e.target.value)}
              placeholder="Age, IELTS score, financial status, work experience, prior refusals, etc."
              rows={2}
              className="input-dark w-full px-4 py-2.5 text-sm resize-y"
            />
          </div>

          {errorMessage && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-sm mb-4">
              <FiAlertCircle size={16} />
              {errorMessage}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSubmit}
              disabled={status === 'loading'}
              className="neon-btn flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm disabled:opacity-50"
            >
              {status === 'loading' ? <FiLoader className="animate-spin" size={16} /> : <FiSend size={16} />}
              {status === 'loading' ? 'Consulting AI Models...' : 'Consult AI Models'}
            </button>
            <span className="text-xs text-gray-600">
              Models: Qwen 3.6 Plus + DeepSeek R1 + Llama 3.3 + Gemma 3 (fallback)
            </span>
          </div>
        </div>

        {/* Loading Indicator */}
        {status === 'loading' && (
          <div className="card-dark p-6 flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-[#1a1a1a] border-t-[#39ff14] animate-spin" />
            </div>
            <div>
              <p className="text-white font-medium">Running 3 AI Models in Parallel...</p>
              <p className="text-sm text-gray-500">
                Qwen 3.6 Plus, DeepSeek R1, Llama 3.3 are analyzing your case simultaneously.
              </p>
            </div>
          </div>
        )}

        {/* Response Panel */}
        {responses.length > 0 && (
          <div className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                AI Analysis Results
                {status === 'success' && (
                  <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-[#39ff14]/10 text-[#39ff14]">
                    <FiCheck size={10} /> All Models Responded
                  </span>
                )}
                {status === 'partial' && (
                  <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-yellow-500/10 text-yellow-400">
                    <FiAlertCircle size={10} /> Some Models Swapped for Gemma 3
                  </span>
                )}
              </h2>
            </div>

            {responses.map((resp, idx) => (
              <div key={idx} className="card-dark overflow-hidden">
                <div className="flex items-center justify-between px-6 py-3 border-b border-[#1a1a1a] bg-[#0f0f0f]">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      resp.error ? 'bg-red-400' :
                      resp.fallback_for ? 'bg-yellow-400' : 'bg-[#39ff14]'
                    }`} />
                    <div>
                      <span className="text-sm font-semibold text-white">{resp.model}</span>
                      {resp.fallback_for && (
                        <span className="text-xs text-yellow-400 ml-2">
                          (Fallback for {resp.fallback_for})
                        </span>
                      )}
                      {resp.error && (
                        <span className="text-xs text-red-400 ml-2">Error: {resp.error}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">{resp.latency_ms}ms</span>
                    {resp.content && (
                      <button
                        onClick={() => copyToClipboard(resp.content, idx)}
                        className="text-gray-500 hover:text-[#39ff14] transition-colors p-1"
                        title="Copy response"
                      >
                        {copiedIndex === idx ? <FiCheck size={14} className="text-[#39ff14]" /> : <FiCopy size={14} />}
                      </button>
                    )}
                  </div>
                </div>
                {resp.content && (
                  <div className="px-6 py-4 text-sm text-gray-300 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto scrollbar-thin">
                    {resp.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
