/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Target, TrendingUp, Globe, Coins, ShieldAlert, BadgeInfo, CheckCircle, Flame, Layers } from 'lucide-react';

interface ProjectVisionProps {
  onViewChange: (view: string) => void;
}

export default function ProjectVision({ onViewChange }: ProjectVisionProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 text-left space-y-12">
      
      {/* Visual Identity & Hero Banner */}
      <div className="bg-gradient-to-br from-[#120835] to-[#0a0520] border-2 border-[#8247E5]/50 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-[0_0_50px_rgba(130,71,229,0.2)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-brand/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#3b82f6]/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-4xl space-y-5">
          <div className="inline-flex items-center space-x-2 bg-[#8247E5]/25 border border-[#8247E5]/40 rounded-full px-4.5 py-1.5 text-xs text-purple-glow font-mono font-bold uppercase tracking-wider">
            <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
            <span>The Upcoming Bull Run Catalyst</span>
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight leading-tight">
            ESTABLISHING THE SOVEREIGN <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-brand via-purple-glow to-blue-400">
              POLYGON (MATIC) FOUNDATION
            </span>
          </h2>
          
          <p className="text-gray-200 text-sm sm:text-base leading-relaxed font-sans font-medium">
            Polygon (POL/MATIC) has engineered state-of-the-art zero-knowledge rollups, modular infrastructure, and the innovative AggLayer. However, actual market recognition has not yet achieved our multi-year strategic targets. We are actively deploying massive capital to secure global mindshare, drive decentralized validator consensus, and position MATIC at the absolute top of the global web3 map.
          </p>
        </div>
      </div>

      {/* Primary Key Rationale Cards (Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Core Aim 1 */}
        <div className="bg-[#0b051d]/90 border-2 border-[#8247E5]/25 rounded-2xl p-6 space-y-4 hover:border-[#8247E5]/55 hover:shadow-[0_0_25px_rgba(130,71,229,0.15)] transition-all">
          <div className="p-3 bg-purple-brand/10 w-fit rounded-xl text-purple-glow border border-[#8247E5]/20">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="font-display font-black text-lg text-white uppercase tracking-wide">
            1. Global Participant Acquisition
          </h3>
          <p className="text-xs text-gray-300 leading-relaxed font-sans">
            Our priority is to onboarding dedicated, educated, and long-term stakers, holders, and delegators. We bypass central marketing conglomerates, putting physical financial liquidity directly into the hands of real human participants.
          </p>
        </div>

        {/* Core Aim 2 */}
        <div className="bg-[#0b051d]/90 border-2 border-[#8247E5]/25 rounded-2xl p-6 space-y-4 hover:border-[#8247E5]/55 hover:shadow-[0_0_25px_rgba(130,71,229,0.15)] transition-all">
          <div className="p-3 bg-[#3b82f6]/10 w-fit rounded-xl text-blue-400 border border-blue-500/20">
            <Coins className="w-6 h-6" />
          </div>
          <h3 className="font-display font-black text-lg text-white uppercase tracking-wide">
            2. Strategic Liquidity Disbursement
          </h3>
          <p className="text-xs text-gray-300 leading-relaxed font-sans">
            By sending check deposits and co-branded credit cards directly to approved applicants, we trigger massive regional transaction cycles. 10% stays in your pocket permanently as a free incentive; the remaining 90% is converted directly to Polygon MATIC.
          </p>
        </div>

        {/* Core Aim 3 */}
        <div className="bg-[#0b051d]/90 border-2 border-[#8247E5]/25 rounded-2xl p-6 space-y-4 hover:border-[#8247E5]/55 hover:shadow-[0_0_25px_rgba(130,71,229,0.15)] transition-all">
          <div className="p-3 bg-emerald-500/10 w-fit rounded-xl text-emerald-400 border border-emerald-500/20">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="font-display font-black text-lg text-white uppercase tracking-wide">
            3. Establishing the Solana Alternative
          </h3>
          <p className="text-xs text-gray-300 leading-relaxed font-sans">
            Solana achieved explosive milestones in previous cycles through heavy distribution. We are staking a permanent flag for the upcoming bull run. Through continuous infrastructure investments, Polygon is positioned to outperform.
          </p>
        </div>

      </div>

      {/* Extended Narrative Details (Rich layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Why the Giveaway is actually a Strategic Incentive */}
        <div className="lg:col-span-7 bg-[#0b051e] border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-wide flex items-center space-x-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Why We Invest Heavily &amp; Disburse Rewards</span>
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed font-sans">
              To the untrained observer, distributing hundreds of thousands of dollars in direct capital funding appears like a simple giveaway. In reality, it is a high-yield, mathematically backed customer acquisition cost (CAC). 
            </p>
            <p className="text-xs text-gray-300 leading-relaxed font-sans">
              Every USD amount converted to MATIC increases the security limits, liquidity pool depth, and voting power of our associated consensus validators. This creates an elegant feedback loop: as our staker pool grows, transaction capacities surge, driving higher protocol returns that recursively back new staker allocations.
            </p>
          </div>

          <div className="bg-[#120835] rounded-xl p-4 border border-[#8247E5]/30 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase font-display tracking-widest flex items-center space-x-1.5">
              <span>🖥️ WHAT WE ARE CONTINUOUSLY BUILDING</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-300 leading-relaxed">
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>Polygon Infrastructure:</strong> Deploying bare-metal node hardware across South America and APAC.</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>Scalable Payment Gateways:</strong> Integrating off-ramp physical credit networks directly with zero-phase Web3 SDKs.</span>
              </div>
            </div>
          </div>
        </div>

        {/* The Upcoming Bull Run Targets */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#1b083c] to-[#0a0520] border-2 border-[#8247E5]/45 rounded-2xl p-6 sm:p-8 space-y-6 text-center flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-mono tracking-widest text-[#a855f7] bg-[#1a0e35] px-2.5 py-1 rounded-full border border-[#8247E5]/30 uppercase font-black">
              Market Projections
            </span>
            <h3 className="font-display font-black text-white text-lg sm:text-xl uppercase">
              The Next Bull Run belongs to POL/MATIC
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed font-sans">
              Solana dominated the preceding cycles through aggressive developer grants and massive infrastructure incentives. We are deploying the same verified playbook, but with greater decentralization safeguards.
            </p>
          </div>

          <div className="space-y-3.5 bg-black/40 rounded-xl p-4 border border-white/5 text-left font-mono text-[11px]">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-gray-400">Strategic Target:</span>
              <span className="text-emerald-400 font-bold uppercase">Consensus Domination</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-gray-400">Core Network Role:</span>
              <span className="text-purple-glow font-bold">POS Validator Backbone</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Institutional Pool:</span>
              <span className="text-white font-bold">$125,000,000 Allocated</span>
            </div>
          </div>

          <button
            onClick={() => onViewChange('kyc')}
            className="w-full py-3.5 bg-gradient-to-r from-purple-brand to-purple-glow hover:brightness-110 active:scale-95 transition-all text-white font-bold rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-purple-brand/25 cursor-pointer"
          >
            CLAIM YOUR SPACE IN THE MOVEMENT
          </button>
        </div>

      </div>

    </div>
  );
}
