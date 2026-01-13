import React, { useState, useEffect, useMemo } from 'react';
import { 
  Wallet, Package, Clock, Check, ChevronDown, ChevronUp, 
  ArrowDownLeft, Lock, Unlock, X, CreditCard, Banknote, Landmark, Save,
  User, Phone, MapPin, Mail, Briefcase
} from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  donor: string;
  amount: string;
  project: string;
  type: string;
  mode: string;
}

// 🟢 NEW INTERFACE FOR SERVICES
interface ServiceEntry {
  id: string;
  donor: string;
  role: string;
  hours: string;
  date: string;
  project: string;
  status: 'pending' | 'approved';
}

export default function IncomeIngressView() {
  const [activeTab, setActiveTab] = useState<'money' | 'inkind' | 'service'>('money');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // SHARED STATE FOR LEDGER (MONEY)
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: "TXN-883925", date: "02 Jan 2026", donor: "Mukesh Gupta", amount: "₹5,000", project: "Vidya Shakti (Project)", type: "Restricted", mode: "UPI" },
    { id: "TXN-883924", date: "01 Jan 2026", donor: "Ghanshyam Singh", amount: "₹1,00,000", project: "Drishti Eye Camp", type: "Restricted", mode: "Cheque" },
    { id: "TXN-883923", date: "28 Dec 2025", donor: "Salman Jain", amount: "₹500", project: "General Fund", type: "Unrestricted", mode: "UPI" },
    { id: "TXN-883922", date: "15 Dec 2025", donor: "Rajesh Kumar", amount: "₹2,50,000", project: "Vidya Shakti (Project)", type: "Restricted", mode: "Bank Transfer" },
    { id: "TXN-883921", date: "10 Nov 2025", donor: "Abdul Khan", amount: "₹1,50,000", project: "Drishti Eye Camp", type: "Restricted", mode: "Cheque" },
    { id: "TXN-883920", date: "05 Nov 2025", donor: "Hanil Mehta", amount: "₹10,000", project: "General Fund", type: "Unrestricted", mode: "Cash" },
  ]);

  // 🟢 SHARED STATE FOR SERVICES
  const [services, setServices] = useState<ServiceEntry[]>([
    { id: 'S1', donor: "Mukesh Gupta", role: "Teaching Volunteer", hours: "5 Hours", date: "Yesterday", project: "Vidya Shakti", status: 'pending' },
    { id: 'S2', donor: "Ghanshyam Singh", role: "Medical Support", hours: "8 Hours", date: "23 Dec", project: "Drishti", status: 'pending' },
    { id: 'S3', donor: "Salman Jain", role: "Logistics Manager", hours: "12 Hours", date: "Today", project: "Annapoorna", status: 'pending' },
    { id: 'S4', donor: "Fuzan Khan", role: "Web Development", hours: "12 Hours", date: "10 Dec", project: "IT Operations", status: 'approved' },
  ]);

  const handleAddNew = (newTxn: Transaction) => {
    setTransactions([newTxn, ...transactions]);
    setIsModalOpen(false);
  };

  // 🟢 APPROVE / REJECT LOGIC
  const handleServiceAction = (id: string, action: 'approve' | 'reject') => {
    if (action === 'approve') {
      setServices(services.map(s => s.id === id ? { ...s, status: 'approved' } : s));
    } else {
      setServices(services.filter(s => s.id !== id)); // Remove if rejected
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans text-slate-800 relative">
      
      {/* HEADER */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Income Ingress</h2>
          <p className="text-slate-500 text-sm mt-1">Manage all incoming resources: Funds, Goods, and Volunteer Hours.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#3366FF] hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all text-sm flex items-center gap-2"
        >
          <ArrowDownLeft size={16} />
          Log New Donation
        </button>
      </header>

      {/* TABS */}
      <div className="flex gap-4 border-b border-gray-200 mb-6">
        <TabButton active={activeTab === 'money'} onClick={() => setActiveTab('money')} label="Money Received" icon={<Wallet size={18}/>} />
        <TabButton active={activeTab === 'inkind'} onClick={() => setActiveTab('inkind')} label="In-Kind Donations" icon={<Package size={18}/>} />
        <TabButton active={activeTab === 'service'} onClick={() => setActiveTab('service')} label="Service Hours" icon={<Clock size={18}/>} badge={services.filter(s => s.status === 'pending').length} />
      </div>

      <div className="min-h-[500px]">
        {activeTab === 'money' && <MoneyTab data={transactions} />}
        {activeTab === 'inkind' && <InKindTab />}
        {/* Pass Data & Handlers to ServiceTab */}
        {activeTab === 'service' && <ServiceTab data={services} onAction={handleServiceAction} />}
      </div>

      {isModalOpen && (
        <LogIncomeModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleAddNew} 
          initialTab={activeTab} 
        />
      )}
    </div>
  );
}

