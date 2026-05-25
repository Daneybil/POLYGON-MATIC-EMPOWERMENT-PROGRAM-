/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Coins, Menu, X, ArrowRight } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onOpenSupport: () => void;
  onOpenWalletModal: () => void;
}

export default function Header({ currentView, onViewChange, onOpenSupport, onOpenWalletModal }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeWallet, setActiveWallet] = useState<string | null>(null);

  // Sync wallet on mount and poll periodically for real-time reactivity
  useEffect(() => {
    setActiveWallet(localStorage.getItem('mep_active_wallet'));
    const interval = setInterval(() => {
      setActiveWallet(localStorage.getItem('mep_active_wallet'));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleQuickConnect = () => {
    const existing = localStorage.getItem('mep_active_wallet');
    if (existing) {
      localStorage.setItem('mep_redirect_to_dashboard', 'true');
      onViewChange('disbursement');
    } else {
      onOpenWalletModal();
    }
  };

  const navItems = [
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'kyc', label: 'KYC Verification' },
    { id: 'benefits', label: 'Benefits' },
    { id: 'disbursement', label: 'PayCard & Methods' },
    { id: 'delegate', label: 'Delegate & Stake' },
    { id: 'legal-agreement', label: 'Govt Agreement' },
    { id: 'mission', label: 'Our Mission' },
    { id: 'faq', label: 'FAQ' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#070412]/85 backdrop-blur-md border-b border-purple-brand/20 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo with official Polygon SVG icon */}
        <div 
          onClick={() => onViewChange('home')} 
          className="flex items-center space-x-3 cursor-pointer group"
          id="header-brand-logo"
        >
          <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-tr from-[#8247E5] to-[#9F7AEA] rounded-xl shadow-[0_0_15px_rgba(130,71,229,0.5)] group-hover:shadow-[0_0_22px_rgba(130,71,229,0.7)] transition-all">
            {/* Real Official Polygon diagonal hexagon logo drawing */}
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              className="w-6 h-6 text-white" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M16.47 11.23a1.43 1.43 0 0 0-.71.18l-3.36 1.94a1.43 1.43 0 0 1-1.42 0L7.61 11.4a1.42 1.42 0 0 1-.71-1.23V6.29a1.42 1.42 0 0 1 .71-1.23l3.37-1.94a1.43 1.43 0 0 1 1.42 0l3.36 1.94a1.42 1.42 0 0 1 .71 1.23v2.33a.5.5 0 0 0 1 0V6.29a2.42 2.42 0 0 0-1.21-2.1l-3.36-1.94a2.43 2.43 0 0 0-2.42 0L7.13 4.19A2.42 2.42 0 0 0 5.91 6.3v3.87a2.42 2.42 0 0 0 1.21 2.1l3.37 1.94a2.43 2.43 0 0 0 2.42 0l3.36-1.94a2.42 2.42 0 0 0 1.21-2.1V7.94a1.43 1.43 0 0 1 .71-.18l3.36 1.94a1.43 1.43 0 0 1 .71 1.23v3.87a1.42 1.42 0 0 1-.71 1.23l-3.37 1.94a1.43 1.43 0 0 1-1.42 0l-3.36-1.94a1.42 1.42 0 0 1-.71-1.23V12.5a.5.5 0 0 0-1 0v2.33a2.42 2.42 0 0 0 1.21 2.1l3.36 1.94a2.43 2.43 0 0 0 2.42 0l3.37-1.94a2.42 2.42 0 0 0 .71-1.78v-3.87a2.42 2.42 0 0 0-1.21-2.1l-3.36-1.94a2.43 2.43 0 0 0-1.42-.02 1.43 1.43 0 0 0-1.54 1.3v3z"
                fill="currentColor"
              />
            </svg>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-dark-bg" title="Network Validators Active"></div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5 leading-none">
              <span className="font-display font-bold tracking-wider text-white text-base sm:text-lg">MATIC</span>
              <span className="text-[10px] tracking-widest font-mono text-purple-glow uppercase bg-purple-brand/15 px-1.5 py-0.5 rounded border border-purple-brand/30">EMPOWER</span>
            </div>
            <p className="text-[10px] font-sans text-gray-400 tracking-tight sm:block hidden">GLOBAL CAPITAL STAKING</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1 font-display">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => {
                  onViewChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`relative px-4 py-2 text-sm font-medium tracking-wide transition-all rounded-lg ${
                  isActive 
                    ? 'text-white bg-purple-brand/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]' 
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-purple-brand rounded-full shadow-[0_0_8px_#7B3FE4]"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Badge and Call to Action buttons */}
        <div className="hidden sm:flex items-center space-x-3">
          {/* SECURE WEB3 WALLET CONNECT Button - Large, prominent, purple, highly styled */}
          <button
            id="purple-web3-connect-btn"
            onClick={handleQuickConnect}
            className={`flex items-center space-x-2 font-extrabold font-display text-xs py-3.5 px-6 rounded-xl border-2 transition-all active:scale-95 cursor-pointer shrink-0 ${
              activeWallet 
                ? 'bg-[#140C33] border-purple-brand text-purple-glow hover:text-white hover:bg-gradient-to-r hover:from-purple-brand hover:to-purple-glow shadow-[0_0_15px_rgba(130,71,229,0.25)]' 
                : 'bg-gradient-to-r from-purple-brand to-purple-glow border-purple-brand/60 hover:border-purple-glow text-white shadow-[0_0_15px_rgba(130,71,229,0.35)] hover:shadow-[0_0_22px_rgba(130,71,229,0.6)] animate-none'
            }`}
          >
            {activeWallet ? (
              <>
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping shrink-0" />
                <span className="font-mono">{activeWallet.slice(0, 6)}...{activeWallet.slice(-4)} • DASHBOARD</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 bg-purple-glow rounded-full animate-pulse shrink-0" />
                <span>SECURE WALLET CONNECT</span>
              </>
            )}
          </button>

          {/* matic validation status indicator */}
          <div className="flex items-center space-x-1.5 bg-[#140E31] border border-purple-brand/30 rounded-lg px-2.5 py-1.5 text-xs text-purple-glow font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>node active</span>
          </div>

          <button
            id="header-apply-btn"
            onClick={() => onViewChange('kyc')}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-brand to-purple-glow hover:from-purple-glow hover:to-purple-brand text-white font-medium text-xs py-3 px-5 rounded-xl shadow-[0_4px_14px_rgba(123,63,228,0.4)] hover:shadow-[0_6px_20px_rgba(123,63,228,0.6)] transition-all font-display group active:translate-y-0.5 cursor-pointer shrink-0"
          >
            <span>Apply Now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center space-x-2 lg:hidden">
          <button
            onClick={handleQuickConnect}
            className={`text-[11px] font-bold font-display px-3 py-2 rounded-lg border flex items-center gap-1.5 cursor-pointer ${
              activeWallet 
                ? 'bg-purple-brand/20 border-purple-brand/40 text-purple-glow' 
                : 'bg-purple-brand border-purple-glow text-white'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${activeWallet ? 'bg-emerald-400 animate-ping' : 'bg-white animate-pulse'}`}></span>
            <span>{activeWallet ? 'Dashboard' : 'Connect Wallet'}</span>
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-300 hover:text-white focus:outline-none focus:ring-1 focus:ring-purple-brand rounded-lg"
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-purple-brand/10 space-y-1 bg-[#100A2C]/95 rounded-xl p-3 shadow-2xl">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => {
                  onViewChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'text-white bg-purple-brand/20 border-l-4 border-purple-brand pl-3' 
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          
          {/* Action and Info for mobile */}
          <div className="pt-3 border-t border-purple-brand/10 flex flex-col space-y-2">
            <button
              onClick={handleQuickConnect}
              className={`w-full text-center py-3 rounded-lg font-bold font-display text-xs tracking-wider ${
                activeWallet 
                  ? 'bg-purple-brand/15 text-purple-glow border border-purple-brand/35' 
                  : 'bg-gradient-to-r from-purple-brand to-purple-glow text-white shadow-lg'
              }`}
            >
              {activeWallet ? 'GO TO STAKER DASHBOARD' : 'SECURE WALLET CONNECT'}
            </button>
            
            <div className="flex items-center justify-between px-4 py-2 bg-[#191040] rounded-lg text-xs font-mono text-purple-glow">
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Security Engine</span>
              </span>
              <span>ACTIVE</span>
            </div>
            
            <button
              onClick={() => {
                onViewChange('kyc');
                setMobileMenuOpen(false);
              }}
              className="w-full text-center bg-gradient-to-r from-purple-brand to-[#9061F9] hover:from-[#9061F9] hover:to-purple-brand text-white font-semibold py-2.5 rounded-lg shadow-lg font-display"
            >
              Get Started Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
