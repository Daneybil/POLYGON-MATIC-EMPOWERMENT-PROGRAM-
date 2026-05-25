/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, CheckCircle2, Wallet, Lock, ShieldCheck, TrendingUp, 
  Coins, ArrowRight, Loader2, Calendar, DollarSign, Globe, Sparkles, 
  HelpCircle, Info, Percent, Smartphone, Send, Check, Truck, Cpu,
  FileText, ShieldAlert, CheckSquare, SmartphoneIcon, Camera, AlertOctagon
} from 'lucide-react';
import { ApplicationData } from '../types';

interface DisbursementProps {
  application: ApplicationData | null;
  fundingAmount: number;
  onViewChange: (view: string) => void;
}

export default function Disbursement({ application, fundingAmount, onViewChange }: DisbursementProps) {
  // Simulator state if they aren't approved yet
  const [demoAmount, setDemoAmount] = useState<number>(fundingAmount || 100000);
  const [activeTab, setActiveTab] = useState<'info' | 'dashboard'>('info');

  const [maticLivePrice, setMaticLivePrice] = useState<number>(0.3850);
  const [isLivePriceLoading, setIsLivePriceLoading] = useState<boolean>(true);
  
  // Custom compliance states for strict card rules
  const [hasAcceptedRules, setHasAcceptedRules] = useState<boolean>(false);
  const [rulesError, setRulesError] = useState<string>('');

  // Fetch live MATIC price
  const fetchPrice = async () => {
    setIsLivePriceLoading(true);
    try {
      // CoinGecko
      const cgResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=polygon-ecosystem-token&vs_currencies=usd');
      if (cgResponse.ok) {
        const cgData = await cgResponse.json();
        if (cgData && cgData['polygon-ecosystem-token'] && typeof cgData['polygon-ecosystem-token'].usd === 'number') {
          setMaticLivePrice(cgData['polygon-ecosystem-token'].usd);
          setIsLivePriceLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn('CoinGecko failed in Disbursement, trying Binance', e);
    }

    try {
      // Binance POLUSDT (highly reliable)
      const binResponse = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=POLUSDT');
      if (binResponse.ok) {
        const binData = await binResponse.json();
        if (binData && binData.price) {
          setMaticLivePrice(parseFloat(binData.price));
          setIsLivePriceLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Binance POLUSDT ticker failed, trying CryptoCompare', e);
    }

    try {
      const r = await fetch('https://min-api.cryptocompare.com/data/price?fsym=MATIC&tsyms=USD');
      const d = await r.json();
      if (d && d.USD) {
        setMaticLivePrice(d.USD);
      }
    } catch (e) {
      console.warn('Fallback to standard rate due to API connectivity', e);
    } finally {
      setIsLivePriceLoading(false);
    }
  };

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 45000);
    return () => clearInterval(interval);
  }, []);

  // Calculations
  const actualFunding = application && application.status === 'APPROVED' ? fundingAmount : demoAmount;
  const payout10Percent = actualFunding * 0.10;
  const staking90Percent = actualFunding * 0.90;
  const totalStakedTokens = staking90Percent / maticLivePrice;
  const rewardRate = 0.10; // Exactly 10% monthly yield as requested
  const monthlyYieldUSD = staking90Percent * rewardRate;
  const monthlyYieldTokens = monthlyYieldUSD / maticLivePrice;

  // Synchronized wallet states and claim handshake verification states
  const [walletConnectState, setWalletConnectState] = useState<'DISCONNECTED' | 'CONNECTING' | 'CONNECTED'>('DISCONNECTED');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [manualAddressInput, setManualAddressInput] = useState<string>('');
  const [searchFailed, setSearchFailed] = useState<boolean>(false);
  const [searchSuccess, setSearchSuccess] = useState<boolean>(false);

  // Security Verification Handshake Payout variables
  const [showPayoutVerification, setShowPayoutVerification] = useState<boolean>(false);
  const [smsVerificationCode, setSmsVerificationCode] = useState<string>('');
  const [verificationError, setVerificationError] = useState<string>('');

  // Sandbox dashboard interactions
  const [unclaimedYield, setUnclaimedYield] = useState<number>(monthlyYieldUSD * 0.15);
  const [payoutsHistory, setPayoutsHistory] = useState([
    { id: 'tx-001', date: 'May 01, 2026', type: 'Monthly Stake Payout', amount: monthlyYieldUSD, status: 'PAID', method: 'Payroll Credit Card' },
    { id: 'tx-002', date: 'April 01, 2026', type: 'Monthly Stake Payout', amount: monthlyYieldUSD, status: 'PAID', method: 'Payroll Credit Card' },
    { id: 'tx-003', date: 'March 01, 2026', type: 'Monthly Stake Payout', amount: monthlyYieldUSD, status: 'PAID', method: 'Physical Check' }
  ]);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawalSuccess, setWithdrawalSuccess] = useState(false);

  // Sync wallet on mount & listen to localStorage mutations (realtime updates)
  useEffect(() => {
    const cachedWallet = localStorage.getItem('mep_active_wallet');
    const cachedWalletType = localStorage.getItem('mep_active_wallet_type');
    if (cachedWallet && cachedWalletType) {
      setWalletAddress(cachedWallet);
      setSelectedWallet(cachedWalletType);
      setWalletConnectState('CONNECTED');
    }
  }, [activeTab]);

  const handleConnectWeb3 = (walletType: string) => {
    setWalletConnectState('CONNECTING');
    setSelectedWallet(walletType);
    setTimeout(() => {
      const randomHex = Math.floor(Math.random() * 1e16).toString(16);
      const address = `0x71C${randomHex.toUpperCase()}49A1`;
      setWalletAddress(address);
      setWalletConnectState('CONNECTED');
      localStorage.setItem('mep_active_wallet', address);
      localStorage.setItem('mep_active_wallet_type', walletType);
      localStorage.setItem('mep_active_wallet_balance', '250000');
    }, 1200);
  };

  const handleDisconnectWeb3 = () => {
    setWalletConnectState('DISCONNECTED');
    setWalletAddress('');
    setSelectedWallet('');
    localStorage.removeItem('mep_active_wallet');
    localStorage.removeItem('mep_active_wallet_type');
    localStorage.removeItem('mep_active_wallet_balance');
  };

  const handleManualLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualAddressInput.trim() || !manualAddressInput.startsWith('0x')) {
      setSearchFailed(true);
      setSearchSuccess(false);
      return;
    }
    setWalletConnectState('CONNECTING');
    setTimeout(() => {
      setWalletAddress(manualAddressInput.trim());
      setSelectedWallet('Indexed Public Registry');
      setWalletConnectState('CONNECTED');
      setSearchFailed(false);
      setSearchSuccess(true);
      localStorage.setItem('mep_active_wallet', manualAddressInput.trim());
      localStorage.setItem('mep_active_wallet_type', 'Indexed Public Registry');
    }, 1000);
  };

  const handleStartClaimFlow = () => {
    if (unclaimedYield <= 0) return;
    // Show security compliance verification handshake
    setShowPayoutVerification(true);
  };

  const handleVerifyAndClaimReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsVerificationCode.trim()) {
      setVerificationError('Handshake code cannot be left blank.');
      return;
    }
    setIsWithdrawing(true);
    setVerificationError('');
    
    setTimeout(() => {
      const newTx = {
        id: `tx-00${payoutsHistory.length + 1}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        type: 'On-Demand Claim Withdrawal',
        amount: unclaimedYield,
        status: 'PAID',
        method: application?.selectedDisbursementMethod === 'CHECK' ? 'Physical Check' : 'Payroll Credit Card'
      };
      setPayoutsHistory([newTx, ...payoutsHistory]);
      setUnclaimedYield(0);
      setIsWithdrawing(false);
      setWithdrawalSuccess(true);
      setShowPayoutVerification(false);
      setSmsVerificationCode('');
      setTimeout(() => setWithdrawalSuccess(false), 5000);
    }, 1800);
  };

  const verifyRulesCompliance = (tabName: 'info' | 'dashboard') => {
    if (!hasAcceptedRules) {
      setRulesError('You must review and accept the Payroll Credit Card regulations & verification procedures before accessing the staker console.');
      // Auto-scroll to rules section
      document.getElementById('rules-agreement-card')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setRulesError('');
      setActiveTab(tabName);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-12 text-left" id="disbursement-section">
      
      {/* Visual Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-purple-brand/10 pb-6 gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 bg-[#2563EB]/10 border border-[#2563EB]/35 rounded-full px-3 py-1 text-[11px] font-mono font-bold text-[#3B82F6] uppercase">
            <CreditCard className="w-3.5 h-3.5 animate-pulse" />
            <span>Fiduciary Liquidity &amp; Staking</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white leading-none">
            PAYMENT METHODS &amp; PAYCARD SPECIFICATIONS
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm max-w-3xl leading-relaxed font-sans">
            Understand how our regulated capital disbursement engine hooks into standard bank channels. We issue fully loaded physical <strong className="text-purple-glow">Payroll Credit Cards</strong> or dispatch certified financial paper checks directly to approved stakers.
          </p>
        </div>

        {/* Dynamic selector to simulation active dashboard or informational parameters */}
        <div className="flex bg-[#120B2F] border border-purple-brand/20 p-1.5 rounded-xl self-start font-mono text-xs shadow-md">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'info' 
                ? 'bg-purple-brand text-white shadow-lg' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Disbursement Specs &amp; Rules
          </button>
          
          <button
            onClick={() => verifyRulesCompliance('dashboard')}
            className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'dashboard' 
                ? 'bg-purple-brand text-white shadow-lg' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Staker Dashboard</span>
          </button>
        </div>
      </div>

      {rulesError && (
        <div className="p-4 bg-red-500/15 border-2 border-red-500/40 text-red-200 text-xs rounded-xl flex items-start space-x-3 shadow-lg animate-fadeIn">
          <AlertOctagon className="w-5.5 h-5.5 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold uppercase tracking-wider block">Compliance Protection Block</span>
            <p>{rulesError}</p>
          </div>
        </div>
      )}

      {activeTab === 'info' ? (
        <div className="space-y-12 animate-fadeIn">
          
          {/* Key Methods Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left side: Partnership assets */}
            <div className="lg:col-span-4 bg-gradient-to-br from-[#120A2F] to-[#0A051C] border-2 border-purple-brand/25 rounded-2xl p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-purple-brand/15 rounded-xl border border-purple-brand/30 flex items-center justify-center text-purple-glow">
                  <Globe className="w-6 h-6 animate-spin-slow" />
                </div>
                <h3 className="font-display font-black text-xl text-white">
                  Regulated Credit Desk Issuer
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed font-sans">
                  The MATIC Empowerment Initiative operates in compliance with international fiscal guidelines. We partner with federally insured financial institutions and leading credit network systems to distribute direct capital access credit cards worldwide.
                </p>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  By utilizing non-custodial capital bridges, participants enjoy direct, certified USD-equivalent liquidation on traditional fiat payment processors.
                </p>
              </div>

              <div className="pt-4 border-t border-purple-brand/10 space-y-2 text-[11px] font-mono text-gray-500">
                <div className="flex justify-between">
                  <span>Merchant Desk Credit Issuer:</span>
                  <span className="text-gray-300">Class-A Global Trust</span>
                </div>
                <div className="flex justify-between">
                  <span>Liquidity Escrow Hub:</span>
                  <span className="text-[#3B82F6]">Traditional Credit Gateway</span>
                </div>
              </div>
            </div>

            {/* Right side: Supported methods cards */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1: Payroll Credit Card */}
              <div className="p-6 bg-purple-card/15 border-2 border-purple-brand/25 hover:border-purple-brand/40 rounded-2xl flex flex-col justify-between space-y-6 transition-colors shadow-xl">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono uppercase bg-[#2563EB]/10 text-[#3B82F6] px-2.5 py-1 rounded border border-[#2563EB]/25 font-bold">
                      PROVISION METHOD A
                    </span>
                    <CreditCard className="w-6 h-6 text-[#3B82F6]" />
                  </div>
                  <h4 className="font-display font-black text-xl text-white uppercase tracking-tight">Payroll Credit Card (PayCard)</h4>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans">
                    Also recognized as our standard <strong>Financial Access Card</strong>, this physical credit asset provides immediate liquidity loading the approved node funds securely. 
                  </p>
                  <ul className="text-xs text-gray-400 space-y-2 font-sans">
                    <li className="flex items-start space-x-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Instant Withdrawal:</strong> Use at any standard merchant POS terminal, online, or ATM worldwide to withdraw your 10% cash share.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>High Limit Allowance:</strong> Up to $1,000,000 credit capacity depending on approved allocation tier.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Delivery Duration:</strong> Secured physical arrival at your registered mailbox address within <strong>1 to 7 working days</strong> max.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-3 bg-[#0E082B] border border-white/5 rounded-xl flex items-center justify-between text-[11px] font-mono">
                  <span className="text-purple-glow">Process Desk:</span>
                  <span className="text-white font-bold">Applied by us on your behalf</span>
                </div>
              </div>

              {/* Card 2: Physical Paper Check */}
              <div className="p-6 bg-[#120B2F]/45 border-2 border-purple-brand/25 hover:border-purple-brand/40 rounded-2xl flex flex-col justify-between space-y-6 transition-colors shadow-xl">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono uppercase bg-white/5 text-gray-400 px-2.5 py-1 rounded border border-white/10 font-bold">
                      PROVISION METHOD B
                    </span>
                    <Calendar className="w-6 h-6 text-purple-glow" />
                  </div>
                  <h4 className="font-display font-black text-xl text-white uppercase tracking-tight">Certified Paper Check</h4>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans">
                    A premium certified bank document, issued and printed under tracking seal directly to your residential domestic mailing address once KYC approval resolves.
                  </p>
                  <ul className="text-xs text-gray-400 space-y-2 font-sans">
                    <li className="flex items-start space-x-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Commercial Clearing:</strong> Deposit the check directly at any commercial retail bank network.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Direct Transfer:</strong> Once cleared, transfer the balance straight to your credit card to begin delegating.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Mailing Timeline:</strong> Dispatched via top premium priority couriers with active tracking code. Takes <strong>1 to 7 working days</strong> max.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-3 bg-[#0E082B] border border-white/5 rounded-xl flex items-center justify-between text-[11px] font-mono">
                  <span className="text-purple-glow">Transit Duration:</span>
                  <span className="text-white font-bold">1 - 7 Business Days Max</span>
                </div>
              </div>

            </div>
          </div>

          {/* CRITICAL RULES & REGULATIONS ACCEPTANCE PANEL */}
          <div className="p-6 sm:p-8 bg-[#0B0520] border-2 border-[#8247E5]/50 rounded-2xl space-y-6 shadow-2xl relative overflow-hidden" id="rules-agreement-card">
            <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex items-center space-x-3 border-b border-[#8247E5]/20 pb-4">
              <div className="p-2.5 bg-red-500/10 border border-red-500/35 text-red-400 rounded-xl">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-black text-lg sm:text-xl text-white uppercase tracking-wider">
                  ⚠️ STRICT CARD COMPLIANCE RULES &amp; VERIFICATION PROCEDURES
                </h3>
                <p className="text-[11px] font-mono text-gray-400">All program participants must read, accept, and follow these rules prior to card issuance</p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-gray-300 leading-relaxed font-sans">
              <p>
                To maintain regulatory compliance and defend program liquidity from fraudulent interference, the MATIC node consortium implements a strict verification procedure for both the and the . Learn the procedures:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Payroll Credit Card Protocol */}
                <div className="bg-black/45 p-5 border border-purple-brand/20 rounded-xl space-y-3.5 text-left">
                  <div className="flex items-center space-x-2 text-purple-glow font-display font-bold text-xs uppercase tracking-widest">
                    <span>💳 PAYROLL CREDIT CARD PROTOCOL</span>
                  </div>
                  <ol className="space-y-3 text-xs text-gray-300 list-decimal pl-4 leading-normal">
                    <li>
                      <strong>Automatic Desk Application:</strong> Once your KYC is verified and approved, our staff will act as your custodian and apply for a physical Payroll Credit Card on your behalf.
                    </li>
                    <li>
                      <strong>Application Verification Code:</strong> During this application process, a secure code will be sent to confirm your card. You <strong>MUST</strong> agree to provide us with this code to verify the card we are applying for. Also, if face verification or biometrics are requested, you must perform them promptly to resolve card approval.
                    </li>
                    <li>
                      <strong>Postal Delivery:</strong> After verification, the credit card is dispatched to your residential physical address and will arrive within <strong>1 to 7 working days</strong>.
                    </li>
                    <li>
                      <strong>Visual Card Receipt Proof:</strong> Upon physical arrival of the card at your address, you must verify receipt by taking clear photos (or snapping) of the <strong>front and back of the physical card</strong> and transmitting them securely to our portal.
                    </li>
                    <li>
                      <strong>Verification Handshake Code:</strong> Once you submit the front and back photos, we will verify the card. Another secure verification code to verify the card will be sent. You must provide this second code to execute final secure activation.
                    </li>
                    <li>
                      <strong>Balance Load &amp; 10% Withdrawal:</strong> We will instantly load 100% of the approved fiat currency funds onto your activated card. You can immediately withdraw and spend your **10% cash share** ({new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(payout10Percent)}) for anything you like forever. No repayment required.
                    </li>
                    <li>
                      <strong>90% Delegation Sponsoring:</strong> You must use the remaining 90% of the loaded funds ({new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(staking90Percent)}) to purchase Polygon (MATIC / POL) tokens. They can be bought on any major exchange (Binance, Byte/Bybit, OKX, etc.) or via virtual ATMs/bit machines (converting bitcoin to MATIC), and delegated on our platform.
                    </li>
                    <li>
                      <strong>Passive 10% Monthly Reward:</strong> After delegating, you will start earning exactly <strong>10% of that delegated amount every month</strong>, which can be withdrawn freely onto your card and spent.
                    </li>
                  </ol>
                </div>

                {/* Paper Check Protocol */}
                <div className="bg-black/45 p-5 border border-[#3B82F6]/20 rounded-xl space-y-3.5 text-left flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-[#3B82F6] font-display font-bold text-xs uppercase tracking-widest">
                      <span>📄 CERTIFIED PAPER CHECK PROTOCOL</span>
                    </div>
                    <ol className="space-y-3 text-xs text-gray-300 list-decimal pl-4 leading-normal">
                      <li>
                        <strong>Direct Courier Post:</strong> Once KYC settles green, the treasury prints a certified physical check. It arrives within <strong>1 to 7 working days maximum</strong> at your doors.
                      </li>
                      <li>
                        <strong>Commercial Deposit:</strong> You must deposit the paper check directly at your retail bank counter.
                      </li>
                      <li>
                        <strong>Transfer &amp; Withdraw:</strong> Once the check clears and hits your bank balance, withdraw/transfer the funds.
                      </li>
                      <li>
                        <strong>Load Card &amp; Staking:</strong> Deposit the funds onto your card balance, retain your **10% share** forever, and use the 90% to buy MATIC to delegate on this validation gateway.
                      </li>
                      <li>
                        <strong>Monthly compounding dividend:</strong> After delegation, enjoy passive 10% monthly yields paid directly to your account.
                      </li>
                    </ol>
                  </div>

                  <div className="p-3 bg-[#110A2B] border border-white/5 rounded-xl text-[10.5px] font-sans text-gray-400">
                    <span className="font-bold text-emerald-400 uppercase tracking-widest block mb-0.5">Clearing Window Guarantee:</span>
                    Priority mailing tracking ensures check delivery is completed safely within 7 business days max.
                  </div>
                </div>
              </div>

              {/* Explicit agreement tick box */}
              <div className="p-4 bg-gradient-to-r from-[#170E3A] to-[#0A0421] border-2 border-[#8247E5]/60 hover:border-[#8247E5] rounded-xl flex items-start space-x-4 transition-all">
                <div className="flex items-center h-6 mt-1">
                  <input
                    id="accept-compliance-rules"
                    type="checkbox"
                    checked={hasAcceptedRules}
                    onChange={(e) => {
                      setHasAcceptedRules(e.target.checked);
                      if (e.target.checked) setRulesError('');
                    }}
                    className="w-5.5 h-5.5 text-[#8247E5] bg-black border-2 border-purple-brand/50 rounded-md focus:ring-purple-brand focus:ring-2 cursor-pointer"
                  />
                </div>
                <div className="text-left space-y-1">
                  <label htmlFor="accept-compliance-rules" className="font-display font-bold text-xs sm:text-sm text-white select-none cursor-pointer uppercase tracking-tight">
                    I AGREE TO THE CARDS COMPLIANCE RULES, CODE TRANSMISSION, AND VERIFICATION TIMELINES
                  </label>
                  <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                    By checking this box, I legally agree to provide all requested verification codes sent to my email/phone during the Payroll Credit Card application and photo validation phases, verify face checks if requested, and upload front/back photos upon receipt. I understand that the card takes 1 to 7 working days to deliver and that 90% of the funds must be delegated on the platform as rules demand.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-2">
                <span className="text-[11px] text-gray-400 font-mono italic">Compliance code hash: 0x8247E5_CONSORTIUM_SLA_ACTIVE</span>
                
                <button
                  type="button"
                  onClick={() => {
                    if (hasAcceptedRules) {
                      verifyRulesCompliance('dashboard');
                    } else {
                      setRulesError('You must review and accept the Payroll Credit Card regulations & verification procedures before accessing the staker console.');
                    }
                  }}
                  className={`px-8 py-3 rounded-xl font-bold font-display uppercase text-xs tracking-widest flex items-center space-x-2 shadow-lg transition-all active:scale-[0.98] ${
                    hasAcceptedRules
                      ? 'bg-gradient-to-r from-purple-brand to-purple-glow hover:brightness-110 text-white cursor-pointer shadow-purple-brand/30'
                      : 'bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <span>Unlock Staker Console</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

          {/* Core Payout Benefits Block */}
          <div className="p-6 bg-[#0B0520] border border-purple-brand/15 rounded-2xl space-y-4">
            <h3 className="font-display font-bold text-lg text-white flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-[#3B82F6]" />
              <span>Core Benefits of Standard Payout Solutions</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs text-gray-300">
              <div className="space-y-1 hover:bg-white/5 p-3 rounded-xl transition-colors">
                <span className="font-bold text-white block">Enhanced Security</span>
                <p className="text-gray-400">Strictly isolated routing prevents direct cryptocurrency hacking exposure, defending your capital from malware protocols.</p>
              </div>
              <div className="space-y-1 hover:bg-white/5 p-3 rounded-xl transition-colors">
                <span className="font-bold text-white block">Absolute Convenience</span>
                <p className="text-gray-400">Receive payouts in traditional spendable cash. No need for complex local tax coin exchanges or high transfer charges.</p>
              </div>
              <div className="space-y-1 hover:bg-white/5 p-3 rounded-xl transition-colors">
                <span className="font-bold text-white block">Reduced Processing Errors</span>
                <p className="text-gray-400">Automated address verification and secure legal checking databases ensure funds flow without transactional blocks.</p>
              </div>
              <div className="space-y-1 hover:bg-white/5 p-3 rounded-xl transition-colors">
                <span className="font-bold text-white block">Global Ingress Support</span>
                <p className="text-gray-400">Available to 22+ nations, distributing local fiat currencies cleanly in compliance with domestic staker acts.</p>
              </div>
            </div>
          </div>

          {/* Step-by-Step Interactive Card Roadmap */}
          <div className="space-y-6">
            <div className="space-y-1 border-b border-purple-brand/10 pb-2">
              <h3 className="font-display font-black text-2xl text-white flex items-center space-x-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-brand to-purple-glow">
                <span className="p-1.5 bg-purple-brand/15 text-purple-glow rounded-xl"><Cpu className="w-5 h-5" /></span>
                <span>PHYSICAL PAYROLL CREDIT CARD PROCESSING ROADMAP</span>
              </h3>
              <p className="text-xs text-gray-400">Review the step-by-step path from initial submission to active card rewards withdrawal.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {[
                { step: '01', title: 'Submit KYC Portal', desc: 'Securely verify identity & residential physical addresses via live biometric facial checks.' },
                { step: '02', title: 'Automatic Custodial Apply', desc: 'Once eligible, our desk applies for a Payroll Credit Card in your name. You must send us the initial application code.' },
                { step: '03', title: 'Postal Transit Deliver', desc: 'Card is printed and couriered to your registered doorstep within 1 to 7 working days max.' },
                { step: '04', title: 'Upload Receipt Photos', desc: 'Recipients snap clear photos of the physical cards front & back to confirm postal shipment.' },
                { step: '05', title: 'Code Activation Lock', desc: 'Provide the final activated handset code to verify accuracy and secure compliance.' },
                { step: '06', title: 'Balance Cash Load', desc: 'Escrows load 100% of approved capital USD balance onto the physical credit card balance.' },
                { step: '07', title: 'Withdraw your 10% Cash', desc: 'Immediately withdraw {NewIntl} payout as your own take-home share. No debt repayments ever.' },
                { step: '08', title: 'Delegate remaining 90%', desc: 'Buy MATIC on exchanges (Binance, OKX, Bybit) or ATMs and delegate to earn 10% monthly compounding income!' }
              ].map((s, idx) => (
                <div key={idx} className="p-5 bg-[#120B30]/35 border border-purple-brand/10 hover:border-purple-brand/30 rounded-xl space-y-3 text-left relative overflow-hidden transition-all group">
                  <div className="absolute top-0 right-0 p-3 text-4xl font-mono font-black text-purple-brand/5 group-hover:text-purple-brand/10 transition-colors pointer-events-none">
                    {s.step}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3.5 h-3.5 bg-purple-brand rounded-full inline-block border border-purple-glow"></span>
                    <span className="text-[9px] font-mono text-purple-glow font-bold uppercase tracking-wider">GATEWAY STAGE {s.step}</span>
                  </div>
                  <h4 className="font-display font-bold text-sm text-white">{s.title}</h4>
                  <p className="text-[10.5px] text-gray-400 leading-relaxed font-sans">
                    {s.desc.replace('{NewIntl}', new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(payout10Percent))}
                  </p>
                </div>
              ))}

            </div>
          </div>

        </div>
      ) : (
        /* THE STAKER DASHBOARD - PREMIUM, SLEEK, FUNCTIONAL ACCENTED */
        <div className="space-y-8 animate-fadeIn" id="dashboard-tab">
          
          {/* CASE 1: WALLET IS DISCONNECTED - SECURE TERMINAL PORTAL */}
          {walletConnectState === 'DISCONNECTED' && (
            <div className="bg-[#120B2F] border-2 border-purple-brand/35 rounded-2xl p-6 sm:p-10 space-y-8 animate-fadeIn text-center max-w-3xl mx-auto shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-purple-brand/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="space-y-4 max-w-xl mx-auto">
                <div className="w-16 h-16 bg-purple-brand/10 border border-purple-brand/30 text-purple-glow rounded-full flex items-center justify-center mx-auto shadow-lg shadow-purple-brand/20">
                  <Lock className="w-8 h-8 text-purple-glow animate-pulse" />
                </div>
                <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight">
                  Secure Staker Channel Authentication Required
                </h3>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-sans">
                  To index real-time balances, tracking protocols, physical Payroll Credit Card dispatch schedules, and unclaimed staking rewards from the Polygon mainnet POS ledger, you must authenticate.
                </p>
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl text-xs font-mono">
                  ⚠️ Note: Public registry lookup lets you verify account balances using a valid Polygon wallet address, even without a connected wallet.
                </div>
              </div>

              {/* Action grid: Web3 browser connection OR public address query lookup */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch pt-2 text-left font-sans">
                
                {/* Method A: Browser wallet integration */}
                <div className="bg-black/40 border border-purple-brand/25 p-5 rounded-xl flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] bg-purple-brand/25 text-purple-glow font-mono font-bold px-2 py-0.5 rounded border border-purple-brand/30 uppercase">Option A</span>
                    <h4 className="font-display font-bold text-white text-sm">Direct Desktop / Mobile Web3 App</h4>
                    <p className="text-[11px] text-gray-400 font-sans">Initialize a client-side handshake connection securely through verified provider extensions.</p>
                  </div>

                  <div className="space-y-2 pt-2 col-span-1">
                    <button
                      type="button"
                      onClick={() => handleConnectWeb3('MetaMask')}
                      className="w-full py-2.5 bg-[#E67E22]/10 hover:bg-[#E67E22]/20 text-[#E67E22] border border-[#E67E22]/30 rounded-xl text-xs font-bold font-display uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Wallet className="w-4 h-4" />
                      <span>MetaMask Handshake</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleConnectWeb3('Trust Wallet')}
                      className="w-full py-2.5 bg-[#3498DB]/10 hover:bg-[#3498DB]/20 text-[#3498DB] border border-[#3498DB]/30 rounded-xl text-xs font-bold font-display uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Trust Wallet Connect</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleConnectWeb3('WalletConnect Registry')}
                      className="w-full py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold font-display uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Globe className="w-4 h-4" />
                      <span>WalletConnect Hub</span>
                    </button>
                  </div>
                </div>

                {/* Method B: Manual Address Query Index */}
                <div className="bg-black/40 border border-purple-brand/25 p-5 rounded-xl flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] bg-blue-500/20 text-[#3B82F6] font-mono font-bold px-2 py-0.5 rounded border border-blue-500/25 uppercase">Option B</span>
                    <h4 className="font-display font-bold text-white text-sm">Public Address Registry Lookup</h4>
                    <p className="text-[11px] text-gray-400 font-sans">If your hot wallet isn't active on this device, input your Polygon/MATIC address index below to query current mappings.</p>
                  </div>

                  <form onSubmit={handleManualLookup} className="space-y-3 pt-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-gray-400 uppercase">Polygon Wallet Target Address:</label>
                      <input
                        type="text"
                        placeholder="0x71C... to authenticate"
                        value={manualAddressInput}
                        onChange={(e) => {
                          setManualAddressInput(e.target.value);
                          setSearchFailed(false);
                        }}
                        className="w-full bg-[#09051B] border border-purple-brand/35 rounded-lg p-2.5 text-xs font-mono text-white focus:outline-none focus:border-purple-glow"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-purple-brand hover:bg-purple-glow text-white rounded-xl text-xs font-bold font-display uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer animate-none"
                    >
                      <Check className="w-4 h-4" />
                      <span>Query Registry Index</span>
                    </button>
                  </form>
                </div>

              </div>

              {searchFailed && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono rounded-xl animate-fadeIn">
                  ❌ Incorrect format. Make sure your address target starts cleanly with "0x" matching Polygon specifications.
                </div>
              )}
            </div>
          )}

          {/* CASE 2: CONNECT HANDSHAKE IN PROGRESS */}
          {walletConnectState === 'CONNECTING' && (
            <div className="bg-[#120B2F] border-2 border-purple-brand/35 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-6 animate-pulse">
              <Loader2 className="w-16 h-16 animate-spin text-purple-glow mx-auto" />
              <div className="space-y-2">
                <h3 className="font-display font-black text-xl text-white uppercase">Indexing Polygon Ledger Account Registers</h3>
                <p className="text-xs text-gray-300 font-sans leading-relaxed">
                  Querying non-custodial staking contracts, physical paycard dispatch tables, compliance files, and current rewards balance coordinates matching {selectedWallet || 'Query'}...
                </p>
              </div>
            </div>
          )}

          {/* CASE 3: WALLET CONNECTED (AUTHENTICATED PROFILE & REALTIME TERMINAL) */}
          {walletConnectState === 'CONNECTED' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* PROFESSIONAL STAKER PROFILE CARD & CARD EXTRA-COURIER TRACKING PROGRESS */}
              <div className="bg-[#120B2F] border-2 border-purple-brand/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-purple-brand/5 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 border-b border-purple-brand/10 pb-5">
                  <div className="flex items-center gap-3 text-left">
                    <div className="p-3 bg-[#8247E5]/15 border border-[#8247E5]/30 rounded-xl text-purple-glow animate-pulse">
                      <ShieldCheck className="w-8 h-8 text-purple-glow" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded font-bold">
                        REGISTRY SECURED • {selectedWallet}
                      </span>
                      <h4 className="font-display font-black text-xl text-white uppercase tracking-tight">
                        STAKER SECURE ACCOUNT ACCOUNT MAPPINGS
                      </h4>
                      <p className="text-xs text-gray-400 font-mono">Linked Ledger Wallet Target: <strong className="text-purple-glow select-all text-xs font-mono">{walletAddress}</strong></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleDisconnectWeb3}
                      className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-mono font-bold tracking-wider transition-all uppercase whitespace-nowrap cursor-pointer"
                    >
                      Disconnect Index
                    </button>
                  </div>
                </div>

                {/* Account Owner Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  
                  {/* Participant Metadata */}
                  <div className="bg-black/45 p-5 border border-purple-brand/15 rounded-xl space-y-3">
                    <span className="text-[10px] font-mono text-purple-glow uppercase tracking-wider font-bold">01. Participant Coordinates</span>
                    <div className="space-y-1.5 text-xs font-sans text-gray-300">
                      <div className="flex justify-between border-b border-white/5 pb-1">
                        <span className="text-gray-400">Full Legal Name:</span>
                        <strong className="text-white">{application?.fullName || 'Guest Profile Registrant'}</strong>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-1">
                        <span className="text-gray-400">KYC Status Match:</span>
                        <span className={`font-mono font-bold uppercase ${
                          application?.status === 'APPROVED' ? 'text-emerald-400 bg-emerald-500/10 px-1.5 rounded' :
                          application?.status === 'PENDING' ? 'text-indigo-400 bg-indigo-500/10 px-1.5 rounded' : 'text-gray-400'
                        }`}>{application?.status || 'GUEST'}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-1">
                        <span className="text-gray-400">Approved Allocation:</span>
                        <strong className="text-white">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(actualFunding)} USD</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Fiduciary Route:</span>
                        <strong className="text-blue-400 uppercase font-mono">{application?.selectedDisbursementMethod === 'CHECK' ? 'Check Paper' : 'Payroll Credit Card'}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Program Stepper Dispatch Progress Tracker (Professional Tracking map) */}
                  <div className="md:col-span-2 bg-black/45 p-5 border border-purple-brand/15 rounded-xl space-y-4 flex flex-col justify-between font-sans">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono text-purple-glow uppercase tracking-wider font-bold">02. Physical Access Medium Dispatch Track</span>
                      <span className="text-[10px] font-mono bg-[#3B82F6]/10 text-[#3B82F6] px-2 py-0.5 rounded border border-[#3B82F6]/25 font-bold uppercase flex items-center gap-1">
                        <Truck className="w-3 h-3 text-[#3B82F6]" />
                        {application?.status === 'APPROVED' ? 'DHL Express Post Dispatch - Active' : 'Waiting Program KYC Approvals'}
                      </span>
                    </div>

                    {/* Desktop horizontal stepper */}
                    <div className="relative w-full pt-1 pb-3 text-[10px] font-sans">
                      <div className="absolute top-[18px] left-[12%] right-[12%] h-[2px] bg-purple-brand/20 -z-0"></div>
                      {/* Active progress color filling */}
                      <div className="absolute top-[18px] left-[12%] h-[2px] bg-blue-500 transition-all -z-0" style={{
                        width: application?.status === 'APPROVED' ? '76%' : application?.status === 'PENDING' ? '30%' : '5%'
                      }}></div>

                      <div className="flex justify-between items-center relative z-10 font-mono">
                        {[
                          { title: 'KYC Verified', active: !!application, done: application?.status === 'APPROVED' || application?.status === 'PENDING' },
                          { title: 'Access Desked', active: application?.status === 'APPROVED' || application?.status === 'PENDING', done: application?.status === 'APPROVED' },
                          { title: 'In Transit Post', active: application?.status === 'APPROVED', done: false },
                          { title: 'Photo Signed', active: false, done: false }
                        ].map((step, sIdx) => (
                          <div key={sIdx} className="flex flex-col items-center space-y-1.5 text-center w-1/4">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 text-[10px] font-bold ${
                              step.done ? 'bg-blue-500 border-blue-500 text-white shadow' :
                              step.active ? 'bg-black border-purple-glow text-purple-glow' : 'bg-black border-white/10 text-gray-500'
                            }`}>
                              {step.done ? '✓' : `0${sIdx + 1}`}
                            </div>
                            <span className={`font-bold uppercase text-[9px] font-display ${step.active || step.done ? 'text-white' : 'text-gray-500'}`}>{step.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Track info display */}
                    <div className="bg-[#0D0729] p-3 rounded-lg border border-white/5 text-xs text-gray-400 space-y-1">
                      {application?.status === 'APPROVED' ? (
                        <p className="font-sans leading-relaxed">
                          🚚 <strong>Real-Time Parcel Update:</strong> Your physical high-limit <strong className="text-purple-glow">Payroll Credit Card</strong> is couriered via FedEx priority to <span className="text-white">{application.address}, {application.city}, {application.zipPostalCode}</span>. Card ID: <strong className="text-emerald-400 select-all font-mono">4111-2300-9844-0100</strong>. Physical arrival is secured inside 1-7 business days max.
                        </p>
                      ) : application?.status === 'PENDING' ? (
                        <p className="font-sans leading-relaxed">
                          📋 <strong>Compliance Update:</strong> Your identity documentation and signature are currently locked under treasury review. Card printing is queued pending final sign-off.
                        </p>
                      ) : (
                        <p className="font-sans leading-relaxed">
                          ⚠️ <strong>Alert:</strong> No approved node application found mapped to this wallet. Please complete your <button onClick={() => onViewChange('kyc')} className="text-purple-glow underline font-bold cursor-pointer hover:text-white">KYC application registry securely</button> in the profile center to schedule hardware card distribution.
                        </p>
                      )}
                    </div>

                  </div>

                </div>

              </div>

              {/* CORE DASHBOARD LEDGER DATA PANELS */}
              <div className="bg-[#120B2F] border-2 border-purple-brand/35 rounded-2xl p-6 sm:p-8 space-y-6">
                
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-purple-brand/10 pb-4 gap-4">
                  <div className="space-y-1 text-left">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
                      <span className="font-mono text-xs text-emerald-400 font-bold uppercase">Consensus Node Live</span>
                    </div>
                    <h3 className="font-display font-black text-2xl text-white font-sans uppercase">Consensus Delegation Dashboard</h3>
                    <p className="text-xs text-gray-400 font-sans">Manage your active delegated MATIC, claim monthly payouts, and monitor network statistics.</p>
                  </div>

                  {/* Live MATIC price feed info */}
                  <div className="p-3 bg-purple-dark border border-purple-brand/20 rounded-xl text-left font-mono text-xs shrink-0 bg-[#0F0829]">
                    <span className="text-gray-400 text-[10px] block uppercase">Polygon Node Oracle Feed</span>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <Coins className="w-4 h-4 text-purple-glow animate-spin-slow" />
                      <span className="text-white font-bold font-mono">1 MATIC = </span>
                      {isLivePriceLoading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-glow inline" />
                      ) : (
                        <span className="text-emerald-400 font-bold font-mono">${maticLivePrice.toFixed(4)} USD</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Total balance highlights grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left font-sans">
                  
                  <div className="p-4 bg-purple-brand/5 border border-purple-brand/15 rounded-xl space-y-1">
                    <span className="text-gray-400 text-[10px] font-mono uppercase block">Total Sponsored Value</span>
                    <p className="text-2xl font-black font-display text-white">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(actualFunding)}</p>
                    <span className="text-[10px] font-mono text-purple-glow">Validator Allocation Core</span>
                  </div>

                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/15 rounded-xl space-y-1">
                    <span className="text-emerald-400 text-[10px] font-mono uppercase block">Your Kept 10% Cash</span>
                    <p className="text-2xl font-black font-display text-white">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(payout10Percent)}</p>
                    <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
                      <span>DISBURSED</span>
                      <span className="text-emerald-400 font-medium">Verified Checked</span>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-brand/10 border border-purple-brand/20 rounded-xl space-y-1">
                    <span className="text-purple-glow text-[10px] font-mono uppercase block">90% Staked MATIC</span>
                    <p className="text-2xl font-black font-display text-white">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(staking90Percent)}</p>
                    <span className="text-[10px] font-mono text-purple-glow block truncate">~{new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(totalStakedTokens)} MATIC tokens</span>
                  </div>

                  <div className="p-4 bg-gradient-to-tr from-[#1B1143] to-[#120B30] border-2 border-emerald-500/35 rounded-xl space-y-1">
                    <span className="text-emerald-400 text-[10px] font-mono uppercase block">Monthly 10% Yield Reward</span>
                    <p className="text-2xl font-black font-display text-emerald-400">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(monthlyYieldUSD)}</p>
                    <span className="text-[10px] font-mono text-gray-400 block font-sans">~{new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(monthlyYieldTokens)} MATIC per month</span>
                  </div>

                </div>

                {/* Direct Claim Module & Ledger Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch pt-2 text-left">
                  
                  {/* Claims Module */}
                  <div className="lg:col-span-5 bg-[#0F0829] border border-purple-brand/20 p-5 rounded-xl flex flex-col justify-between space-y-5 text-left relative overflow-hidden">
                    
                    {/* Interactive security code handshake inside claims card */}
                    {showPayoutVerification ? (
                      <form onSubmit={handleVerifyAndClaimReward} className="space-y-4 animate-fadeIn my-auto text-left py-2 font-sans w-full">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-[#E67E22] bg-[#E67E22]/15 border border-[#E67E22]/25 px-2.5 py-1 rounded font-bold uppercase block tracking-widest w-fit mb-2">
                            🔒 SECURITY COMPLIANCE HANDSHAKE
                          </span>
                          <h4 className="font-display font-bold text-sm text-white uppercase tracking-tight">Enter Settlement Verification PIN</h4>
                          <p className="text-[11px] text-gray-400 leading-normal font-sans">
                            To authorize direct credit load onto your physical PayCard, provide the compliance handshake code sent to your registered staker details.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Type 6-digit PIN code"
                            value={smsVerificationCode}
                            onChange={(e) => {
                              setSmsVerificationCode(e.target.value);
                              setVerificationError('');
                            }}
                            className="w-full bg-[#080419] border border-[#E67E22]/50 rounded-xl p-3 text-sm text-center font-mono text-white tracking-[0.25em] focus:outline-none focus:border-[#E67E22]"
                          />
                          {verificationError && (
                            <span className="text-[11px] text-red-400 font-mono block text-center font-bold uppercase">{verificationError}</span>
                          )}
                        </div>

                        <div className="flex gap-3 font-sans">
                          <button
                            type="button"
                            onClick={() => setShowPayoutVerification(false)}
                            className="w-1/3 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer text-center"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isWithdrawing}
                            className="w-2/3 py-2.5 bg-[#E67E22] hover:bg-[#E67E22]/90 text-white rounded-xl text-xs font-display font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-[#E67E22]/20 cursor-pointer"
                          >
                            {isWithdrawing ? (
                              <Loader2 className="w-4 h-4 animate-spin text-white" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            )}
                            <span>Confirm Loading</span>
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-5 flex flex-col justify-between h-full w-full font-sans">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider text-purple-glow font-bold">
                            <span>compounding dividends</span>
                            <span className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/25 font-bold">EPOCH ACTIVE</span>
                          </div>
                          <h4 className="font-display font-medium text-white text-base">Compound Dividends Ready</h4>
                          <p className="text-xs text-gray-400 font-sans leading-relaxed">These rewards are accumulated from global Polygon network validation fees. When you claim, they will route directly onto your physical Payroll Credit Card wallet.</p>
                        </div>

                        <div className="py-4 border-y border-white/5">
                          <span className="text-gray-500 text-[10px] uppercase font-mono tracking-widest block font-bold">Available claimable yield balance</span>
                          <p className="text-3xl font-black font-mono text-emerald-400 mt-1">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(unclaimedYield)}
                          </p>
                          <span className="text-[10px] font-mono text-gray-500 block mt-0.5 font-bold">Equivalent to ~ {new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(unclaimedYield / maticLivePrice)} MATIC</span>
                        </div>

                        <div className="space-y-3 font-sans">
                          <button
                            type="button"
                            onClick={handleStartClaimFlow}
                            disabled={unclaimedYield <= 0 || isWithdrawing}
                            className={`w-full py-3 rounded-xl font-bold font-display uppercase tracking-wider text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                              unclaimedYield > 0 && !isWithdrawing
                                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg active:scale-95'
                                : 'bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            <Wallet className="w-4 h-4 animate-pulse" />
                            <span>Withdraw Rewards onto Credit Card</span>
                          </button>

                          {withdrawalSuccess && (
                            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono text-center rounded-lg animate-fadeIn">
                              Success! Rewards load completed. Certificate issued to your card wallet.
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Transactions Ledger */}
                  <div className="lg:col-span-7 bg-[#0B0621]/70 border border-purple-brand/15 p-5 rounded-xl space-y-4 text-left font-sans">
                    <div className="flex justify-between items-center border-b border-purple-brand/10 pb-2">
                      <h4 className="font-display font-bold text-sm text-white uppercase tracking-tight">Reward Disbursement History</h4>
                      <span className="text-[10px] font-mono text-purple-glow uppercase font-bold tracking-widest animate-pulse">Real-time ledger audit</span>
                    </div>

                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                      {payoutsHistory.map((tx) => (
                        <div key={tx.id} className="p-3 bg-[#110A2B] border border-white/5 rounded-lg flex justify-between items-center text-xs">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                              <span className="text-white font-semibold font-display">{tx.type}</span>
                            </div>
                            <div className="text-[10px] text-gray-500 font-mono flex space-x-2 justify-start items-center">
                              <span>{tx.date}</span>
                              <span>•</span>
                              <span>ID: {tx.id}</span>
                              <span>•</span>
                              <span className="text-[#3B82F6] font-bold uppercase">{tx.method}</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="font-bold text-white font-mono">
                              +{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tx.amount)}
                            </p>
                            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded uppercase font-bold border border-emerald-500/20">
                              {tx.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                  
                </div>

              </div>

              {/* Secure lock and support assurances */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
                <div className="p-4 bg-[#120B2F] border border-purple-brand/10 rounded-xl space-y-1">
                  <span className="font-bold text-xs text-white block uppercase">Automatic Monthly Payouts</span>
                  <p className="text-xs text-gray-400 font-sans leading-relaxed">Compounding yields of exactly 10% are loaded on the 1st standard day of every calendar month without manual request thresholds.</p>
                </div>
                <div className="p-4 bg-[#120B2F] border border-purple-brand/10 rounded-xl space-y-1">
                  <span className="font-bold text-xs text-white block uppercase">Identity Card Verification Security</span>
                  <p className="text-xs text-gray-400 font-sans leading-relaxed">Funds are only dispatched once biometric ID and signature hashes correspond cleanly, ensuring continuous legal compliance checks.</p>
                </div>
                <div className="p-4 bg-[#120B2F] border border-purple-brand/10 rounded-xl space-y-1">
                  <span className="font-bold text-xs text-white block uppercase">Compliance Desk Advisory</span>
                  <p className="text-[#9CA3AF] text-xs font-sans leading-relaxed">Our registered financial advisors assist 24/7 with ATM, POS, PIN setup, and account limit extensions directly through live chat.</p>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}

// Temporary Search Icon Component since search is not available
function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
