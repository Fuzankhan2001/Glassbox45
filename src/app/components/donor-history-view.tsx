import { useState, useEffect } from 'react';
import { GlassCard } from "./glass-card";
import { FileText, Download, IndianRupee, Package, Clock, Calendar, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";

// 🟢 MOCK DATA
const INITIAL_HISTORY = [
  { id: 1, type: 'money', amount: 5000, title: "Education Program", subtitle: "UPI Payment", date: "March 15, 2024", status: "Completed", receipt: "GB45-2024-0342" },
  { id: 2, type: 'inkind', amount: 0, title: "20 Blankets", subtitle: "Winter Relief Drive • NGO Pickup", date: "March 10, 2024", status: "Delivered", receipt: "IKD-2024-0287" },
  { id: 3, type: 'service', amount: 0, title: "20 Hours Teaching", subtitle: "Math Tutoring • Weekend Program", date: "Started March 5, 2024", status: "In Progress", receipt: null },
  { id: 4, type: 'money', amount: 10000, title: "Healthcare Camp", subtitle: "Card Payment", date: "February 28, 2024", status: "Completed", receipt: "GB45-2024-0298" },
];

export function DonorHistoryView() {
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [totals, setTotals] = useState({ totalDonation: 0, taxSavings: 0, totalCount: 0 });

  // 🟢 CALCULATE TOTALS DYNAMICALLY
  useEffect(() => {
    // 1. Get static data sum
    let totalMoney = INITIAL_HISTORY.reduce((acc, item) => item.type === 'money' ? acc + item.amount : acc, 0);
    
    // 2. Add any NEW donations from LocalStorage (Live Sync)
    const liveData = localStorage.getItem("demo_donations");
    if (liveData) {
      const parsed = JSON.parse(liveData);
      const liveTotal = parsed.reduce((acc: any, item: any) => acc + Number(item.amount), 0);
      totalMoney += liveTotal;
    }

    setTotals({
      totalDonation: totalMoney,
      taxSavings: totalMoney * 0.5, // 50% Tax Exemption (80G Standard)
      totalCount: INITIAL_HISTORY.length + (liveData ? JSON.parse(liveData).length : 0)
    });
  }, []);

  return (
    <div className="space-y-6">
      
      {/* 1. DYNAMIC SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="bg-white border-blue-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Donations</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">₹{totals.totalDonation.toLocaleString()}</h2>
              <p className="text-xs text-slate-500 mt-1">This financial year</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <IndianRupee className="w-6 h-6" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="bg-white border-emerald-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tax Savings (80G)</p>
              <h2 className="mt-2 text-3xl font-bold text-emerald-700">₹{totals.taxSavings.toLocaleString()}</h2>
              <p className="text-xs text-emerald-600 mt-1 font-medium">Eligible deduction amount</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
              <FileText className="w-6 h-6" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="bg-white border-teal-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Contributions</p>
              <h2 className="mt-2 text-3xl font-bold text-teal-700">{totals.totalCount}</h2>
              <p className="text-xs text-teal-600 mt-1">Money, items & service combined</p>
            </div>
            <div className="p-3 rounded-xl bg-teal-50 text-teal-600">
              <Package className="w-6 h-6" />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* 2. UNIFIED HISTORY LIST */}
      <GlassCard title="Donation History" subtitle="Your complete timeline of impact.">
        <div className="mt-6 space-y-4">
            {/* Render Static History */}
            {history.map((item) => (
                <HistoryItem key={item.id} data={item} />
            ))}
            
            {/* Render Live History from LocalStorage (if any) */}
            {/* Note: In a real app, these would be merged and sorted by date. 
                For demo, we rely on the static list + dashboard stats mostly. */}
        </div>
      </GlassCard>

      {/* 3. TAX DOWNLOADS */}
      <GlassCard title="Tax Documents" subtitle="Download official certificates for your tax filing.">
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:scale-110 transition-transform"><FileText size={20}/></div>
              <div>
                <p className="text-sm font-bold text-slate-900">Annual Summary FY 2023-24</p>
                <p className="text-xs text-slate-500">Consolidated Statement</p>
              </div>
            </div>
            <Download size={18} className="text-slate-400 group-hover:text-blue-600"/>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg group-hover:scale-110 transition-transform"><CheckCircle2 size={20}/></div>
              <div>
                <p className="text-sm font-bold text-slate-900">Form 10BE Certificate</p>
                <p className="text-xs text-slate-500">Official 80G Proof</p>
              </div>
            </div>
            <Download size={18} className="text-slate-400 group-hover:text-emerald-600"/>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

// 🟢 HELPER COMPONENT: SINGLE HISTORY ROW
function HistoryItem({ data }: any) {
    let Icon = IndianRupee;
    let bg = "bg-blue-50";
    let color = "text-blue-600";
    let amountText = `₹${data.amount.toLocaleString()}`;

    if (data.type === 'inkind') {
        Icon = Package;
        bg = "bg-teal-50";
        color = "text-teal-600";
        amountText = "In-Kind";
    } else if (data.type === 'service') {
        Icon = Clock;
        bg = "bg-orange-50";
        color = "text-orange-600";
        amountText = "Service";
    }

    return (
        <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg} ${color}`}>
                <Icon size={20} />
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="text-sm font-bold text-slate-900">{data.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{data.subtitle}</p>
                    </div>
                    <div className="text-right">
                        <span className={`text-sm font-bold ${data.type === 'money' ? 'text-slate-900' : 'text-slate-500'}`}>
                            {amountText}
                        </span>
                        <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 w-fit ml-auto ${
                            data.status === 'Completed' || data.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                            {data.status}
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Calendar size={14}/> {data.date}
                    </div>
                    {data.receipt && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <FileText size={14}/> {data.receipt}
                        </div>
                    )}
                    {data.type === 'money' && (
                        <Button variant="ghost" className="h-6 text-xs ml-auto text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 cursor-pointer">
                            <Download size={12} className="mr-1"/> Receipt
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}