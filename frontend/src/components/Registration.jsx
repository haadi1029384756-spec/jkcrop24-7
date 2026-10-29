import React, { useState } from 'react';

const Registration = () => {
  const [authMode, setAuthMode] = useState('phone'); // 'phone' or 'email'
  const [role, setRole] = useState('digital_farmer');

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center">
      <header className="w-full max-w-md flex justify-between items-center mb-10">
        <img src="/logo.png" className="h-12" alt="JKCrop24/7" />
        <select className="bg-slate-800 p-2 rounded border border-slate-600 text-sm">
          <option>English</option>
          <option>Kashmiri</option>
          <option>Dogri</option>
          <option>Hindi</option>
        </select>
      </header>

      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-green-500/30">
        <h2 className="text-2xl font-bold text-center mb-6">Join JKCrop24/7</h2>
        
        <div className="flex bg-slate-700 p-1 rounded-lg mb-6">
          <button 
            onClick={() => setAuthMode('phone')}
            className={`flex-1 py-2 rounded-md transition ${authMode === 'phone' ? 'bg-green-600 text-white' : 'text-slate-400'}`}
          >Phone (OTP)</button>
          <button 
            onClick={() => setAuthMode('email')}
            className={`flex-1 py-2 rounded-md transition ${authMode === 'email' ? 'bg-green-600 text-white' : 'text-slate-400'}`}
          >Email</button>
        </div>

        <div className="space-y-4">
          <input type="text" placeholder="Full Name" className="w-full p-3 rounded bg-slate-900 border border-slate-700" />
          {authMode === 'phone' ? 
            <input type="tel" placeholder="+91 00000-00000" className="w-full p-3 rounded bg-slate-900 border border-slate-700" /> :
            <input type="email" placeholder="email@example.com" className="w-full p-3 rounded bg-slate-900 border border-slate-700" />
          }
          
          <div className="grid grid-cols-1 gap-3 py-4">
            <label className="text-sm text-slate-400">I am a:</label>
            <div className="grid grid-cols-1 gap-2">
              {['digital_farmer', 'offline_farmer', 'researcher'].map(r => (
                <button 
                  key={r}
                  onClick={() => setRole(r)}
                  className={`p-3 rounded-lg border transition text-left capitalize ${role === r ? 'border-green-500 bg-green-500/20' : 'border-slate-700 bg-slate-900'}`}
                >
                  {r.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <button className="w-full bg-green-600 hover:bg-green-500 py-3 rounded-xl font-bold transition">Register Now</button>
        </div>
      </div>
    </div>
  );
};
export default Registration;