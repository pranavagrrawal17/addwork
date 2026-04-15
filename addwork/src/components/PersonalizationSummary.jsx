import React from 'react';
import { TrendingUp, Target } from 'lucide-react';

const TONE_EMOJI = { professional: '🧠', casual: '😊', urgent: '🔥', friendly: '👋', bold: '💪' };

export default function PersonalizationSummary({ adAnalysis, confidenceScore, campaignName }) {
  const score = Math.round((confidenceScore || 0) * 100);
  const color = score > 70 ? 'teal' : score >= 40 ? 'amber' : 'red';
  const colorMap = {
    teal:  { bar: 'from-teal-500 to-emerald-500', text: 'text-teal-400', badge: 'bg-teal-900/40 border-teal-800 text-teal-400', label: 'Strong Match' },
    amber: { bar: 'from-amber-500 to-yellow-500', text: 'text-amber-400', badge: 'bg-amber-900/40 border-amber-800 text-amber-400', label: 'Moderate Match' },
    red:   { bar: 'from-red-500 to-rose-500',   text: 'text-red-400',   badge: 'bg-red-900/40 border-red-800 text-red-400',     label: 'Weak Match' },
  }[color];

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 mb-4 fade-in">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-teal-400"/>
            <h2 className="text-sm font-semibold text-slate-200">Personalization Report</h2>
          </div>
          {campaignName && <p className="text-xs text-slate-500 mt-0.5 ml-6">Campaign: <span className="text-teal-400">{campaignName}</span></p>}
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${colorMap.badge}`}>{colorMap.label}</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className={`h-full bg-gradient-to-r ${colorMap.bar} rounded-full transition-all duration-1000`} style={{ width: `${score}%` }}/>
            </div>
            <span className={`text-sm font-bold tabular-nums ${colorMap.text}`}>{score}%</span>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/40">
          <div className="flex items-center gap-1.5 mb-3">
            <Target className="w-3.5 h-3.5 text-teal-400"/>
            <p className="text-xs font-semibold tracking-wider text-teal-400 uppercase">Ad Intelligence</p>
          </div>
          <ul className="space-y-2">
            {[
              ['Category', adAnalysis.product_category],
              ['Tone', `${TONE_EMOJI[adAnalysis.tone] || '📌'} ${adAnalysis.tone}`],
              ['Offer', adAnalysis.offer],
              ['Ad Headline', `"${adAnalysis.headline}"`],
            ].map(([k, v]) => (
              <li key={k} className="text-xs flex gap-2">
                <span className="text-slate-500 w-20 shrink-0">{k}</span>
                <span className="text-slate-300">{v}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/40">
          <p className="text-xs font-semibold tracking-wider text-emerald-400 uppercase mb-3">✦ Changes Applied</p>
          <ul className="space-y-2">
            {[
              ['Headline', 'Rewritten to match ad offer'],
              ['Subheadline', 'Pain-point aligned'],
              ['Hero Copy', 'Ad promise connected'],
              ['CTA Button', 'Mapped to ad CTA'],
            ].map(([field, desc]) => (
              <li key={field} className="text-xs flex gap-2">
                <span className="text-teal-500">✓</span>
                <span className="text-slate-400"><span className="text-slate-300 font-medium">{field}</span> — {desc}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
