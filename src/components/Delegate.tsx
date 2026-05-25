/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Coins, ShieldCheck, Wallet, ArrowRight, Loader2, Award, 
  ChevronRight, RefreshCw, Smartphone, TrendingUp, CheckCircle2,
  Lock, AlertTriangle, Info, ArrowUpRight, Copy, Terminal
} from 'lucide-react';

interface DelegateProps {
  onViewChange: (view: string) => void;
  savedAmount: number;
}

export default function Delegate({ onViewChange, savedAmount }: DelegateProps) {
  const [walletConnectState, setWalletConnectState] = useState<'DISCONNECTED' | 'CONNECTING' | 'CONNECTED'>('DISCONNECTED');
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [delegatorBalance, setDelegatorBalance] = useState<number>(250000); // 250,000 standard MATIC balance mock
  const [activeMaticPrice, setActiveMaticPrice] = useState<number>(0.3850);
  const [isPriceLoading, setIsPriceLoading] = useState<boolean>(true);
  
  // Staking states
  const [delegateAmount, setDelegateAmount] = useState<string>('50000');
  const [selectedValidator, setSelectedValidator] = useState<string>('Matic-Empower-Node-01');
  const [activeDelegations, setActiveDelegations] = useState([
    { id: 'del-101', validator: 'Matic-Empower-Node-01', amount: 150000, date: '2026-05-10', rewards: 2500, txHash: '0x8d5c...ef31' },
    { id: 'del-102', validator: 'Matic-Empower-Node-03', amount: 75000, date: '2026-05-14', rewards: 1250, txHash: '0x3ea2...4bb9' }
  ]);
  
  // Forms & interactive triggers
  const [isDelegationsLoading, setIsDelegationsLoading] = useState(false);
  const [newDelegationSuccess, setNewDelegationSuccess] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [rewardsClaimedState, setRewardsClaimedState] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  // Fetch true MATIC price from CoinGecko & backup endpoints
  const fetchPrice = async () => {
    setIsPriceLoading(true);
    try {
      // CoinGecko
      const cgResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=polygon-ecosystem-token&vs_currencies=usd');
      if (cgResponse.ok) {
        const cgData = await cgResponse.json();
        if (cgData && cgData['polygon-ecosystem-token'] && typeof cgData['polygon-ecosystem-token'].usd === 'number') {
          setActiveMaticPrice(cgData['polygon-ecosystem-token'].usd);
          setIsPriceLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn('CoinGecko failed in Delegate tab, trying Binance backup', e);
    }

    try {
      // Binance Backup (Most robust)
      const binResponse = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=POLUSDT');
      if (binResponse.ok) {
        const binData = await binResponse.json();
        if (binData && binData.price) {
          setActiveMaticPrice(parseFloat(binData.price));
          setIsPriceLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Binance POLUSDT failed, trying CryptoCompare MATIC', e);
    }

    try {
      // CryptoCompare Backup
      const ccResponse = await fetch('https://min-api.cryptocompare.com/data/price?fsym=MATIC&tsyms=USD');
      if (ccResponse.ok) {
        const ccData = await ccResponse.json();
        if (ccData && ccData.USD) {
          setActiveMaticPrice(ccData.USD);
        }
      }
    } catch (e) {
      console.warn('CryptoCompare backup failed', e);
    } finally {
      setIsPriceLoading(false);
    }
  };

  useEffect(() => {
    fetchPrice();
    const priceInterval = setInterval(fetchPrice, 45000);

    // Sync live connected wallet if present
    const cachedWallet = localStorage.getItem('mep_active_wallet');
    const cachedWalletType = localStorage.getItem('mep_active_wallet_type');
    const cachedBalance = localStorage.getItem('mep_active_wallet_balance');
    if (cachedWallet && cachedWalletType) {
      setWalletAddress(cachedWallet);
      setSelectedWallet(cachedWalletType);
      setWalletConnectState('CONNECTED');
    }
    if (cachedBalance) {
      const parsed = parseFloat(cachedBalance);
      if (!isNaN(parsed)) {
        setDelegatorBalance(parsed);
      }
    }

    return () => clearInterval(priceInterval);
  }, []);

  // Connect mock wallets
  const handleConnectWallet = (walletType: string) => {
    setWalletConnectState('CONNECTING');
    setSelectedWallet(walletType);
    
    setTimeout(() => {
      // Generate standard random web3 looking address
      const randomHex = Math.floor(Math.random() * 1e16).toString(16);
      const generatedAddress = `0x71C${randomHex.toUpperCase()}49A1`;
      setWalletAddress(generatedAddress);
      setWalletConnectState('CONNECTED');

      localStorage.setItem('mep_active_wallet', generatedAddress);
      localStorage.setItem('mep_active_wallet_type', walletType);
      localStorage.setItem('mep_active_wallet_balance', delegatorBalance.toString());
    }, 1200);
  };

  const handleDisconnect = () => {
    setWalletConnectState('DISCONNECTED');
    setWalletAddress('');
    setSelectedWallet('');
    localStorage.removeItem('mep_active_wallet');
    localStorage.removeItem('mep_active_wallet_type');
    localStorage.removeItem('mep_active_wallet_balance');
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Delegate execution flow
  const handleDelegateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(delegateAmount);
    if (isNaN(amountNum) || amountNum <= 0 || amountNum > delegatorBalance) return;

    setIsDelegationsLoading(true);
    
    setTimeout(() => {
      // Deduct balance and join active group
      setDelegatorBalance(prev => {
        const next = prev - amountNum;
        localStorage.setItem('mep_active_wallet_balance', next.toString());
        return next;
      });
      const newDel = {
        id: `del-${Date.now().toString().slice(-3)}`,
        validator: selectedValidator,
        amount: amountNum,
        date: new Date().toISOString().split('T')[0],
        rewards: 0,
        txHash: `0x${Math.floor(Math.random() * 1e16).toString(16)}...9f8b`
      };
      setActiveDelegations([newDel, ...activeDelegations]);
      setIsDelegationsLoading(false);
      setNewDelegationSuccess(true);
      setTimeout(() => setNewDelegationSuccess(false), 5000);
    }, 1500);
  };

  // Claim staking yield
  const handleClaimAllStakingRewards = () => {
    setIsClaiming(true);
    setTimeout(() => {
      // Reset rewards inside list mock
      setActiveDelegations(prev => prev.map(d => ({ ...d, rewards: 0 })));
      setIsClaiming(false);
      setRewardsClaimedState(true);
      setTimeout(() => setRewardsClaimedState(false), 5000);
    }, 1400);
  };

  // Calculate sum rates
  const totalStaked = activeDelegations.reduce((acc, curr) => acc + curr.amount, 0);
  const totalUncollectedRewards = activeDelegations.reduce((acc, curr) => acc + curr.rewards, 0);

  // Expected returns
  const monthlyyieldRate = 0.10; // 10% monthly compounding
  const estimatedMonthlyGainTokens = totalStaked * monthlyyieldRate;
  const estimatedMonthlyGainUSD = estimatedMonthlyGainTokens * activeMaticPrice;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 text-left space-y-10" id="delegate-matrix-view">
      
      {/* Visual Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-purple-brand/10 pb-6 gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-brand/20 to-purple-glow/20 border border-purple-brand/40 px-3 py-1 rounded-full text-xs font-mono font-bold text-purple-glow uppercase">
            <Coins className="w-3.5 h-3.5" />
            <span>Non-Custodial Polygon Consensus Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white leading-none uppercase tracking-tight">
            DELEGATE &amp; STAKE MATIC
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm max-w-2xl leading-relaxed font-sans">
            Connect any major Web3 dApp wallet directly to authorize MATIC delegation. Sponsoring approved program validator nodes secures robust consensus yields of up to 10% monthly.
          </p>
        </div>

        {/* Live Oracle Widget */}
        <div className="p-3 bg-gradient-to-br from-[#120B2F] to-[#0A051C] border-2 border-emerald-500/35 rounded-2xl text-left font-mono text-xs shrink-0 self-start md:self-auto shadow-lg shadow-emerald-500/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>
          <span className="text-gray-400 text-[9px] block uppercase font-bold tracking-widest flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>POLYGON ORACLE PRICE FEED</span>
          </span>
          <div className="flex items-center space-x-2 mt-1">
            <Coins className="w-4.5 h-4.5 text-purple-glow animate-spin-slow" />
            <span className="text-white font-black text-xs sm:text-sm">1 MATIC = </span>
            {isPriceLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-glow inline" />
            ) : (
              <span className="text-emerald-400 font-bold text-xs sm:text-sm bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/25">${activeMaticPrice.toFixed(4)} USD</span>
            )}
          </div>
        </div>
      </div>

      {walletConnectState === 'DISCONNECTED' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch animate-fadeIn">
          
          {/* Sponsoring Matrix hook */}
          <div className="lg:col-span-7 bg-[#110A2E]/90 border-2 border-[#8247E5]/25 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-brand/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="space-y-4">
              <h3 className="font-display font-black text-2xl text-white uppercase tracking-tight">
                Secure Validator Joint Escrow System
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                The delegation framework integrates natively with physical POS hardware nodes. To establish a secure staker channel, connect your verified Trust Wallet, MetaMask, or browser Web3 terminal below.
              </p>
              
              <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-3 font-sans text-xs">
                <p className="font-bold text-white uppercase tracking-wider text-purple-glow flex items-center space-x-1.5 font-display">
                  <span className="p-1 bg-[#8247E5]/15 text-purple-glow rounded-lg">🛡️</span>
                  <span>Consensus Rules of Delegation:</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300">
                  <div className="space-y-1 bg-white/5 p-2.5 rounded-xl border border-white/5">
                    <span className="font-bold text-white text-[11px] block">Non-Custodial Escrow</span>
                    <p className="text-[10.5px] text-gray-400 leading-relaxed">Your underlying funds represent delegated nodes and remain secure in non-custodial smart contract vaults permanently.</p>
                  </div>
                  <div className="space-y-1 bg-white/5 p-2.5 rounded-xl border border-white/5">
                    <span className="font-bold text-white text-[11px] block">No Commission Lockouts</span>
                    <p className="text-[10.5px] text-gray-400 leading-relaxed">Commission fee rates are strictly locked at 0.00% permanently. Enjoy 100% of generated POS consensus block fees.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#120835] rounded-xl p-4.5 border border-[#8247E5]/35 space-y-2 text-[11px] font-mono text-gray-400">
              <div className="flex justify-between items-center text-white font-bold mb-1 pb-1 border-b border-white/5 uppercase">
                <span>Validator Statistics</span>
                <span>Combined Pool States</span>
              </div>
              <div className="flex justify-between">
                <span>Active Joint Delegators:</span>
                <span className="text-white">1,842 verified stakers</span>
              </div>
              <div className="flex justify-between">
                <span>Total Sponsored Coins:</span>
                <span className="text-purple-glow font-bold">128,485,910 MATIC</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>Averaged Reward Multiplier:</span>
                <span>10.00% Payout Rates</span>
              </div>
            </div>
          </div>

          {/* Connect interactive modal box */}
          <div className="lg:col-span-5 bg-[#120B2F] border-2 border-purple-brand/50 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xl relative shadow-purple-brand/10">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-brand/20 rounded-xl text-purple-glow">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-base">Select Web3 Network</h3>
                  <p className="text-[10px] text-gray-400 font-mono">DApp &amp; Wallet Verification</p>
                </div>
              </div>
              
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                Choose your primary Web3 transaction client. Rest assured, our node gateway operates entirely via client-side ledger queries. We never obtain access to private credentials or seed phrases.
              </p>

              {/* Wallet lists */}
              <div className="space-y-2.5">
                {[
                  { name: 'MetaMask', desc: 'Secure desktop extension &amp; mobile connector', accent: 'border-orange-500/30 hover:bg-orange-500/5 focus:border-orange-500' },
                  { name: 'Trust Wallet', desc: 'Official Binance web3 mobile trust application', accent: 'border-blue-500/30 hover:bg-blue-500/5 focus:border-blue-500' },
                  { name: 'Coinbase Wallet', desc: 'Sovereign custodial &amp; network browser vault', accent: 'border-indigo-500/30 hover:bg-indigo-500/5 focus:border-indigo-500' },
                  { name: 'WalletConnect Registry', desc: 'Dynamic QR terminal for 100+ multi-chain dApps', accent: 'border-emerald-500/30 hover:bg-emerald-500/5 focus:border-emerald-500' }
                ].map((w, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleConnectWallet(w.name)}
                    className={`w-full p-4 rounded-xl text-left bg-black/40 border-2 transition-all flex justify-between items-center cursor-pointer group hover:border-[#8247E5]/70 active:scale-[0.98] ${w.accent}`}
                  >
                    <div className="space-y-1">
                      <span className="font-display font-medium text-xs sm:text-sm text-white group-hover:text-purple-glow transition-colors">{w.name}</span>
                      <p className="text-[10px] text-gray-400 leading-none" dangerouslySetInnerHTML={{ __html: w.desc }}></p>
                    </div>
                    <ChevronRight className="w-4.5 h-4.5 text-gray-500 group-hover:text-purple-glow group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[10px] text-gray-500 text-center font-sans tracking-tight">
              📂 Ensure your Trust Wallet or App is configured to the Polygon Mainnet chain securely.
            </p>
          </div>

        </div>
      )}

      {walletConnectState === 'CONNECTING' && (
        <div className="bg-[#120B2F] border-2 border-purple-brand/35 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-6 animate-pulse">
          <Loader2 className="w-16 h-16 animate-spin text-purple-glow mx-auto" />
          <div className="space-y-2">
            <h3 className="font-display font-black text-xl text-white uppercase">Authorizing secure node handshake</h3>
            <p className="text-xs text-gray-300 font-sans leading-relaxed">
              Establishing compliance secure connection with your {selectedWallet} client on the Polygon mainnet blockchain ledger...
            </p>
          </div>
        </div>
      )}

      {walletConnectState === 'CONNECTED' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch animate-fadeIn">
          
          {/* Left: Active consensus control panel */}
          <div className="lg:col-span-5 bg-[#120B2E] border-2 border-[#8247E5]/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              <div className="flex justify-between items-start border-b border-white/5 pb-4">
                <div className="space-y-1">
                  <span className="font-mono text-[9px] text-[#3B82F6] font-bold bg-[#3B82F6]/10 px-2.5 py-1 rounded border border-[#3B82F6]/25 uppercase flex items-center space-x-1 w-fit">
                    <span className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full animate-pulse"></span>
                    <span>WALLET SESSION ACTIVE</span>
                  </span>
                  <p className="text-xs text-gray-400 mt-1 uppercase font-mono tracking-wider font-semibold">Active Client: {selectedWallet}</p>
                </div>
                
                <button
                  onClick={handleDisconnect}
                  className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-md text-[10px] font-mono tracking-wider transition-colors uppercase font-bold cursor-pointer"
                >
                  Disconnect
                </button>
              </div>

              {/* Connected Address Card */}
              <div className="p-4 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-between font-mono text-[11px] text-gray-300">
                <div className="space-y-1">
                  <span className="text-gray-500 text-[10px] block uppercase">Address Index:</span>
                  <span className="text-white font-bold">{walletAddress}</span>
                </div>
                <button
                  type="button"
                  onClick={copyAddress}
                  className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer"
                  title="Copy wallet address"
                >
                  {copiedText ? <span className="text-emerald-400 text-[9px] uppercase font-bold">Copied!</span> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Wallet Mock Balance */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-purple-brand/5 border border-[#8247E5]/20 rounded-xl space-y-1">
                  <span className="text-gray-400 text-[9px] font-mono uppercase block">DApp MATIC Balance</span>
                  <p className="text-xl font-bold font-display text-white">
                    {new Intl.NumberFormat('en-US').format(delegatorBalance)} POL
                  </p>
                </div>
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl space-y-1">
                  <span className="text-emerald-400 text-[9px] font-mono uppercase block">Fiat Valuation Equivalent</span>
                  <p className="text-xl font-bold font-display text-emerald-400">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(delegatorBalance * activeMaticPrice)}
                  </p>
                </div>
              </div>

              {/* DELEGATE INTERACTIVE FORM */}
              <form onSubmit={handleDelegateSubmit} className="space-y-4 pt-2">
                <div className="space-y-1.5 text-left">
                  <label className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-widest block">Choose Target physical validator node:</label>
                  <select 
                    value={selectedValidator}
                    onChange={(e) => setSelectedValidator(e.target.value)}
                    className="w-full bg-[#0E0629] border border-purple-brand/35 text-white font-mono rounded-xl p-3 text-xs focus:outline-none focus:border-purple-glow font-bold"
                  >
                    <option value="Matic-Empower-Node-01">Matic-Empower-Node-01 (U.S., Chicago Hardware)</option>
                    <option value="Matic-Empower-Node-02">Matic-Empower-Node-02 (EU, Frankfurt Vault)</option>
                    <option value="Matic-Empower-Node-03">Matic-Empower-Node-03 (APAC, Singapore Enclave)</option>
                  </select>
                </div>

                <div className="space-y-1.5 text-left">
                  <div className="flex justify-between">
                    <label className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-widest block">Amount of MATIC/POL to Sponsor:</label>
                    <button 
                      type="button" 
                      onClick={() => setDelegateAmount(delegatorBalance.toString())}
                      className="text-[10px] font-mono text-purple-glow hover:text-white uppercase font-bold"
                    >
                      Max Staker Amount
                    </button>
                  </div>
                  <div className="relative">
                    <input 
                      type="number"
                      value={delegateAmount}
                      onChange={(e) => setDelegateAmount(e.target.value)}
                      min="100"
                      max={delegatorBalance}
                      className="w-full bg-[#0E0629] border border-purple-brand/35 text-white font-mono rounded-xl p-4.5 text-sm focus:outline-none focus:border-purple-glow font-bold pr-16"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono font-black text-purple-glow">
                      POL / MATIC
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isDelegationsLoading || parseFloat(delegateAmount) <= 0 || parseFloat(delegateAmount) > delegatorBalance}
                  className="w-full py-4 bg-gradient-to-r from-purple-brand to-[#8247E5] hover:brightness-110 active:scale-95 transition-all text-white font-bold font-display rounded-xl text-xs uppercase tracking-widest flex items-center justify-center space-x-2 shadow-lg shadow-purple-brand/20 cursor-pointer"
                >
                  {isDelegationsLoading ? (
                    <>
                      <Loader2 className="w-4.5 h-4.5 animate-spin text-white" />
                      <span>Broadcasting delegation smart transaction...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Delegate Now to {selectedValidator.slice(-7)}</span>
                    </>
                  )}
                </button>
              </form>

              {newDelegationSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono text-center text-[10.5px] rounded-lg animate-fadeIn">
                  🎉 Transaction Successful! The delegation block is integrated. Check rewards update below.
                </div>
              )}

            </div>

            <div className="p-4 bg-[#0A0421] border border-white/5 rounded-2xl flex items-start space-x-2.5 text-[10.5px] text-gray-400 leading-normal">
              <Info className="w-4.5 h-4.5 text-purple-glow shrink-0" />
              <p>
                <strong>Unlocking Timelines:</strong> Delegated coins represents physical nodes and reside directly on POS hardware blocks. To request consensus unlocking, please file an SLA request through compliance live messenger channels.
              </p>
            </div>
          </div>

          {/* Right: Delegators history and stats ledger */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            
            {/* Real Stats Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="p-5 bg-[#120B2F] border border-purple-brand/15 rounded-2xl space-y-1 text-left">
                <span className="text-gray-400 text-[10px] font-mono uppercase block">Active Delegations</span>
                <p className="text-2xl font-black font-display text-white">
                  {new Intl.NumberFormat('en-US').format(totalStaked)} MATIC
                </p>
                <span className="text-[10px] font-mono text-gray-500 block truncate">Valued: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalStaked * activeMaticPrice)}</span>
              </div>

              <div className="p-5 bg-gradient-to-br from-[#120B2F] to-[#0A051C] border-2 border-[#8247E5]/35 rounded-2xl space-y-1 text-left">
                <span className="text-[#8247E5] text-[10px] font-mono uppercase block">Expected Yield Gain</span>
                <p className="text-2xl font-black font-display text-emerald-400">
                  {new Intl.NumberFormat('en-US').format(estimatedMonthlyGainTokens)} POL <span className="text-xs text-gray-400">/ mo</span>
                </p>
                <span className="text-[10px] font-mono text-[#D8B4FE] block">Equivalent: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(estimatedMonthlyGainUSD)} USD</span>
              </div>

              <div className="p-5 bg-[#0F0829] border border-[#8247E5]/15 rounded-2xl space-y-2 text-left flex flex-col justify-between">
                <div className="space-y-0.5">
                  <span className="text-gray-400 text-[10px] font-mono uppercase block">Accumulated Staking Rewards</span>
                  <p className="text-xl font-bold font-mono text-emerald-400">
                    +{new Intl.NumberFormat('en-US').format(totalUncollectedRewards)} MATIC
                  </p>
                </div>
                
                <button
                  onClick={handleClaimAllStakingRewards}
                  disabled={totalUncollectedRewards <= 0 || isClaiming}
                  className={`w-full py-2 px-1 rounded-lg text-[10px] font-bold font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    totalUncollectedRewards > 0 && !isClaiming
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md'
                      : 'bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed'
                  }`}
                >
                  {isClaiming ? 'Claiming...' : 'Claim consensus rewards'}
                </button>
              </div>

            </div>

            {rewardsClaimedState && (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono text-center text-xs rounded-xl animate-fadeIn">
                🎉 Yield rewards fully collected and credited to your connected wallet!
              </div>
            )}

            {/* Active delegations list */}
            <div className="bg-[#120B2F] border-2 border-purple-brand/20 rounded-3xl p-6 sm:p-7 space-y-5 text-left flex-grow">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <h4 className="font-display font-bold text-base text-white">Consensus Active Delegations</h4>
                <span className="text-[10px] font-mono text-purple-glow uppercase font-bold bg-[#8247E5]/10 px-2.5 py-1 rounded border border-[#8247E5]/20">STAKED LEDGER INDEX</span>
              </div>

              <div className="space-y-3.5 overflow-y-auto max-h-80 pr-1">
                {activeDelegations.map((del) => (
                  <div key={del.id} className="p-4 bg-[#0F0829] border border-white/5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-glow animate-pulse"></span>
                        <span className="text-white font-bold text-xs sm:text-sm font-display">{del.validator}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10.5px] text-gray-400 font-mono">
                        <div>Staking Since: <span className="text-gray-300 font-semibold">{del.date}</span></div>
                        <div>TX Hash: <span className="text-purple-glow select-all font-semibold">{del.txHash}</span></div>
                        <div>Delegation ID: <span className="text-gray-300">{del.id}</span></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0 justify-between sm:justify-end">
                      <div className="text-left sm:text-right">
                        <p className="font-bold text-white font-mono text-sm">
                          {new Intl.NumberFormat('en-US').format(del.amount)} POL
                        </p>
                        <span className="text-[10px] text-gray-400 font-mono">
                          ~ {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(del.amount * activeMaticPrice)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded uppercase font-bold border border-emerald-500/20">
                          Yield Active
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Quick terminal node logs */}
            <div className="p-4 bg-black/95 rounded-2xl border-2 border-white/10 font-mono text-[10.5px] text-left text-gray-400 space-y-1">
              <div className="flex items-center space-x-1 border-b border-white/5 pb-1 mb-1 text-purple-glow font-bold">
                <Terminal className="w-3.5 h-3.5 text-purple-glow" />
                <span>POLYGON LEDGER STATUS PROTOCOL</span>
              </div>
              <div className="leading-relaxed space-y-0.5">
                <div>[2026-05-24T12:00:21Z] Connected successfully to consensus node #1842.</div>
                <div>[2026-05-24T12:15:35Z] Block index 9482719 synced cleanly. Epoch duration is locked.</div>
                <div className="text-emerald-400 font-bold">[ONLINE] Staker validation escrow accounts fully active on node group MATIC_POS_MAINNET.</div>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
