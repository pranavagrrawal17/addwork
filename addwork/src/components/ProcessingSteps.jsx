import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle } from 'lucide-react';

const STEPS = [
  { label: 'Fetching landing page', detail: 'Scraping HTML + markdown via Puppeteer' },
  { label: 'Processing ad image', detail: 'Converting to base64 for Llama 4 vision' },
  { label: 'Analyzing with Llama 4', detail: 'Running CRO analysis via Groq API' },
  { label: 'Injecting copy changes', detail: 'Applying surgical DOM replacements' },
  { label: 'Finalizing output', detail: 'Building preview render' },
];

export default function ProcessingSteps({ currentStep }) {
  const [dots, setDots] = useState('');
  useEffect(() => {
    const t = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 400);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto fade-in">
      {/* Terminal header */}
      <div className="bg-slate-900 border border-slate-700/60 rounded-xl overflow-hidden shadow-2xl shadow-black/60">
        <div className="px-4 py-2.5 bg-slate-800/80 border-b border-slate-700/60 flex items-center gap-2">
          <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500/70"/><div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70"/><div className="w-2.5 h-2.5 rounded-full bg-teal-500/70"/></div>
          <span className="text-xs text-slate-500 font-mono ml-2">addwork — engine.js</span>
          <div className="ml-auto flex items-center gap-1.5 text-xs text-teal-400 font-mono">
            <Loader2 className="w-3 h-3 animate-spin"/> running{dots}
          </div>
        </div>

        <div className="p-5 font-mono text-sm space-y-3">
          {STEPS.map((step, idx) => {
            const n = idx + 1;
            const done = currentStep > n;
            const active = currentStep === n;
            const pending = currentStep < n;
            return (
              <div key={idx} className={`flex items-start gap-3 transition-all duration-300 ${pending ? 'opacity-20' : 'opacity-100'}`}>
                <span className={`shrink-0 mt-0.5 ${done ? 'text-teal-400' : active ? 'text-teal-300' : 'text-slate-600'}`}>
                  {done ? '✓' : active ? '›' : '·'}
                </span>
                <div>
                  <span className={`${done ? 'text-slate-500' : active ? 'text-teal-200' : 'text-slate-600'}`}>
                    {step.label}{active ? dots : done ? ' done' : ''}
                  </span>
                  {active && <p className="text-xs text-slate-600 mt-0.5 font-sans">{step.detail}</p>}
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-5 pb-4">
          <div className="h-0.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-700 rounded-full"
              style={{ width: `${Math.max(5, ((currentStep - 1) / 4) * 100)}%` }}/>
          </div>
          <p className="text-xs text-slate-600 font-mono mt-2">{Math.round(((currentStep - 1) / 4) * 100)}% complete</p>
        </div>
      </div>
    </div>
  );
}
