import React, { useState, useEffect, useMemo } from 'react';
import { 
  Upload, ShieldCheck, ShieldAlert, ScanLine, 
  CheckCircle2, AlertTriangle, X, Wallet, 
  History, Loader2, Keyboard, Lock, Building2, Search
} from 'lucide-react';
import Tesseract from 'tesseract.js';

interface Fund {
  id: string;
  name: string;
  type: 'RESTRICTED' | 'UNRESTRICTED';
  allowedCategories: string[];
  initialBalance: number;
}

interface ExpenseLog {
  id: string;
  vendor: string;
  amount: number;
  project: string;
  fundId: string;
  date: string;
  status: 'APPROVED' | 'REJECTED';
}

export default function ExpenseLockboxView() {
  const [activeInputTab, setActiveInputTab] = useState<'ocr' | 'manual'>('ocr');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [violation, setViolation] = useState<string | null>(null);
  const [isFormReady, setIsFormReady] = useState(false);
  
  // Vendor Verification State
  const [verifyingVendor, setVerifyingVendor] = useState(false);
  const [vendorStatus, setVendorStatus] = useState<'idle' | 'verified' | 'blacklisted'>('idle');

  // 1. STRICT FUND RULES
  const FUNDS_CONFIG: Fund[] = [
    { 
      id: 'F1', name: 'General Operating Fund', type: 'UNRESTRICTED', initialBalance: 400000,
      allowedCategories: ['ALL'] 
    },
    { 
      id: 'F2', name: 'Vidya Shakti (Education)', type: 'RESTRICTED', initialBalance: 500000,
      allowedCategories: ['Educational Materials', 'Tuition Fees', 'Stationery'] 
    },
    { 
      id: 'F3', name: 'Drishti Eye Camp', type: 'RESTRICTED', initialBalance: 350000,
      allowedCategories: ['Medical Supplies', 'Surgery Costs', 'Camp Equipment'] 
    },
  ];

  // 2. HISTORY
  const [history, setHistory] = useState<ExpenseLog[]>([
    { id: 'E1', vendor: 'City Stationery', amount: 2500, project: 'Vidya Shakti', fundId: 'F2', date: 'Yesterday', status: 'APPROVED' },
    { id: 'E2', vendor: 'Taj Hotel (Party)', amount: 15000, project: 'Drishti Eye Camp', fundId: 'F3', date: '10 Jan', status: 'REJECTED' },
  ]);

  // 3. BALANCE CALCULATION
  const funds = useMemo(() => {
    return FUNDS_CONFIG.map(fund => {
      const spent = history
        .filter(h => h.fundId === fund.id && h.status === 'APPROVED')
        .reduce((sum, item) => sum + item.amount, 0);
      return { ...fund, currentBalance: fund.initialBalance - spent, spent: spent };
    });
  }, [history]);

  const [formData, setFormData] = useState({
    vendor: '', 
    gstin: '', 
    amount: '', 
    date: '', 
    fundId: '', 
    category: '', 
    imagePreview: '' as string | null
  });

  // --- OCR LOGIC ---
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setActiveInputTab('ocr');
    const objectUrl = URL.createObjectURL(file);
    
    setFormData({ 
      vendor: 'Scanning...', 
      gstin: '', 
      amount: '...', 
      date: '', 
      fundId: '', 
      category: '', 
      imagePreview: objectUrl 
    });
    
    setIsScanning(true);
    setScanProgress(0);
    setIsFormReady(false);
    setVendorStatus('idle'); // Reset verification

    Tesseract.recognize(
      file, 'eng',
      { logger: m => { if (m.status === 'recognizing text') setScanProgress(Math.floor(m.progress * 100)); } }
    ).then(({ data: { text } }) => {
      parseBillData(text); 
      setIsScanning(false);
      setIsFormReady(true);
    }).catch(err => {
      console.error(err);
      setIsScanning(false);
      alert("OCR Failed. Please enter manually.");
      enableManualEntry();
    });
  };

  const parseBillData = (text: string) => {
    const totalMatch = text.match(/(?:Total|Amount|Net|Payable|₹|Rs\.?)[\s:]*([\d,]+\.?\d*)/i);
    let extractedAmount = '';

    if (totalMatch && totalMatch[1]) {
      extractedAmount = totalMatch[1].replace(/,/g, '');
    }

    const dateMatch = text.match(/\d{2}[/-]\d{2}[/-]\d{4}/);
    
    // regex for standard GSTIN format
    const gstinMatch = text.match(/\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}/);
    
    const lines = text.split('\n').filter(line => line.trim().length > 3);
    const vendorName = lines[0] || "Unknown Vendor";

    setFormData(prev => ({
      ...prev,
      vendor: vendorName.substring(0, 25),
      gstin: gstinMatch ? gstinMatch[0] : '', // Auto-fill if found
      amount: extractedAmount,
      date: dateMatch ? dateMatch[0] : new Date().toISOString().split('T')[0],
      fundId: '',
      category: ''
    }));
  };

  const enableManualEntry = () => {
    setActiveInputTab('manual');
    setIsFormReady(true);
    setVendorStatus('idle');
    setFormData({ vendor: '', gstin: '', amount: '', date: new Date().toISOString().split('T')[0], fundId: '', category: '', imagePreview: null });
  };

  // 🟢 VENDOR VERIFICATION LOGIC (India Level Prototype)
  const verifyVendor = () => {
    const inputGstin = formData.gstin.trim().toUpperCase();
    
    if (!inputGstin) {
        alert("Please enter a GSTIN");
        return;
    }

    setVerifyingVendor(true);
    
    // Mock API Call delay
    setTimeout(() => {
        setVerifyingVendor(false);
        
        // 🟢 Regex for Valid Indian GSTIN:
        // 2 numbers (State) + 5 letters (PAN) + 4 numbers (PAN) + 1 letter (PAN) + 1 Entity + Z + 1 Checksum
        const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

        if (gstinRegex.test(inputGstin)) {
            setVendorStatus('verified');
        } else {
            setVendorStatus('blacklisted');
        }
    }, 1500);
  };

  // --- COMPLIANCE LOGIC ---
  useEffect(() => {
    if (!formData.fundId || !formData.category) {
      setViolation(null);
      return;
    }
    const selectedFund = FUNDS_CONFIG.find(f => f.id === formData.fundId);
    if (!selectedFund) return;

    if (selectedFund.type === 'UNRESTRICTED') {
      setViolation(null);
      return;
    }

    if (!selectedFund.allowedCategories.includes(formData.category)) {
      setViolation(`MISUSE BLOCK: '${selectedFund.name}' cannot pay for '${formData.category}'.`);
    } else {
      setViolation(null);
    }

  }, [formData.fundId, formData.category]);

  const handlePay = () => {
    if (!formData.vendor || !formData.amount || !formData.fundId) {
      alert("Please fill in all details.");
      return;
    }

    const selectedFund = FUNDS_CONFIG.find(f => f.id === formData.fundId);
    
    const newLog: ExpenseLog = {
      id: 'E' + Math.random().toString().substr(2, 4),
      vendor: formData.vendor,
      amount: parseFloat(formData.amount),
      project: selectedFund?.name || 'Unknown',
      fundId: formData.fundId,
      date: 'Today',
      status: 'APPROVED'
    };
    
    setHistory([newLog, ...history]);
    setFormData({ vendor: '', gstin: '', amount: '', date: '', fundId: '', category: '', imagePreview: null });
    setIsFormReady(false);
    setVendorStatus('idle');
    setActiveInputTab('ocr');
    alert("Payment Approved! Ledger Updated.");
  };

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans text-slate-800 space-y-8">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="text-emerald-600" /> Expense Lockbox
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            AI-powered compliance engine. Verify Vendors & Funds before release.
          </p>
        </div>
      </div>
      
      {/* LIVE FUNDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {funds.map(fund => (
          <div key={fund.id} className={`p-6 rounded-xl border shadow-sm transition-all ${fund.type === 'RESTRICTED' ? 'bg-emerald-50 border-emerald-100' : 'bg-blue-50 border-blue-100'}`}>
             <div className="flex justify-between items-start mb-2">
               <span className={`text-[10px] font-bold px-2 py-1 rounded tracking-wide ${fund.type === 'RESTRICTED' ? 'bg-emerald-200 text-emerald-800' : 'bg-blue-200 text-blue-800'}`}>{fund.type}</span>
               <Wallet className={fund.type === 'RESTRICTED' ? 'text-emerald-600' : 'text-blue-600'} size={20}/>
             </div>
             <p className="text-sm text-slate-600 font-semibold truncate">{fund.name}</p>
             <h3 className="text-2xl font-bold text-slate-900 mt-1">₹{fund.currentBalance.toLocaleString()}</h3>
             <p className="text-[10px] text-slate-500 mt-1">{Math.round((fund.spent / fund.initialBalance) * 100)}% Budget Used</p>
          </div>
        ))}
      </div>

      {/* MAIN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: INPUT */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-100 p-1 rounded-xl flex">
            <button onClick={() => { setActiveInputTab('ocr'); setIsFormReady(false); }} className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${activeInputTab === 'ocr' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              <ScanLine size={16}/> Scan Bill
            </button>
            <button onClick={enableManualEntry} className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${activeInputTab === 'manual' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              <Keyboard size={16}/> Manual Entry
            </button>
          </div>

          {activeInputTab === 'ocr' ? (
            <div className={`relative h-96 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden bg-slate-50 border-slate-300 ${isScanning ? 'pointer-events-none' : ''}`}>
               {isScanning ? (
                 <div className="text-center z-10 space-y-4">
                   <Loader2 className="animate-spin text-blue-600 w-12 h-12 mx-auto"/>
                   <p className="text-blue-700 font-bold animate-pulse">Reading Bill Details...</p>
                   <div className="w-48 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden"><div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${scanProgress}%` }}></div></div>
                 </div>
               ) : formData.imagePreview ? (
                 <div className="relative w-full h-full group">
                   <img src={formData.imagePreview} alt="Bill" className="w-full h-full object-contain p-4"/>
                   <button onClick={() => { setFormData({...formData, imagePreview: null}); setIsFormReady(false); }} className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-md text-slate-600 hover:text-red-600"><X size={18}/></button>
                 </div>
               ) : (
                 <>
                   <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                   <div className="text-center space-y-4">
                     <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto hover:scale-110 transition-transform"><Upload size={32}/></div>
                     <div><h3 className="font-bold text-slate-700">Drop Invoice Here</h3><p className="text-sm text-slate-400 mt-1">We'll auto-fill GSTIN & Amount</p></div>
                   </div>
                 </>
               )}
            </div>
          ) : (
            <div className="h-96 rounded-2xl border border-slate-200 bg-white flex flex-col items-center justify-center text-center p-8 space-y-4">
               <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center"><Keyboard size={32}/></div>
               <div><h3 className="font-bold text-slate-900">Manual Entry Active</h3><p className="text-sm text-slate-500 mt-1">Please fill the details in the right panel.</p></div>
            </div>
          )}
        </div>

        {/* RIGHT: VALIDATION FORM */}
        <div className="lg:col-span-7 relative">
          
          {/* LOCK OVERLAY */}
          {!isFormReady && (
            <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center">
              <div className="bg-white p-4 rounded-full shadow-lg mb-4"><Lock size={32} className="text-slate-400"/></div>
              <h3 className="font-bold text-slate-600">Form Locked</h3>
              <p className="text-sm text-slate-400">Scan a bill or select Manual Entry to unlock.</p>
            </div>
          )}

          <div className={`bg-white p-8 rounded-2xl border border-slate-200 shadow-lg space-y-6 h-full transition-all ${!isFormReady ? 'opacity-40 pointer-events-none' : ''}`}>
            <h3 className="font-bold text-slate-900 flex items-center gap-2 pb-4 border-b border-slate-100">
              <CheckCircle2 className="text-blue-600"/> 2. Verify & Categorize
            </h3>

            {/* 🟢 VENDOR & GSTIN SECTION */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Building2 size={14}/> Vendor Details
                    </h4>
                    {vendorStatus === 'verified' && <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded flex items-center gap-1"><CheckCircle2 size={10}/> GSTIN VERIFIED</span>}
                    {vendorStatus === 'blacklisted' && <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-1 rounded flex items-center gap-1"><ShieldAlert size={10}/> INVALID FORMAT</span>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <input value={formData.vendor} onChange={e => setFormData({...formData, vendor: e.target.value})} className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm font-semibold focus:border-blue-500 outline-none" placeholder="Vendor Name"/>
                    </div>
                    <div className="flex gap-2">
                        <input 
                            value={formData.gstin} 
                            onChange={e => {
                                setFormData({...formData, gstin: e.target.value.toUpperCase()});
                                setVendorStatus('idle'); // Reset if changed
                            }} 
                            className={`w-full p-2.5 bg-white border rounded-lg text-sm font-mono focus:border-blue-500 outline-none uppercase ${vendorStatus === 'verified' ? 'border-emerald-500 text-emerald-700' : 'border-slate-300'}`} 
                            placeholder="GSTIN (e.g. 27AAAA...)"
                            maxLength={15}
                        />
                        <button 
                            onClick={verifyVendor} 
                            disabled={verifyingVendor || vendorStatus === 'verified'}
                            className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${vendorStatus === 'verified' ? 'bg-emerald-100 text-emerald-600 cursor-default' : 'bg-slate-800 text-white hover:bg-slate-900'}`}
                        >
                            {verifyingVendor ? <Loader2 size={14} className="animate-spin"/> : vendorStatus === 'verified' ? 'OK' : 'Verify'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Amount (₹)</label>
                <input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition-all" placeholder="0.00"/>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Expense Date</label>
                <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:bg-white outline-none"/>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Debit From (Source Fund)</label>
                <select className="w-full p-3 border border-slate-300 rounded-xl focus:border-blue-500 outline-none bg-white cursor-pointer" value={formData.fundId} onChange={e => setFormData({...formData, fundId: e.target.value})}>
                  <option value="">-- Select Available Fund --</option>
                  {funds.map(f => <option key={f.id} value={f.id} disabled={f.currentBalance <= 0}>{f.name} — ₹{f.currentBalance.toLocaleString()} Avbl.</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Expense Category</label>
                <select className="w-full p-3 border border-slate-300 rounded-xl focus:border-blue-500 outline-none bg-white cursor-pointer" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option value="">-- Select Category --</option>
                  <optgroup label="Educational Expenses">
                    <option>Educational Materials</option><option>Tuition Fees</option><option>Stationery</option>
                  </optgroup>
                  <optgroup label="Medical Expenses">
                    <option>Medical Supplies</option><option>Surgery Costs</option><option>Camp Equipment</option>
                  </optgroup>
                  <optgroup label="Food & Relief">
                    <option>Food Distribution</option><option>Rations</option>
                  </optgroup>
                  <optgroup label="Admin & Overhead (General Only)">
                    <option>Admin Overhead (Rent/Bills)</option><option>Staff Salary</option><option>Travel (Non-Project)</option>
                  </optgroup>
                </select>
              </div>
            </div>

            {/* STATUS & ACTION AREA */}
            <div className={`p-4 rounded-xl border flex gap-3 items-start transition-all duration-300 ${!formData.fundId || !formData.category ? 'bg-gray-50 border-gray-200 text-gray-500' : (violation || vendorStatus === 'blacklisted') ? 'bg-red-50 border-red-200 text-red-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
                {(violation || vendorStatus === 'blacklisted') ? <ShieldAlert size={20} className="shrink-0 mt-0.5"/> : <CheckCircle2 size={20} className="shrink-0 mt-0.5"/>}
                <div>
                    <p className="font-bold text-sm">
                        {vendorStatus === 'blacklisted' ? "Vendor Verification Failed" : violation ? "Fund Compliance Violation" : !formData.fundId ? "Awaiting Details..." : "Ready for Approval"}
                    </p>
                    {(violation || vendorStatus === 'blacklisted') && <p className="text-xs mt-1 leading-relaxed opacity-90">{violation || "Vendor GSTIN invalid format."}</p>}
                </div>
            </div>

            <button 
                onClick={handlePay} 
                disabled={!!violation || !formData.fundId || !formData.category || vendorStatus !== 'verified'} 
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md ${(!formData.fundId || vendorStatus !== 'verified') ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' : 'bg-[#3366FF] text-white hover:bg-blue-700 hover:shadow-lg'}`}
            >
              {vendorStatus !== 'verified' ? "Verify Vendor First" : violation ? "Transfer Blocked" : "Approve & Record Expense"}
            </button>
          </div>
        </div>
      </div>

      {/* RECENT HISTORY TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
         <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
           <h3 className="font-bold text-slate-900 flex items-center gap-2"><History size={18}/> Live Expense Log</h3>
         </div>
         <table className="w-full text-sm text-left">
           <thead className="text-slate-500 font-semibold border-b border-slate-100 bg-slate-50">
             <tr><th className="px-6 py-3">Vendor</th><th className="px-6 py-3">Project / Fund</th><th className="px-6 py-3">Amount</th><th className="px-6 py-3">Status</th></tr>
           </thead>
           <tbody className="divide-y divide-slate-50">
             {history.map(log => (
               <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                 <td className="px-6 py-4 font-medium text-slate-900">{log.vendor}<div className="text-xs text-slate-400 font-normal mt-0.5">{log.date}</div></td>
                 <td className="px-6 py-4"><span className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md text-xs font-medium text-slate-600">{log.project}</span></td>
                 <td className="px-6 py-4 font-bold text-slate-900">₹{log.amount.toLocaleString()}</td>
                 <td className="px-6 py-4">
                   <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide ${log.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>{log.status}</span>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
      </div>
    </div>
  );
}