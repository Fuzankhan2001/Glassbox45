import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Wallet, FileCheck, TrendingUp, 
  Users, ArrowUpRight, ArrowDownRight, Ban, Calendar, Target,
  Camera // 🟢 New Icon for Impact
} from 'lucide-react';

// 🟢 Sub-Views
import IncomeIngressView from './income-ingress-view';
import ExpenseLockboxView from './expense-lockbox-view';
import { AdminImpactTimeline } from './admin-impact-timeline'; // 🟢 New Import

// --- MOCK DATA ---
const PROJECT_GOALS = [
  { name: "Vidya Shakti (Education)", goal: 500000, raised: 245000, color: "bg-blue-600" },
  { name: "Drishti Eye Camp", goal: 300000, raised: 150000, color: "bg-emerald-500" },
  { name: "Annapoorna (Hunger Relief)", goal: 800000, raised: 180000, color: "bg-orange-500" },
];

const RECENT_ACTIVITY = [
  { id: 'static-1', type: 'expense', title: "Expense Approved", subtitle: "City Stationery • Vidya Shakti", amount: "-₹2,500", time: "2 hours ago" },
  { id: 'static-2', type: 'income', title: "Donation Received", subtitle: "Mukesh Gupta • Vidya Shakti", amount: "+₹5,000", time: "5 hours ago" },
  { id: 'static-3', type: 'blocked', title: "Transaction BLOCKED", subtitle: "Taj Hotel • Medical Fund Misuse", amount: "₹15,000", time: "Yesterday", detail: "Restricted Fund Misuse" },
  { id: 'static-4', type: 'expense', title: "Expense Approved", subtitle: "Power Grid Corp • General Fund", amount: "-₹12,000", time: "Yesterday" },
  { id: 'static-5', type: 'income', title: "Donation Received", subtitle: "Ghanshyam Singh • Drishti Eye Camp", amount: "+₹1,00,000", time: "2 days ago" },
];

// --- MAIN COMPONENT ---
export default function AdminDashboardView() {
  // 🟢 Updated State to include 'impact'
  const [currentView, setCurrentView] = useState<'overview' | 'income' | 'lockbox' | 'impact'>('overview');

  return (
    <div className="flex min-h-screen bg-[#F6FAFF] font-sans text-slate-800">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-white border-r border-gray-100 fixed h-full z-10 hidden md:block">
        <div className="p-6">
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <div className="p-1.5 bg-[#3366FF] rounded-lg text-white">
              <LayoutDashboard size={18}/>
            </div>
            GlassBox 45
          </h1>
          <p className="text-xs text-slate-400 mt-1 ml-9 font-medium tracking-wide">ADMIN PORTAL</p>
        </div>
        
        <nav className="mt-6 px-4 space-y-2">
          <NavButton 
            active={currentView === 'overview'} 
            onClick={() => setCurrentView('overview')}
            icon={<LayoutDashboard size={20}/>} 
            label="Dashboard" 
          />
          <NavButton 
            active={currentView === 'income'} 
            onClick={() => setCurrentView('income')}
            icon={<Wallet size={20}/>} 
            label="Income Ingress" 
          />
          <NavButton 
            active={currentView === 'lockbox'} 
            onClick={() => setCurrentView('lockbox')}
            icon={<FileCheck size={20}/>} 
            label="Expense Lockbox" 
          />
          
          {/* 🟢 NEW: Impact Timeline Tab */}
          <NavButton 
            active={currentView === 'impact'} 
            onClick={() => setCurrentView('impact')}
            icon={<Camera size={20}/>} 
            label="Impact Timeline" 
          />
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="md:ml-64 flex-1 relative">
        {currentView === 'overview' && <AdminOverview />}
        {currentView === 'income' && <IncomeIngressView />}
        {currentView === 'lockbox' && <ExpenseLockboxView />}
        {/* 🟢 NEW: Render Impact View */}
        {currentView === 'impact' && <AdminImpactTimeline />}
      </main>
    </div>
  );
}

