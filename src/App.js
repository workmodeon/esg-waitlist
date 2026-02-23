import React, { useState, useMemo } from 'react';
import { 
  Building2, User, Mail, Calendar, CheckCircle2, 
  X, Loader2, ArrowRight, Clock, Leaf 
} from 'lucide-react';

const GOOGLE_SHEET_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbyo0XDNh7R2oWGsWvM7Gi-L9VUuMVjCFcyvZJxnf7XvR1Bk-1QvLbzDdwMRR4o50uqiBQ/exec"; 

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    companyName: '',
    personName: '',
    email: '',
    demoDate: ''
  });

  const daysLeft = useMemo(() => {
    const targetDate = new Date("2026-04-14T00:00:00"); 
    const now = new Date();
    const diff = targetDate - now;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setTimeout(() => {
          setIsSuccess(false);
          setFormData({ companyName: '', personName: '', email: '', demoDate: '' });
        }, 500);
      }, 3000);
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen w-full font-sans antialiased flex flex-col items-center justify-center bg-[#F8FAF9] text-slate-900 px-6">
      
      {/* --- LOGO --- */}
      <div className="mb-12">
        <img 
          src="/logo.png" 
          alt="Zissions Logo" 
          className="h-14 w-auto object-contain" 
        />
      </div>

      {/* --- HERO CONTENT --- */}
      <main className="w-full max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
           <Leaf size={14} />
           <span>Sustainability Automation</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
          The future of climate tech <br/> starts with <span className="text-emerald-600">Zissions.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 max-w-xl mx-auto leading-relaxed mb-10">
          Join the exclusive list of forward-thinking companies automating their sustainability future.
        </p>

        <div className="flex flex-col items-center gap-6">
          <button 
            onClick={() => setIsOpen(true)}
            className="px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-lg rounded-xl transition-all shadow-lg shadow-emerald-200 active:scale-95"
          >
            Join the Waitlist
          </button>

          <div className="flex items-center gap-2 text-slate-400 font-medium text-sm">
              <Clock size={16} />
              <span>Only {daysLeft} days left for early access</span>
          </div>
        </div>
      </main>

      {/* --- CLEAN MODAL --- */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 relative">
            <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-500">
              <X size={24} />
            </button>
            
            {isSuccess ? (
              <div className="py-10 text-center">
                <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">You're on the list!</h2>
                <p className="text-slate-500">We'll reach out to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Reserve Access</h2>
                  <p className="text-slate-500 text-sm">Limited spots for the April 2026 cohort.</p>
                </div>
                
                <div className="space-y-3">
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input required name="companyName" placeholder="Company Name" onChange={handleInputChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:border-emerald-500 outline-none transition-all" />
                  </div>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input required name="personName" placeholder="Full Name" onChange={handleInputChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:border-emerald-500 outline-none transition-all" />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input required type="email" name="email" placeholder="Work Email" onChange={handleInputChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:border-emerald-500 outline-none transition-all" />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input required type="date" name="demoDate" min={new Date().toISOString().split('T')[0]} onChange={handleInputChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:border-emerald-500 outline-none transition-all" />
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full mt-4 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "Request Invitation"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="absolute bottom-8 text-slate-400 text-xs tracking-widest uppercase">
        © 2026 Zissions Technology
      </footer>
    </div>
  );
}
