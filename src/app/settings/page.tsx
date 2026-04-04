'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { FiKey, FiLink, FiCheckCircle, FiAlertCircle, FiGlobe, FiEye, FiEyeOff } from 'react-icons/fi';

export default function SettingsPage() {
  const [openrouterKey, setOpenrouterKey] = useState('');
  const [googleScriptUrl, setGoogleScriptUrl] = useState('');
  const [showKeys, setShowKeys] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex w-full min-h-screen">
      <Sidebar />
      <main className="flex-1 min-h-screen p-4 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-white">
            <span className="neon-text">Settings</span> & Configuration
          </h1>
          <p className="text-gray-500 mt-1">Manage API keys, integrations, and workspace preferences.</p>
        </div>

        <div className="max-w-3xl space-y-6">
          {/* API Configuration */}
          <div className="card-dark p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FiKey className="text-[#39ff14]" size={18} />
              API Configuration
            </h2>

            <div className="space-y-6">
              {/* OpenRouter API Key */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  OpenRouter API Key <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showKeys ? 'text' : 'password'}
                    value={openrouterKey}
                    onChange={e => setOpenrouterKey(e.target.value)}
                    placeholder="sk-or-v1-..."
                    className="input-dark w-full px-4 py-3 text-sm pr-12"
                  />
                  <button
                    onClick={() => setShowKeys(!showKeys)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showKeys ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Get your API key from{' '}
                  <a href="https://openrouter.ai/keys" target="_blank" className="text-[#39ff14] underline hover:text-[#2bcc10]">
                    openrouter.ai/keys
                  </a>{' '}
                  — required for Qwen 3.6 Plus, DeepSeek R1, Llama 3.3, and Gemma 3.
                </p>
              </div>

              {/* Google Apps Script URL */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Google Apps Script Web App URL <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showKeys ? 'text' : 'password'}
                    value={googleScriptUrl}
                    onChange={e => setGoogleScriptUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="input-dark w-full px-4 py-3 text-sm pr-12"
                  />
                  <FiLink className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  The deployed Google Apps Script Web App URL that receives case results and stores them in Google Sheets.
                </p>
              </div>

              {/* Test Connection */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  className="neon-btn flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm"
                >
                  <FiCheckCircle size={16} />
                  Save Configuration
                </button>
                {saved && (
                  <span className="flex items-center gap-1 text-sm text-[#39ff14]">
                    <FiCheckCircle size={14} /> Configuration saved!
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Model Configuration */}
          <div className="card-dark p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FiGlobe className="text-[#39ff14]" size={18} />
              Active AI Models
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'Qwen 3.6 Plus', provider: 'qwen/qwen-3.6-plus', status: 'Primary', free: true },
                { name: 'DeepSeek R1', provider: 'deepseek-ai/deepseek-r1', status: 'Primary', free: true },
                { name: 'Llama 3.3 70B', provider: 'meta-llama/llama-3.3-70b-instruct', status: 'Primary', free: true },
                { name: 'Gemma 3 27B', provider: 'google/gemma-3-27b-it', status: 'Failover', free: true },
              ].map(model => (
                <div key={model.provider} className="bg-[#1a1a1a] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-white">{model.name}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase
                      ${model.status === 'Primary' ? 'bg-[#39ff14]/10 text-[#39ff14]' : 'bg-yellow-500/10 text-yellow-400'}
                    `}>
                      {model.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-mono mb-1">{model.provider}</p>
                  <p className="text-xs text-[#39ff14]">Free tier available</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4">
              All 3 primary models run in parallel. If any model fails or times out, it automatically swaps for Gemma 3.
            </p>
          </div>

          {/* Immigration Skills Coverage */}
          <div className="card-dark p-6">
            <h2 className="text-lg font-bold text-white mb-4">Immigration Rules Coverage</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { skill: 'Australia (600, 500, 189/190/491, 482, 309)', loaded: true },
                { skill: 'Canada (Express Entry, Blue Collar LMIA)', loaded: true },
                { skill: 'UK (Skilled Worker, Litigation & Appeals)', loaded: true },
                { skill: 'Schengen (All countries, bank analysis)', loaded: true },
                { skill: 'USA EB-2 NIW (Dhanasar 3-prong)', loaded: true },
                { skill: 'GCC Work Permits (UAE, SA, QA, BH, OM, KW)', loaded: true },
                { skill: 'Turkey Visit Visa (Four Pillars Analysis)', loaded: true },
                { skill: 'NZ Jobs (AEWV pathway)', loaded: true },
                { skill: 'Greece Work Permit (Metaklisi)', loaded: true },
                { skill: 'Spain Digital Nomad Visa', loaded: true },
                { skill: 'Forensic Financial/Bank Analysis', loaded: true },
                { skill: 'FBR/ATL Integration', loaded: true },
              ].map(rule => (
                <div key={rule.skill} className="flex items-center gap-2 text-sm bg-[#1a1a1a] rounded-lg px-3 py-2">
                  <FiCheckCircle className="text-[#39ff14] flex-shrink-0" size={14} />
                  <span className="text-gray-300 truncate">{rule.skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Google Apps Script Template */}
          <div className="card-dark p-6">
            <h2 className="text-lg font-bold text-white mb-4">Google Apps Script Template</h2>
            <p className="text-sm text-gray-400 mb-3">
              Deploy this script in Google Apps Script (<code className="text-[#39ff14]">Extensions → Apps Script</code>) connected to your Google Sheet. 
              Set deployment to "Anyone" so the API can POST to it.
            </p>
            <div className="bg-[#1a1a1a] rounded-lg p-4 overflow-x-auto">
              <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
{`function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  // Ensure headers exist
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp', 'Client Name', 'Case Type',
      'Country', 'Case Result', 'Documents',
      'Assessment', 'Recommendations',
      'Success Probability', 'Consultant'
    ]);
    sheet.getRange(1, 1, 1, 10)
      .setFontWeight('bold')
      .setBackground('#0a0a0a')
      .setFontColor('#39ff14');
  }
  
  // Append the case data
  sheet.appendRow([
    data.timestamp || new Date(),
    data.clientName || 'Unknown',
    data.caseType || '-',
    data.visaCountry || '-',
    data.caseResult || '-',
    data.documentsUploaded || 'None',
    data.assessment || '-',
    data.recommendations || '-',
    data.successProbability || '-',
    data.consultant || 'Farrukh Consultancy'
  ]);
  
  return ContentService.createTextOutput(
    JSON.stringify({ status: 'ok', message: 'Case recorded' })
  ).setMimeType(ContentService.MimeType.JSON);
}`}
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
