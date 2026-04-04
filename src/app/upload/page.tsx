'use client';

import { useState, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import { FiUpload, FiX, FiFile, FiCheckCircle, FiAlertCircle, FiSend } from 'react-icons/fi';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface UploadedFile {
  name: string;
  size: number;
  status: 'pending' | 'uploaded' | 'failed';
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

    const formData = new FormData();
    formData.append('clientName', clientName.trim());
    formData.append('caseType', caseType);
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
      setUploadedFilesList(prev => prev.map(f => ({ ...f, status: 'uploaded' })));

      setFiles([]);
      setClientName('');
      setCaseType('');
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
            <div className="card-dark p-6">
              <h3 className="font-bold text-white mb-3">Upload Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Files selected</span>
                  <span className="text-white font-medium">{files.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total size</span>
                  <span className="text-white font-medium">{(files.reduce((a, f) => a + f.size, 0) / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Client</span>
                  <span className="text-white font-medium">{clientName || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Visa Type</span>
                  <span className="text-white font-medium">{caseType || 'Not set'}</span>
                </div>
              </div>
            </div>

            {uploadedFilesList.length > 0 && (
              <div className="card-dark p-6">
                <h3 className="font-bold text-white mb-3">Files Status</h3>
                <div className="space-y-2">
                  {uploadedFilesList.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      {f.status === 'uploaded' && <FiCheckCircle className="text-[#39ff14] flex-shrink-0" size={12} />}
                      {f.status === 'failed' && <FiAlertCircle className="text-red-400 flex-shrink-0" size={12} />}
                      {f.status === 'pending' && (
                        <svg className="animate-spin h-3 w-3 text-yellow-400 flex-shrink-0" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      )}
                      <span className="text-gray-300 truncate">{f.name}</span>
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
