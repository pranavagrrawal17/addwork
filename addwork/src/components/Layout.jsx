import React from 'react';
import { Zap } from 'lucide-react';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#080c10] text-slate-200 flex flex-col font-sans">
      <header className="border-b border-teal-900/40 bg-[#080c10]/90 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-teal-500 rounded-lg opacity-20 blur-sm"/>
              <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center shadow">
                <Zap className="w-4 h-4 text-white fill-white"/>
              </div>
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white">Addwork</span>
              <span className="ml-2 text-[10px] font-semibold bg-teal-900/60 text-teal-400 px-1.5 py-0.5 rounded border border-teal-800/60">BETA</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"/>
            Powered by Groq AI + Llama 4 Scout
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
        {children}
      </main>

      <footer className="py-4 text-center text-xs text-slate-700 border-t border-slate-900">
        Addwork · AI Landing Page Personalization · Powered by <span className="text-teal-600">Groq</span> + <span className="text-teal-600">Llama 4</span>
      </footer>
    </div>
  );
}
