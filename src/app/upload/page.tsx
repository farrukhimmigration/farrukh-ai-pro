'use client';

import { useState, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import {
  FiUpload, FiX, FiFile, FiCheckCircle, FiAlertCircle, FiSend,
  FiShield, FiChevronDown, FiChevronUp, FiEye
} from 'react-icons/fi';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface UploadedFile {
  name: string;
  size: number;
  status: 'pending' | 'uploaded' | 'failed';
  audit?: any;
}

interface AuditResult {
  score: number;
  passed: string[];
  failed: Array<{ id: string; reason: string }>;
  warnings: string[];
  missing: string[];
  summary: string;
  verdict: 'APPROVE' | 'CONDITIONAL' | 'REJECT';
}

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [clientName, setClientName] = useState('');
  const [caseType, setCaseType] = useState('');
  const [country, setCountry] = useState('');
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [message, setMessage] = useState('');
  const [dragging, setDragging] = useState(false);
  const [uploadedFilesList, setUploadedFilesList] = useState<UploadedFile[]>([]);
  const [auditEnabled, setAuditEnabled] = useState(true);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [expandedAudit, setExpandedAudit] = useState<number | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);
  const handleDragLeave = useCallback(() => setDragging(false), []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  }, []);
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selected]);
    }
  }, []);
  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleUpload = async () => {
    if (!clientName.trim()) { setMessage('Client name is required.'); return; }
    if (files.length === 0) { setMessage('Please select at least one file.'); return; }

    setStatus('uploading');
    setMessage('');
    setUploadedFilesList([]);
    setAuditResult(null);

    const formData = new FormData();
    formData.append('clientName', clientName.trim());
    formData.append('visaType', caseType);
    formData.append('destination', country);
    formData.append('audit', auditEnabled ? 'true' : 'false');
    files.forEach(f => formData.append('files', f));

    // Update local list
    const pendingList: UploadedFile[] = files.map(f => ({ name: f.name, size: f.size, status: 'pending' }));
    setUploadedFilesList(pendingList);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setStatus('success');
      setMessage(`Successfully uploaded ${data.files.length} file(s) for ${data.clientName}!`);

      const updatedList: UploadedFile[] = data.files.map((f: any) => ({
        name: f.name,
        size: f.size,
        status: 'uploaded',
        audit: f.audit,
      }));
      setUploadedFilesList(updatedList);

      if (data.audit) {
        setAuditResult(data.audit as AuditResult);
      }

      setFiles([]);
      setClientName('');
      setCaseType('');
      setCountry('');
    } catch (err) {
      setStatus('error');
      setMessage(`Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setUploadedFilesList(prev => prev.map(f => ({ ...f, status: 'failed' })));
    }
  };

  return (
    <div className="flex w-full min-h-screen">
      <Sidebar />
      <main className="flex-1 min-h-screen p-4 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-white">
            Upload <span className="neon-text">Client Documents</span>
          </h1>
          <p className="text-gray-500 mt-1">Upload and organize client documents for case processing.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client Info */}
            <div className="card-dark p-6">
              <h2 className="text-lg font-bold text-white mb-4">Client Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Client Name *</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    placeholder="e.g., Ahmed Khan"
                    className="input-dark w-full px-4 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Visa Type</label>
                  <select
                    value={caseType}
                    onChange={e => setCaseType(e.target.value)}
                    className="input-dark w-full px-4 py-2.5 text-sm"
                  >
                    <option value="">Select visa type</option>
                    <optgroup label="Australia">
                      <option value="Subclass 600 Visitor">Subclass 600 Visitor</option>
                      <option value="Subclass 500 Student">Subclass 500 Student</option>
                      <option value="Subclass 189 Skilled">Subclass 189 Skilled</option>
                      <option value="Subclass 190 Skilled">Subclass 190 Skilled</option>
                      <option value="Subclass 482 TSS">Subclass 482 TSS</option>
                      <option value="Subclass 309 Partner">Subclass 309 Partner</option>
                    </optgroup>
                    <optgroup label="Canada">
                      <option value="Express Entry FSW">Express Entry FSW</option>
                      <option value="Express Entry CEC">Express Entry CEC</option>
                      <option value="Blue Collar LMIA">Blue Collar LMIA</option>
                      <option value="Study Permit">Study Permit</option>
                      <option value="Visitor Visa">Visitor Visa</option>
                    </optgroup>
                    <optgroup label="UK">
                      <option value="Skilled Worker">Skilled Worker</option>
                      <option value="Student">Student</option>
                      <option value="Family">Family</option>
                    </optgroup>
                    <optgroup label="Schengen">
                      <option value="Schengen Visit">Schengen Visit</option>
                      <option value="Schengen Business">Schengen Business</option>
                    </optgroup>
                    <optgroup label="USA">
                      <option value="EB-2 NIW">EB-2 NIW</option>
                      <option value="H1B">H1B</option>
                      <option value="B1/B2">B1/B2 Visit</option>
                    </optgroup>
                    <optgroup label="GCC">
                      <option value="UAE Work Permit">UAE Work Permit</option>
                      <option value="Saudi Work Permit">Saudi Work Permit</option>
                      <option value="Qatar Work Permit">Qatar Work Permit</option>
                    </optgroup>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Destination Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    placeholder="e.g., Australia"
                    className="input-dark w-full px-4 py-2.5 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Drop Zone */}
            <div className="card-dark p-6">
              <h2 className="text-lg font-bold text-white mb-4">Documents</h2>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                  border-2 border-dashed rounded-xl p-8 text-center transition-all
                  ${dragging
                    ? 'border-[#39ff14] bg-[#39ff14]/5 neon-glow'
                    : 'border-[#2a2a2a] hover:border-[#39ff14]/50'
                  }
                `}
              >
                <FiUpload size={36} className="mx-auto text-[#39ff14]/40 mb-3" />
                <p className="text-white font-medium mb-1">
                  Drag and drop files here
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  or click to browse
                </p>
                <label className="neon-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-lg cursor-pointer text-sm">
                  <FiUpload size={16} />
                  Choose Files
                  <input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-600 mt-3">
                  Supports PDF, DOC, DOCX, JPG, PNG, XLS, ZIP (up to 50MB)
                </p>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="mt-4 space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
                  {files.map((file, i) => (
                    <div key={`${file.name}-${i}`} className="flex items-center justify-between bg-[#1a1a1a] rounded-lg px-4 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <FiFile size={16} className="text-[#39ff14]/60 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm text-white truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <button onClick={() => removeFile(i)} className="text-gray-500 hover:text-red-400 transition-colors flex-shrink-0">
                        <FiX size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Status Message */}
              {message && (
                <div className={`mt-4 flex items-center gap-2 p-3 rounded-lg text-sm
                  ${status === 'success' ? 'bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/20' : ''}
                  ${status === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : ''}
                  ${status === 'uploading' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : ''}
                `}>
                  {status === 'success' && <FiCheckCircle size={16} />}
                  {status === 'error' && <FiAlertCircle size={16} />}
                  {status === 'uploading' && (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  {message}
                </div>
              )}

              {/* Upload Button */}
              <div className="mt-6">
                <button
                  onClick={handleUpload}
                  disabled={status === 'uploading'}
                  className="neon-btn w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiSend size={16} />
                  {status === 'uploading' ? 'Uploading...' : 'Upload to Farrukh Consultancy'}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar - Upload Status */}
          <div className="space-y-4">
            {/* AI Audit Toggle */}
            <div className="card-dark p-6">
              <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                <FiShield className="text-[#39ff14]" size={16} /> AI Visa Audit
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Check documents against visa rules</span>
                <button
                  onClick={() => setAuditEnabled(!auditEnabled)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${auditEnabled ? 'bg-[#39ff14]' : 'bg-gray-700'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow ${auditEnabled ? 'left-6' : 'left-0.5'}`} />
                </button>
              </div>
            </div>

            {/* Upload Summary */}
            <div className="card-dark p-6">
              <h3 className="font-bold text-white mb-3">Upload Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Files</span>
                  <span className="text-white font-medium">{files.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Size</span>
                  <span className="text-white font-medium">{(files.reduce((a, f) => a + f.size, 0) / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Client</span>
                  <span className="text-white font-medium">{clientName || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Visa</span>
                  <span className="text-white font-medium">{caseType || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Country</span>
                  <span className="text-white font-medium">{country || '—'}</span>
                </div>
              </div>
            </div>

            {/* Overall Audit Verdict */}
            {auditResult && (
              <div className={`card-dark p-6 border-l-4 ${
                auditResult.verdict === 'APPROVE' ? 'border-l-[#39ff14]' :
                auditResult.verdict === 'REJECT' ? 'border-l-red-500' : 'border-l-yellow-500'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <FiShield className={
                    auditResult.verdict === 'APPROVE' ? 'text-[#39ff14]' :
                    auditResult.verdict === 'REJECT' ? 'text-red-400' : 'text-yellow-400'
                  } size={18} />
                  <h3 className="font-bold text-white">Audit Verdict</h3>
                </div>
                <div className={`text-3xl font-black mb-2 ${
                  auditResult.verdict === 'APPROVE' ? 'text-[#39ff14]' :
                  auditResult.verdict === 'REJECT' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {auditResult.verdict}
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${
                      auditResult.score >= 70 ? 'bg-[#39ff14]' :
                      auditResult.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                    }`} style={{ width: `${auditResult.score}%` }} />
                  </div>
                  <span className="text-sm text-gray-400 font-mono">{auditResult.score}/100</span>
                </div>
                <p className="text-xs text-gray-400 mb-3">{auditResult.summary}</p>

                <div className="text-xs space-y-1">
                  {auditResult.passed.length > 0 && (
                    <div className="flex items-center gap-1.5 text-[#39ff14]">
                      <FiCheckCircle size={10} /> {auditResult.passed.length} passed
                    </div>
                  )}
                  {auditResult.failed.length > 0 && (
                    <div className="flex items-center gap-1.5 text-red-400">
                      <FiAlertCircle size={10} /> {auditResult.failed.length} failed
                    </div>
                  )}
                  {auditResult.warnings.length > 0 && (
                    <div className="flex items-center gap-1.5 text-yellow-400">
                      <FiAlertCircle size={10} /> {auditResult.warnings.length} warnings
                    </div>
                  )}
                  {auditResult.missing.length > 0 && (
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <FiEye size={10} /> {auditResult.missing.length} not assessable
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* File-level Audit Details */}
            {uploadedFilesList.length > 0 && (
              <div className="card-dark p-6">
                <h3 className="font-bold text-white mb-3">Files & Audit</h3>
                <div className="space-y-2">
                  {uploadedFilesList.map((f, i) => (
                    <div key={i}>
                      <div className="flex items-center gap-2 text-xs cursor-pointer" onClick={() => setExpandedAudit(expandedAudit === i ? null : i)}>
                        {f.status === 'uploaded' && <FiCheckCircle className="text-[#39ff14] flex-shrink-0" size={12} />}
                        {f.status === 'failed' && <FiAlertCircle className="text-red-400 flex-shrink-0" size={12} />}
                        {f.status === 'pending' && (
                          <svg className="animate-spin h-3 w-3 text-yellow-400 flex-shrink-0" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        )}
                        <span className="text-gray-300 truncate flex-1">{f.name}</span>
                        {f.audit && (
                          <span className="flex items-center gap-1">
                            {expandedAudit === i ? <FiChevronUp size={12} className="text-gray-500" /> : <FiChevronDown size={12} className="text-gray-500" />}
                          </span>
                        )}
                      </div>
                      {expandedAudit === i && f.audit && (
                        <div className="ml-5 mt-1 mb-2 p-3 bg-[#111] rounded-lg text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Score</span>
                            <span className={`font-mono font-bold ${
                              f.audit.score >= 70 ? 'text-[#39ff14]' :
                              f.audit.score >= 40 ? 'text-yellow-400' : 'text-red-400'
                            }`}>{f.audit.score}/100</span>
                          </div>
                          <div className={`inline-block text-[10px] px-2 py-0.5 rounded-sm font-bold ${
                            f.audit.verdict === 'APPROVE' ? 'bg-[#39ff14]/10 text-[#39ff14]' :
                            f.audit.verdict === 'REJECT' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'
                          }`}>{f.audit.verdict}</div>
                          {f.audit.failed?.length > 0 && (
                            <div className="mt-1 space-y-0.5">
                              <p className="text-red-400 font-semibold">Failed:</p>
                              {f.audit.failed.map((fail: any, fi: number) => (
                                <p key={fi} className="text-gray-400 pl-2">• {fail.reason || fail}</p>
                              ))}
                            </div>
                          )}
                          {f.audit.warnings?.length > 0 && (
                            <div className="mt-1 space-y-0.5">
                              <p className="text-yellow-400 font-semibold">Warnings:</p>
                              {f.audit.warnings.map((w: string, wi: number) => (
                                <p key={wi} className="text-gray-400 pl-2">⚠ {w}</p>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Supported Documents */}
            <div className="card-dark p-6">
              <h3 className="font-bold text-white mb-3">Required Documents</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p className="flex items-center gap-2"><FiCheckCircle size={12} className="text-[#39ff14]" /> Passport (all pages)</p>
                <p className="flex items-center gap-2"><FiCheckCircle size={12} className="text-[#39ff14]" /> CNIC / NADRA FRC</p>
                <p className="flex items-center gap-2"><FiCheckCircle size={12} className="text-[#39ff14]" /> IELTS / PTE Results</p>
                <p className="flex items-center gap-2"><FiCheckCircle size={12} className="text-[#39ff14]" /> Bank Statements (6 months)</p>
                <p className="flex items-center gap-2"><FiCheckCircle size={12} className="text-[#39ff14]" /> Employment Letters / Slips</p>
                <p className="flex items-center gap-2"><FiCheckCircle size={12} className="text-[#39ff14]" /> Educational Documents</p>
                <p className="flex items-center gap-2"><FiCheckCircle size={12} className="text-[#39ff14]" /> Police Clearance</p>
                <p className="flex items-center gap-2"><FiCheckCircle size={12} className="text-[#39ff14]" /> Nikah Nama / Family Docs</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
