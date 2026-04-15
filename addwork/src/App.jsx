import React, { useState } from 'react';
import { AlertCircle, Zap } from 'lucide-react';
import Layout from './components/Layout';
import InputForm from './components/InputForm';
import ProcessingSteps from './components/ProcessingSteps';
import PersonalizationSummary from './components/PersonalizationSummary';
import PagePreview from './components/PagePreview';

import { scrapePage } from './services/scraper';
import { analyzeAndPersonalize } from './services/groq';
import { injectChanges } from './services/injector';
import { toBase64 } from './utils/imageUtils';

export default function App() {
  const [appState, setAppState] = useState('input');
  const [step, setStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [jobData, setJobData] = useState({
    landingUrl: '',
    campaignName: '',
    originalHtml: '',
    modifiedHtml: '',
    pageChanges: null,
    adAnalysis: null,
    confidenceScore: 0
  });

  const handlePersonalize = async (adInput, adDestUrl, landingUrl, isFile, campaignName) => {
    try {
      setAppState('processing');
      setErrorMsg('');

      setStep(1);
      const { rawHTML, markdown } = await scrapePage(landingUrl);
      if (!rawHTML && !markdown) throw new Error('Unable to fetch this page. Please try another URL.');

      setStep(2);
      const imageData = isFile ? await toBase64(adInput) : adInput;

      setStep(3);
      let result;
      let truncated = markdown || '';
      try {
        result = await analyzeAndPersonalize(imageData, truncated);
      } catch (err) {
        if (err.message.includes('413')) {
          result = await analyzeAndPersonalize(imageData, truncated.slice(0, 4000));
        } else {
          throw err;
        }
      }

      setStep(4);
      const modifiedHTML = injectChanges(rawHTML || '', result.page_changes, landingUrl);

      setStep(5);
      setJobData({
        landingUrl,
        campaignName: campaignName || 'Untitled Campaign',
        originalHtml: rawHTML || '',
        modifiedHtml: modifiedHTML || rawHTML || '',
        pageChanges: result.page_changes,
        adAnalysis: result.ad_analysis,
        confidenceScore: result.confidence_score
      });

      await new Promise(r => setTimeout(r, 500));
      setAppState('output');

    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'An unexpected error occurred.');
      setAppState('error');
    }
  };

  const handleReset = () => {
    setAppState('input');
    setStep(0);
    setErrorMsg('');
    setJobData({ landingUrl: '', campaignName: '', originalHtml: '', modifiedHtml: '', pageChanges: null, adAnalysis: null, confidenceScore: 0 });
  };

  return (
    <Layout>
      {appState === 'input' && (
        <div className="max-w-4xl mx-auto w-full fade-in">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 bg-teal-950/50 border border-teal-900/60 text-teal-400 text-xs font-medium px-3 py-1.5 rounded-full mb-3">
              <Zap className="w-3 h-3 fill-teal-400"/> Groq · Llama 4 Scout · Vision
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">
              Match your ad to your<br className="hidden sm:inline"/> landing page — instantly
            </h1>
            <p className="text-slate-500 text-sm max-w-lg">Upload an ad creative, point to your landing page, and Addwork rewrites the copy for perfect ad→page message match.</p>
          </div>
          <InputForm onSubmit={handlePersonalize} />
        </div>
      )}

      {appState === 'processing' && (
        <div className="flex-1 flex items-center justify-center">
          <ProcessingSteps currentStep={step} />
        </div>
      )}

      {appState === 'error' && (
        <div className="max-w-md mx-auto w-full bg-red-950/30 border border-red-900/40 p-8 rounded-2xl text-center fade-in">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3"/>
          <h3 className="text-base font-bold text-red-300 mb-2">Processing Failed</h3>
          <p className="text-sm text-red-400/80 mb-6 leading-relaxed">{errorMsg}</p>
          <button onClick={handleReset}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium py-2 px-6 rounded-lg transition-colors text-sm">
            ← Try Again
          </button>
        </div>
      )}

      {appState === 'output' && (
        <div className="flex flex-col w-full fade-in" style={{ height: 'calc(100vh - 130px)' }}>
          <PersonalizationSummary
            adAnalysis={jobData.adAnalysis}
            confidenceScore={jobData.confidenceScore}
            campaignName={jobData.campaignName}
          />
          <div className="flex-1 min-h-0 border border-slate-800 rounded-xl overflow-hidden shadow-2xl shadow-black/60">
            <PagePreview
              originalHtml={jobData.originalHtml}
              modifiedHtml={jobData.modifiedHtml}
              pageChanges={jobData.pageChanges}
              url={jobData.landingUrl}
              onReset={handleReset}
            />
          </div>
        </div>
      )}
    </Layout>
  );
}
