import React, { useState } from 'react';
import { RotateCcw, Download, Copy, Check, ChevronLeft, ChevronRight, Globe, Columns2 } from 'lucide-react';

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} title="Copy to clipboard"
      className="p-1 hover:bg-slate-700 rounded transition-colors">
      {copied ? <Check className="w-3 h-3 text-teal-400"/> : <Copy className="w-3 h-3 text-slate-500"/>}
    </button>
  );
}

export default function PagePreview({ originalHtml, modifiedHtml, pageChanges, url, onReset }) {
  const [mode, setMode] = useState('split');   // 'split' | 'personalized' | 'original'
  const [panelOpen, setPanelOpen] = useState(true);

  const exportHtml = () => {
    const blob = new Blob([modifiedHtml || ''], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'personalized-page.html';
    a.click();
  };

  const changes = [
    { label: 'Headline', value: pageChanges.headline, color: 'border-teal-500', tag: 'text-teal-400' },
    { label: 'Subheadline', value: pageChanges.subheadline, color: 'border-emerald-500', tag: 'text-emerald-400' },
    { label: 'Hero Copy', value: pageChanges.hero_copy, color: 'border-cyan-500', tag: 'text-cyan-400' },
    { label: 'CTA', value: pageChanges.cta_text, color: 'border-amber-500', tag: 'text-amber-400' },
  ];

  const FallbackContent = () => (
    <div className="flex items-center justify-center h-full bg-slate-900/50" style={{ minHeight: 400 }}>
      <div className="p-6 bg-slate-800 border border-slate-700 rounded-xl max-w-sm text-center">
        <p className="text-slate-400 text-sm">This site blocks iframe rendering. The copy was still generated — export the HTML or view the AI panel →</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#080c10]">
      {/* Browser bar */}
      <div className="flex flex-wrap items-center gap-2 px-3 py-2 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="flex gap-1.5 items-center">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60"/>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60"/>
          <div className="w-2.5 h-2.5 rounded-full bg-teal-500/60"/>
        </div>

        {/* View toggle */}
        <div className="flex gap-0.5 bg-slate-800 p-0.5 rounded-lg border border-slate-700/50 ml-1">
          {[
            { id: 'original', label: 'Original' },
            { id: 'split', label: <><Columns2 className="w-3 h-3 inline mr-1"/>Split</> },
            { id: 'personalized', label: 'AI Page' },
          ].map(v => (
            <button key={v.id} onClick={() => setMode(v.id)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all whitespace-nowrap ${mode === v.id ? (v.id === 'personalized' ? 'bg-teal-600 text-white' : 'bg-slate-600 text-white') : 'text-slate-500 hover:text-slate-300'}`}>
              {v.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700/50">
          <Globe className="w-3 h-3 text-slate-500 shrink-0"/>
          <span className="text-xs text-slate-400 truncate max-w-[200px]">{url}</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden sm:inline text-xs bg-teal-900/50 text-teal-400 border border-teal-800/50 px-2 py-1 rounded-full">✦ AI Active</span>
          <button onClick={exportHtml}
            className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-2.5 py-1.5 rounded-lg transition-colors">
            <Download className="w-3 h-3"/> Export HTML
          </button>
        </div>
      </div>

      {/* Preview area */}
      <div className="relative flex-1 overflow-hidden flex" style={{ minHeight: 500 }}>
        {mode === 'split' ? (
          <div className="flex w-full">
            <div className="flex-1 flex flex-col border-r border-slate-800 min-w-0">
              <div className="text-center py-1 bg-slate-900/80 text-xs text-slate-500 border-b border-slate-800">Original</div>
              {originalHtml ? <iframe srcDoc={originalHtml} title="Original" className="flex-1 w-full border-0 bg-white"/> : <FallbackContent/>}
            </div>
            <div className="flex-1 flex flex-col min-w-0">
              <div className="text-center py-1 bg-teal-950/60 text-xs text-teal-400 border-b border-teal-900/50">AI Personalized</div>
              {modifiedHtml ? <iframe srcDoc={modifiedHtml} title="Personalized" className="flex-1 w-full border-0 bg-white"/> : <FallbackContent/>}
            </div>
          </div>
        ) : (
          <div className="flex-1">
            {(mode === 'personalized' ? modifiedHtml : originalHtml)
              ? <iframe srcDoc={mode === 'personalized' ? modifiedHtml : originalHtml} title="Preview" className="w-full h-full border-0 bg-white"/>
              : <FallbackContent/>}
          </div>
        )}

        {/* AI Panel */}
        <div className={`absolute top-0 right-0 flex h-full transition-transform duration-250 ease-in-out z-10 ${panelOpen ? 'translate-x-0' : 'translate-x-[calc(100%-28px)]'}`}>
          <button onClick={() => setPanelOpen(!panelOpen)}
            className="w-7 bg-slate-800 border-l border-y border-slate-700 text-slate-400 flex items-center justify-center hover:text-teal-400 transition-colors rounded-l-lg">
            {panelOpen ? <ChevronRight className="w-4 h-4"/> : <ChevronLeft className="w-4 h-4"/>}
          </button>
          <div className="w-64 bg-slate-900/98 border-l border-slate-800 p-4 overflow-y-auto">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Copy Changes</p>
            <div className="space-y-4">
              {changes.map(({ label, value, color, tag }) => (
                <div key={label} className={`border-l-2 pl-3 ${color}`}>
                  <div className="flex items-center justify-between">
                    <p className={`text-xs font-semibold uppercase ${tag}`}>{label}</p>
                    <CopyBtn text={value}/>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-slate-900 border-t border-slate-800 px-4 py-2.5 flex items-center justify-between shrink-0">
        <button onClick={onReset} className="flex items-center gap-2 text-xs text-slate-400 hover:text-teal-400 font-medium transition-colors">
          <RotateCcw className="w-3.5 h-3.5"/> New Personalization
        </button>
        <span className="text-xs text-slate-700">Addwork CRO Engine · Groq + Llama 4</span>
      </div>
    </div>
  );
}
