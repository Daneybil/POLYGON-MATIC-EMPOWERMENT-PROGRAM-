/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BENEFITS } from '../data';
import { Award, ShieldCheck, TrendingUp, Cpu, HeartHandshake, UserCheck } from 'lucide-react';

interface BenefitsProps {
  onViewChange: (view: string) => void;
}

export default function Benefits({ onViewChange }: BenefitsProps) {
  
  const benefitIcons = [
    <Cpu className="w-6 h-6 text-purple-glow" />,
    <Award className="w-6 h-6 text-[#2563EB]" />,
    <TrendingUp className="w-6 h-6 text-emerald-400" />,
    <ShieldCheck className="w-6 h-6 text-purple-glow" />,
    <HeartHandshake className="w-6 h-6 text-emerald-400" />,
    <UserCheck className="w-6 h-6 text-[#2563EB]" />
  ];

  return (
    <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-12 text-left" id="benefits-section">
      
      {/* Intro info heading */}
      <div className="space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-purple-glow px-3 py-1 bg-purple-brand/10 border border-purple-brand/25 rounded-md">
          Participant Rewards
        </span>
        <h2 className="text-3xl sm:text-4xl font-display font-black text-white">
          Why Join the MATIC Empowerment Program?
        </h2>
        <p className="text-gray-400 max-w-3xl text-sm sm:text-base">
          Our initiative is engineered by Polygon consensus validators to optimize delegating pools. This introduces distinct benefits that protect participants from liabilities while rewarding active network contributions.
        </p>
      </div>

      {/* Grid displays */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {BENEFITS.map((benefit, index) => (
          <div 
            key={benefit.title}
            className="group p-6 bg-gradient-to-br from-[#130E30]/60 to-[#0A071E]/60 border border-purple-brand/15 hover:border-purple-brand/45 rounded-2xl transition-all shadow-xl hover:-translate-y-1"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-[#1B1143] rounded-xl text-purple-glow group-hover:scale-110 transition-transform">
                {benefitIcons[index] || <Award className="w-6 h-6" />}
              </div>
              
              {benefit.badge && (
                <span className="text-[10px] uppercase font-mono tracking-wider bg-purple-brand/20 text-purple-glow px-2.5 py-0.5 rounded-full border border-purple-brand/20">
                  {benefit.badge}
                </span>
              )}
            </div>

            <h3 className="font-display font-bold text-lg text-white group-hover:text-purple-glow transition-colors">
              {benefit.title}
            </h3>
            
            <p className="text-sm text-gray-300 mt-2 leading-relaxed">
              {benefit.description}
            </p>

            {/* Bottom subtle bar decor */}
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
              <span>Verified Node Benefit</span>
              <span className="text-emerald-400 font-semibold">100% Guaranteed</span>
            </div>

          </div>
        ))}
      </div>

      {/* Trust Quote Box */}
      <div className="p-6 sm:p-8 bg-[#150F35]/50 border border-purple-brand/25 rounded-2xl flex flex-col md:flex-row items-center gap-6 justify-between">
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex shrink-0 w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-400 items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-display font-bold text-white text-base">Military-Grade Encryption &amp; Protections</h4>
            <p className="text-xs text-gray-400">Your documents are processed in sandboxed hardware enclaves (SGX Secure Enclaves). We never sell or share compliance telemetry to external brokers.</p>
          </div>
        </div>
        <button
          onClick={() => onViewChange('kyc')}
          className="w-full md:w-auto px-5 py-3 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold font-display text-xs sm:text-sm rounded-xl transition-all tracking-wide whitespace-nowrap"
        >
          Secure Your Allocation Node
        </button>
      </div>

    </section>
  );
}
