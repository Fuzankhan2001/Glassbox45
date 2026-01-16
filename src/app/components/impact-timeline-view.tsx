import { useState } from "react";
import { GlassCard } from "./glass-card";
import { 
  Search, CheckCircle2, Truck, BookOpen, User, 
  Clock, FileText, MapPin 
} from "lucide-react"; // 🟢 Checked: Clock is imported correctly
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function ImpactTimelineView() {
  const [searchId, setSearchId] = useState("");
  const [showResult, setShowResult] = useState(true);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* 1. TRACKER SEARCH HERO */}
      <div className="text-center space-y-4 mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Track Your Impact Journey</h2>
        <p className="text-slate-500 max-w-lg mx-auto">
          Enter your Donation Receipt ID to see exactly when and where your specific contribution was utilized.
        </p>
        
        <div className="flex max-w-md mx-auto gap-2 mt-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
            <Input 
              placeholder="e.g. GB45-2024-0342" 
              className="pl-10 h-12 bg-white border-slate-200 text-lg rounded-xl"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
          </div>
          <Button 
            className="h-12 px-6 bg-[#3366FF] hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/20 rounded-xl cursor-pointer"
            onClick={() => setShowResult(true)}
          >
            Track
          </Button>
        </div>
      </div>

      {/* 2. TIMELINE RESULT CARD */}
      {showResult && (
        <GlassCard className="border-t-4 border-t-[#3366FF] animate-fade-in-up">
          <div className="flex justify-between items-start mb-10 border-b border-slate-100 pb-6">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tracking Donation</p>
              <h3 className="text-2xl font-bold text-slate-900">₹5,000 for Education</h3>
              <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                <FileText size={14}/> Receipt #GB45-2024-0342
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200">
                <CheckCircle2 size={14} /> Fully Utilized
              </span>
            </div>
          </div>

          {/* 🟢 UI FIX: 
             - Added pl-10 (40px padding)
             - Line at left-[19px] (Center of 40px is 20px, minus 1px for line width)
          */}
          <div className="relative pl-10 space-y-12 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
            
            {/* STEP 1: RECEIVED */}
            <TimelineItem 
              icon={<CheckCircle2 size={20} className="text-white"/>} 
              bg="bg-emerald-500"
              date="March 15, 2024 • 10:42 AM"
              title="Donation Received"
              desc="Your contribution of ₹5,000 was successfully processed via UPI."
            />

            {/* STEP 2: ALLOCATION */}
            <TimelineItem 
              icon={<BookOpen size={20} className="text-blue-600"/>} 
              bg="bg-blue-100 border-2 border-white shadow-sm"
              date="March 18, 2024"
              title="Allocated to 'Vidya Shakti' Project"
              desc="Funds were assigned to the purchase of Grade 10 Math Textbooks for Govt School, Andheri."
            />

            {/* STEP 3: VENDOR PAYMENT */}
            <TimelineItem 
              icon={<Truck size={20} className="text-orange-600"/>} 
              bg="bg-orange-100 border-2 border-white shadow-sm"
              date="March 22, 2024"
              title="Vendor Payment Released"
              desc="Payment of ₹4,500 made to 'City Stationery & Books' (Invoice #CS-992). Verified by Admin."
            >
               <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-center gap-3 max-w-md hover:bg-white transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-white rounded border flex items-center justify-center shadow-sm">
                     <FileText size={16} className="text-red-500"/>
                  </div>
                  <div>
                     <p className="font-bold text-slate-900">Invoice_CS992.pdf</p>
                     <p className="text-[10px] text-slate-500">Vendor: City Stationery • GST: 27ABCDE1234F1Z5</p>
                  </div>
               </div>
            </TimelineItem>

            {/* STEP 4: IMPACT DELIVERY */}
            <TimelineItem 
              icon={<User size={20} className="text-purple-600"/>} 
              bg="bg-purple-100 border-2 border-white shadow-sm"
              date="March 25, 2024"
              title="Books Distributed to Students"
              desc="20 Textbooks were distributed to Class 10 students. The remaining ₹500 remains in the Restricted Fund for next month."
            >
               <div className="mt-4 grid grid-cols-2 gap-3 max-w-md">
                  <div className="h-24 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center text-xs text-slate-400 font-medium">
                     [Classroom Photo]
                  </div>
                  <div className="h-24 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center text-xs text-slate-400 font-medium">
                     [Distribution Log]
                  </div>
               </div>
               <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-slate-500">
                  <MapPin size={14} className="text-slate-400"/> Govt High School, Andheri East, Mumbai
               </div>
            </TimelineItem>

          </div>
        </GlassCard>
      )}
    </div>
  );
}

// 🟢 HELPER: Timeline Row Component
// Fixed Alignment: -left-[36px] centers a 32px icon perfectly on the line at 20px (inside 40px padding)
function TimelineItem({ icon, bg, date, title, desc, children }: any) {
  return (
    <div className="relative">
      {/* Icon Dot */}
      <div className={`absolute -left-[36px] top-0 w-8 h-8 rounded-full flex items-center justify-center z-10 ${bg}`}>
        {icon}
      </div>
      
      {/* Content */}
      <div className="pt-1">
        <p className="text-xs font-bold text-slate-400 mb-1 flex items-center gap-2 uppercase tracking-wide">
           <Clock size={12} className="text-slate-400"/> {date}
        </p>
        <h4 className="text-lg font-bold text-slate-900">{title}</h4>
        <p className="text-sm text-slate-600 mt-1 leading-relaxed max-w-xl">{desc}</p>
        {children}
      </div>
    </div>
  );
}