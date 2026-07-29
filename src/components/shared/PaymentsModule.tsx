'use client';

import React, { useState } from 'react';
import { CreditCard, Download, CheckCircle2, ShieldCheck, Upload, FileText, Sparkles } from 'lucide-react';
import { mockPayments } from '../../data/mockData';

export const PaymentsModule: React.FC = () => {
  const [payments, setPayments] = useState(mockPayments);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const handlePayOnline = (inv: any) => {
    setSelectedInvoice(inv);
    setShowPayModal(true);
  };

  const confirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setPayments(prev =>
        prev.map(p =>
          p.id === selectedInvoice.id
            ? { ...p, status: 'Paid', paidDate: 'Today (Online Payment)', paymentMethod: 'Credit Card (Stripe)' }
            : p
        )
      );
      setIsProcessing(false);
      setShowPayModal(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="clay-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase">
              Financial Management
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-purple-950 mt-1">
              Payments & Lab Fee Receipts
            </h2>
            <p className="text-xs text-purple-600 font-medium">Pay term equipment fees, Zoom access, and download official receipts</p>
          </div>
        </div>

        {/* Invoice List */}
        <div className="space-y-4">
          {payments.map((pay) => (
            <div
              key={pay.id}
              className="p-5 rounded-3xl bg-white border border-purple-100 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className={`clay-badge-icon ${pay.status === 'Paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-purple-950">{pay.invoiceNumber}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      pay.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {pay.status}
                    </span>
                  </div>
                  <p className="text-xs text-purple-700 font-medium mt-0.5">{pay.description}</p>
                  <p className="text-[11px] text-purple-400 mt-1">Due Date: {pay.dueDate} {pay.paidDate && `• Paid on ${pay.paidDate}`}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end shrink-0">
                <span className="text-xl font-black text-purple-950">${pay.amount}.00</span>
                {pay.status === 'Pending' ? (
                  <button
                    onClick={() => handlePayOnline(pay)}
                    className="clay-btn px-5 py-2.5 text-xs font-bold"
                  >
                    Pay Now $45.00
                  </button>
                ) : (
                  <button
                    onClick={() => alert(`Downloading Invoice PDF ${pay.invoiceNumber}...`)}
                    className="clay-btn-secondary px-4 py-2 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> Receipt PDF
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pay Online Modal */}
      {showPayModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4 border border-purple-100">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <h3 className="font-black text-lg text-purple-950">Pay Invoice {selectedInvoice.invoiceNumber}</h3>
              <span className="font-black text-lg text-purple-900">${selectedInvoice.amount}.00</span>
            </div>

            <form onSubmit={confirmPayment} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-purple-900 mb-1">Cardholder Name</label>
                <input
                  type="text"
                  required
                  defaultValue="Mia Sharma"
                  className="w-full px-4 py-2.5 rounded-2xl bg-purple-50 border border-purple-200 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-900 mb-1">Card Number</label>
                <input
                  type="text"
                  required
                  defaultValue="4242 •••• •••• 4242"
                  className="w-full px-4 py-2.5 rounded-2xl bg-purple-50 border border-purple-200 text-xs outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-purple-900 mb-1">Expiry</label>
                  <input
                    type="text"
                    required
                    defaultValue="12/28"
                    className="w-full px-4 py-2.5 rounded-2xl bg-purple-50 border border-purple-200 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-purple-900 mb-1">CVC</label>
                  <input
                    type="text"
                    required
                    defaultValue="888"
                    className="w-full px-4 py-2.5 rounded-2xl bg-purple-50 border border-purple-200 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold text-purple-700 bg-purple-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="clay-btn px-6 py-2 text-xs font-bold flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isProcessing ? 'Processing Payment...' : 'Confirm $45.00'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
