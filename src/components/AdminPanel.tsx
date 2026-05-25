/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ToggleLeft, Database, Check, AlertOctagon, RefreshCw, Layers, Award, ShieldAlert, Sparkles } from 'lucide-react';
import { ApplicationData, CountryCode } from '../types';

interface AdminPanelProps {
  application: ApplicationData | null;
  onUpdateApplication: (app: ApplicationData | null) => void;
  onJumpToStep: (step: 1 | 2 | 3 | 4 | 5) => void;
  fundingAmount: number;
}

export default function AdminPanel({ application, onUpdateApplication, onJumpToStep, fundingAmount }: AdminPanelProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>('Selfie with ID is blurred or illegible');

  const rejectionOptions = [
    'Selfie with ID is blurred or illegible',
    'Proof of address date exceeds 60-day limit',
    'Invalid National Tax ID format (mismatch detected)',
    'Cheque authorization void proof missing official signature'
  ];

  const handleAutocompleteDemo = () => {
    const demoApp: ApplicationData = {
      country: 'US',
      fullName: 'Johnathan Doe',
      email: 'john.doe@polygon-partner.io',
      phone: '+1 (555) 019-2834',
      birthDate: '1988-11-22',
      address: '742 Evergreen Terrace',
      city: 'Springfield',
      stateProvince: 'IL',
      zipPostalCode: '62704',
      taxId: '555-01-9283',
      billingAddressConfirmed: true,
      corporateEmploymentStatus: 'Employed Full-time',
      phoneVerified: true,
      emailVerified: true,
      selectedDisbursementMethod: 'PAYCARD',
      cardBrandingType: 'PAYROLL',
      documentsUploaded: {
        photo_id: { fileName: 'us_passport_front.jpg', size: '2.4 MB', uploadedAt: new Date().toLocaleDateString() },
        proof_address: { fileName: 'coned_water_bill.pdf', size: '1.1 MB', uploadedAt: new Date().toLocaleDateString() },
        selfie_id: { fileName: 'selfie_holding_id.jpg', size: '3.8 MB', uploadedAt: new Date().toLocaleDateString() },
        direct_deposit: { fileName: 'chase_void_cheque.pdf', size: '890 KB', uploadedAt: new Date().toLocaleDateString() }
      },
      signatureName: 'Johnathan Doe',
      signatureDate: new Date().toLocaleDateString(),
      sha256SignatureHash: 'af72b036ceee4b72c91a0c441bb16feae4af728e9c0e44b93fb25db56f1a84f3',
      status: 'PENDING',
      submittedAt: new Date().toLocaleString()
    };

    onUpdateApplication(demoApp);
    localStorage.setItem('mep_application_data', JSON.stringify(demoApp));
    onJumpToStep(5); // Jump to step 5 review tracker
  };

  const handleForceApprove = () => {
    if (!application) return;

    const approvedTx = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    const chequeNum = `POL-CHQ-${Math.floor(100000 + Math.random() * 900000)}-US`;

    const approvedApp: ApplicationData = {
      ...application,
      status: 'APPROVED',
      approvalTxHash: approvedTx,
      chequeNumber: chequeNum,
      fundingDisbursed: true,
      rejectionReason: undefined
    };

    onUpdateApplication(approvedApp);
    localStorage.setItem('mep_application_data', JSON.stringify(approvedApp));
  };

  const handleForceReject = () => {
    if (!application) return;

    const rejectedApp: ApplicationData = {
      ...application,
      status: 'REJECTED',
      rejectionReason: rejectReason
    };

    onUpdateApplication(rejectedApp);
    localStorage.setItem('mep_application_data', JSON.stringify(rejectedApp));
    onJumpToStep(3); // Send them back to uploads for corrections
  };

  const handleReset = () => {
    onUpdateApplication(null);
    localStorage.removeItem('mep_application_data');
    localStorage.removeItem('mep_requested_funding');
    onJumpToStep(1);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 text-left font-sans">
      
      {/* Floating Panel Activation Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        id="admin-simulator-trigger"
        className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold px-4 py-3 rounded-full hover:brightness-110 shadow-lg shadow-orange-500/20 active:scale-95 transition-all text-xs"
      >
        <ToggleLeft className="w-4 h-4" />
        <span>Simulator Console ({application ? application.status : 'Empty'})</span>
      </button>

      {/* Control Drawer Panels */}
      {isOpen && (
        <div 
          id="admin-simulator-panel"
          className="absolute bottom-14 right-0 w-[90vw] sm:w-[350px] bg-[#140E2D] border-2 border-amber-500/50 rounded-2xl p-5 shadow-2xl text-xs space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center space-x-1.5">
              <Database className="w-4 h-4 text-amber-500" />
              <h4 className="font-display font-black tracking-wide text-white uppercase text-xs">Compliance Simulator Q/A</h4>
            </div>
            <span className="text-[9px] uppercase font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded">
              Demo Test Node
            </span>
          </div>

          <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
            Use this panel to instantly transition application states. Live UI screens respond dynamically to reviewer approvals and declines.
          </p>

          {/* Stored State Indicator */}
          <div className="p-3 bg-purple-dark border border-purple-brand/20 rounded-xl space-y-1.5 font-mono">
            <div className="flex justify-between">
              <span className="text-gray-400">Database Entry:</span>
              <span className={`font-bold ${application ? 'text-emerald-400' : 'text-gray-500'}`}>
                {application ? 'REGISTERED' : 'NULL'}
              </span>
            </div>
            
            {application && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-400">Current Status:</span>
                  <span className={`font-bold leading-none px-1.5 py-0.5 rounded text-[10px] ${
                    application.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400' :
                    application.status === 'REJECTED' ? 'bg-rose-500/20 text-rose-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}>
                    {application.status}
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-400">Applicant:</span>
                  <span className="text-white truncate max-w-[150px]">{application.fullName}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-400">Region Set:</span>
                  <span className="text-white">{application.country} Node</span>
                </div>
              </>
            )}

            <div className="flex justify-between text-[11px] border-t border-white/5 pt-1.5 mt-1.5">
              <span className="text-gray-400">Active Slider:</span>
              <span className="text-purple-glow font-bold">${fundingAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Action Operations grid */}
          <div className="space-y-2.5">
            
            {/* 1. Fast Autocomplete Button */}
            {!application && (
              <button
                type="button"
                onClick={handleAutocompleteDemo}
                className="w-full py-2 bg-purple-brand hover:bg-purple-glow text-white font-semibold rounded-lg flex items-center justify-center space-x-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Autocomplete Demo Application</span>
              </button>
            )}

            {application && (
              <>
                {/* 2. Force Approval Button (Available in PENDING or REJECTED) */}
                {application.status !== 'APPROVED' && (
                  <button
                    type="button"
                    onClick={handleForceApprove}
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <Check className="w-4 h-4" />
                    <span>FORCE APPROVE ALLOCATION</span>
                  </button>
                )}

                {/* 3. Force Decline / Rejection Trigger */}
                {application.status !== 'APPROVED' && (
                  <div className="space-y-1.5 border-t border-white/5 pt-2.5">
                    <label className="text-[10px] text-gray-400 block font-mono">Select Rejection Reason:</label>
                    <select
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="w-full bg-purple-dark border border-purple-brand/30 rounded-lg p-1.5 text-[11px] text-white focus:outline-none"
                    >
                      {rejectionOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    
                    <button
                      type="button"
                      onClick={handleForceReject}
                      className="w-full py-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-lg flex items-center justify-center space-x-1.5 transition-all text-xs"
                    >
                      <AlertOctagon className="w-3.5 h-3.5" />
                      <span>CORRECTION guide (Reject)</span>
                    </button>
                  </div>
                )}
              </>
            )}

            {/* 4. Reset Session Clears Cache */}
            <button
              type="button"
              onClick={handleReset}
              className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-lg flex items-center justify-center space-x-1.5 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Full Reset (Empty Database)</span>
            </button>

          </div>

          <div className="text-[10px] text-center text-amber-500/80 border-t border-white/5 pt-2 flex items-center justify-center space-x-1">
            <ShieldAlert className="w-3 h-3 text-amber-500" />
            <span>Simulated actions. Sandbox active.</span>
          </div>

        </div>
      )}

    </div>
  );
}