// --- DASHBOARD OVERVIEW COMPONENT ---
function AdminOverview() {
  const [demoDonations, setDemoDonations] = useState<any[]>([]);
  
  // LIVE SYNC: Read from local storage safely
  useEffect(() => {
    try {
      const data = localStorage.getItem("demo_donations");
      if (data) {
        setDemoDonations(JSON.parse(data));
      }
    } catch (e) {
      console.error("Error reading donations", e);
    }
  }, []);

  const stats = {
    totalAssets: "12,35,500", 
    restricted: "8,47,500", 
    unrestricted: "3,88,000" 
  };

  // Convert Donor Data Format to Admin Activity Feed Format
  const liveDonationActivity = demoDonations.map((donation) => ({
    id: donation.id,
    type: "income",
    title: "Donation Received",
    subtitle: `${donation.donorName} • ${donation.purpose}`,
    amount: `+₹${donation.amount}`,
    time: "Just now"
  }));

  return (
    <div className="p-8 max-w-7xl mx-auto">
      
      {/* DASHBOARD HEADER */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Dashboard</h2>
          <p className="text-slate-500 text-sm mt-1">Real-time financial overview and project tracking.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 flex items-center gap-2">
             <Calendar size={16}/> Jan 2026
          </button>
          <button className="bg-[#3366FF] hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all text-sm flex items-center gap-2">
            <Wallet size={16} /> Add Funds
          </button>
        </div>
      </header>

      {/* 1. FUND HEALTH CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <GlassCard title="Total Assets (Available)" icon={<TrendingUp className="text-[#3366FF]"/>} bg="bg-white">
           <h3 className="text-3xl font-bold text-slate-900">₹{stats.totalAssets}</h3>
           <p className="text-xs font-medium text-emerald-600 mt-2 flex items-center gap-1 bg-emerald-50 w-fit px-2 py-1 rounded-full">
             <ArrowUpRight size={12}/> +12% vs last month
           </p>
        </GlassCard>

        <GlassCard title="Restricted Funds (Locked)" icon={<Wallet className="text-emerald-600"/>} bg="bg-emerald-50 border-emerald-100">
           <h3 className="text-3xl font-bold text-emerald-900">₹{stats.restricted}</h3>
           <div className="mt-2 flex items-center gap-2 text-[10px] font-bold text-emerald-700 bg-white/60 w-fit px-2 py-1 rounded-full uppercase tracking-wide">
              🔒 Tied to Projects
           </div>
        </GlassCard>

        <GlassCard title="Unrestricted (General)" icon={<FileCheck className="text-blue-600"/>} bg="bg-blue-50 border-blue-100">
           <h3 className="text-3xl font-bold text-blue-900">₹{stats.unrestricted}</h3>
           <p className="text-xs text-blue-700 mt-2 font-medium">Available for Salaries/Rent</p>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. PROJECT FUNDING TRACKER */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Target size={20} className="text-blue-600"/> Project Funding Goals
          </h3>
          
          <div className="space-y-6">
            {PROJECT_GOALS.map((project, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{project.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Raised: <span className="font-semibold text-slate-900">₹{project.raised.toLocaleString()}</span> • 
                      Goal: <span className="text-slate-400">₹{project.goal.toLocaleString()}</span>
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-600">{Math.round((project.raised / project.goal) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${project.color}`} 
                    style={{ width: `${(project.raised / project.goal) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. LIVE LEDGER */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-900 text-sm">Live Activity Feed</h3>
            <button className="text-xs text-[#3366FF] font-medium hover:underline">View All</button>
          </div>
          
          <div className="flex-1 overflow-y-auto max-h-[350px]">
             <div className="divide-y divide-slate-50">
               {/* MERGING LIVE AND STATIC DATA */}
               {[...liveDonationActivity, ...RECENT_ACTIVITY].map((log) => (
                 <LogItem key={log.id} {...log} />
               ))}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function NavButton({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
        active ? 'bg-blue-50 text-[#3366FF] font-semibold' : 'text-slate-600 hover:bg-gray-50 hover:text-slate-900'
      }`}
    >
      {icon}
      <span className="flex-1 text-sm text-left">{label}</span>
    </button>
  );
}

function GlassCard({ children, title, icon, bg }: any) {
  return (
    <div className={`p-6 rounded-xl border shadow-sm transition-all hover:shadow-md ${bg} border-slate-100`}>
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
      </div>
      {children}
    </div>
  );
}

function LogItem({ type, title, subtitle, amount, time, detail }: any) {
  let Icon = Wallet;
  let iconBg = "bg-gray-100";
  let iconColor = "text-gray-600";
  let amtColor = "text-slate-900";

  if (type === 'blocked') {
    Icon = Ban;
    iconBg = "bg-red-50";
    iconColor = "text-red-600";
    amtColor = "text-red-600 line-through";
  } else if (type === 'income') {
    Icon = ArrowDownRight;
    iconBg = "bg-emerald-50";
    iconColor = "text-emerald-600";
    amtColor = "text-emerald-600 font-bold";
  } else if (type === 'expense') {
    Icon = ArrowUpRight;
    iconBg = "bg-blue-50";
    iconColor = "text-blue-600";
    amtColor = "text-slate-900";
  }

  return (
    <div className={`flex items-center justify-between p-4 hover:bg-slate-50 transition-colors ${type === 'blocked' ? 'bg-red-50/20' : ''}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${iconBg} ${iconColor}`}>
          <Icon size={16} />
        </div>
        <div>
          <h4 className={`text-xs font-bold ${type === 'blocked' ? 'text-red-700' : 'text-slate-900'}`}>{title}</h4>
          <p className="text-[10px] text-slate-500 mt-0.5">{subtitle}</p>
          {detail && <p className="text-[9px] font-bold text-red-500 mt-1 uppercase tracking-wide">⚠️ {detail}</p>}
        </div>
      </div>
      
      <div className="text-right">
        <p className={`text-xs font-bold ${amtColor}`}>{amount}</p>
        <p className="text-[9px] text-slate-400 mt-0.5">{time}</p>
      </div>
    </div>
  );
}