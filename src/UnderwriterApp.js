"use client";
import React, { useState, useEffect } from 'react';
import { Calculator, FileText, Users, Download, Printer } from 'lucide-react';

export default function UnderwriterApp() {
  const [address, setAddress] = useState('2832 Patton St, Nacogdoches, TX');
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
      <header className="mb-12 border-b border-slate-100 pb-6 flex justify-between items-center text-slate-900">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-indigo-600">DEALSNAP</h1>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-tighter">Underwriting Mission Control</p>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <h2 className="flex items-center gap-2 font-bold text-slate-700">
            <Calculator className="text-indigo-500" size={18}/> Ingest & Buy Terms
          </h2>
          <input 
            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner bg-white"
            placeholder="Property Address..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-widest">Buy Price</label>
              <input type="number" className="w-full p-2 bg-white border border-slate-200 rounded-lg" value={buyTerms.price} onChange={(e) => setBuyTerms({...buyTerms, price: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-widest">Down</label>
              <input type="number" className="w-full p-2 bg-white border border-slate-200 rounded-lg" value={buyTerms.down} onChange={(e) => setBuyTerms({...buyTerms, down: Number(e.target.value)})} />
            </div>
          </div>
        </div>

        <div className="space-y-6 bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
          <h2 className="flex items-center gap-2 font-bold text-indigo-900">
            <FileText className="text-indigo-600" size={18}/> Wrap Terms (Sell)
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-indigo-400 mb-1 tracking-widest">Sell Price</label>
              <input type="number" className="w-full p-2 bg-white border border-indigo-200 rounded-lg" value={wrapTerms.price} onChange={(e) => setWrapTerms({...wrapTerms, price: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-indigo-400 mb-1 tracking-widest">Buyer Down</label>
              <input type="number" className="w-full p-2 bg-white border border-indigo-200 rounded-lg" value={wrapTerms.down} onChange={(e) => setWrapTerms({...wrapTerms, down: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-indigo-400 mb-1 tracking-widest">Interest Rate (%)</label>
              <input type="number" className="w-full p-2 bg-white border border-indigo-200 rounded-lg" value={wrapTerms.rate} onChange={(e) => setWrapTerms({...wrapTerms, rate: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-indigo-400 mb-1 tracking-widest">Balloon (Yrs)</label>
              <input type="number" className="w-full p-2 bg-white border border-indigo-200 rounded-lg" value={wrapTerms.term} onChange={(e) => setWrapTerms({...wrapTerms, term: Number(e.target.value)})} />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 text-white p-8 rounded-3xl mb-12 shadow-2xl shadow-indigo-200/50">
        <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
          <h2 className="text-xl font-bold tracking-tight uppercase text-slate-300">Arbitrage Metrics</h2>
          <div className="flex gap-2">
            <button className="p-3 bg-slate-800 hover:bg-indigo-600 rounded-xl transition-all shadow-lg active:scale-95"><Printer size={18}/></button>
            <button className="p-3 bg-slate-800 hover:bg-indigo-600 rounded-xl transition-all shadow-lg active:scale-95"><Download size={18}/></button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <p className="text-[10px] uppercase font-black text-slate-500 mb-2 tracking-[0.2em]">Upfront Cash</p>
            <p className="text-4xl font-bold text-emerald-400 tabular-nums tracking-tight">${results.upfront.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-black text-slate-500 mb-2 tracking-[0.2em]">Monthly Spread</p>
            <p className="text-4xl font-bold text-indigo-400 tabular-nums tracking-tight">${results.monthlySpread.toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-black text-slate-500 mb-2 tracking-[0.2em]">Equity Spread</p>
            <p className="text-4xl font-bold text-white tabular-nums tracking-tight">${results.backend.toLocaleString()}</p>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-100 pt-8 pb-12">
        <h2 className="flex items-center gap-2 font-bold text-slate-700 mb-6 uppercase tracking-widest text-sm">
          <Users className="text-indigo-500" size={18}/> Buyer Match (Nacogdoches)
        </h2>
        <div className="bg-slate-50 p-5 rounded-2xl flex justify-between items-center border border-slate-200 hover:border-indigo-300 transition-colors cursor-pointer group shadow-sm">
          <div>
            <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-lg tracking-tight">Heidi Lemus</p>
            <p className="text-sm text-slate-400 font-medium">Nacogdoches, TX • Budget: $1,500/mo • 6% Down</p>
          </div>
          <div className="text-right">
            <span className="bg-emerald-100 text-emerald-700 text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest border border-emerald-200">92% Match</span>
          </div>
        </div>
      </section>
      
      <footer className="text-center text-[10px] text-slate-300 uppercase font-bold tracking-[0.3em] mt-12 mb-8">
        Clean Build • DEALSNAP
      </footer>
    </div>
  );
}
