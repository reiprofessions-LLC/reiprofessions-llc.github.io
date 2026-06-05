"use client";
import React, { useState, useEffect } from 'react';
import { Calculator, FileText, Users, Download, Printer } from 'lucide-react';

export default function UnderwriterApp() {
  const [address, setAddress] = useState('2832 Patton St & 220 Leak St, Nacogdoches, TX');
  const [buyTerms, setBuyTerms] = useState({ price: 160000, down: 5000, rate: 5.5, payment: 733.33 });
  const [wrapTerms, setWrapTerms] = useState({ price: 250000, down: 15000, rate: 8.0, term: 10, amort: 30 });
  
  const calculateWrap = () => {
    const loanAmount = wrapTerms.price - wrapTerms.down;
    const monthlyRate = (wrapTerms.rate / 100) / 12;
    const n = wrapTerms.amort * 12;
    const pAndI = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    
    const upfront = wrapTerms.down - buyTerms.down;
    const monthlySpread = pAndI - buyTerms.payment;
    const backend = wrapTerms.price - buyTerms.price;
    
    return { pAndI, upfront, monthlySpread, backend };
  };

  const results = calculateWrap();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans p-8 max-w-4xl mx-auto border-x border-slate-100 shadow-sm">
      <header className="mb-12 border-b border-slate-100 pb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-indigo-600">REI PROFESSIONS</h1>
          <p className="text-slate-400 text-sm font-medium">Underwriting Mission Control</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400 uppercase tracking-widest">Primary Contact</p>
          <p className="font-bold text-slate-700">210-954-3508</p>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <h2 className="flex items-center gap-2 font-bold text-slate-700"><Calculator size={18}/> Ingest & Buy Terms</h2>
          <input 
            className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            placeholder="Property Address..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Buy Price</label>
              <input type="number" className="w-full p-2 bg-white border border-slate-200 rounded" value={buyTerms.price} onChange={(e) => setBuyTerms({...buyTerms, price: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Down</label>
              <input type="number" className="w-full p-2 bg-white border border-slate-200 rounded" value={buyTerms.down} onChange={(e) => setBuyTerms({...buyTerms, down: Number(e.target.value)})} />
            </div>
          </div>
        </div>

        <div className="space-y-6 bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
          <h2 className="flex items-center gap-2 font-bold text-indigo-900"><FileText size={18}/> Wrap Terms (Sell)</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-indigo-400 mb-1">Sell Price</label>
              <input type="number" className="w-full p-2 bg-white border border-indigo-200 rounded" value={wrapTerms.price} onChange={(e) => setWrapTerms({...wrapTerms, price: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-indigo-400 mb-1">Buyer Down</label>
              <input type="number" className="w-full p-2 bg-white border border-indigo-200 rounded" value={wrapTerms.down} onChange={(e) => setWrapTerms({...wrapTerms, down: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-indigo-400 mb-1">Interest Rate</label>
              <input type="number" className="w-full p-2 bg-white border border-indigo-200 rounded" value={wrapTerms.rate} onChange={(e) => setWrapTerms({...wrapTerms, rate: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-indigo-400 mb-1">Balloon (Yrs)</label>
              <input type="number" className="w-full p-2 bg-white border border-indigo-200 rounded" value={wrapTerms.term} onChange={(e) => setWrapTerms({...wrapTerms, term: Number(e.target.value)})} />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 text-white p-8 rounded-3xl mb-12 shadow-xl shadow-indigo-100">
        <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
          <h2 className="text-xl font-bold tracking-tight">Financial Arbitrage / Spread</h2>
          <div className="flex gap-2">
            <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"><Printer size={16}/></button>
            <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"><Download size={16}/></button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-8">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500 mb-2">Upfront Cash</p>
            <p className="text-3xl font-bold text-green-400">${results.upfront.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500 mb-2">Monthly Cash Flow</p>
            <p className="text-3xl font-bold text-indigo-400">${results.monthlySpread.toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500 mb-2">Backend Equity</p>
            <p className="text-3xl font-bold text-white">${results.backend.toLocaleString()}</p>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-100 pt-8">
        <h2 className="flex items-center gap-2 font-bold text-slate-700 mb-6"><Users size={18}/> Buyer Match (Live)</h2>
        <div className="bg-slate-50 p-4 rounded-xl flex justify-between items-center border border-slate-100">
          <div>
            <p className="font-bold text-slate-900">Heidi Lemus</p>
            <p className="text-sm text-slate-400">Target: Nacogdoches, TX • Budget: $1,500/mo</p>
          </div>
          <span className="bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wide">92% Match</span>
        </div>
      </section>
    </div>
  );
}