// --- 1. MONEY TAB ---
function MoneyTab({ data }: { data: Transaction[] }) {
  const [viewAll, setViewAll] = useState(false);
  
  const totals = useMemo(() => {
    let total = 0, restricted = 0, unrestricted = 0;
    data.forEach(txn => {
      if (txn.amount.includes('₹')) {
        const val = parseInt(txn.amount.replace(/[₹,]/g, ''), 10) || 0;
        total += val;
        txn.type === 'Restricted' ? restricted += val : unrestricted += val;
      }
    });
    const fmt = (n: number) => "₹" + n.toLocaleString('en-IN');
    return { total: fmt(total), restricted: fmt(restricted), unrestricted: fmt(unrestricted) };
  }, [data]);

  const projectTotals = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach(txn => {
       if (txn.amount.includes('₹')) {
         const val = parseInt(txn.amount.replace(/[₹,]/g, ''), 10) || 0;
         counts[txn.project] = (counts[txn.project] || 0) + val;
       }
    });
    return counts;
  }, [data]);

  const getProjectTotal = (name: string) => "₹" + (projectTotals[name] || 0).toLocaleString('en-IN');
  const displayedTransactions = viewAll ? data : data.slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FundCard title="Total Money Received" amount={totals.total} bg="bg-white" border="border-gray-200" textColor="text-slate-900" icon={<Wallet className="text-[#3366FF]" />} />
        <FundCard title="Designated Impact Fund" amount={totals.restricted} bg="bg-emerald-50" border="border-emerald-100" textColor="text-emerald-700" icon={<Lock className="text-emerald-600" size={20} />} subtext="Restricted (Education, Medical...)" />
        <FundCard title="General Operating Fund" amount={totals.unrestricted} bg="bg-blue-50" border="border-blue-100" textColor="text-blue-700" icon={<Unlock className="text-blue-600" size={20} />} subtext="Salaries, Bills, Tax" />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900">Recent Transactions</h3>
            <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{viewAll ? data.length : 5} Shown</span>
          </div>
          <button onClick={() => setViewAll(!viewAll)} className="text-xs font-medium text-[#3366FF] hover:underline flex items-center gap-1 bg-white border border-blue-100 px-3 py-1.5 rounded-lg transition-colors">
            {viewAll ? "Collapse List" : "View All History"} {viewAll ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-3">Date & ID</th>
                <th className="px-6 py-3">Donor Name</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Project / Cause</th>
                <th className="px-6 py-3">Mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {displayedTransactions.map((txn, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{txn.date}</div>
                    <div className="text-[10px] text-gray-400 font-mono tracking-wide">{txn.id}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">{txn.donor}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{txn.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${['General Fund', 'General'].includes(txn.project) ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                      {txn.project}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded w-fit">
                      {txn.mode}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold text-slate-900">Money Breakdown by Designated Cause</h3>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium">
             <tr><th className="px-6 py-3">Project Name</th><th className="px-6 py-3">Category</th><th className="px-6 py-3 text-right">Total Money Received</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
             <ProjectRow name="Vidya Shakti (Project)" category="Education" amount={getProjectTotal('Vidya Shakti (Project)')} />
             <ProjectRow name="Annapoorna (Hunger)" category="Hunger Relief" amount={getProjectTotal('Annapoorna (Hunger)')} />
             <ProjectRow name="Drishti Eye Camp" category="Medical Camp" amount={getProjectTotal('Drishti Eye Camp')} />
             
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- 2. IN-KIND TAB ---
function InKindTab() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in zoom-in duration-300">
      <div className="p-6 border-b border-gray-100">
        <h3 className="font-bold text-slate-900">In-Kind Contributions Registry</h3>
      </div>
      <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 font-medium">
            <tr><th className="px-6 py-3">Date</th><th className="px-6 py-3">Donor</th><th className="px-6 py-3">Item Details</th><th className="px-6 py-3">Qty</th><th className="px-6 py-3">Project</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
             <InKindRow date="02 Jan" donor="City Library" item="Textbooks (Class 1-5)" qty="500 Units" project="Vidya Shakti" />
             <InKindRow date="28 Dec" donor="Local Bakery" item="Bread Loaves" qty="100 Packets" project="Annapoorna" />
          </tbody>
      </table>
    </div>
  );
}

// --- 3. SERVICE TAB (Now Interactive!) ---
function ServiceTab({ data, onAction }: { data: ServiceEntry[], onAction: (id: string, action: 'approve' | 'reject') => void }) {
  const pending = data.filter(s => s.status === 'pending');
  const approved = data.filter(s => s.status === 'approved');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in zoom-in duration-300">
      {/* PENDING COLUMN */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span> Pending Approval ({pending.length})
        </h3>
        
        {pending.length === 0 && <p className="text-gray-400 text-sm italic p-4">No pending requests.</p>}
        
        {pending.map(s => (
          <ServiceCard key={s.id} data={s} onAction={onAction} />
        ))}
      </div>

      {/* APPROVED COLUMN */}
      <div className="space-y-4 opacity-75">
        <h3 className="font-bold text-slate-500 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Approved History ({approved.length})
        </h3>
        
        {approved.map(s => (
          <ServiceCard key={s.id} data={s} onAction={onAction} />
        ))}
      </div>
    </div>
  );
}

// --- MODAL ---
function LogIncomeModal({ onClose, onSave, initialTab }: { onClose: () => void, onSave: (txn: Transaction) => void, initialTab: string }) {
  const [type, setType] = useState<'Money' | 'In-Kind' | 'Service'>('Money');
  
  useEffect(() => {
    if (initialTab === 'inkind') setType('In-Kind');
    else if (initialTab === 'service') setType('Service');
    else setType('Money');
  }, [initialTab]);

  const [formData, setFormData] = useState({
    name: '', occupation: '', address: '', email: '', mobile: '',
    amount: '', mode: 'UPI',
    item: '', qty: '', 
    role: '', hours: '',
    project: 'General Fund',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (type === 'Money') {
       setFormData(prev => ({ ...prev, project: 'General Fund' }));
    } else {
       setFormData(prev => ({ ...prev, project: 'General' }));
    }
  }, [type]);

  const handleSubmit = () => {
    if (!formData.mobile) { alert("Mobile Number is mandatory!"); return; }
    if (!formData.name) { alert("Donor Name is required!"); return; }
    if (!formData.date) { alert("Date is mandatory!"); return; }

    if (type === 'Money') {
       if (!formData.amount || Number(formData.amount) < 100) {
          alert("Minimum donation amount is ₹100");
          return;
       }
       if (!formData.mode) { alert("Payment Mode is mandatory!"); return; }
    }
    if (type === 'In-Kind') {
       if (!formData.item) { alert("Product Name/Details are mandatory!"); return; }
       if (!formData.qty) { alert("Quantity is mandatory!"); return; }
    }
    if (type === 'Service') {
       if (!formData.hours) { alert("Number of Hours is mandatory!"); return; }
    }

    const newTxn: Transaction = {
      id: "TXN-" + Math.floor(Math.random() * 900000 + 100000),
      date: new Date(formData.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      donor: formData.name,
      amount: type === 'Money' ? "₹" + Number(formData.amount).toLocaleString('en-IN') : (type === 'Service' ? `${formData.hours} hrs` : `${formData.qty} items`),
      project: formData.project,
      type: (formData.project === "General Fund" || formData.project === "General") ? "Unrestricted" : "Restricted",
      mode: type === 'Money' ? formData.mode : type
    };

    onSave(newTxn);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-lg text-slate-900">Log New Donation</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
        </div>
        
        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="flex p-1 bg-gray-100 rounded-lg">
            {['Money', 'In-Kind', 'Service'].map((t) => (
              <button key={t} onClick={() => setType(t as any)} className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${type === t ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>{t}</button>
            ))}
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Donor Name <span className="text-red-500">*</span></label>
              <div className="relative"><User size={14} className="absolute left-3 top-2.5 text-gray-400"/><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:border-blue-500 focus:outline-none" placeholder="e.g. Rajesh Kumar" /></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div><label className="block text-xs font-semibold text-gray-500 mb-1">Mobile <span className="text-red-500">*</span></label><div className="relative"><Phone size={14} className="absolute left-3 top-2.5 text-gray-400"/><input type="text" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:border-blue-500 focus:outline-none" placeholder="+91..." /></div></div>
               <div><label className="block text-xs font-semibold text-gray-500 mb-1">Occupation</label><div className="relative"><Briefcase size={14} className="absolute left-3 top-2.5 text-gray-400"/><input type="text" value={formData.occupation} onChange={e => setFormData({...formData, occupation: e.target.value})} className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:border-blue-500 focus:outline-none" placeholder="Optional" /></div></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-xs font-semibold text-gray-500 mb-1">Email</label><div className="relative"><Mail size={14} className="absolute left-3 top-2.5 text-gray-400"/><input type="text" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:border-blue-500 focus:outline-none" placeholder="Optional" /></div></div>
              <div><label className="block text-xs font-semibold text-gray-500 mb-1">Address</label><div className="relative"><MapPin size={14} className="absolute left-3 top-2.5 text-gray-400"/><input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:border-blue-500 focus:outline-none" placeholder="City" /></div></div>
            </div>

            <div className="border-t border-gray-100 my-2 pt-2"></div>

            {type === 'Money' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Amount (₹) <span className="text-red-500">*</span></label>
                  <input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none text-slate-700" placeholder="e.g. 1000" />
                  <p className="text-[10px] text-gray-400 mt-1">Min. ₹100</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Mode <span className="text-red-500">*</span></label>
                  <select value={formData.mode} onChange={e => setFormData({...formData, mode: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                    <option>UPI</option><option>Bank Transfer</option><option>Cheque</option><option>Cash</option>
                  </select>
                </div>
              </div>
            )}
            
            {type === 'In-Kind' && (
              <>
                <div><label className="block text-xs font-semibold text-gray-500 mb-1">Product Name / Details <span className="text-red-500">*</span></label><input type="text" value={formData.item} onChange={e => setFormData({...formData, item: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" placeholder="e.g. 50 Textbooks" /></div>
                <div><label className="block text-xs font-semibold text-gray-500 mb-1">Quantity <span className="text-red-500">*</span></label><input type="text" value={formData.qty} onChange={e => setFormData({...formData, qty: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" placeholder="e.g. 5 Boxes" /></div>
              </>
            )}

            {type === 'Service' && (
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-semibold text-gray-500 mb-1">Role / Service</label><input type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" placeholder="e.g. Teaching" /></div>
                <div><label className="block text-xs font-semibold text-gray-500 mb-1">Hours Committed <span className="text-red-500">*</span></label><input type="number" value={formData.hours} onChange={e => setFormData({...formData, hours: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" placeholder="e.g. 5" /></div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Project / Cause <span className="text-red-500">*</span></label>
              <select value={formData.project} onChange={e => setFormData({...formData, project: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                <option>{type === 'Money' ? 'General Fund' : 'General'}</option>
                <option>Vidya Shakti (Project)</option><option>Annapoorna (Hunger)</option><option>Drishti Eye Camp</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">{type === 'Service' ? 'Date Requested' : 'Date'} <span className="text-red-500">*</span></label>
              <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 text-sm font-bold text-white bg-[#3366FF] hover:bg-blue-700 rounded-lg shadow-md transition-all flex items-center gap-2"><Save size={16} /> Save Record</button>
        </div>
      </div>
    </div>
  );
}

// --- HELPERS ---
function FundCard({ title, amount, subtext, bg, border, textColor, icon }: any) {
  return (
    <div className={`p-6 rounded-xl border ${bg} ${border} shadow-sm`}>
      <div className="flex justify-between items-start mb-2"><p className="text-sm font-semibold text-slate-500">{title}</p><div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div></div>
      <h3 className={`text-3xl font-bold ${textColor}`}>{amount}</h3>
      {subtext && <p className="text-xs font-medium opacity-80 mt-1">{subtext}</p>}
    </div>
  );
}
function ProjectRow({ name, category, amount }: any) {
  return <tr className="hover:bg-slate-50"><td className="px-6 py-4 font-bold text-slate-800">{name}</td><td className="px-6 py-4"><span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">{category}</span></td><td className="px-6 py-4 text-right font-mono font-bold text-slate-900">{amount}</td></tr>;
}
function InKindRow({ date, donor, item, qty, project }: any) {
  return <tr className="hover:bg-gray-50"><td className="px-6 py-4 text-slate-900">{date}</td><td className="px-6 py-4 font-medium">{donor}</td><td className="px-6 py-4 flex items-center gap-2"><Package size={16} className="text-blue-500"/> {item}</td><td className="px-6 py-4 font-bold">{qty}</td><td className="px-6 py-4 text-sm text-slate-700">{project}</td></tr>;
}
function ServiceCard({ data, onAction }: { data: ServiceEntry, onAction: (id: string, action: 'approve' | 'reject') => void }) {
  const { donor, role, hours, date, project, status, id } = data;
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center transition-all hover:shadow-md">
      <div className="flex gap-4 items-center">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">{donor[0]}</div>
        <div>
          <h4 className="font-bold text-slate-900">{donor}</h4>
          <p className="text-xs text-slate-500">{role} • <span className="text-slate-900 font-medium">{project}</span></p>
          <div className="flex gap-2 mt-1">
            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600 flex items-center gap-1"><Clock size={10}/> {hours}</span>
            <span className="text-xs text-gray-400">{date}</span>
          </div>
        </div>
      </div>
      
      {/* 🟢 INTERACTIVE BUTTONS */}
      {status === 'pending' ? (
        <div className="flex gap-2">
          <button onClick={() => onAction(id, 'reject')} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 transition-colors" title="Reject"><X size={18}/></button>
          <button onClick={() => onAction(id, 'approve')} className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100 transition-colors" title="Approve"><Check size={18}/></button>
        </div>
      ) : (
        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1"><Check size={12}/> Approved</span>
      )}
    </div>
  );
}
function TabButton({ active, onClick, label, icon, badge }: any) {
  return <button onClick={onClick} className={`pb-4 px-2 flex items-center gap-2 text-sm font-medium transition-all relative ${active ? 'text-[#3366FF] border-b-2 border-[#3366FF]' : 'text-gray-500 hover:text-gray-700'}`}>{icon} {label}{badge > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{badge}</span>}</button>;
}