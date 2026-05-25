/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, User, ShieldAlert, Sparkles, Check, HelpCircle } from 'lucide-react';
import { ChatMessage } from '../types';

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(1);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'advisor',
      text: "Hello! Welcome to the MATIC Empowerment Compliance Desk. I am your validator assistance advisor. How can I guide your node allocation today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    { label: "💰 Payout info?", query: "How do I receive the 10% cash payout?" },
    { label: "🔒 Staking safety?", query: "Is the 90% delegation core safe?" },
    { label: "📄 What Address proofs?", query: "What documents are accepted as proof of residency?" },
    { label: "🇺🇸 SSN/Tax privacy?", query: "Is my SSN / Tax identifier secure?" }
  ];

  useEffect(() => {
    // Scroll to bottom whenever messages list grows
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    // Show notification badge
    if (!isOpen && messages.length > 1) {
      setUnreadCount(prev => prev + 1);
    }
  }, [messages, isOpen]);

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate realistic typing delay
    setTimeout(() => {
      let responseText = '';
      const trimmedText = textToSend.toLowerCase();

      if (trimmedText.includes('10%') || trimmedText.includes('ten percent') || trimmedText.includes('payout') || trimmedText.includes('cheque') || trimmedText.includes('cash') || trimmedText.includes('funding')) {
        responseText = "Under Article 1, you keep 10% of your total allocation as cash (e.g. $10,000 kept from a $100,000 node). Upon compliance approval, this is dispatched immediately via SEPA direct wire, institutional ACH transfer, or registered certified cheque. There is zero repayment required!";
      } else if (trimmedText.includes('90%') || trimmedText.includes('staked') || trimmedText.includes('staker') || trimmedText.includes('where') || trimmedText.includes('delegate') || trimmedText.includes('matic')) {
        responseText = "The remaining 90% is swapped to MATIC at the rate of $0.50/token and locked in multi-signature cold storage vault contracts. This core is delegated to secure partner Polygon core consensus nodes. You receive dividends from the generator monthly (up to 10.00% monthly).";
      } else if (trimmedText.includes('id') || trimmedText.includes('ssn') || trimmedText.includes('tax') || trimmedText.includes('sin') || trimmedText.includes('nino') || trimmedText.includes('privacy') || trimmedText.includes('secure') || trimmedText.includes('safe')) {
        responseText = "Highly secure. We operate on Sandboxed Hardware Enclaves utilizing industry leading encryption algorithms. Your SSN, TFN, or National Identity codes are hashed immediately off-chain. Under standard policy regulations, no document records are stored permanently in public indexes.";
      } else if (trimmedText.includes('country') || trimmedText.includes('countries') || trimmedText.includes('region') || trimmedText.includes('state') || trimmedText.includes('us') || trimmedText.includes('united')) {
        responseText = "We support participants residing in the US, Canada, Great Britain (UK), Germany, and Australia. Be sure your uploaded ID matches your selected regional node registry to prevent compliance flow suspensions.";
      } else if (trimmedText.includes('address') || trimmedText.includes('bill') || trimmedText.includes('proof') || trimmedText.includes('residency')) {
        responseText = "Accepted Proofs of Residency are municipal utility bills (gas, electricity, water), registered bank statements, or official renter insurance agreements dated within 60 days. Blurred documents, screen-captures, or cropped margins are rejected automatically.";
      } else {
        responseText = "Thank you for asking. I am authorized to guide you regarding the MATIC Empowerment program parameters. Please choose your Country Hub inside the Eligibility Portal, fill your standard details, upload required validation documents, and sign the Biometric scroll agreement to complete submission. We review files within 24-72 hours!";
      }

      const advisorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'advisor',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, advisorMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handleOpenToggle = () => {
    setIsOpen(!isOpen);
    setUnreadCount(0);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={handleOpenToggle}
          id="support-chat-trigger"
          className="fixed bottom-6 left-6 z-40 flex items-center space-x-2 bg-gradient-to-r from-purple-brand to-purple-glow text-white font-semibold font-display px-4 py-3 rounded-full shadow-[0_4px_20px_rgba(123,63,228,0.5)] hover:shadow-[0_6px_25px_rgba(123,63,228,0.7)] hover:scale-105 active:scale-95 transition-all outline-none"
        >
          <div className="relative">
            <MessageSquare className="w-5.5 h-5.5 text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-2.5 -right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white border-2 border-[#070412]">
                {unreadCount}
              </span>
            )}
          </div>
          <span className="text-xs sm:text-sm tracking-wide">Advisor Support</span>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse border border-dark-bg"></span>
        </button>
      )}

      {/* Floating Chat Modal Panel */}
      {isOpen && (
        <div 
          id="support-chat-container"
          className="fixed bottom-6 left-6 z-40 w-[90vw] sm:w-[420px] h-[520px] bg-[#110A2E] border-2 border-purple-brand/45 rounded-2xl flex flex-col overflow-hidden shadow-2xl shadow-black/80 font-sans"
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-purple-brand to-purple-dark border-b border-purple-brand/20 flex items-center justify-between">
            <div className="flex items-center space-x-3 text-left">
              <div className="relative w-10 h-10 bg-purple-glow/20 rounded-xl flex items-center justify-center border border-purple-glow/30">
                <MessageSquare className="w-5 h-5 text-purple-glow" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-[#110A2E]"></span>
              </div>
              <div>
                <h4 className="text-sm font-display font-bold text-white tracking-wide">Compliance Advisor Desk</h4>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <span className="text-[10px] font-mono text-emerald-400">Node Operator Live</span>
                  <span className="text-[9px] text-gray-400">• SECURE ESCROW</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors bg-white/5 border border-white/5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Secure disclaimer bar */}
          <div className="bg-[#1A1143]/40 border-b border-purple-brand/10 px-4 py-1.5 flex items-center space-x-2 text-[10px] text-purple-glow font-mono">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-amber-500" />
            <span>Encrypted sandbox. All inquiries strictly safe.</span>
          </div>

          {/* Scroll Area Chat Log */}
          <div 
            ref={scrollRef}
            className="flex-1 p-4 overflow-y-auto space-y-4 bg-purple-dark/10"
          >
            {messages.map((msg) => {
              const IsAdvisor = msg.sender === 'advisor';
              return (
                <div 
                  key={msg.id}
                  className={`flex items-start space-x-2.5 text-left max-w-[85%] ${
                    IsAdvisor ? 'mr-auto' : 'ml-auto flex-row-reverse space-x-reverse'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg shrink-0 ${
                    IsAdvisor ? 'bg-purple-brand/20 text-purple-glow' : 'bg-blue-600/20 text-blue-400'
                  }`}>
                    <User className="w-3.5 h-3.5" />
                  </div>

                  <div className="space-y-1">
                    <div className={`p-3 rounded-xl text-xs sm:text-sm leading-relaxed ${
                      IsAdvisor 
                        ? 'bg-[#181041] border border-purple-brand/20 text-gray-200' 
                        : 'bg-gradient-to-r from-purple-brand to-purple-glow text-white'
                    }`}>
                      {msg.text}
                    </div>
                    <p className="text-[9px] text-gray-500 font-mono tracking-tighter text-right">
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Simulated typing status */}
            {isTyping && (
              <div className="flex items-center space-x-2.5 text-left max-w-[85%] mr-auto">
                <div className="p-1.5 rounded-lg bg-purple-brand/20 text-purple-glow shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="bg-[#181041] border border-purple-brand/10 p-3 rounded-xl flex items-center space-x-1.5">
                  <span className="text-xs text-purple-glow font-mono">Advisor is analyzing</span>
                  <span className="flex space-x-1">
                    <span className="w-1.5 h-1.5 bg-purple-brand rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-purple-brand rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-1.5 h-1.5 bg-purple-brand rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Questions Tag Bar */}
          <div className="px-3 py-2 bg-[#0F0A27]/80 border-t border-purple-brand/10 overflow-x-auto whitespace-nowrap flex space-x-2 scrollbar-none">
            {quickQuestions.map((q) => (
              <button
                key={q.label}
                onClick={() => handleSendMessage(q.query)}
                className="inline-flex items-center space-x-1 bg-purple-brand/10 hover:bg-purple-brand/25 border border-purple-brand/20 rounded-full px-2.5 py-1 text-[10px] text-gray-300 transition-all font-mono"
              >
                <HelpCircle className="w-3 h-3 text-purple-glow" />
                <span>{q.label}</span>
              </button>
            ))}
          </div>

          {/* Field Input Form */}
          <form 
            onSubmit={handleFormSubmit}
            className="p-3 bg-[#0C0821] border-t border-purple-brand/20 flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your compliance question..."
              className="flex-1 bg-white/5 border border-purple-brand/10 hover:border-purple-brand/30 focus:border-purple-brand rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-brand mt-0 font-sans"
              id="chat-input"
            />
            <button
              type="submit"
              className="p-2.5 bg-purple-brand hover:bg-purple-glow text-white rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-40"
              disabled={!inputValue.trim() || isTyping}
              id="chat-send-btn"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
