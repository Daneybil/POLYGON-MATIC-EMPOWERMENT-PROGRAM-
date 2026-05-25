/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, ArrowRight, ArrowLeft, Upload, CheckCircle2, AlertTriangle, HelpCircle, Loader2, Sparkles, FileText, Check, Trash2, Key, Landmark, Send, CreditCard } from 'lucide-react';
import { ApplicationData, CountryCode, KycStep, CountryConfig } from '../types';
import { COUNTRIES, LEGAL_TERMS_TEXT } from '../data';

interface EligibilityKycProps {
  application: ApplicationData | null;
  onUpdateApplication: (app: ApplicationData | null) => void;
  activeStep: KycStep;
  onStepChange: (step: KycStep) => void;
  fundingAmount: number;
}

export default function EligibilityKyc({
  application,
  onUpdateApplication,
  activeStep,
  onStepChange,
  fundingAmount
}: EligibilityKycProps) {
  
  // States if application doesn't exist yet or is being initialized
  const [selectedCountryCode, setSelectedCountryCode] = useState<CountryCode>('US');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    birthDate: '',
    address: '',
    city: '',
    stateProvince: '',
    zipPostalCode: '',
    taxId: '',
    billingAddressConfirmed: false,
    corporateEmploymentStatus: 'Employed Full-time',
    selectedDisbursementMethod: 'PAYCARD' as 'CHECK' | 'PAYCARD',
    cardBrandingType: 'PAYROLL' as 'PAYROLL' | 'FINANCIAL_ACCESS' | 'DIGITAL_PAYCARD'
  });

  const [uploadedFiles, setUploadedFiles] = useState<Record<string, { fileName: string; size: string; uploadedAt: string }>>({});
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});
  const [termsScrolledEnd, setTermsScrolledEnd] = useState<boolean>(false);
  const [signatureName, setSignatureName] = useState<string>('');
  const [agreedCheck, setAgreedCheck] = useState<boolean>(false);
  const [govAgreedCheck, setGovAgreedCheck] = useState<boolean>(false);

  // Verification code states (Phone & Email verification simulation)
  const [verificationCodeSent, setVerificationCodeSent] = useState<boolean>(false);
  const [verificationCodeInput, setVerificationCodeInput] = useState<string>('');
  const [isVerifyingCode, setIsVerifyingCode] = useState<boolean>(false);
  const [isCodeVerified, setIsCodeVerified] = useState<boolean>(false);

  // SLA Time Countdown simulation
  const [timeLeft, setTimeLeft] = useState({ hours: 47, minutes: 59, seconds: 35 });

  const termsContainerRef = useRef<HTMLDivElement>(null);

  const selectedCountry = COUNTRIES.find(c => c.code === selectedCountryCode) || COUNTRIES[0];

  // Sync state if an application exists in database/localStorage
  useEffect(() => {
    if (application) {
      setSelectedCountryCode(application.country);
      setFormData({
        fullName: application.fullName,
        email: application.email,
        phone: application.phone,
        birthDate: application.birthDate,
        address: application.address,
        city: application.city,
        stateProvince: application.stateProvince,
        zipPostalCode: application.zipPostalCode,
        taxId: application.taxId,
        billingAddressConfirmed: application.billingAddressConfirmed || false,
        corporateEmploymentStatus: application.corporateEmploymentStatus || 'Employed Full-time',
        selectedDisbursementMethod: application.selectedDisbursementMethod || 'PAYCARD',
        cardBrandingType: application.cardBrandingType || 'PAYROLL'
      });
      setUploadedFiles(application.documentsUploaded);
      setSignatureName(application.signatureName);
      setAgreedCheck(true);
      setGovAgreedCheck(true);
      if (application.phoneVerified || application.emailVerified) {
        setIsCodeVerified(true);
      }
    }
  }, [application]);

  // Live timer tick for SLA Pending step
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 47, minutes: 59, seconds: 59 }; // wrap back
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Validate scrolling on step 4 to unlock agreement button
  const handleTermsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    // Calculate scroll parameters
    const difference = target.scrollHeight - target.scrollTop - target.clientHeight;
    // Within 25 pixels of the bottom constitutes "scrolled to bottom"
    if (difference <= 25) {
      setTermsScrolledEnd(true);
    }
  };

  // Skip validation / Demo Autocomplete fill
  const handleDemoAutocompleteFill = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setFormData({
      fullName: 'William Vance',
      email: `vance.w_${randomNum}@polygon-network.org`,
      phone: '+1 (555) 728-1928',
      birthDate: '1990-04-15',
      address: '2241 Oak Ridge Highway',
      city: 'Austin',
      stateProvince: 'TX',
      zipPostalCode: '78701',
      taxId: '635-02-1928',
      billingAddressConfirmed: true,
      corporateEmploymentStatus: 'Employed Full-time',
      selectedDisbursementMethod: 'PAYCARD',
      cardBrandingType: 'PAYROLL'
    });
    
    // Simulate auto importing documents loaded too
    const dummyDocs: Record<string, { fileName: string; size: string; uploadedAt: string }> = {};
    selectedCountry.documents.forEach((doc) => {
      dummyDocs[doc.id] = {
        fileName: `demo_reg_${doc.id}.png`,
        size: '1.4 MB',
        uploadedAt: new Date().toLocaleDateString()
      };
    });
    setUploadedFiles(dummyDocs);
    setIsCodeVerified(true);
  };

  // Simulating custom individual file uploads with loaders
  const handleSimulateUpload = (documentId: string) => {
    if (isUploading[documentId]) return;

    // Trigger state loading
    setIsUploading(prev => ({ ...prev, [documentId]: true }));
    setUploadProgress(prev => ({ ...prev, [documentId]: 5 }));

    let currentProg = 5;
    const interval = setInterval(() => {
      currentProg += Math.floor(Math.random() * 25) + 12;
      if (currentProg >= 100) {
        currentProg = 100;
        clearInterval(interval);
        
        // Finalize uploads
        const mockExtensions: Record<string, string> = {
          photo_id: 'front_passport_verification.jpg',
          proof_address: 'electrical_service_bill.pdf',
          selfie_id: 'verification_selfie_mat_2026.jpg',
          direct_deposit: 'authorized_direct_deposit_slip.pdf'
        };

        const fileName = mockExtensions[documentId] || `${documentId}_registry_check.png`;

        setUploadedFiles(prev => ({
          ...prev,
          [documentId]: {
            fileName,
            size: `${(1.2 + Math.random() * 3).toFixed(1)} MB`,
            uploadedAt: new Date().toLocaleDateString()
          }
        }));

        setIsUploading(prev => ({ ...prev, [documentId]: false }));
      }
      setUploadProgress(prev => ({ ...prev, [documentId]: currentProg }));
    }, 150);
  };

  const handleDeleteUploadedFile = (documentId: string) => {
    const updated = { ...uploadedFiles };
    delete updated[documentId];
    setUploadedFiles(updated);
    
    const progress = { ...uploadProgress };
    delete progress[documentId];
    setUploadProgress(progress);
  };

  // Navigation handlers and validation
  const handleStep1Continue = () => {
    onStepChange(2);
  };

  const handleStep2Continue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.taxId || !formData.address) {
      alert("Please fill all required diagnostic fields to proceed to Secure uploads.");
      return;
    }
    if (!isCodeVerified) {
      alert("Please verify your contract email and phone number utilizing the secure Code Verification widget to guarantee identity compliance.");
      return;
    }
    if (!formData.billingAddressConfirmed) {
      alert("Please confirm that your residential address corresponds to your legal billing statements.");
      return;
    }
    onStepChange(3);
  };

  const handleStep3Continue = () => {
    // Audit that all files are there
    const reqIds = selectedCountry.documents.map(d => d.id);
    const uploadedIds = Object.keys(uploadedFiles);
    
    // Check if every required document exists in uploads
    const allUploaded = reqIds.every(id => uploadedIds.includes(id));
    if (!allUploaded) {
      alert("Please upload high-resolution files for all 4 required node validation fields.");
      return;
    }
    onStepChange(4);
  };

  const handleStep4FinalizeSubmit = () => {
    if (!signatureName.trim()) {
      alert("Please co-sign your legal name in the biometrical form block to legalize execution.");
      return;
    }

    if (!agreedCheck) {
      alert("Please mark the legal agreement checkbox saying you understand the lockup.");
      return;
    }

    if (!govAgreedCheck) {
      alert("Please mark the Government Partnership and Criminal accountability checkbox to authorize submit.");
      return;
    }

    // Hash calculation simulation
    const fakeSignatureHash = `af72b036ceee${Array.from({ length: 48 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    const fakeCardNum = `4111-2300-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const submission: ApplicationData = {
      country: selectedCountryCode,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      birthDate: formData.birthDate,
      address: formData.address,
      city: formData.city,
      stateProvince: formData.stateProvince,
      zipPostalCode: formData.zipPostalCode,
      taxId: formData.taxId,
      billingAddressConfirmed: formData.billingAddressConfirmed,
      corporateEmploymentStatus: formData.corporateEmploymentStatus,
      phoneVerified: isCodeVerified,
      emailVerified: isCodeVerified,
      selectedDisbursementMethod: formData.selectedDisbursementMethod,
      cardBrandingType: formData.cardBrandingType,
      documentsUploaded: uploadedFiles,
      signatureName,
      signatureDate: new Date().toLocaleDateString(),
      sha256SignatureHash: fakeSignatureHash,
      status: 'PENDING',
      submittedAt: new Date().toLocaleString(),
      chequeNumber: `POL-CHQ-${Math.floor(100000 + Math.random() * 900000)}-${selectedCountryCode}`,
      payCardNumber: fakeCardNum
    };

    onUpdateApplication(submission);
    localStorage.setItem('mep_application_data', JSON.stringify(submission));
    onStepChange(5); // Jump to tracker
  };

  const handleRestartKycFlow = () => {
    const cleared: ApplicationData = {
      ...application!,
      status: 'NOT_STARTED',
      rejectionReason: undefined
    };
    onUpdateApplication(cleared);
    localStorage.setItem('mep_application_data', JSON.stringify(cleared));
    onStepChange(3); // Take them back to Uploads
  };

  return (
    <div className="py-8 px-4 sm:px-6 max-w-5xl mx-auto space-y-8 text-left" id="kyc-portal-container">
      
      {/* Top Breadcrumb row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-purple-brand/10 pb-4 gap-3">
        <button
          onClick={() => onStepChange(1)}
          className="inline-flex items-center space-x-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          id="back-breadcrumb-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
        <p className="text-xs font-mono text-purple-glow uppercase tracking-wider">
          MATIC Empowerment Hub / <strong className="text-white text-[11px] uppercase tracking-normal">KYC Verification Portal</strong>
        </p>
      </div>

      {/* Main compliance headers */}
      <div className="text-center space-y-2.5 max-w-2xl mx-auto py-2">
        <span className="inline-flex bg-[#120D2C] border-2 border-purple-brand/35 text-purple-glow font-display font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(123,63,228,0.2)]">
          Security &amp; Verification
        </span>
        <h2 className="text-3xl sm:text-4xl font-display font-black text-white leading-tight">
          Eligibility &amp; Verification Portal
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm">
          Securely submit validation files to verify your node, generating active certified cheque codes. 
          Compliance telemetry resides entirely in hardware sandboxes.
        </p>
      </div>

      {/* Multi-step breadcrumb progress stepper */}
      <div className="bg-[#110A2B]/40 border border-purple-brand/15 p-3.5 rounded-xl text-[10px] sm:text-[11px] font-mono font-semibold" id="stepper-indicator">
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 text-gray-400 text-center">
          <span className="uppercase text-purple-glow font-bold">APPLICATION STEP:</span>
          
          {[
            { step: 1, label: '1. Country' },
            { step: 2, label: '2. Details' },
            { step: 3, label: '3. Uploads' },
            { step: 4, label: '4. Sign Agreement' },
            { step: 5, label: '5. Review Tracker' }
          ].map((s) => {
            const isCurrent = activeStep === s.step;
            const isCompleted = activeStep > s.step;
            return (
              <React.Fragment key={s.step}>
                {s.step !== 1 && <span className="text-gray-600 font-normal">›</span>}
                <span className={`px-2 py-1 rounded-md transition-colors ${
                  isCurrent ? 'bg-purple-brand border border-purple-glow text-white font-bold shadow-[0_0_8px_rgba(123,63,228,0.4)]' :
                  isCompleted ? 'text-emerald-400 font-bold bg-emerald-500/5 border border-emerald-500/10' :
                  'text-gray-500 bg-white/5'
                }`}>
                  {s.label}
                </span>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* =====================================
          STEP 1: COUNTRY REGIONAL NODE SELECTOR
          ===================================== */}
      {activeStep === 1 && (
        <div className="bg-[#110A2E] border-2 border-purple-brand/30 rounded-2xl p-6 sm:p-8 space-y-8 shadow-2xl" id="step1-card">
          
          <div className="space-y-2 border-b border-purple-brand/10 pb-4">
            <h3 className="font-display font-black text-xl text-white flex items-center space-x-2.5">
              <Landmark className="w-5.5 h-5.5 text-purple-glow" />
              <span>Select Your Regional Program Node</span>
            </h3>
            <p className="text-xs text-gray-400">
              We operate sponsored validator nodes in targeted states honoring international financial frameworks. Choosing your domestic node produces personalized compliance guidelines automatically.
            </p>
          </div>

          {/* Regional Picker Flag Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4" id="country-grid">
            {COUNTRIES.map((c) => {
              const isSelected = selectedCountryCode === c.code;
              return (
                <button
                  key={c.code}
                  type="button"
                  id={`country-card-${c.code}`}
                  onClick={() => setSelectedCountryCode(c.code)}
                  className={`relative p-5 text-left rounded-xl transition-all border flex flex-col justify-between h-28 group ${
                    isSelected 
                      ? 'bg-gradient-to-tr from-[#1B124E] to-[#120B30] border-purple-brand ring-2 ring-purple-glow/30' 
                      : 'bg-[#150F2C]/40 border-purple-brand/15 hover:border-purple-brand/40 hover:bg-[#1E1541]/25'
                  }`}
                >
                  <span className="text-3xl filter saturate-100">{c.flag}</span>
                  <div>
                    <span className="text-xs uppercase font-mono tracking-widest text-purple-glow font-bold">{c.code}</span>
                    <p className="text-sm font-bold text-white tracking-tight leading-none mt-1 truncate">{c.fullName}</p>
                  </div>
                  
                  {isSelected && (
                    <span className="absolute top-4 right-4 bg-purple-brand text-white p-0.5 rounded-full border border-purple-glow shadow-[0_0_8px_rgba(123,63,228,0.5)]">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Dynamic Documents List displays based on choice */}
          <div className="bg-purple-dark/50 border border-purple-brand/20 rounded-xl p-5 sm:p-6 space-y-4" id="documents-required-pane">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-xs font-mono uppercase font-bold tracking-widest text-[#2563EB]">
                DOCUMENTS REQUIRED: {selectedCountry.fullName}
              </span>
              <span className="text-[10px] uppercase font-mono bg-purple-brand/15 text-purple-glow px-2 py-0.5 rounded border border-purple-brand/20">
                100% Sandbox Encrypted
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
              {selectedCountry.documents.map((doc, idx) => (
                <div key={doc.id} className="flex items-start space-x-3.5 p-3.5 bg-[#17103C]/40 border border-purple-brand/10 hover:border-purple-brand/25 rounded-xl transition-all">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-[#21174F] text-purple-glow border border-purple-brand/20 rounded-full text-xs font-bold font-mono">
                    {idx + 1}
                  </span>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-white font-display">{doc.name}</h4>
                    <p className="text-[11px] text-gray-400 font-sans leading-relaxed">{doc.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Yellow/Orange warning info badge */}
            <div className="p-4 bg-[#C2410C]/5 border border-[#C2410C]/20 text-[#EA580C] text-[11px] font-sans rounded-lg">
              <strong className="font-semibold block mb-0.5 text-xs">Node Validation Advisory:</strong>
              {selectedCountry.extraTaxNotes}
            </div>
          </div>

          {/* Action buttons footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-purple-brand/10 gap-4">
            <button
              onClick={handleDemoAutocompleteFill}
              type="button"
              className="w-full sm:w-auto px-5 py-3 border border-amber-500/35 hover:bg-amber-500/10 text-amber-500 text-xs font-bold font-mono rounded-xl tracking-wider flex items-center justify-center space-x-1.5 transition-all"
              id="autocomplete-demo-btn"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Autocomplete Demo Fill</span>
            </button>

            <button
              onClick={handleStep1Continue}
              type="button"
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-brand to-purple-glow hover:brightness-110 text-white font-bold font-display rounded-xl flex items-center justify-center space-x-2"
              id="step1-continue-btn"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* =====================================
          STEP 2: FORM DETAILS & TAX INDICATORS
          ===================================== */}
      {activeStep === 2 && (
        <form onSubmit={handleStep2Continue} className="bg-[#110A2E] border-2 border-purple-brand/30 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl animate-fadeIn" id="step2-form">
          
          <div className="space-y-1.5 border-b border-purple-brand/10 pb-4">
            <h3 className="font-display font-black text-xl text-white flex items-center space-x-2.5">
              <ShieldCheck className="w-5.5 h-5.5 text-purple-glow" />
              <span>Provide Registration Details</span>
            </h3>
            <p className="text-xs text-gray-400">
              Please declare your formal identity coordinates. Double check that legal spellings precisely resemble your verification assets to avoid administrative delay flags.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300 block font-display">Full Legal Name *</label>
              <input 
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="First-name Middle-name Last-name"
                className="w-full bg-[#18113E] border border-purple-brand/25 text-sm rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-[#7B3FE4] text-white font-sans mt-0"
                id="form-full-name"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300 block font-display">Date of Birth *</label>
              <input 
                type="date"
                required
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="w-full bg-[#18113E] border border-purple-brand/25 text-sm rounded-xl px-4 py-3 text-white focus:outline-[#7B3FE4] font-sans mt-0"
                id="form-birthdate"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300 block font-display">Contract Email Address *</label>
              <input 
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@institution.com"
                className="w-full bg-[#18113E] border border-purple-brand/25 text-sm rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-[#7B3FE4] text-white font-sans mt-0"
                id="form-email animate-pulse"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300 block font-display">Mobile Telephone *</label>
              <input 
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-[#18113E] border border-purple-brand/25 text-sm rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-[#7B3FE4] text-white font-sans mt-0"
                id="form-phone"
              />
            </div>
          </div>

          {/* Phone & Email Secure SMS Token Verification Widget */}
          <div className="p-4 bg-purple-brand/10 border border-purple-brand/25 rounded-xl space-y-3">
            <div className="flex justify-between items-center border-b border-purple-brand/10 pb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-purple-glow font-bold flex items-center space-x-1.5">
                <Key className="w-3.5 h-3.5 text-emerald-400" />
                <span>Security Token Verification</span>
              </span>
              <span className="text-[9px] font-mono text-gray-400">Card Setup Ownership Protocol</span>
            </div>

            {isCodeVerified ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-lg flex items-center space-x-3 text-emerald-400 text-xs shadow-inner">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                <div className="text-left leading-tight">
                  <span className="font-bold block text-white">Compliance Status: TELEMETRY VERIFIED</span>
                  <span className="text-[10px] font-mono text-emerald-400/80">Physical mobile identity keys successfully bound to high-fiduciary card systems.</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="space-y-1 flex-1">
                  <p className="text-[11px] text-gray-300 leading-relaxed font-sans">
                    To authorize direct physical card setup and background compliance queries, we transmit an encrypted authentication PIN to your mobile.
                  </p>
                  {verificationCodeSent && (
                    <input
                      type="text"
                      maxLength={6}
                      value={verificationCodeInput}
                      onChange={(e) => setVerificationCodeInput(e.target.value)}
                      placeholder="Enter 6-digit PIN (e.g., 192834)"
                      className="w-full sm:w-52 bg-[#0C0724] border border-purple-brand/40 text-sm font-mono tracking-widest rounded-lg px-3 py-1.5 focus:outline-[#7B3FE4] text-white mt-1.5"
                    />
                  )}
                </div>

                <div className="shrink-0 self-end">
                  {!verificationCodeSent ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (!formData.email || !formData.phone) {
                          alert("Please declare legal email and phone coordinates to receive security credentials.");
                          return;
                        }
                        setVerificationCodeSent(true);
                      }}
                      className="px-4 py-2.5 bg-[#2563EB] hover:bg-blue-600 text-white font-mono text-[10.5px] font-bold rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-white" />
                      <span>Request Verification PIN</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={verificationCodeInput.length < 4 || isVerifyingCode}
                      onClick={() => {
                        setIsVerifyingCode(true);
                        setTimeout(() => {
                          setIsCodeVerified(true);
                          setIsVerifyingCode(false);
                        }, 1200);
                      }}
                      className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-45 disabled:cursor-not-allowed text-white font-mono text-[10.5px] font-bold rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer"
                    >
                      {isVerifyingCode ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                          <span>Binding Keys...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>Confirm Security PIN</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Dynamic National Index Number */}
          <div className="p-4 bg-[#1C1448]/80 border border-purple-brand/20 rounded-xl space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-white block font-display">
                {selectedCountry.taxIdLabel} *
              </label>
              <span className="text-[10px] font-mono text-purple-glow font-bold">
                Country Registry: {selectedCountry.fullName}
              </span>
            </div>
            
            <input 
              type="text"
              required
              value={formData.taxId}
              onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
              placeholder={selectedCountry.taxIdPlaceholder}
              className="w-full bg-[#0D082A] border border-purple-brand/35 text-sm rounded-lg px-3 py-2.5 placeholder-gray-600 focus:outline-[#7B3FE4] text-white font-mono mt-0"
              id="form-taxid"
            />
            
            <p className="text-[10px] text-gray-400 font-sans">
              🔒 Decrypted exclusively in ephemeral secure VM kernels. Will be validated using governmental background registers.
            </p>
          </div>

          {/* Corporate employment status dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 block font-display">Corporate Employment Status *</label>
            <select
              value={formData.corporateEmploymentStatus}
              onChange={(e) => setFormData({ ...formData, corporateEmploymentStatus: e.target.value })}
              className="w-full bg-[#18113E] border border-purple-brand/25 text-sm rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-purple-brand text-gray-200 font-sans cursor-pointer"
            >
              <option value="Employed Full-time">Employed Full-time (W2 or equivalent)</option>
              <option value="Self-employed / Business Owner">Self-employed / Business Owner</option>
              <option value="Contractor / Consultant">Contractor / Consultant (1099 or equivalent)</option>
              <option value="Unemployed / Independent">Unemployed / Independent Trustee</option>
              <option value="Retired / Pensionary">Retired / Pensionary Trustee</option>
              <option value="Academic Scholar / Student">Academic Scholar / Student</option>
            </select>
          </div>

          {/* Payout Mechanism Selector */}
          <div className="p-5 bg-[#0C0825] border border-purple-brand/20 rounded-xl space-y-4">
            <div className="flex justify-between items-center border-b border-purple-brand/10 pb-2">
              <h4 className="font-display font-bold text-sm text-white flex items-center space-x-2">
                <CreditCard className="w-4.5 h-4.5 text-[#3B82F6]" />
                <span>Primary Funding Payout Strategy</span>
              </h4>
              <span className="text-[9px] font-mono text-purple-glow font-bold uppercase">Disbursement Plan</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Payroll Card Option */}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, selectedDisbursementMethod: 'PAYCARD' })}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between space-y-2 transition-all min-h-24 ${
                  formData.selectedDisbursementMethod === 'PAYCARD'
                    ? 'bg-[#150D3A] border-[#3B82F6] ring-1 ring-[#3B82F6]/30'
                    : 'bg-[#120B2F]/40 border-purple-brand/10 hover:border-purple-brand/25'
                }`}
              >
                <div className="flex justify-between items-start w-full">
                  <span className="text-xs font-bold text-white font-display">Payroll Card (PayCard)</span>
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${formData.selectedDisbursementMethod === 'PAYCARD' ? 'border-[#3B82F6]' : 'border-gray-600'}`}>
                    {formData.selectedDisbursementMethod === 'PAYCARD' && <span className="w-2 h-2 bg-[#3B82F6] rounded-full"></span>}
                  </div>
                </div>
                <p className="text-[10.5px] text-gray-400 font-sans leading-relaxed">Loads keeping rewards instantly. Integrated with ATM/POS. Also supporting digital activation.</p>
              </button>

              {/* Paper Check Option */}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, selectedDisbursementMethod: 'CHECK' })}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between space-y-2 transition-all min-h-24 ${
                  formData.selectedDisbursementMethod === 'CHECK'
                    ? 'bg-[#150D3A] border-purple-brand ring-1 ring-purple-glow/30'
                    : 'bg-[#120B2F]/40 border-purple-brand/10 hover:border-purple-brand/25'
                }`}
              >
                <div className="flex justify-between items-start w-full">
                  <span className="text-xs font-bold text-white font-display">Certified Paper Cheque</span>
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${formData.selectedDisbursementMethod === 'CHECK' ? 'border-purple-brand' : 'border-gray-600'}`}>
                    {formData.selectedDisbursementMethod === 'CHECK' && <span className="w-2 h-2 bg-purple-brand rounded-full"></span>}
                  </div>
                </div>
                <p className="text-[10.5px] text-gray-400 font-sans leading-relaxed">Dispatched under priority courier to domestic address. Clearable on global physical banks.</p>
              </button>
            </div>

            {formData.selectedDisbursementMethod === 'PAYCARD' && (
              <div className="space-y-2 animate-fadeIn bg-purple-brand/5 p-3.5 rounded-lg border border-purple-brand/10 text-left">
                <label className="text-[11px] font-bold text-gray-300 block font-display">Select Custom Card Branding Option:</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                  {[
                    { type: 'PAYROLL', label: 'Payroll Card' },
                    { type: 'FINANCIAL_ACCESS', label: 'Financial Access Card' },
                    { type: 'DIGITAL_PAYCARD', label: 'Digital Payroll Card' }
                  ].map((c) => (
                    <button
                      key={c.type}
                      type="button"
                      onClick={() => setFormData({ ...formData, cardBrandingType: c.type as any })}
                      className={`p-2 rounded border text-center font-bold tracking-tight py-2 text-[9.5px] uppercase transition-all cursor-pointer ${
                        formData.cardBrandingType === c.type
                          ? 'bg-purple-brand border-purple-glow text-white shadow-[0_0_8px_rgba(123,63,228,0.4)]'
                          : 'bg-[#0E072D] border-purple-brand/15 text-gray-400 hover:text-white'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Address Registry block */}
          <div className="space-y-4 pt-2 border-t border-purple-brand/10">
            <h4 className="font-display font-medium text-white text-base">Permanent Residential Address</h4>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-display">Street Address *</label>
                <input 
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Apartment, suite, unit, building, number, and street"
                  className="w-full bg-[#18113E] border border-purple-brand/25 text-sm rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-[#7B3FE4] text-white font-sans mt-0"
                  id="form-address"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-300 font-display">City *</label>
                  <input 
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="City"
                    className="w-full bg-[#18113E] border border-purple-brand/25 text-sm rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-[#7B3FE4] text-white font-sans mt-0"
                    id="form-city"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-300 font-display">State / Prov *</label>
                  <input 
                    type="text"
                    required
                    value={formData.stateProvince}
                    onChange={(e) => setFormData({ ...formData, stateProvince: e.target.value })}
                    placeholder="State"
                    className="w-full bg-[#18113E] border border-purple-brand/25 text-sm rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-[#7B3FE4] text-white font-sans mt-0"
                    id="form-state"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-300 font-display">Zip / Postal *</label>
                  <input 
                    type="text"
                    required
                    value={formData.zipPostalCode}
                    onChange={(e) => setFormData({ ...formData, zipPostalCode: e.target.value })}
                    placeholder="Zip"
                    className="w-full bg-[#18113E] border border-purple-brand/25 text-sm rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-[#7B3FE4] text-white font-sans mt-0"
                    id="form-zip"
                  />
                </div>
              </div>

              {/* Billing Address Confirmation Checkbox */}
              <div className="pt-2">
                <label className="flex items-start space-x-2.5 cursor-pointer text-xs text-gray-300 font-sans select-none">
                  <input 
                    type="checkbox"
                    required
                    checked={formData.billingAddressConfirmed}
                    onChange={(e) => setFormData({ ...formData, billingAddressConfirmed: e.target.checked })}
                    className="mt-0.5 rounded border-purple-brand text-purple-brand focus:ring-purple-brand cursor-pointer"
                  />
                  <span className="text-left leading-relaxed">
                    I officially confirm that this permanent address corresponds to my verified financial bank records, card direct billing details, and courier dispatch receipts.
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Stepper controls */}
          <div className="flex justify-between pt-6 border-t border-purple-brand/10">
            <button
              onClick={() => onStepChange(1)}
              type="button"
              className="px-6 py-3 border border-white/5 bg-white/5 hover:bg-white/10 text-gray-200 rounded-xl font-semibold flex items-center space-x-2 transition-all"
              id="step2-back-btn"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-purple-brand to-purple-glow hover:brightness-110 text-white font-bold font-display rounded-xl flex items-center space-x-2 shadow-lg cursor-pointer"
              id="step2-continue-submit"
            >
              <span>Continue to Uploads</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>
      )}

      {/* =====================================
          STEP 3: SECURE DEPLOYMENT UPLOADS
          ===================================== */}
      {activeStep === 3 && (
        <div className="bg-[#110A2E] border-2 border-purple-brand/30 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl" id="step3-uploads-card">
          
          <div className="space-y-1.5 border-b border-purple-brand/10 pb-4">
            <h3 className="font-display font-black text-xl text-white">Upload Required Documents</h3>
            <p className="text-xs text-gray-400">
              Drag-and-drop or select verification files directly from your workspace. Only clear PDF, JPG, PNG under 5MB are processed correctly.
            </p>
          </div>

          {/* If there was a previous rejection, highlight correction alert */}
          {application && application.status === 'REJECTED' && (
            <div className="p-4 bg-rose-500/10 border-2 border-rose-500/40 text-rose-300 rounded-xl space-y-1.5 flex items-start space-x-3 text-xs leading-relaxed" id="decline-correction-banner">
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block text-sm">Correction Directed:</strong>
                User registration has declined: <em className="text-white block font-semibold font-mono border-l-2 border-rose-500 pl-2 py-0.5 mt-1 bg-rose-500/5">{application.rejectionReason}</em>
                <span className="text-xs text-gray-300 block mt-2">Replace files marked with warning markers and co-sign the refreshed stakes agreement to re-submit compliance packet.</span>
              </div>
            </div>
          )}

          {/* 4 Files Upload Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="upload-grid-slots">
            {selectedCountry.documents.map((doc, idx) => {
              const fileInfo = uploadedFiles[doc.id];
              const progress = uploadProgress[doc.id] || 0;
              const uploadActive = isUploading[doc.id];
              const isRejectedSlot = application?.status === 'REJECTED' && 
                (application.rejectionReason?.toLowerCase().includes(doc.id.replace('_', ' ')) || 
                 application.rejectionReason?.toLowerCase().includes(doc.name.toLowerCase()));

              return (
                <div 
                  key={doc.id}
                  className={`p-5 rounded-xl border-2 transition-all relative flex flex-col justify-between min-h-48 text-left ${
                    isRejectedSlot ? 'border-amber-500/55 bg-[#251214]' :
                    fileInfo ? 'border-emerald-500/40 bg-emerald-500/5' :
                    'border-purple-brand/15 hover:border-purple-brand/40 bg-[#160E36]/30'
                  }`}
                  id={`upload-zone-${doc.id}`}
                >
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono uppercase bg-purple-dark px-2 py-0.5 rounded border border-white/5">
                        Document {idx + 1}
                      </span>
                      {isRejectedSlot && (
                        <span className="text-[9px] uppercase font-mono bg-[#E05B13] text-white px-1.5 py-0.5 rounded flex items-center space-x-1 font-bold animate-pulse">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Correction Needed</span>
                        </span>
                      )}
                    </div>
                    
                    <h4 className="font-display font-semibold text-sm text-white">{doc.name}</h4>
                    <p className="text-[11px] text-gray-400 font-sans leading-relaxed">{doc.description}</p>
                  </div>

                  {/* Dynamic interactive loading indicator or file data or trigger zone */}
                  <div className="mt-4">
                    {uploadActive ? (
                      /* Live Progress Bar indicator */
                      <div className="space-y-2">
                        <div className="flex justify-between text-[11px] font-mono text-purple-glow">
                          <span className="flex items-center space-x-1.5">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Encrypting payload...</span>
                          </span>
                          <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-[#0E0927] rounded-full h-1.5 overflow-hidden">
                          <div className="bg-purple-brand h-1.5 transition-all" style={{ width: `${progress}%` }}></div>
                        </div>
                      </div>
                    ) : fileInfo ? (
                      /* File Completed State template */
                      <div className="p-2.5 bg-[#0D082A] border border-emerald-500/20 rounded-lg flex items-center justify-between">
                        <div className="flex items-center space-x-2 truncate">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <div className="truncate text-left leading-none">
                            <span className="text-xs text-white block truncate">{fileInfo.fileName}</span>
                            <span className="text-[9px] text-gray-500 font-mono mt-0.5 inline-block">{fileInfo.size} • Safe Sandbox Enclave</span>
                          </div>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => handleDeleteUploadedFile(doc.id)}
                          className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-colors shrink-0"
                          title="Delete File"
                          id={`delete-doc-${doc.id}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      /* Blank upload click-trigger template */
                      <button
                        type="button"
                        onClick={() => handleSimulateUpload(doc.id)}
                        className="w-full py-4 px-3 bg-[#0C0823]/60 hover:bg-[#1A1248]/50 border-2 border-dashed border-purple-brand/20 hover:border-purple-brand/40 text-gray-400 rounded-xl flex flex-col items-center justify-center space-y-1.5 transition-all outline-none text-center"
                        id={`btn-trigger-upload-${doc.id}`}
                      >
                        <Upload className="w-5 h-5 text-purple-glow" />
                        <span className="text-xs font-semibold text-purple-glow font-display">Click to Select Documents</span>
                        <span className="text-[10px] text-gray-500">Supports PDF, JPG, PNG</span>
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

          {/* SLA validation checks note */}
          <div className="p-3 bg-purple-brand/5 border border-purple-brand/10 text-gray-400 text-[11px] leading-relaxed rounded-lg flex items-center space-x-2 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Telemetry integrity audited securely to protect against spoofing. Double file-hash layers apply immediately.</span>
          </div>

          {/* Controls */}
          <div className="flex justify-between pt-4 border-t border-purple-brand/10">
            <button
              onClick={() => onStepChange(2)}
              type="button"
              className="px-6 py-3 border border-white/5 bg-white/5 hover:bg-white/10 text-gray-200 rounded-xl font-semibold flex items-center space-x-2 transition-all"
              id="step3-back-btn"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleStep3Continue}
              type="button"
              className="px-8 py-3 bg-gradient-to-r from-purple-brand to-purple-glow hover:brightness-110 text-white font-bold font-display rounded-xl flex items-center space-x-2 shadow-lg"
              id="step3-continue-btn"
            >
              <span>Continue to agreement</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* =====================================
          STEP 4: SCROLL-LOCKED STAKING AGREEMENT
          ===================================== */}
      {activeStep === 4 && (
        <div className="bg-[#110A2E] border-2 border-purple-brand/35 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative" id="step4-lock-card">
          
          <div className="space-y-1.5 border-b border-purple-brand/10 pb-4">
            <h3 className="font-display font-black text-xl text-white">Consensual Delegation Legal Agreement</h3>
            <p className="text-xs text-gray-400">
              Please scroll carefully to the literal bottom of this lockup contract in order to activate compliance signature fields.
            </p>
          </div>

          {/* Scollable Terms Box with scroll lock trigger */}
          <div 
            ref={termsContainerRef}
            onScroll={handleTermsScroll}
            className="w-full h-64 bg-[#080516] border border-purple-brand/20 p-5 rounded-xl overflow-y-auto text-xs space-y-3 font-mono text-gray-400 select-text leading-relaxed whitespace-pre"
            id="terms-scroll-pane"
          >
            {LEGAL_TERMS_TEXT}
          </div>

          <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono">
            <span>Scroll Status: {termsScrolledEnd ? '✅ READ COMPLETE' : '⏳ PLS SCROLL TO BOTTOM TO READ'}</span>
            <span>Registration: MATIC-MEP-EMPOWER-2026</span>
          </div>

          {/* Pop-out green signature card if scrolled to bottom */}
          {termsScrolledEnd ? (
            <div className="p-5 sm:p-6 bg-emerald-500/5 border-2 border-emerald-500/35 rounded-xl space-y-4 animate-fadeIn" id="terms-unlocked-signature-zone">
              <div className="flex items-center space-x-2 text-emerald-400 font-display font-black text-sm uppercase">
                <CheckCircle2 className="w-5 h-5" />
                <span>Signature Segment Certified Unlock</span>
              </div>
              <p className="text-[11px] text-gray-300 font-sans leading-relaxed">
                By entering your full name, you execute a legally binding signature co-signing this allocation ledger. An immutable cryptographic signature verification hash token maps directly to your country tax node immediately.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-emerald-400 font-semibold font-display">Enter Full Legal Name (Signature) *</label>
                  <input 
                    type="text"
                    required
                    value={signatureName}
                    onChange={(e) => setSignatureName(e.target.value)}
                    placeholder="Johnathan Quincy Doe"
                    className="w-full bg-[#0C0821] border border-emerald-500/35 text-xs sm:text-sm rounded-lg px-3.5 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans mt-0"
                    id="signature-input-field"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-400 block font-display">Biometric Verification Hash</label>
                  <div className="p-2.5 bg-[#0A061C] border border-white/5 text-gray-500 rounded-lg text-[10px] font-mono select-all truncate leading-none mt-1">
                    SHA-256: af72b036ceee{signatureName ? signatureName.length * 4015 : '8942'}fbae2341d84f3
                  </div>
                </div>
              </div>

              {/* Checkbox agreement */}
              <div className="space-y-4 pt-2 border-t border-[#8247E5]/20">
                <label className="flex items-start space-x-3 cursor-pointer select-none" id="agree-checkbox-label">
                  <input 
                    type="checkbox"
                    checked={agreedCheck}
                    onChange={(e) => setAgreedCheck(e.target.checked)}
                    className="w-4 h-4 bg-emerald-500 text-emerald-600 rounded mt-0.5 border-emerald-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    id="agree-checkbox"
                  />
                  <span className="text-[11px] text-gray-300 font-sans leading-relaxed">
                    I co-sign and declare that I understand the 10% instant payout structures and verify that 90% core staking asset holds lockup limitations through Polygon PoS validations cycle.
                  </span>
                </label>

                {/* Powerful Government & Criminal liability co-signing banner */}
                <div className="p-4 bg-rose-500/5 rounded-xl border border-rose-500/35 space-y-3 font-mono text-[11px] text-gray-300 leading-relaxed text-left">
                  <span className="text-[10px] text-rose-400 font-bold block tracking-wider">
                     ⚠️ FEDERAL CRIMINAL LIABILITY CO-SIGN &amp; GOVERNANCE AGREEMENT:
                  </span>
                  
                  <div className="italic text-gray-200 border-l-2 border-rose-500 pl-3 leading-normal">
                    &ldquo;I, <strong className="text-white uppercase not-italic font-black underline">{signatureName || '_________________'}</strong>, have signed and agreed that if anything, if I decide to run away with this money, with the Polygon empowerment money, or if I try to scam them, that the government should hold me fully accountable for this. And I know, and I agree and I accept that the Polygon Empowerment Consortium handles my details. I will face the police and I will face the jail. Jail time and the full consequences of the fraudulent offenses.&rdquo;
                  </div>

                  <label className="flex items-start space-x-3 cursor-pointer select-none pt-2" id="gov-agree-checkbox-label">
                    <input 
                      type="checkbox"
                      checked={govAgreedCheck}
                      onChange={(e) => setGovAgreedCheck(e.target.checked)}
                      className="w-4 h-4 bg-rose-500 text-rose-600 rounded mt-0.5 border-rose-500 focus:ring-0 focus:ring-offset-0 cursor-pointer shrink-0"
                      id="gov-agree-checkbox"
                    />
                    <span className="text-[10px] text-gray-300 font-sans leading-normal font-medium">
                      I co-sign and solemnly swear that the above declaration is legally binding, and I consent to instant federal prosecution, police arrest, and 10 years imprisonment for any attempted fraud.
                    </span>
                  </label>
                </div>
              </div>

            </div>
          ) : (
            /* locked prompt */
            <div className="p-4 bg-purple-brand/5 border border-purple-brand/10 text-gray-400 text-xs rounded-xl flex items-center justify-center space-x-2 font-mono">
              <Loader2 className="w-4 h-4 animate-spin text-purple-glow shrink-0" />
              <span>Please scroll the Partnership Agreement box to bottom to unlock legal signature modules.</span>
            </div>
          )}

          {/* Stepper actions */}
          <div className="flex justify-between pt-4 border-t border-purple-brand/10">
            <button
              onClick={() => onStepChange(3)}
              type="button"
              className="px-6 py-3 border border-white/5 bg-white/5 hover:bg-white/10 text-gray-200 rounded-xl font-semibold flex items-center space-x-2 transition-all"
              id="step4-back-btn"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleStep4FinalizeSubmit}
              type="button"
              disabled={!termsScrolledEnd || !signatureName.trim() || !agreedCheck || !govAgreedCheck}
              className={`px-8 py-3 rounded-xl font-bold font-display flex items-center space-x-2 transition-all text-sm ${
                termsScrolledEnd && signatureName.trim() && agreedCheck && govAgreedCheck
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer'
                  : 'bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed'
              }`}
              id="finalize-legal-submission"
            >
              <span>SIGN &amp; FINALIZE APPLICATION</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* =====================================
          STEP 5: LIVE Review / SLA TRACKER
          ===================================== */}
      {activeStep === 5 && (
        <div className="bg-[#110A2E] border-2 border-purple-brand/35 rounded-2xl p-6 sm:p-8 space-y-8 shadow-2xl" id="step5-tracker-card">
          
          {/* Status mapping */}
          {(!application || application.status === 'PENDING' || application.status === 'UNDER_REVIEW') && (
            /* PENDING PANE */
            <div className="space-y-6 animate-fadeIn" id="pane-status-pending">
              
              <div className="flex flex-col items-center justify-center text-center space-y-3.5 border-b border-purple-brand/10 pb-6">
                <div className="relative flex items-center justify-center w-16 h-16 bg-amber-500/10 rounded-full border border-amber-500/35 animate-pulse shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                  <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                </div>
                
                <div>
                  <span className="text-[10px] font-mono uppercase bg-amber-500/15 text-amber-500 px-3 py-1 rounded inline-block border border-amber-500/25">
                    PENDING COMPLIANCE AUDIT
                  </span>
                  <h3 className="font-display font-black text-2xl text-white mt-1.5 leading-none">
                    Security Enclave Review Active
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Application ID: MEP-NODE-{signatureName ? signatureName.length * 849 : '2849'}-US</p>
                </div>
              </div>

              {/* Live Count countdown clock ticker */}
              <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto text-center p-4 bg-[#140E31] border border-purple-brand/20 rounded-xl">
                <div>
                  <p className="text-2xl font-black font-mono text-white tracking-widest leading-none">
                    0{timeLeft.hours}
                  </p>
                  <span className="text-[9px] text-gray-400 font-mono block mt-1 uppercase">Hours</span>
                </div>
                <div>
                  <p className="text-2xl font-black font-mono text-white tracking-widest leading-none">
                    {timeLeft.minutes < 10 ? `0${timeLeft.minutes}` : timeLeft.minutes}
                  </p>
                  <span className="text-[9px] text-gray-400 font-mono block mt-1 uppercase">Min</span>
                </div>
                <div>
                  <p className="text-2xl font-black font-mono text-amber-500 tracking-widest leading-none">
                    {timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}
                  </p>
                  <span className="text-[9px] text-amber-400 font-mono block mt-1 uppercase">Sec Left</span>
                </div>
              </div>

              <p className="text-center text-xs text-gray-300 max-w-lg mx-auto leading-relaxed">
                Our standard SLA takes up to 72 hours max. Your SSN index lookup is currently queueing alongside validation metrics. No manual user steps remain!
              </p>

              {/* Progress diagnostic checking list */}
              <div className="p-4 bg-purple-dark/50 border border-purple-brand/20 rounded-xl space-y-3 max-w-md mx-auto">
                <span className="text-[10px] font-mono text-purple-glow font-bold uppercase tracking-wider block mb-1">Queue Audit Progress checklist</span>
                
                <div className="flex items-center justify-between text-xs text-gray-300 font-sans">
                  <span className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Hashed biometric signature verified</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">PASSED</span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-300 font-sans">
                  <span className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 text-amber-500 animate-spin shrink-0" />
                    <span>Regional Address residency crosschecking</span>
                  </span>
                  <span className="text-[10px] font-mono text-amber-500 animate-pulse">QUEUED</span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-300 font-sans">
                  <span className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 text-amber-500 animate-spin shrink-0" />
                    <span>Government matched SSN/Tax index</span>
                  </span>
                  <span className="text-[10px] font-mono text-amber-500 animate-pulse">QUEUED</span>
                </div>
              </div>

            </div>
          )}

          {application && application.status === 'APPROVED' && (
            /* APPROVED CELEBRATORY PANE */
            <div className="space-y-6 animate-fadeIn" id="pane-status-approved">
              
              <div className="flex flex-col items-center justify-center text-center space-y-3.5 border-b border-purple-brand/10 pb-6">
                {/* Micro sparks decorative background */}
                <div className="relative flex items-center justify-center w-20 h-20 bg-emerald-500/10 rounded-full border-2 border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.30)]">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-brand rounded-full flex items-center justify-center text-[10px] text-white animate-bounce" title="Delegated Staking Core Online">1</div>
                </div>
                
                <div className="space-y-1">
                  <span className="inline-flex bg-emerald-500/15 text-emerald-400 font-mono text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-500/25">
                    NODE ELIGIBILITY APPROVED &amp; ACTIVE
                  </span>
                  <h3 className="font-display font-black text-2xl sm:text-3xl text-white">
                    Program Payout Disbursed
                  </h3>
                  <p className="text-xs text-gray-400 font-mono">Ledger Certificate: MEP-CERT-{signatureName ? signatureName.length * 30 + 1928 : '9284'}-US</p>
                </div>
              </div>

              {/* Certified allocation overview */}
              <div className="max-w-xl mx-auto space-y-4">
                
                {/* 10% Cash/Card Payout dynamic dashboard selection */}
                {application.selectedDisbursementMethod === 'PAYCARD' ? (
                  /* PREMIUM PAYCARD LAYOUT AND SECURE DETAILS */
                  <div className="p-5 bg-[#120D2F] border-2 border-purple-glow/45 rounded-xl text-left space-y-4 animate-fadeIn">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono text-purple-glow uppercase tracking-widest font-extrabold block">Card Dispatch Status: DISBURSED</span>
                        <p className="text-xl font-bold font-display text-white mt-1">
                          ${(fundingAmount * 0.10).toLocaleString()} USD Cash Loaded
                        </p>
                      </div>
                      <span className="bg-[#2563EB] text-white font-mono text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded">
                        {application.cardBrandingType === 'FINANCIAL_ACCESS' ? 'Financial Access Card' :
                         application.cardBrandingType === 'DIGITAL_PAYCARD' ? 'Digital PayCard' : 'Digital Payroll Card'}
                      </span>
                    </div>

                    {/* Credit Card Mockup UI */}
                    <div className="relative mx-auto w-full max-w-[340px] aspect-[1.586/1] rounded-2xl bg-gradient-to-br from-[#1F1049] via-[#0D0524] to-[#2563EB]/40 border border-white/20 p-5 shadow-[0_12px_24px_rgba(0,0,0,0.5)] flex flex-col justify-between overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-brand/25 rounded-full blur-2xl"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#3B82F6]/25 rounded-full blur-xl"></div>
                      
                      {/* Top Bar: Chip & Card Type */}
                      <div className="flex justify-between items-start z-10">
                        {/* Brass Chip */}
                        <div className="w-9 h-7 bg-gradient-to-br from-[#F59E0B]/80 to-[#D97706]/85 rounded-md border border-amber-400/40 relative overflow-hidden flex items-center justify-center">
                          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-40">
                            {Array.from({ length: 9 }).map((_, i) => (
                              <div key={i} className="border-[0.5px] border-black/30"></div>
                            ))}
                          </div>
                        </div>

                        {/* Co-branding Logo */}
                        <div className="text-right flex items-center space-x-1.5">
                          <div className="w-4 h-4 rounded-full bg-purple-brand opacity-80 shrink-0"></div>
                          <span className="text-[9px] font-mono tracking-tight text-white font-black">POLYGON PORTAL</span>
                        </div>
                      </div>

                      {/* Card Number */}
                      <div className="text-base sm:text-lg font-mono text-white tracking-[0.2em] font-medium z-10 text-left my-2 select-all">
                        {application.payCardNumber || '4111 2300 1284 9284'}
                      </div>

                      {/* Bottom row: Holder name / Expiry */}
                      <div className="flex justify-between items-end z-10">
                        <div className="text-left max-w-[70%]">
                          <span className="text-[8px] font-sans text-gray-400 block uppercase tracking-wider">Cardholder Beneficiary</span>
                          <span className="text-xs font-mono text-white font-bold truncate block">{application.fullName}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[8px] font-sans text-gray-400 block uppercase tracking-wider">Expires</span>
                          <span className="text-xs font-mono text-white font-bold block">05/31</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Activation, Security Codes, and Policies Info Box */}
                    <div className="p-3.5 bg-[#09051C] border border-[#22C55E]/15 rounded-lg space-y-2 text-xs leading-relaxed font-sans text-left">
                      <div className="flex justify-between border-b border-white/5 pb-1.5 text-[10.5px] font-mono uppercase font-bold text-emerald-400">
                        <span>Card Activation Key:</span>
                        <span className="text-white">PIN SECURELY MAILED</span>
                      </div>
                      
                      <p className="text-[11px] text-gray-300">
                        💡 <strong>Activation Code Protocol:</strong> Your private activation security PIN has been transmitted to your verified mobile <strong>{application.phone}</strong> and email registry. To activate this co-branded credit instrument instantly:
                      </p>
                      
                      <ul className="list-decimal list-inside text-[10.5px] text-gray-400 pl-1 space-y-1">
                        <li>Log into your personal secure mobile device registry portal.</li>
                        <li>Submit your OTP authentication trigger inside the wallet application.</li>
                        <li>Or dispatch verification requests directly to customer service: <em className="text-white not-italic font-semibold underline">support@polygon-network.org</em></li>
                      </ul>

                      <div className="pt-2 border-t border-white/5 text-[10.5px] text-gray-400 space-y-1">
                        <p>🛡️ <strong>Fraud &amp; Support Safeguard:</strong> This co-branded payroll instrument is shielded under standard $0 Fraud Liability. Our active identity matching engines crosscheck background hardware variables dynamically to repel identity fraud.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ORIGINAL PREMIUM PHYSICAL CHEQUE DETAILS */
                  <div className="p-5 bg-[#120D2F] border-2 border-emerald-500/35 rounded-xl text-left">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">Payout Status: DISBURSED</span>
                        <p className="text-xl font-bold font-display text-white mt-1">
                          ${(fundingAmount * 0.10).toLocaleString()} USD Cash
                        </p>
                      </div>
                      <span className="bg-emerald-500 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                        Cheque Issued
                      </span>
                    </div>
                    
                    {/* Cheque details from simulation */}
                    <div className="mt-3.5 p-3 bg-[#0A061F] border border-[#22C55E]/20 rounded-lg text-xs font-mono space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-500">certified cheque serial:</span>
                        <span className="text-white font-bold">{application.chequeNumber || 'POL-CHQ-192834-US'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">disbursement method:</span>
                        <span className="text-emerald-400">Postal Registered Mail Cheque</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-gray-400 mt-1 border-t border-white/5 pt-1">
                        <span>Recipient Registry:</span>
                        <span>{application.fullName}</span>
                      </div>
                    </div>
                    
                    <p className="text-[10px] text-gray-400 mt-2.5 leading-relaxed leading-normal">
                      Check dispatched under priority courier. Average duration to domestic mailbox resides between 48 and 72 hours. Our financial support network is active to support validation at: <em className="text-white not-italic font-mono font-bold">support@polygon-network.org</em>
                    </p>
                  </div>
                )}

                {/* 90% MATIC delegated core */}
                <div className="p-5 bg-[#17103C] border border-purple-brand/25 rounded-xl text-left">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono text-purple-glow uppercase tracking-widest font-medium">Delegation Status: DELEGATED &amp; EARNING</span>
                      <p className="text-lg font-bold font-display text-white mt-1">
                        ${(fundingAmount * 0.90).toLocaleString()} USD Core Staking
                      </p>
                      <p className="text-sm font-semibold font-mono text-purple-glow">
                        {((fundingAmount * 0.90) / 0.50).toLocaleString()} MATIC
                      </p>
                    </div>
                    <span className="bg-purple-brand/35 text-purple-glow font-mono text-[10px] px-2 py-0.5 rounded border border-purple-brand/20">
                      POL Validator
                    </span>
                  </div>

                  {/* On-chain Transaction hash from simulation */}
                  <div className="mt-4 pt-3 border-t border-white/5 font-mono text-xs space-y-1">
                    <div className="flex justify-between items-baseline gap-2">
                      <span className="text-gray-500 text-[10px] shrink-0">Staking Tx Ledger:</span>
                      <span className="text-gray-300 truncate text-[10px] select-all tracking-tight cursor-copy underline decoration-dotted" title="Copy Staking Transaction Hash">
                        {application.approvalTxHash || '0x7b3f021e89fbae2341d84f3eec48aa21bb3421bb'}
                      </span>
                    </div>
                    <div className="flex justify-between mt-1 text-[11px] text-purple-glow border-t border-white/5 pt-1">
                      <span>Est. Monthly Reward yield:</span>
                      <span className="font-semibold text-emerald-400">~ ${(fundingAmount * 0.90 * 0.085).toLocaleString()} / month</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {application && application.status === 'REJECTED' && (
            /* REJECTED CORRECTION INITIATION PANE */
            <div className="space-y-6 animate-fadeIn" id="pane-status-rejected">
              
              <div className="flex flex-col items-center justify-center text-center space-y-3 border-b border-purple-brand/10 pb-6">
                <div className="relative flex items-center justify-center w-16 h-16 bg-rose-500/10 rounded-full border-2 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.15)] animate-shake">
                  <AlertTriangle className="w-8 h-8 text-rose-500" />
                </div>
                
                <div>
                  <span className="text-[10px] font-mono uppercase bg-rose-500/10 text-rose-400 px-3 py-1 rounded inline-block border border-rose-500/20">
                    COMPLIANCE CORRECTION DIRECTIVE
                  </span>
                  <h3 className="font-display font-black text-2xl text-white mt-1.5 leading-none">
                    Revision Mandated By Auditor
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Application Registry MEP-{signatureName ? signatureName.length * 300 : '283a'}</p>
                </div>
              </div>

              {/* Error summary and explainer */}
              <div className="max-w-md mx-auto p-5 bg-[#1C1123] border border-rose-500/20 rounded-xl text-left space-y-3">
                <div className="flex items-center space-x-2 text-rose-300 font-display font-medium text-xs uppercase font-bold">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <span>Administrative Audit Flag</span>
                </div>
                
                <p className="text-[11px] sm:text-xs text-gray-300 leading-relaxed font-mono bg-rose-950/20 border-l-2 border-rose-500 p-2 text-white">
                  "{application.rejectionReason || 'Uploaded Residency proof exceeds 60-day threshold.'}"
                </p>

                <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                  Don't worry, your node registration has not been permanently disqualified. Sponsoring reserves remain held in escrow. Simply click the corrective action button below to replace the flagged document and resend your registration.
                </p>
              </div>

              {/* Correct action button */}
              <button
                type="button"
                onClick={handleRestartKycFlow}
                className="w-full sm:w-auto px-8 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold font-display rounded-xl tracking-wide shadow-lg shadow-rose-500/20 transition-all text-xs"
                id="correct-and-reupload-btn"
              >
                REPLACE FLAGGED DOCUMENT NOW
              </button>

            </div>
          )}

          {/* Core tracker buttons */}
          <div className="flex justify-center pt-4 border-t border-purple-brand/10">
            <button
              onClick={() => {
                localStorage.removeItem('mep_application_data');
                onUpdateApplication(null);
                onStepChange(1);
              }}
              type="button"
              className="text-xs text-gray-400 hover:text-white transition-colors"
              id="tracker-reset-btn"
            >
              Reset Application &amp; Form Data
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
