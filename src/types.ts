/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CountryCode = 'US' | 'GB' | 'CA' | 'DE' | 'AU' | 'NL' | 'CN' | 'FR' | 'ES' | 'IT' | 'SE' | 'NO' | 'CH' | 'IE' | 'BE' | 'AT' | 'SG' | 'JP' | 'KR' | 'AE' | 'NZ' | 'OT';

export interface RequiredDocument {
  id: string;
  name: string;
  description: string;
}

export interface CountryConfig {
  code: CountryCode;
  name: string;
  fullName: string;
  flag: string;
  taxIdLabel: string;
  taxIdPlaceholder: string;
  extraTaxNotes: string;
  documents: RequiredDocument[];
}

export type KycStep = 1 | 2 | 3 | 4 | 5;

export interface ApplicationData {
  country: CountryCode;
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  address: string;
  city: string;
  stateProvince: string;
  zipPostalCode: string;
  taxId: string;
  
  // Financial access / customized fields
  billingAddressConfirmed: boolean;
  corporateEmploymentStatus: string;
  phoneVerified: boolean;
  emailVerified: boolean;
  selectedDisbursementMethod: 'CHECK' | 'PAYCARD';
  cardBrandingType?: 'PAYROLL' | 'FINANCIAL_ACCESS' | 'DIGITAL_PAYCARD';
  
  documentsUploaded: Record<string, { fileName: string; size: string; uploadedAt: string }>;
  signatureName: string;
  signatureDate: string;
  sha256SignatureHash: string;
  status: 'NOT_STARTED' | 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  submittedAt?: string;
  rejectionReason?: string;
  approvalTxHash?: string;
  chequeNumber?: string;
  payCardNumber?: string; // New: masked card token
  fundingDisbursed?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'advisor';
  text: string;
  timestamp: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export interface HowItWorksStep {
  number: number;
  title: string;
  description: string;
  bulletPoints: string[];
}

export interface BenefitItem {
  title: string;
  description: string;
  badge?: string;
}
