import { Button } from "./ui/button";
import { ShieldCheck, ArrowRight, TrendingUp, Users, Shield, CheckCircle } from "lucide-react";
import { GlassCard } from "./glass-card";

// 🟢 Define props to accept both login actions
interface HomepageProps {
  onGetStarted: () => void; // For Donors
  onAdminLogin: () => void; // For Admins
}

export function Homepage({ onGetStarted, onAdminLogin }: HomepageProps) {
  return (
    <div className="min-h-screen bg-[#F6FAFF] font-sans">
      
      {/* 🟢 HEADER / NAVIGATION */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#3366FF] rounded-xl flex items-center justify-center text-white">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">GlassBox 45</h1>
              <p className="text-xs text-slate-500 font-medium">Transparent Giving</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* 🟢 ADMIN BUTTON (Ghost Style) */}
            <button 
              onClick={onAdminLogin}
              className="text-sm font-semibold text-slate-500 hover:text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-100 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Shield size={16}/> Staff Login
            </button>

            {/* DONOR BUTTON (Primary Style) */}
            <Button 
              onClick={onGetStarted}
              className="bg-[#3366FF] hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
            >
              Donor Login
            </Button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-bold mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            Live: 100% Impact Tracking Active
          </div>
          
          <h1 className="text-6xl font-extrabold text-slate-900 leading-tight mb-6">
            Donate with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3366FF] to-[#00C2FF]">Absolute Clarity.</span>
          </h1>
          
          <p className="text-xl text-slate-500 leading-relaxed mb-10">
            Every rupee tracked. Every impact visible. GlassBox 45 ensures your donations reach where they're needed most, with full audit-grade transparency.
          </p>

          <div className="flex justify-center gap-4">
            <Button 
              onClick={onGetStarted}
              className="h-14 px-8 text-lg bg-[#3366FF] hover:bg-blue-700 text-white rounded-2xl shadow-xl shadow-blue-600/20 transition-all hover:scale-105 cursor-pointer"
            >
              Start Donating <ArrowRight className="ml-2"/>
            </Button>
            <Button 
              variant="outline" 
              className="h-14 px-8 text-lg border-2 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 rounded-2xl cursor-pointer"
            >
              How it Works
            </Button>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard icon={<TrendingUp className="text-[#3366FF]"/>} value="₹2.4 Cr+" label="Total Donations" />
          <StatCard icon={<Users className="text-[#14B8A6]"/>} value="5,240" label="Active Donors" />
          <StatCard icon={<CheckCircle className="text-[#22C55E]"/>} value="12,580" label="Lives Impacted" />
          <StatCard icon={<ShieldCheck className="text-[#8B5CF6]"/>} value="100%" label="Transparent" />
        </div>
      </main>
      
      {/* Footer (Simplified for brevity) */}
      <footer className="border-t border-gray-200 py-8 text-center text-slate-400 text-sm">
        © 2026 GlassBox 45. Built for Trust.
      </footer>
    </div>
  );
}

function StatCard({ icon, value, label }: any) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 text-center hover:shadow-2xl transition-all hover:-translate-y-1 group">
      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
        <div className="w-8 h-8">{icon}</div>
      </div>
      <h3 className="text-3xl font-bold text-slate-900 mb-1">{value}</h3>
      <p className="text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
}