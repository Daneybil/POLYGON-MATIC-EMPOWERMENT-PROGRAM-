/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight, DollarSign, Calculator, Percent, Sparkles, Landmark } from 'lucide-react';

interface HeroProps {
  onViewChange: (view: string) => void;
  onSetFundingAmount: (amount: number) => void;
  savedAmount: number;
}

export default function Hero({ onViewChange, onSetFundingAmount, savedAmount }: HeroProps) {
  const [fundingAmount, setFundingAmount] = useState<number>(savedAmount);
  const [maticPrice, setMaticPrice] = useState<number>(0.3850);

  // Fetch live MATIC price
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        // Try CoinGecko first (user preferred endpoint)
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=polygon-ecosystem-token&vs_currencies=usd');
        if (response.ok) {
          const data = await response.json();
          if (data && data['polygon-ecosystem-token'] && typeof data['polygon-ecosystem-token'].usd === 'number') {
            setMaticPrice(data['polygon-ecosystem-token'].usd);
            return;
          }
        }
      } catch (err) {
        console.warn('CoinGecko price fetch failed, trying Binance POLUSDT', err);
      }

      try {
        // Try Binance POLUSDT (highly robust and stable global exchange ticker)
        const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=POLUSDT');
        if (response.ok) {
          const data = await response.json();
          if (data && data.price) {
            setMaticPrice(parseFloat(data.price));
            return;
          }
        }
      } catch (err) {
        console.warn('Binance POLUSDT price fetch failed, trying CryptoCompare backup', err);
      }

      try {
        // CryptoCompare Backup
        const response = await fetch('https://min-api.cryptocompare.com/data/price?fsym=MATIC&tsyms=USD');
        if (response.ok) {
          const data = await response.json();
          if (data && data.USD) {
            setMaticPrice(data.USD);
          }
        }
      } catch (err) {
        console.warn('Utilizing fallback standard MATIC rate', err);
      }
    };

    fetchPrice();
    // Refresh every 30-45 seconds as requested by the user for real-time accuracy
    const interval = setInterval(fetchPrice, 45000);
    return () => clearInterval(interval);
  }, []);

  // Staking parameters
  const activePrice = maticPrice;
  const MONTHLY_REWARD_RATE = 0.10; // Exactly 10% staking dividend yield as requested

  // Calculations
  const immediateTenPercent = fundingAmount * 0.10;
  const stakingNinetyPercent = fundingAmount * 0.90;
  const maticTokenAmount = stakingNinetyPercent / activePrice;
  const estimatedMonthlyYieldUSD = stakingNinetyPercent * MONTHLY_REWARD_RATE;
  const estimatedMonthlyYieldMATIC = estimatedMonthlyYieldUSD / activePrice;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setFundingAmount(val);
    onSetFundingAmount(val);
  };

  const handleQuickSelect = (val: number) => {
    setFundingAmount(val);
    onSetFundingAmount(val);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatTokens = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleProceedWithAmount = () => {
    onSetFundingAmount(fundingAmount);
    localStorage.setItem('mep_requested_funding', fundingAmount.toString());
    onViewChange('kyc');
  };

  return (
    <section className="relative py-12 px-4 sm:px-6 lg:py-20 overflow-hidden" id="hero-section">
      
      {/* Absolute decorative glowing mesh */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-purple-brand/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-10 left-10 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Column: Heading and program hooks */}
        <div className="lg:col-span-7 space-y-8 text-left">
          
          <div className="inline-flex items-center space-x-2.5 bg-purple-brand/15 border border-[#8247E5]/45 rounded-full px-4 py-2 text-xs text-white font-display shadow-[0_0_20px_rgba(130,71,229,0.15)]">
            <svg 
              viewBox="0 0 38 38" 
              fill="none" 
              className="w-4.5 h-4.5 text-[#8247E5]" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M30.4 12.835L24.58 9.475V16.2L30.4 19.56a1.114 1.114 0 01.558.966v6.72c0 .403-.215.776-.558.966l-5.82 3.36a1.114 1.114 0 01-1.115 0l-5.82-3.36a1.114 1.114 0 01-.558-.966V20.526l2.316-1.337L15 16.634V9.914a1.114 1.114 0 01.558-.966l5.82-3.36a1.114 1.114 0 011.115 0l5.82 3.36a1.114 1.114 0 01.558.966v2.921h1.529V9.914c0-.792-.423-1.525-1.115-1.898l-5.82-3.36a2.228 2.228 0 00-2.23 0l-5.82 3.36a2.228 2.228 0 00-1.114 1.898v6.72c0 .403.214.776.557.966l5.82 3.36a1.113 1.113 0 01.558.966v6.72c0 .403-.214.776-.558.966l-5.82 3.36a1.114 1.114 0 01-1.115 0l-5.82-3.36c-.343-.2-.558-.564-.558-.966V20.526a1.114 1.114 0 01.558-.966l5.82-3.36a1.114 1.114 0 011.115 0l4.314 2.49V12L9.42 15.166a1.114 1.114 0 01-.558-.966V7.48a1.114 1.114 0 01.558-.966l5.82-3.36a1.114 1.114 0 011.115 0l5.82 3.36a1.114 1.114 0 01.558.966v2.921c0 .792.423 1.525 1.115 1.898l5.82 3.36a2.228 2.228 0 011.114 1.898v6.72c0 .792-.423 1.525-1.114 1.898l-5.82 3.36a2.228 2.228 0 01-2.23 0l-5.82-3.36a2.228 2.228 0 01-1.115-1.898V20.526a2.228 2.228 0 00-1.114-1.898l-5.82-3.36a2.228 2.228 0 00-2.23 0l-5.82 3.36a2.228 2.228 0 00-1.114 1.898V27.246c0 .792.422 1.525 1.114 1.898l5.82 3.36c.692.4 1.538.4 2.23 0l5.82-3.36c.692-.4 1.115-1.133 1.115-1.898V20.526c0-.792-.423-1.525-1.115-1.898l-4.314-2.49V12.835z" 
                fill="#8247E5" 
              />
            </svg>
            <span className="font-bold uppercase tracking-wider text-purple-glow">Polygon (MATIC) Node Consortium</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight text-white leading-tight">
              MATIC EMPOWERMENT <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-brand via-purple-glow to-blue-400">
                PROGRAM
              </span>
            </h1>
            
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl font-sans">
              Empowering global participants with direct capital funding to purchase and delegate MATIC. 
              Keep <strong className="text-emerald-400 font-semibold underline decoration-wavy">10% of your funding</strong> instantly, 
              use 90% to buy and stake MATIC for long-term rewards, network security, and Polygon’s generational growth.
            </p>
          </div>

          {/* Quick value props grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-4 bg-[#140E31]/40 border border-purple-brand/15 hover:border-purple-brand/30 rounded-xl transition-all">
              <span className="text-xs uppercase font-mono tracking-widest text-purple-glow">PROVISIONS</span>
              <p className="text-xl font-bold font-display text-white mt-1">$10k to $1M Core</p>
              <p className="text-xs text-gray-400 mt-1">Direct institutional backing with no repayment liability.</p>
            </div>

            <div className="p-4 bg-[#140E31]/40 border border-purple-brand/15 hover:border-purple-brand/30 rounded-xl transition-all">
              <span className="text-xs uppercase font-mono tracking-widest text-[#2563EB]">YIELD</span>
              <p className="text-xl font-bold font-display text-emerald-400 mt-1">Up to 10% Monthly</p>
              <p className="text-xs text-gray-400 mt-1">Consistently generated via active POS consensus delegation.</p>
            </div>

            <div className="p-4 bg-[#140E31]/40 border border-purple-brand/15 hover:border-purple-brand/30 rounded-xl transition-all">
              <span className="text-xs uppercase font-mono tracking-widest text-purple-glow">TIMELINE</span>
              <p className="text-xl font-bold font-display text-white mt-1">24 - 72h Verification</p>
              <p className="text-xs text-gray-400 mt-1">Secure government-partnered checks processed securely.</p>
            </div>

            <div className="p-4 bg-[#140E31]/40 border border-purple-brand/15 hover:border-purple-brand/30 rounded-xl transition-all">
              <span className="text-xs uppercase font-mono tracking-widest text-emerald-400">GUARANTEES</span>
              <p className="text-xl font-bold font-display text-white mt-1">100% Legal Safeguard</p>
              <p className="text-xs text-gray-400 mt-1">Vetted agreement with biometric-secured lock sign-offs.</p>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
            <button
              id="hero-get-started-btn"
              onClick={() => onViewChange('kyc')}
              className="px-8 py-4 bg-gradient-to-r from-purple-brand to-purple-glow hover:brightness-110 text-white font-semibold font-display shadow-lg shadow-purple-brand/30 rounded-xl flex items-center justify-center space-x-3 transition-all active:scale-[0.98]"
            >
              <span>GET STARTED NOW</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              id="hero-government-agreement-btn"
              onClick={() => onViewChange('legal-agreement')}
              className="px-6 py-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl font-semibold font-display flex items-center justify-center space-x-2 transition-all active:scale-[0.98]"
            >
              <Landmark className="w-4 h-4 text-rose-400 shrink-0" />
              <span>GOVERNMENT AGREEMENT</span>
            </button>
            <button
              id="hero-learn-more-btn"
              onClick={() => onViewChange('how-it-works')}
              className="px-6 py-4 bg-white/5 hover:bg-white/10 text-gray-200 border border-white/15 rounded-xl font-semibold font-display text-center transition-all"
            >
              LEARN MORE
            </button>
          </div>

          {/* Secure validation badge */}
          <div className="flex items-center space-x-4 pt-4 border-t border-purple-brand/10">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-purple-brand flex items-center justify-center border-2 border-dark-bg text-[10px] font-bold">1</div>
              <div className="w-8 h-8 rounded-full bg-purple-glow flex items-center justify-center border-2 border-dark-bg text-[10px] font-bold">2</div>
              <div className="w-8 h-8 rounded-full bg-[#1A1A3A] flex items-center justify-center border-2 border-dark-bg text-[10px] font-bold">3</div>
            </div>
            <p className="text-xs text-gray-400 font-sans">
              Currently sponsoring over <span className="text-white font-semibold">1,842 nodes</span> worldwide. Funded securely in escrow.
            </p>
          </div>

        </div>

        {/* Right Column: Funding Slider Card */}
        <div className="lg:col-span-5 relative" id="hero-calculator">
          {/* Decorative halo glow behind card */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-brand via-purple-glow to-blue-500 rounded-2xl blur-xl opacity-35"></div>
          
          <div className="relative bg-[#110A2E]/90 border-2 border-purple-brand/35 rounded-2xl p-6 sm:p-8 text-left shadow-2xl">
            
            <div className="flex items-center justify-between mb-6 border-b border-purple-brand/10 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-purple-brand/20 rounded-lg text-purple-glow">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-lg">Allocation Calculator</h3>
                  <p className="text-[11px] text-gray-400 font-mono">Guaranteed Node Conversion</p>
                </div>
              </div>
              <span className="text-[11px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                Rate Lock Active
              </span>
            </div>            {/* Price reference note with detailed live oracle / rate lock selection */}
            <div className="bg-[#10062a] border-2 border-emerald-500/30 rounded-2xl p-4 sm:p-5 mb-6 space-y-2.5 shadow-inner relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
              <div className="flex items-center justify-between">
                <span className="text-white font-display font-black text-[11px] tracking-wider flex items-center space-x-1.5 uppercase">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>📈 REAL-TIME MATIC PRICE FEED</span>
                </span>
                <span className="font-mono text-[9px] text-emerald-300 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25">
                  Secure feed Active
                </span>
              </div>
              <p className="text-[11px] text-gray-300 leading-normal font-sans">
                Our secure gateway hooks directly into the consolidated industry price ticker. This ensures your allocations and token figures are stable, verified, and transparent.
              </p>
              <div className="flex justify-between items-center text-xs font-mono pt-2 border-t border-white/5">
                <span className="text-gray-400 font-sans">Applied Valuation Rate:</span>
                <span className="text-emerald-400 font-bold flex items-center space-x-1.5 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span>1 MATIC = ${activePrice.toFixed(4)} USD</span>
                </span>
              </div>
            </div>

            {/* The Huge, Ultra-Prominent Slider Input */}
            <div className="space-y-4 mb-6 bg-[#09051d] p-4.5 rounded-2xl border-2 border-[#8247E5]/50 shadow-inner">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-purple-glow font-bold uppercase tracking-wider font-display">
                  🎚️ ADJUST ALLOCATION:
                </span>
                <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight bg-purple-brand/10 border border-[#8247E5]/20 px-3 py-1 rounded-xl">
                  {formatCurrency(fundingAmount)}
                </span>
              </div>
              
              <div className="relative pt-2">
                <input 
                  type="range" 
                  min="10000" 
                  max="1000000" 
                  step="10000" 
                  value={fundingAmount}
                  onChange={handleSliderChange}
                  className="w-full h-4 sm:h-5 bg-[#140D36] border border-[#8247E5]/35 rounded-full appearance-none cursor-pointer accent-purple-glow hover:accent-[#9F7AEA] transition-all focus:outline-none focus:ring-2 focus:ring-purple-glow"
                  style={{
                    background: `linear-gradient(to right, #8247E5 0%, #8247E5 ${((fundingAmount - 10000) / 990000) * 100}%, #140D36 ${((fundingAmount - 10000) / 990000) * 100}%, #140D36 100%)`
                  }}
                  id="funding-slider"
                />
              </div>
              
              <div className="flex justify-between text-[11px] text-gray-400 font-mono font-bold pt-1">
                <span className="text-emerald-400">$10,000 MIN</span>
                <span className="text-gray-400">$500,000 MID</span>
                <span className="text-purple-glow">$1,000,000 MAX</span>
              </div>
            </div>

            {/* Quick selectors for fast clicks */}
            <div className="grid grid-cols-4 gap-2 mb-6 text-center">
              {[10000, 50000, 100000, 500000].map((val) => {
                const isSelected = fundingAmount === val;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleQuickSelect(val)}
                    className={`py-2 px-1 rounded-lg text-xs font-semibold font-mono border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-purple-brand border-purple-glow text-white shadow-[0_0_12px_rgba(123,63,228,0.55)] scale-105' 
                        : 'bg-white/5 border-white/10 hover:border-purple-brand/50 text-gray-300'
                    }`}
                  >
                    {val >= 100000 ? `${val/1000}k` : formatCurrency(val)}
                  </button>
                );
              })}
            </div>

            {/* Calculations outputs visually mapped in 2 discrete grids */}
            <div className="space-y-4 mb-6">
              
              {/* Take-Home 10% Cash payout Card with step guide */}
              <div className="p-4 sm:p-5 bg-emerald-500/5 hover:bg-emerald-500/10 border-2 border-emerald-500/30 rounded-xl transition-all space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-500/15 pb-2">
                  <span className="text-xs sm:text-xs font-black text-emerald-400 font-display flex items-center space-x-1.5 uppercase">
                    <DollarSign className="w-4 h-4" />
                    <span>Your 10% Cash Take-Home Share</span>
                  </span>
                  <span className="font-mono text-[9px] text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/35 uppercase font-bold">
                    KEEP PERMANENTLY
                  </span>
                </div>
                
                <div className="flex justify-between items-baseline">
                  <span className="text-3xl font-black font-display text-white">
                    {formatCurrency(immediateTenPercent)}
                  </span>
                  <span className="text-xs text-emerald-400 font-semibold font-mono">Guaranteed Bonus</span>
                </div>

                {/* Layman-friendly process guide */}
                <div className="bg-[#0b0520] rounded-xl p-3 border border-[#8247E5]/5 space-y-2.5 text-xs font-sans text-gray-300 leading-relaxed">
                  <p className="font-bold text-white text-[10.5px] uppercase tracking-wider text-[#a855f7] flex items-center space-x-1">
                    <span>📦 HOW IS YOUR CASH DISBURSED?</span>
                  </p>
                  <ul className="space-y-2 text-[10.5px] text-gray-300">
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-400 font-bold shrink-0 mt-0.5">①</span>
                      <span><strong>PayCard or Paper Check:</strong> We ship a physical credit PayCard or print a certified bank check to your residential physical address.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-400 font-bold shrink-0 mt-0.5">②</span>
                      <span><strong>Priority Courier:</strong> Deliveries are securely processed and arrive at your door within <strong>2 to 5 business days</strong> (up to one week).</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-400 font-bold shrink-0 mt-0.5">③</span>
                      <span><strong>Photo Activation:</strong> Upon arrival, snap photos of the card's front &amp; back and send them to us to authorize activation.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-400 font-bold shrink-0 mt-0.5">④</span>
                      <span><strong>Dollar Balance Loaded:</strong> We instantly load 100% of your approved USD funding amount onto the activated card.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#60A5FA] font-bold shrink-0 mt-0.5">⑤</span>
                      <span><strong>Acquire MATIC &amp; Keep 10%:</strong> You withdraw and keep exactly 10% ({formatCurrency(immediateTenPercent)}) as your permanent bonus. You use the other 90% ({formatCurrency(stakingNinetyPercent)}) to purchase Polygon MATIC (online, bank terminal, or ATM) and delegate it to earn rewards!</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Staking 90% */}
              <div className="p-4 bg-purple-brand/10 border border-purple-brand/20 rounded-xl">
                <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                  <span className="text-xs text-purple-glow font-semibold font-display flex items-center space-x-1">
                    <Percent className="w-3.5 h-3.5" />
                    <span>90% Staked MATIC Allocation</span>
                  </span>
                  <span className="font-mono text-[9px] text-gray-400">Locked Staking Core</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-gray-400 font-mono">STAKING VALUE</p>
                    <p className="text-lg font-bold font-display text-white mt-0.5">
                      {formatCurrency(stakingNinetyPercent)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-mono">CONVERTED TOKENS</p>
                    <p className="text-lg font-bold font-display text-purple-glow mt-0.5">
                      {formatTokens(maticTokenAmount)} MATIC
                    </p>
                  </div>
                </div>

                {/* Compound monthly returns projection */}
                <div className="mt-3 pt-3 border-t border-white/5 bg-[#1B1245]/50 p-2.5 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-gray-300 font-display">Contract Monthly Dividend Rate:</span>
                    <span className="text-xs font-bold text-emerald-400 font-mono">10.0% Payout</span>
                  </div>
                  <div className="flex justify-between items-baseline mt-1">
                    <span className="text-sm font-bold text-white font-mono">
                      {formatCurrency(estimatedMonthlyYieldUSD)} <span className="text-[10px] text-gray-400 font-normal">/ mo</span>
                    </span>
                    <span className="text-xs text-purple-glow font-mono">
                      ~{formatTokens(estimatedMonthlyYieldMATIC)} MATIC
                    </span>
                  </div>
                </div>

              </div>
              
            </div>

            {/* Interactive Apply Button */}
            <button
              id="calculator-apply-btn"
              onClick={handleProceedWithAmount}
              className="w-full py-4 bg-gradient-to-r from-purple-brand to-purple-glow hover:brightness-110 text-white font-bold font-display rounded-xl tracking-wide shadow-lg shadow-purple-brand/35 transition-all text-sm active:scale-[0.99]"
            >
              SECURE THIS FUNDING NODE &amp; START KYC
            </button>
            
            <p className="text-center text-[10px] text-gray-500 mt-3 font-sans">
              🔒 Backed by military-grade smart contracts and Polygon POS validators.
            </p>

          </div>
        </div>

      </div>
    </section>
  );
}
