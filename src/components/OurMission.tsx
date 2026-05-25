/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Target, Globe, Shield, Zap, TrendingUp, CheckCircle } from 'lucide-react';

export default function OurMission() {
  
  const strategicPillars = [
    {
      title: 'Long-term price stability',
      description: 'By locking core tokens into long-term delegation pools, we mitigate temporary selling pressure and assist organic price discoveries.',
      icon: <Shield className="w-5 h-5 text-purple-glow" />
    },
    {
      title: 'Global holder expansion',
      description: 'Empowering average users with high-capital nodes expands the active validator participation base to diverse democratic countries.',
      icon: <Globe className="w-5 h-5 text-[#2563EB]" />
    },
    {
      title: 'Consensus layer decentralization',
      description: 'Distributing stakes across multiple non-congested consensus validator nodes safeguards the Polygon PoS network from validator collusion.',
      icon: <Target className="w-5 h-5 text-emerald-400" />
    },
    {
      title: 'Preparing for major expansion',
      description: 'Our pool lockups align with anticipated upgrades to POL and AggLayer token bridges, securing liquidity reserves for the next system run.',
      icon: <TrendingUp className="w-5 h-5 text-purple-glow" />
    }
  ];

  return (
    <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-16 text-left" id="our-mission-section">
      
      {/* Intro Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Story */}
        <div className="lg:col-span-7 space-y-6">
          <span className="text-xs font-mono uppercase tracking-widest text-[#2563EB] px-3 py-1 bg-[#2563EB]/10 border border-[#2563EB]/20 rounded-md">
            Our Mission &amp; Purpose
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-white leading-tight">
            Preparing the Polygon Network for Next-Generation Adoption
          </h2>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            The MATIC Empowerment Program was established to address a persistent constraint in proof-of-stake blockchain architectures: <strong>the centralization of validator delegation power.</strong> 
          </p>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
            Leading institutions often hold massive chunks of voting stakes, leaving minor token holders sidelined. By leveraging sovereign liquidity pools to sponsor global participants, we distribute delegation nodes to real humans. Users receive substantial yield benefits while the underlying Polygon PoS network obtains broader geographical node decentralization, boosting security metrics substantially.
          </p>
          
          <div className="p-4 bg-purple-brand/10 border border-purple-brand/20 rounded-xl space-y-2">
            <h4 className="font-display font-semibold text-white text-sm">Our 2026 Delegation Benchmark Goals</h4>
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div>
                <span className="text-2xl font-black text-purple-glow font-display">100M+</span>
                <p className="text-[10px] text-gray-400 uppercase font-mono mt-0.5">Target Delegated MATIC</p>
              </div>
              <div>
                <span className="text-2xl font-black text-emerald-400 font-display">5,000+</span>
                <p className="text-[10px] text-gray-400 uppercase font-mono mt-0.5">Active Human Nodes</p>
              </div>
              <div>
                <span className="text-2xl font-black text-white font-display">5 Eligible</span>
                <p className="text-[10px] text-gray-400 uppercase font-mono mt-0.5">Continents Served</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Visual Graphic Box */}
        <div className="lg:col-span-5 relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-brand to-emerald-500 rounded-2xl blur-lg opacity-25"></div>
          
          <div className="relative bg-[#110A30] border border-purple-brand/30 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <h3 className="font-display font-bold text-white text-base">Ecosystem Node Core Architecture</h3>
            
            {/* Visual simulation mapping cards */}
            <div className="space-y-3.5">
              
              <div className="p-3 bg-purple-dark border border-purple-brand/20 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></div>
                  <span className="text-xs font-mono font-medium text-gray-200">Main Chain Validator #12</span>
                </div>
                <span className="text-[10px] font-mono text-purple-glow bg-purple-brand/10 px-1.5 py-0.5 rounded border border-purple-brand/25">98.9% UP</span>
              </div>

              <div className="p-3 bg-purple-dark border border-purple-brand/20 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></div>
                  <span className="text-xs font-mono font-medium text-gray-200">Main Chain Validator #45</span>
                </div>
                <span className="text-[10px] font-mono text-purple-glow bg-purple-brand/10 px-1.5 py-0.5 rounded border border-purple-brand/25">99.4% UP</span>
              </div>

              <div className="p-3 bg-purple-dark border border-purple-brand/20 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2.5 h-2.5 bg-purple-glow rounded-full"></div>
                  <span className="text-xs font-mono font-medium text-gray-400">Main Chain Validator #72</span>
                </div>
                <span className="text-[10px] font-mono text-gray-400 bg-white/5 px-1.5 py-0.5 rounded">STANDBY</span>
              </div>

            </div>

            <div className="border-t border-purple-brand/10 pt-4 text-center">
              <p className="text-xs text-purple-glow font-mono">Consolidated Safe Escrow Protocols Active</p>
              <div className="flex justify-center space-x-4 mt-2">
                <span className="text-[10px] bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded font-mono">SSL Secure</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono">Hashed Biometrics</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Strategic Pillars cards grid */}
      <div className="space-y-6 pt-4">
        <h3 className="text-xl sm:text-2xl font-display font-black text-center text-white">Our Strategic Core Pillars</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {strategicPillars.map((pillar) => (
            <div 
              key={pillar.title}
              className="p-5 bg-[#120C32] border border-purple-brand/20 rounded-xl flex items-start space-x-4 hover:border-purple-brand/40 transition-colors"
            >
              <div className="p-2.5 bg-[#201548] rounded-xl shrink-0">
                {pillar.icon}
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white font-display">{pillar.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">{pillar.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
