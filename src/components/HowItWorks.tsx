/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HOW_IT_WORKS_STEPS } from '../data';
import { Check, ShieldAlert, ArrowRight, HelpCircle, FileText, Landmark, Key, Trophy } from 'lucide-react';

interface HowItWorksProps {
  onViewChange: (view: string) => void;
}

export default function HowItWorks({ onViewChange }: HowItWorksProps) {
  
  const stepIcons = [
    <Landmark className="w-6 h-6 text-purple-glow" />,
    <Key className="w-6 h-6 text-[#2563EB]" />,
    <Trophy className="w-6 h-6 text-emerald-400" />,
    <FileText className="w-6 h-6 text-purple-glow" />,
    <ShieldAlert className="w-6 h-6 text-emerald-400" />
  ];

  return (
    <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-16 text-left" id="how-it-works-section">
      
      {/* Upper header */}
      <div className="space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-purple-glow px-3 py-1 bg-purple-brand/10 border border-purple-brand/25 rounded-md">
          Deep Dive Workflow
        </span>
        <h2 className="text-3xl sm:text-4xl font-display font-black text-white">
          How The MATIC Empowerment Program Works
        </h2>
        <p className="text-gray-400 max-w-3xl text-sm sm:text-base">
          This program is organized around high integrity node delegation. We facilitate institutional escrow reserves, distribute immediate take-home incentives, and configure secure validator staking structures.
        </p>
      </div>

      {/* Consolidated Workflow Matrix Table (redesigned with premium structural layouts) */}
      <div 
        className="bg-[#0b061e]/90 border-2 border-[#8247E5]/30 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(130,71,229,0.12)]"
        id="workflow-matrix-table-container"
      >
        <div className="p-6 bg-gradient-to-r from-[#140b35] to-[#0b061e] border-b border-[#8247E5]/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-display font-black text-xl text-white tracking-wide">
              📊 Sovereign Allocation Workflow Matrix
            </h3>
            <p className="text-xs text-gray-300 mt-1 font-sans">
              Consolidated procedural guide describing liquid assets, compliance locks, SLAs, and validator escrow duties.
            </p>
          </div>
          <span className="text-[10px] font-mono tracking-widest text-purple-glow bg-purple-brand/15 px-3 py-1 rounded border border-[#8247E5]/30 uppercase font-bold">
            Audited &amp; Authorized Protocol
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-200 font-sans min-w-[750px]">
            <thead className="text-[11px] uppercase tracking-widest font-mono bg-[#110930] border-b border-[#8247E5]/25 text-[#a855f7]">
              <tr>
                <th className="px-6 py-4.5 font-bold">Sequence &amp; Phase</th>
                <th className="px-6 py-4.5 font-bold">Objective Core Duty</th>
                <th className="px-6 py-4.5 font-bold">Allocation / Fund Status</th>
                <th className="px-6 py-4.5 font-bold">Legal Secure Index</th>
                <th className="px-6 py-4.5 font-bold text-right">Standard SLA SLA / Cycle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#8247E5]/15 bg-[#0b061e]/50">
              {HOW_IT_WORKS_STEPS.map((step, idx) => {
                let badgeStyle = '';
                let allocationText = '';
                let legalBound = '';
                let duration = '';
                
                if (idx === 0) {
                  allocationText = 'Keep 10% Cash (Liquid)';
                  badgeStyle = 'bg-emerald-500/10 border border-emerald-500/35 text-emerald-400 font-bold';
                  legalBound = 'W-9 / International KYC Node';
                  duration = 'Immediate upon approval';
                } else if (idx === 1) {
                  allocationText = '90% Core MATIC Stake';
                  badgeStyle = 'bg-blue-500/10 border border-blue-500/35 text-[#60A5FA] font-bold';
                  legalBound = 'Non-custodial Smart Contract';
                  duration = 'Current Cycle Lock';
                } else if (idx === 2) {
                  allocationText = 'Up to 10% Monthly Rewards';
                  badgeStyle = 'bg-purple-brand/20 border border-purple-glow text-purple-glow font-bold';
                  legalBound = 'Validator Yield Distribution';
                  duration = 'Every 30-day epoch';
                } else if (idx === 3) {
                  allocationText = 'Continuous Price Support';
                  badgeStyle = 'bg-[#1e1548] border border-[#8247E5]/25 text-gray-300 font-medium';
                  legalBound = 'Polygon POS Network Pledge';
                  duration = 'Network contract life';
                } else {
                  allocationText = 'Zero Personal Capital Risk';
                  badgeStyle = 'bg-emerald-500/10 border border-emerald-500/35 text-emerald-400 font-bold';
                  legalBound = 'Biometric Signed Contract';
                  duration = 'Guaranteed Escrow Protection';
                }

                return (
                  <tr key={step.number} className="hover:bg-[#1d104a]/30 transition-colors odd:bg-white/[0.01]">
                    <td className="px-6 py-5 font-display font-black text-white whitespace-nowrap">
                      <span className="inline-flex items-center justify-center w-6.5 h-6.5 bg-purple-brand/20 text-[#a855f7] rounded-full mr-3 text-xs font-mono font-bold border border-[#8247E5]/20">
                        0{step.number}
                      </span>
                      {step.title}
                    </td>
                    <td className="px-6 py-5 max-w-xs text-xs text-gray-300 leading-relaxed font-sans">
                      {step.description}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`inline-block text-[10.5px] uppercase tracking-wider px-3 py-1 rounded-full ${badgeStyle}`}>
                        {allocationText}
                      </span>
                    </td>
                    <td className="px-6 py-5 font-mono text-xs text-white">
                      {legalBound}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-xs text-gray-300 font-mono text-right">
                      {duration}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Numbered Steps detail panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
        {HOW_IT_WORKS_STEPS.map((step, index) => (
          <div 
            key={step.number}
            className="relative bg-gradient-to-b from-[#160E3B] to-[#0E0927] border border-purple-brand/20 hover:border-purple-brand/40 hover:shadow-[0_0_20px_rgba(123,63,228,0.15)] rounded-2xl p-6 transition-all group flex flex-col justify-between"
          >
            {/* Stage Indicator Badge */}
            <div className="absolute top-5 right-5 font-mono text-4xl font-extrabold text-white/5 group-hover:text-purple-brand/10 transition-colors select-none">
              #0{step.number}
            </div>

            <div className="space-y-4">
              <div className="inline-flex p-3 bg-purple-brand/10 rounded-xl">
                {stepIcons[index] || <Landmark className="w-6 h-6 text-purple-brand" />}
              </div>

              <div>
                <h4 className="font-display font-bold text-xl text-white">
                  0{step.number}. {step.title}
                </h4>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Sub items points */}
              <ul className="space-y-2 pt-2 border-t border-white/5">
                {step.bulletPoints.map((point, k) => (
                  <li key={k} className="flex items-start text-xs text-gray-300">
                    <Check className="w-3.5 h-3.5 text-emerald-500 mr-2 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom mini status label */}
            <div className="pt-4 mt-6 border-t border-purple-brand/10 text-[10px] uppercase font-mono tracking-widest text-purple-glow">
              Audit secure &amp; regulatory safe
            </div>
          </div>
        ))}
      </div>

      {/* Lower CTA */}
      <div className="bg-gradient-to-r from-purple-brand/10 to-blue-500/5 border border-purple-brand/20 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-left space-y-2">
          <h4 className="font-display font-bold text-lg text-white">Ready to activate your custom allocation node?</h4>
          <p className="text-xs text-gray-400 font-sans max-w-xl">Configure your eligibility region to automatically pull compliance contracts and proceed with standard verification checklists.</p>
        </div>
        <button
          onClick={() => onViewChange('kyc')}
          className="px-6 py-3 bg-gradient-to-r from-purple-brand to-purple-glow hover:brightness-110 text-white font-semibold font-display rounded-xl flex items-center space-x-2 shrink-0 active:scale-95 transition-all text-sm"
        >
          <span>Begin KYC Verification</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </section>
  );
}
