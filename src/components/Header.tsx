/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, Coins, Menu, X, ArrowRight } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onOpenSupport: () => void;
}

export default function Header({ currentView, onViewChange, onOpenSupport }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            {/* Accurate Polygon token logo drawing */}
            <svg 
              viewBox="0 0 38 38" 
              fill="none" 
              className="w-6 h-6 text-white" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M30.4 12.835L24.58 9.475V16.2L30.4 19.56a1.114 1.114 0 01.558.966v6.72c0 .403-.215.776-.558.966l-5.82 3.36a1.114 1.114 0 01-1.115 0l-5.82-3.36a1.114 1.114 0 01-.558-.966V20.526l2.316-1.337L15 16.634V9.914a1.114 1.114 0 01.558-.966l5.82-3.36a1.114 1.114 0 011.115 0l5.82 3.36a1.114 1.114 0 01.558.966v2.921h1.529V9.914c0-.792-.423-1.525-1.115-1.898l-5.82-3.36a2.228 2.228 0 00-2.23 0l-5.82 3.36a2.228 2.228 0 00-1.114 1.898v6.72c0 .403.214.776.557.966l5.82 3.36a1.113 1.113 0 01.558.966v6.72c0 .403-.214.776-.558.966l-5.82 3.36a1.114 1.114 0 01-1.115 0l-5.82-3.36c-.343-.2-.558-.564-.558-.966V20.526a1.114 1.114 0 01.558-.966l5.82-3.36a1.114 1.114 0 011.115 0l4.314 2.49V12L9.42 15.166a1.114 1.114 0 01-.558-.966V7.48a1.114 1.114 0 01.558-.966l5.82-3.36a1.114 1.114 0 011.115 0l5.82 3.36a1.114 1.114 0 01.558.966v2.921c0 .792.423 1.525 1.115 1.898l5.82 3.36a2.228 2.228 0 011.114 1.898v6.72c0 .792-.423 1.525-1.114 1.898l-5.82 3.36a2.228 2.228 0 01-2.23 0l-5.82-3.36a2.228 2.228 0 01-1.115-1.898V20.526a2.228 2.228 0 00-1.114-1.898l-5.82-3.36a2.228 2.228 0 00-2.23 0l-5.82 3.36a2.228 2.228 0 00-1.114 1.898V27.246c0 .792.422 1.525 1.114 1.898l5.82 3.36c.692.4 1.538.4 2.23 0l5.82-3.36c.692-.4 1.115-1.133 1.115-1.898V20.526c0-.792-.423-1.525-1.115-1.898l-4.314-2.49V12.835z" 
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
          {/* Web3 Connect Wallet Action */}
          <button
            id="header-connect-wallet-btn"
            onClick={() => onViewChange('delegate')}
            className="flex items-center space-x-1.5 bg-[#140E31]/95 text-emerald-400 hover:text-white hover:bg-[#8247E5]/20 border-2 border-emerald-500/25 hover:border-[#8247E5]/60 font-bold text-xs py-2.5 px-4 rounded-xl transition-all font-display shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_20px_rgba(130,71,229,0.25)] active:scale-95 cursor-pointer shrink-0"
          >
            <Coins className="w-4 h-4 text-emerald-400 animate-spin-slow shrink-0" />
            <span>Connect Wallet</span>
          </button>

          {/* matic validation status indicator */}
          <div className="flex items-center space-x-1.5 bg-[#140E31] border border-purple-brand/30 rounded-lg px-2.5 py-1.5 text-xs text-purple-glow font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>node active</span>
          </div>

          <button
            id="header-apply-btn"
            onClick={() => onViewChange('kyc')}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-brand to-purple-glow hover:from-purple-glow hover:to-purple-brand text-white font-medium text-xs py-2.5 px-4 rounded-xl shadow-[0_4px_14px_rgba(123,63,228,0.4)] hover:shadow-[0_6px_20px_rgba(123,63,228,0.6)] transition-all font-display group active:translate-y-0.5 cursor-pointer shrink-0"
          >
            <span>Apply Now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center space-x-2 lg:hidden">
          <button
            onClick={() => onViewChange('kyc')}
            className="sm:hidden block bg-gradient-to-r from-purple-brand to-purple-glow text-white font-medium text-xs px-3 py-1.5 rounded-lg font-display"
          >
            Apply
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
