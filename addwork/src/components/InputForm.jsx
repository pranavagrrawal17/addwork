import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, CheckCircle, X, Tag } from 'lucide-react';
import { isValidUrl } from '../utils/validators';

const inputClass = "w-full px-3 py-2.5 bg-slate-900 border border-slate-700/60 rounded-lg text-slate-200 placeholder-slate-600 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all text-sm";

function FieldLabel({ letter, label, valid }) {
  const colors = { A: 'bg-teal-600', B: 'bg-emerald-700', C: 'bg-cyan-700' };
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <span className={`w-5 h-5 rounded-md ${colors[letter]} flex items-center justify-center text-[10px] font-bold text-white`}>{letter}</span>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
      </div>
      {valid && <CheckCircle className="w-4 h-4 text-teal-400"/>}
    </div>
  );
}

export default function InputForm({ onSubmit }) {
  const [adTab, setAdTab] = useState('upload');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [fileError, setFileError] = useState('');
  const [adImageUrl, setAdImageUrl] = useState('');
  const [adDestUrl, setAdDestUrl] = useState('');
  const [landingUrl, setLandingUrl] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const fileInputRef = useRef(null);

  const validateAndSetFile = (f) => {
    setFileError('');
    if (!f) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) return setFileError('PNG, JPG or WEBP only.');
    if (f.size > 5 * 1024 * 1024) return setFileError('Max file size is 5MB.');
    setFile(f);
    setFilePreview(URL.createObjectURL(f));
  };

  const clearFile = () => { setFile(null); setFilePreview(''); if (fileInputRef.current) fileInputRef.current.value = ''; };

  const isFormValid = () => {
    const hasAd = adTab === 'upload' ? !!file : adImageUrl.trim() !== '';
    return hasAd && isValidUrl(adDestUrl) && isValidUrl(landingUrl);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid()) return;
    onSubmit(adTab === 'upload' ? file : adImageUrl, adDestUrl, landingUrl, adTab === 'upload', campaignName || 'Untitled Campaign');
  };

  return (
    <form onSubmit={handleSubmit} className="fade-in">
      <div className="grid lg:grid-cols-2 gap-4">
        {/* LEFT COLUMN */}
        <div className="space-y-4">
          {/* Section A */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <FieldLabel letter="A" label="Ad Creative" valid={adTab === 'upload' ? !!file : adImageUrl !== ''} />

            <div className="flex gap-1 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/50 w-max mb-3">
              {['upload', 'url'].map(t => (
                <button key={t} type="button" onClick={() => setAdTab(t)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${adTab === t ? 'bg-teal-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                  {t === 'upload' ? '↑ Upload' : '🔗 URL'}
                </button>
              ))}
            </div>

            {adTab === 'upload' ? (
              <div onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); validateAndSetFile(e.dataTransfer.files[0]); }}
                onClick={() => !file && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-5 text-center transition-all ${file ? 'border-teal-600/60 bg-teal-950/20 cursor-default' : 'border-slate-700 bg-slate-800/30 cursor-pointer hover:border-teal-600/50'}`}>
                <input type="file" ref={fileInputRef} onChange={e => validateAndSetFile(e.target.files[0])} accept=".png,.jpg,.jpeg,.webp" className="hidden" />
                {file ? (
                  <div className="flex items-center gap-3">
                    <img src={filePreview} alt="Ad" className="w-16 h-16 rounded-lg object-cover border border-teal-800/50"/>
                    <div className="text-left flex-1">
                      <p className="text-sm font-medium text-slate-200 truncate">{file.name}</p>
                      <p className="text-xs text-teal-400 flex items-center gap-1 mt-1"><CheckCircle className="w-3 h-3"/> {(file.size/1024).toFixed(0)} KB · Ready</p>
                    </div>
                    <button type="button" onClick={clearFile} className="p-1.5 hover:bg-slate-700 rounded-lg"><X className="w-3.5 h-3.5 text-slate-500"/></button>
                  </div>
                ) : (
                  <div>
                    <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-slate-800 flex items-center justify-center">
                      <Upload className="w-5 h-5 text-teal-500"/>
                    </div>
                    <p className="text-sm text-slate-400">Drop your ad image here</p>
                    <p className="text-xs text-slate-600 mt-1">PNG, JPG, WEBP · max 5MB</p>
                  </div>
                )}
                {fileError && <p className="text-xs text-red-400 mt-2">{fileError}</p>}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative"><LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-500"/>
                  <input type="url" value={adImageUrl} onChange={e => setAdImageUrl(e.target.value)} placeholder="https://example.com/ad.jpg" className={`${inputClass} pl-9`}/>
                </div>
                <p className="text-xs text-slate-600">Direct image URL only (.jpg .png .webp)</p>
              </div>
            )}
          </div>

          {/* Campaign Name */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-4 h-4 text-slate-500"/>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Campaign Name</span>
              <span className="text-xs text-slate-600">(optional)</span>
            </div>
            <input type="text" value={campaignName} onChange={e => setCampaignName(e.target.value)}
              placeholder="e.g. Summer Sale 2025" className={inputClass}/>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">
          {/* Section B */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <FieldLabel letter="B" label="Ad Destination URL" valid={isValidUrl(adDestUrl)} />
            <input type="url" value={adDestUrl} onChange={e => setAdDestUrl(e.target.value)}
              placeholder="https://yoursite.com/product" className={inputClass}/>
            <p className="text-xs text-slate-600 mt-1.5">The URL your ad currently links to (reference only)</p>
          </div>

          {/* Section C */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <FieldLabel letter="C" label="Landing Page to Personalize" valid={isValidUrl(landingUrl)} />
            <input type="url" value={landingUrl} onChange={e => setLandingUrl(e.target.value)}
              placeholder="https://yoursite.com/landing" className={inputClass}/>
            <p className="text-xs text-slate-600 mt-1.5">We'll fetch and rewrite this page to match your ad</p>
            <p className="text-xs text-slate-700 mt-1">Works best with static/server-rendered pages · V1</p>
          </div>

          {/* Submit */}
          <button type="submit" disabled={!isFormValid()}
            className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 disabled:opacity-25 disabled:cursor-not-allowed active:scale-[0.98] transition-all text-white font-semibold py-3 px-6 rounded-xl text-sm shadow-lg shadow-teal-900/30 flex items-center justify-center gap-2">
            <span>⚡ Run Personalization</span>
          </button>
        </div>
      </div>
    </form>
  );
}
