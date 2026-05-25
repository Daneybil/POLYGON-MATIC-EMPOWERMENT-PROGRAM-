/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FAQS } from '../data';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, MessageSquareCode } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'General', 'Financials', 'Verification', 'Staking Structure'];

  const filteredFaqs = selectedCategory === 'All' 
    ? FAQS 
    : FAQS.filter(f => f.category === selectedCategory);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 px-4 sm:px-6 max-w-4xl mx-auto space-y-10 text-left" id="faq-section">
      
      {/* Upper header summary */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center space-x-1 text-xs font-mono uppercase tracking-widest text-[#2563EB] px-3 py-1 bg-white/5 border border-white/10 rounded-full">
          <MessageSquareCode className="w-3.5 h-3.5 text-purple-glow" />
          <span>Need Quick Answers?</span>
        </span>
        <h2 className="text-3xl sm:text-4xl font-display font-black text-white">
          Frequently Answered Queries
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto text-xs sm:text-sm">
          Everything you need to verify about the 10/90 payouts, staking structures, regional requirements, and smart contract escrow guarantees.
        </p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap justify-center gap-2 border-b border-purple-brand/10 pb-6" id="faq-categories">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setOpenIndex(0); // Reset accordion on change
            }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold font-mono border transition-all ${
              selectedCategory === cat 
                ? 'bg-purple-brand/20 border-purple-brand text-white shadow-lg' 
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion list */}
      <div className="space-y-4" id="faq-accordion-list">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={faq.question}
                className={`border rounded-xl overflow-hidden transition-all ${
                  isOpen 
                    ? 'border-purple-brand bg-[#110A2F] shadow-lg' 
                    : 'border-white/5 bg-[#140F30]/30 hover:border-purple-brand/30'
                }`}
              >
                {/* Header button click */}
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full flex justify-between items-center p-5 text-left font-display text-sm sm:text-base font-bold text-white transition-colors"
                >
                  <span className="flex items-center space-x-3 pr-4">
                    <HelpCircle className={`w-5 h-5 shrink-0 ${isOpen ? 'text-purple-glow animate-pulse' : 'text-gray-500'}`} />
                    <span>{faq.question}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-purple-glow shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 shrink-0" />
                  )}
                </button>

                {/* Content body with height check */}
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-purple-brand/10 text-xs sm:text-sm text-gray-300 leading-relaxed font-sans bg-purple-dark/20">
                    <p className="whitespace-pre-line">{faq.answer}</p>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5 text-[10px] font-mono text-gray-500">
                      <span>Category: {faq.category}</span>
                      <span className="text-emerald-400">Escrow Audited Safe</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 py-10 font-mono">No FAQs found under this category.</p>
        )}
      </div>

      {/* Disclaimer quote */}
      <div className="text-center p-4 bg-purple-brand/5 border border-purple-brand/10 rounded-xl">
        <p className="text-[10px] text-gray-500 font-sans max-w-xl mx-auto">
          Still have specialized questions about tax withholdings, bank wire routines, or network contract periods? Use our virtual chat advisor below for round-the-clock compliance queries.
        </p>
      </div>

    </section>
  );
}
