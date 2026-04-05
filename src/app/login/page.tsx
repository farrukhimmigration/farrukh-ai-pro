'use client';

import { useState, FormEvent, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FiLock, FiAlertCircle, FiCheck, FiEye, FiEyeOff } from 'react-icons/fi';

// ── LoginForm Component (uses useSearchParams) ──
function LoginForm() {
  const searchParams = useSearchParams();
  const [accessKey, setAccessKey] = useState('');
  const [error, setError] = useState(searchParams?.get('msg') || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [glowPulse, setGlowPulse] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setGlowPulse(prev => !prev), 1500);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = accessKey.trim();
    if (trimmed.length < 7 || trimmed.length > 8) {
      setError('Invalid credentials');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessKey: trimmed }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Invalid credentials');
        setLoading(false);
        return;
      }

      setSuccess(true);
      const target = data.redirect || '/analytics';
      setTimeout(() => {
        window.location.href = target;
      }, 500);

    } catch {
      setError('Invalid credentials');
      setLoading(false);
    }
  };

  const trimmed = accessKey.trim();
  const isMasterLength = trimmed.length === 7;
  const isStaffLength = trimmed.length === 8;
  const isValidLength = isMasterLength || isStaffLength;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden selection:bg-[#39ff14] selection:text-[#0a0a0a]">
      {/* Ambient glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-[#39ff14]/5 rounded-full blur-[100px] transition-all duration-2000"
          style={{ opacity: glowPulse ? 0.6 : 0.2 }}
        />
        <div
          className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[#39ff14]/3 rounded-full blur-[80px] transition-all duration-3000"
          style={{ opacity: glowPulse ? 0.4 : 0.1 }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#39ff14 1px, transparent 1px), linear-gradient(90deg, #39ff14 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo Header */}
        <div className="text-center mb-10">
          {/* Logo icon */}
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl border border-[#39ff14]/20 bg-[#141414] mb-4"
            style={{
              boxShadow: `0 0 20px rgba(57,255,20,${glowPulse ? 0.3 : 0.15}), inset 0 0 10px rgba(57,255,20,0.05)`,
            }}
          >
            <span className="text-[#39ff14] font-black text-2xl">FA</span>
          </div>
          <h1
            className="text-3xl lg:text-4xl font-black tracking-wider"
            style={{
              color: '#39ff14',
              textShadow: `0 0 15px rgba(57,255,20,${glowPulse ? 0.6 : 0.3}), 0 0 30px rgba(57,255,20,${glowPulse ? 0.3 : 0.15})`,
            }}
          >
            FARRUKH
          </h1>
          <p className="text-[11px] text-gray-500 tracking-[0.4em] uppercase font-medium mt-1">
            Consultancy Pro
          </p>
          <div
            className="mt-3 h-px w-24 mx-auto"
            style={{ background: `linear-gradient(90deg, transparent, rgba(57,255,20,${glowPulse ? 0.5 : 0.3}), transparent)` }}
          />
        </div>

        {/* Auth Card */}
        <div
          className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-2xl overflow-hidden"
          style={{ boxShadow: '0 0 40px rgba(0,0,0,0.5), 0 0 1px rgba(57,255,20,0.1)' }}
        >
          {/* Card header accent */}
          <div
            className="h-px w-full"
            style={{ background: `linear-gradient(90deg, transparent, rgba(57,255,20,${glowPulse ? 0.5 : 0.2}), transparent)` }}
          />

          <div className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-lg font-bold text-white">Authentication</h2>
              <p className="text-gray-500 text-xs mt-1">Enter your access code</p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Access Key Input */}
              <div className="mb-4">
                <label htmlFor="accessKey" className="block text-[10px] text-gray-500 mb-1.5 tracking-widest font-semibold uppercase">
                  Access Key
                </label>
                <div className="relative">
                  <input
                    id="accessKey"
                    type={showKey ? 'text' : 'password'}
                    value={accessKey}
                    onChange={e => {
                      const val = e.target.value.replace(/[^\d]/g, '');
                      setAccessKey(val.slice(0, 8));
                      setError('');
                      setSuccess(false);
                    }}
                    placeholder="Enter your key"
                    autoComplete="off"
                    autoFocus
                    className={`
                      w-full px-4 py-3.5 bg-[#0a0a0a] rounded-xl text-white text-center text-2xl tracking-[0.4em] font-mono
                      border transition-all duration-200 outline-none pr-12
                      ${error
                        ? 'border-red-500/50 focus:border-red-500'
                        : success
                          ? 'border-[#39ff14] focus:border-[#39ff14]'
                          : isValidLength
                            ? 'border-[#39ff14]/40 focus:border-[#39ff14]'
                            : 'border-[#1e1e1e] focus:border-[#39ff14]/50'
                      }
                      placeholder:text-gray-700 placeholder:text-lg placeholder:tracking-[0.2em]
                    `}
                    style={{
                      boxShadow: error
                        ? '0 0 15px rgba(239,68,68,0.15)'
                        : isValidLength
                          ? `0 0 10px rgba(57,255,20,${glowPulse ? 0.15 : 0.08})`
                          : 'none',
                    }}
                    inputMode="numeric"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors p-1"
                    tabIndex={-1}
                  >
                    {showKey ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>

      {/* Status indicators */}
              {isValidLength && !error && !success && (
                <p className="text-center text-xs text-[#39ff14]/70 mb-3 flex items-center justify-center gap-1.5">
                  <FiLock size={12} /> Code accepted
                </p>
              )}
              {error && (
                <div className="mb-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                  <FiAlertCircle size={14} className="text-red-400 flex-shrink-0" />
                  <span className="text-xs text-red-400">{error}</span>
                </div>
              )}
              {success && (
                <div className="mb-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-[#39ff14]/10 border border-[#39ff14]/20">
                  <FiCheck size={14} className="text-[#39ff14] flex-shrink-0" />
                  <span className="text-xs text-[#39ff14]">Authentication successful — redirecting...</span>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading || !isValidLength}
                className={`
                  w-full py-3.5 rounded-xl font-bold tracking-wider text-sm transition-all duration-200
                  ${isValidLength && !loading
                    ? 'bg-[#39ff14] text-[#0a0a0a] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] active:scale-[0.99]'
                    : 'bg-[#141414] text-gray-700 cursor-not-allowed'
                  }
                `}
                style={{
                  boxShadow: isValidLength && !loading
                    ? `0 0 20px rgba(57,255,20,${glowPulse ? 0.3 : 0.15})`
                    : 'none',
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    VERIFYING ACCESS KEY...
                  </span>
                ) : (
                  'AUTHENTICATE'
                )}
              </button>
            </form>

              {/* Info footer — NO sensitive info exposed */}
              <div className="mt-6 pt-4 border-t border-[#1a1a1a]">
                <div className="flex items-center justify-center gap-2 text-[10px] text-gray-600">
                  <FiLock size={10} /> Encrypted session · 24-hour expiry
                </div>
              </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-[8px] text-gray-800 tracking-[0.5em] uppercase">
            Farrukh AI Pro v2.0 — Immigration Intelligence
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Page wrapper with Suspense ──
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
          <div className="w-8 h-8 border-2 border-[#39ff14] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
