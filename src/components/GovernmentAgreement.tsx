/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Scale, FileText, Fingerprint, Landmark, AlertOctagon, HelpCircle, ArrowRight, ShieldAlert, CheckCircle } from 'lucide-react';
import { ApplicationData } from '../types';

interface GovernmentAgreementProps {
  application: ApplicationData | null;
  onViewChange: (view: string) => void;
}

export default function GovernmentAgreement({ application, onViewChange }: GovernmentAgreementProps) {
  const [previewName, setPreviewName] = useState<string>('');
  const [checkedReview, setCheckedReview] = useState<boolean>(false);

  useEffect(() => {
    if (application && application.fullName) {
      setPreviewName(application.fullName);
    }
  }, [application]);

  const signedName = previewName || (application?.fullName) || 'WILLIAM VANCE (PRO MEMORIAM)';

  return (
    <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-12 text-left animate-fadeIn" id="government-agreement-page">
      
      {/* Decorative ambient background glows */}
      <div className="absolute top-20 right-5 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 left-5 w-96 h-96 bg-purple-brand/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Head section */}
      <div className="space-y-4 border-b border-purple-brand/10 pb-6">
        <div className="inline-flex items-center space-x-2.5 bg-rose-500/10 border border-rose-500/30 rounded-full px-4 py-2 text-xs text-rose-300 font-mono shadow-sm">
          <Landmark className="w-4 h-4 text-rose-400" />
          <span className="font-bold uppercase tracking-wider">SOVEREIGN COOPERATION & GOVERNANCE STATUS</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white leading-tight uppercase">
          Government Partnership Agreement <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-400 to-purple-glow">
            &amp; Legal Accountability Ethos
          </span>
        </h1>
        
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-3xl font-sans">
          To protect the absolute integrity of the Polygon (MATIC) Empowerment Program, all allocations are governed under strict multi-jurisdictional government collaborations. This section details the binding participant guidelines and federal anti-fraud reporting frameworks.
        </p>
      </div>

      {/* Main Grid: Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Detailed Articles */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Section 1: Progress and Intent */}
          <div className="bg-[#110A2E]/60 border border-purple-brand/15 rounded-2xl p-6 sm:p-7 space-y-4">
            <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-purple-glow" />
              <span>1. Long-Term Progress of the Polygon Ecosystem</span>
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-sans">
              This global initiative has been established for the core progress and decentralization of the <strong>Polygon PoS Network</strong>. Millions of dollars in capital funding are actively dispatched as 10% instant bonuses and 90% validator stakings to secure network nodes.
            </p>
            <p className="text-gray-400 text-xs leading-relaxed font-sans">
              While we empower direct global validation, we actively enforce protective regulatory protocols. Many participants may falsely assume that decentralized programs lack rigorous compliance measures or that they have the free liberty to engage in fraudulent practices with program assets. <strong>This assumption is a critical error.</strong> Any attempt to compromise, sybil-attack, or flee with allocated program funds triggers automatic sovereign prosecution.
            </p>
          </div>

          {/* Section 2: Sovereign Collaboration & Worldwide Tracking */}
          <div className="bg-[#110A2E]/60 border border-purple-brand/15 rounded-2xl p-6 sm:p-7 space-y-4">
            <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <Landmark className="w-5 h-5 text-blue-400" />
              <span>2. Direct Partnership with Federal Authorities</span>
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-sans">
              We are not a small, unmonitored entity; the MATIC Empowerment Consortium is an institutional program that operates <strong>hand-in-hand with sovereign federal intelligence, cybercrime divisions, and financial ministries</strong> across all participating countries (including the United States, Great Britain, Canada, Germany, Australia, and all supported global nodes).
            </p>
            <p className="text-gray-400 text-xs leading-relaxed font-sans">
              All legal identity documents, permanent addresses, tax ID numbers, and biometric selfie registries submitted during KYC are parsed and stored in secure government-compliant databases. If a participant attempts to execute an fraudulent withdrawal, abscond with program staking balances, or mislead regional coordinators:
            </p>
            <ul className="list-disc pl-5 text-xs text-gray-400 space-y-2 leading-relaxed">
              <li><strong>Global Legal Network:</strong> Host nations will instantly share registry packets and trigger immediate police files.</li>
              <li><strong>Ubiquitous Monitoring:</strong> We maintain legal and regulatory partners in every supported country to arrest offenders, regardless of geographical boundary.</li>
              <li><strong>Federal Extradition:</strong> All program contracts invoke federal wire fraud covenants with full interstate extradition rights.</li>
            </ul>
          </div>

          {/* Section 3: Legal Consequences */}
          <div className="bg-[#1C0F2F]/60 border border-rose-500/25 rounded-2xl p-6 sm:p-7 space-y-4 shadow-lg shadow-rose-950/10">
            <h3 className="font-display font-bold text-lg text-rose-300 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>3. Up to 10 Years Imprisonment &amp; Ethics Standards</span>
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-sans">
              Participants are hereby warned that any act of scamming, identity falsification, or illegal capital runaways constitutes <strong>Federal Wire Fraud, Money Laundering, and Illegal Token Embezzlement</strong>.
            </p>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-sans font-semibold">
              The minimum federal baseline for systemic fraud against decentralized institutional capital pools is standardly penalized by:
            </p>
            <div className="bg-[#0D051C] border border-rose-500/20 rounded-xl p-4 text-center text-xs space-y-1 font-mono">
              <span className="text-xl font-black text-rose-400 tracking-wider">UP TO 10 YEARS IMPRISONMENT</span>
              <p className="text-[10px] text-gray-500 font-sans uppercase">And standard asset seizures to recover core program balances</p>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed font-sans">
              Sponsoring nodes utilize persistent real-time telemetry and double blockchain-hash audit layers. If a breach is detected, the local federal police department will immediately issue formal arrest warrants and proceed with asset freezing, followed by mandatory containment sentencing.
            </p>
          </div>

        </div>

        {/* Right: Signature Display & Live Preview */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          
          {/* Certificate Design representing court document */}
          <div className="border-2 border-rose-500/35 bg-[#0C061D] rounded-2xl overflow-hidden shadow-2xl relative">
            <div className="bg-gradient-to-r from-rose-900/40 via-[#1F0E31] to-purple-900/40 px-5 py-4 border-b border-rose-500/20">
              <div className="flex items-center space-x-2">
                <Fingerprint className="w-4 h-4 text-rose-400 animate-pulse" />
                <span className="text-[11px] font-mono tracking-widest text-rose-300 uppercase font-black">
                  OFFICIAL GOVERNMENT-MAPPED REGISTER
                </span>
              </div>
            </div>

            <div className="p-6 space-y-6 text-left relative">
              
              {/* Seal watermark behind */}
              <div className="absolute inset-0 flex items-center justify-center opacity-3 pointer-events-none select-none">
                <Landmark className="w-48 h-48 text-white" />
              </div>

              <div className="space-y-4 relative z-10 text-xs font-serif leading-relaxed text-gray-300 italic">
                
                <p className="border-l-2 border-rose-500/40 pl-3 py-1">
                  &ldquo;I, <strong className="text-white uppercase font-sans tracking-wide not-italic font-black border-b border-rose-500/30 pb-0.5">{signedName}</strong>, hereby declare, write, and officially confirm that I have co-signed and agreed that if anything happens, or if I choose or decide to run away with this money, with the Polygon Empowerment Money, or if I try to scam them, that the government should hold me fully accountable for this.&rdquo;
                </p>

                <p className="border-l-2 border-rose-500/40 pl-3 py-1">
                  &ldquo;And I know, and I agree, and I accept that the Polygon Empowerment Consortium handles my legal details. What will be the police, and I will face the police and I will face the jail. Jail time and the full legal consequences of any offense I commit under the law.&rdquo;
                </p>

                <p className="border-l-2 border-rose-500/40 pl-3 py-1">
                  &ldquo;I acknowledge that this program works in direct affiliation with worldwide federal intelligence, government regulation networks, and standard ethics agencies. I agree that I am subject to immediate prosecution, global asset seizures, and <strong>10 years imprisonment for fraud</strong>, no matter which country I flee to.&rdquo;
                </p>

              </div>

              {/* Holographic Verification Row */}
              <div className="pt-4 border-t border-purple-brand/10 space-y-2 font-mono text-[9px] text-gray-500">
                <div className="flex justify-between">
                  <span>REGULAR STATUS:</span>
                  <span className="text-rose-400 font-bold">MAPPED DIRECT TO GOVERNMENT</span>
                </div>
                <div className="flex justify-between">
                  <span>CIPHER SIGNATURE SHIELD:</span>
                  <span className="text-gray-400 truncate max-w-[200px]">SHA-256: 412b_secure_{Math.floor(1000 + Math.random()*9000)}_7b36f</span>
                </div>
                <div className="flex justify-between">
                  <span>PENAL CODE MATRIX:</span>
                  <span className="text-gray-300">SECTION 1341 (FED. INTEL COOPERATION)</span>
                </div>
              </div>

              {/* Preview inputs if not logged in */}
              {!application && (
                <div className="bg-[#140C29] p-3 rounded-lg border border-purple-brand/15 space-y-2 mt-4">
                  <span className="text-[10px] text-purple-glow font-mono font-bold block uppercase">
                    Test Live Legal Signature Signature Preview:
                  </span>
                  <input 
                    type="text"
                    value={previewName}
                    onChange={(e) => setPreviewName(e.target.value)}
                    placeholder="Type legal name to co-sign card"
                    className="w-full bg-[#080515] border border-purple-brand/20 text-xs rounded px-2.5 py-2 text-white placeholder-gray-600 focus:outline-[#7120e2]"
                  />
                  <p className="text-[9px] text-gray-500 leading-normal font-sans">
                    * Type your full name here to observe the dynamic co-signature mapping on this legal decree.
                  </p>
                </div>
              )}

            </div>
          </div>

          {/* Quick Checklist */}
          <div className="bg-[#110A2E]/60 border border-purple-brand/15 rounded-xl p-4 space-y-3 font-sans text-xs">
            <span className="font-display font-medium text-white block">Stance of Regulatory Assurance:</span>
            <div className="space-y-2">
              <div className="flex items-start space-x-2.5 text-gray-400">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Government validation occurs via automatic regional tax agency links.</span>
              </div>
              <div className="flex items-start space-x-2.5 text-gray-400">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Staking funds remain safely locked to consensus validator nodes.</span>
              </div>
              <div className="flex items-start space-x-2.5 text-gray-400">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Identity protection is fully managed under military-grade security.</span>
              </div>
            </div>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <button
              onClick={() => onViewChange('home')}
              className="px-5 py-3 bg-white/5 hover:bg-white/10 text-gray-200 rounded-xl text-xs font-bold font-display uppercase tracking-wider transition-all"
            >
              Dashboard
            </button>

            <button
              onClick={() => onViewChange('kyc')}
              className="flex-grow flex items-center justify-center space-x-2 bg-gradient-to-r from-rose-600 to-purple-glow hover:brightness-110 text-white font-bold font-display text-xs py-3.5 px-4 rounded-xl shadow-lg transition-all"
            >
              <span>{application ? 'VIEW KYC TRACKING' : 'PROCEED TO KYC STATUS'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </section>
  );
}
