import { useState, useEffect } from 'react';
import { GlassCard } from "./glass-card"; 
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  IndianRupee, Package, Clock, Heart, ArrowRight, AlertTriangle, 
  CreditCard, Landmark, Smartphone, Tag, CheckCircle2, User, Phone, Mail, MapPin, FileText, Calendar
} from "lucide-react";

// 🟢 MOCK PROJECT DATA (Synced with Admin)
const PROJECTS = [
  { name: "Vidya Shakti (Education)", raised: 245000, goal: 500000, color: "bg-blue-600", percent: 49 },
  { name: "Drishti Eye Camp", raised: 150000, goal: 300000, color: "bg-emerald-500", percent: 50 },
  { name: "Annapoorna (Hunger Relief)", raised: 180000, goal: 800000, color: "bg-orange-500", percent: 23 },
];

export function DonorDashboardView() {
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    pan: '',
    amount: '',
    purpose: 'General Fund (Unrestricted)',
    paymentMethod: 'UPI',
    // In-Kind Specific
    itemName: '',
    quantity: '',
    // Service Specific
    serviceType: '',
    hours: ''
  });

  // Auto-fill Name on Load
  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      setFormData(prev => ({ ...prev, name: savedName }));
    }
  }, []);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMoneyDonation = () => {
    // 1. Validation
    if (!formData.amount || !formData.name || !formData.mobile) {
      alert("Please fill in Name, Mobile, and Amount.");
      return;
    }
    if (Number(formData.amount) < 100) {
      alert("Minimum donation amount is ₹100.");
      return;
    }

    // 2. Sync with Admin
    const adminDonation = {
      id: crypto.randomUUID(),
      donorName: formData.name,
      amount: Number(formData.amount),
      purpose: formData.purpose,
      type: "Money",
      status: "Success",
      createdAt: new Date().toISOString()
    };

    const existingDonations = JSON.parse(localStorage.getItem("demo_donations") || "[]");
    existingDonations.unshift(adminDonation);
    localStorage.setItem("demo_donations", JSON.stringify(existingDonations));

    // 3. Generate Receipt
    downloadReceipt(
        `GEN-${Math.floor(Math.random() * 10000)}`, 
        formData.amount, 
        new Date().toISOString().split('T')[0], 
        "TAX RECEIPT"
    );
    
    setFormData(prev => ({ ...prev, amount: '' }));
    alert("Donation successful! Your 80G Receipt is downloading.");
  };

  const handleInKindSubmit = () => {
      alert("Thank you! Your In-Kind donation request has been submitted for approval.");
      setFormData(prev => ({ ...prev, itemName: '', quantity: '' }));
  };

  const handleServiceSubmit = () => {
      alert("Thank you! Your volunteering request has been logged.");
      setFormData(prev => ({ ...prev, serviceType: '', hours: '' }));
  };

  // 🟢 RECEIPT GENERATOR
  const downloadReceipt = (receiptId: string, amount: string, date: string, title: string) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1240;
    canvas.height = 1754;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#3366FF';
    ctx.fillRect(0, 0, canvas.width, 300);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 80px Helvetica, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, canvas.width / 2, 180);

    ctx.font = 'normal 30px Helvetica, Arial, sans-serif';
    ctx.fillText('GlassBox 45 Foundation', canvas.width / 2, 240);

    ctx.textAlign = 'left';
    const margin = 100;
    const startX = margin;
    let startY = 450;
    const lineHeight = 100;

    const drawRow = (label: string, value: string) => {
      ctx.font = 'bold 40px Helvetica, Arial, sans-serif';
      ctx.fillStyle = '#64748B';
      ctx.textAlign = 'left';
      ctx.fillText(label, startX, startY);

      ctx.font = 'normal 45px Helvetica, Arial, sans-serif';
      ctx.fillStyle = '#0F172A';
      ctx.textAlign = 'right';
      ctx.fillText(value, canvas.width - margin, startY);

      ctx.beginPath();
      ctx.moveTo(startX, startY + 30);
      ctx.lineTo(canvas.width - margin, startY + 30);
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 2;
      ctx.stroke();

      startY += lineHeight;
    };

    drawRow('Receipt Reference:', receiptId);
    drawRow('Donor Name:', formData.name);
    drawRow('Date:', date);
    drawRow('Amount:', `Rs. ${amount}`);
    drawRow('Project:', formData.purpose);

    const stampY = startY + 100;
    const boxHeight = 150;
    ctx.fillStyle = '#DCFCE7';
    ctx.fillRect(margin, stampY, canvas.width - (margin * 2), boxHeight);
    ctx.strokeStyle = '#166534';
    ctx.lineWidth = 3;
    ctx.strokeRect(margin, stampY, canvas.width - (margin * 2), boxHeight);
    ctx.fillStyle = '#166534';
    ctx.font = 'bold 40px Helvetica, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✓  80G Tax Exempt Compliant', canvas.width / 2, stampY + 90);

    const link = document.createElement('a');
    link.download = `${title}_${receiptId}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.9);
    link.click();
  };
  
  return (
    <div className="space-y-8">
      
      {/* 1. WELCOME & STATS */}
      <GlassCard className="border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Welcome back, {formData.name || 'Donor'}!</h2>
            <p className="text-gray-500 mt-1 text-sm">Your contributions are changing lives.</p>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-blue-100">
            <div className="p-2 bg-emerald-100 rounded-full"><Heart className="w-5 h-5 text-emerald-600" /></div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase">Your Impact</p>
              <p className="text-lg font-bold text-gray-900">₹1,25,000</p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* 2. LIVE PROJECT FUNDING (New Section) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <TargetIcon /> Live Project Funding Goals
            </h3>
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-sm">
                {PROJECTS.map((project, idx) => (
                <div key={idx}>
                    <div className="flex justify-between items-end mb-2">
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm">{project.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                        Raised: <span className="font-semibold text-slate-900">₹{project.raised.toLocaleString()}</span> • 
                        Goal: <span className="text-slate-400">₹{project.goal.toLocaleString()}</span>
                        </p>
                    </div>
                    <span className="text-xs font-bold text-slate-600">{project.percent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                        className={`h-full rounded-full transition-all duration-1000 ${project.color}`} 
                        style={{ width: `${project.percent}%` }}
                    ></div>
                    </div>
                </div>
                ))}
            </div>
        </div>

        {/* 3. EMERGENCY CALLOUT */}
        <div>
            <h3 className="font-bold text-slate-900 mb-4 opacity-0">.</h3>
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-6 h-[calc(100%-2rem)] flex flex-col justify-between">
                <div>
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="text-orange-600"/>
                    </div>
                    <h4 className="font-bold text-orange-900 mb-2">Emergency Relief</h4>
                    <p className="text-sm text-orange-800/80 leading-relaxed">
                        Flood relief efforts active in Gujarat. 500 families need food packets and medical kits immediately.
                    </p>
                </div>
                <Button className="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white font-bold cursor-pointer">
                    Donate to Relief
                </Button>
            </div>
        </div>
      </div>

      {/* 4. MAKE A DONATION (The Upgraded Form) */}
      <GlassCard title="Make a Contribution" subtitle="Secure, tax-deductible, and transparent.">
        <Tabs defaultValue="money" className="mt-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1 rounded-xl">
            <TabsTrigger value="money" className="rounded-lg cursor-pointer">Money</TabsTrigger>
            <TabsTrigger value="inkind" className="rounded-lg cursor-pointer">In-Kind</TabsTrigger>
            <TabsTrigger value="service" className="rounded-lg cursor-pointer">Service</TabsTrigger>
          </TabsList>

          {/* --- MONEY TAB --- */}
          <TabsContent value="money" className="mt-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left: Personal Details */}
                <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Donor Details</h4>
                    <div className="relative">
                        <User className="absolute left-3 top-3 text-slate-400 w-4 h-4"/>
                        <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name *" className="pl-10"/>
                    </div>
                    <div className="relative">
                        <Phone className="absolute left-3 top-3 text-slate-400 w-4 h-4"/>
                        <Input name="mobile" value={formData.mobile} onChange={handleInputChange} placeholder="Mobile Number *" className="pl-10"/>
                    </div>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-slate-400 w-4 h-4"/>
                        <Input name="email" value={formData.email} onChange={handleInputChange} placeholder="Email (Optional)" className="pl-10"/>
                    </div>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 text-slate-400 w-4 h-4"/>
                        <Input name="address" value={formData.address} onChange={handleInputChange} placeholder="City / Address" className="pl-10"/>
                    </div>
                </div>

                {/* Right: Payment Details */}
                <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Donation Details</h4>
                    
                    {/* Amount Field with Min Value Logic */}
                    <div className="relative">
                        <IndianRupee className="absolute left-3 top-3 text-slate-400 w-4 h-4"/>
                        <Input 
                            name="amount" 
                            type="number" 
                            value={formData.amount} 
                            onChange={handleInputChange} 
                            placeholder="Amount (Min ₹100) *" 
                            className="pl-10 font-bold text-slate-700"
                        />
                    </div>
                    {formData.amount && Number(formData.amount) < 100 && (
                        <p className="text-[10px] text-red-500 font-bold ml-1">⚠️ Minimum donation is ₹100</p>
                    )}

                    <div className="relative">
                        <Tag className="absolute left-3 top-3.5 text-slate-400 w-4 h-4"/>
                        <select name="purpose" value={formData.purpose} onChange={handleInputChange} className="w-full pl-10 pr-4 py-2.5 rounded-md border border-slate-200 bg-white text-sm text-slate-700 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer">
                            <option>General Fund (Unrestricted)</option>
                            <option>Vidya Shakti (Education)</option>
                            <option>Drishti Eye Camp (Healthcare)</option>
                            <option>Annapoorna (Hunger Relief)</option>
                        </select>
                    </div>

                    <div className="relative">
                        <FileText className="absolute left-3 top-3 text-slate-400 w-4 h-4"/>
                        <Input name="pan" value={formData.pan} onChange={handleInputChange} placeholder="PAN (For 80G Tax Benefit)" className="pl-10"/>
                    </div>

                    {/* Mode Selector */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                        {['UPI', 'Card', 'Bank'].map(mode => (
                            <button 
                                key={mode} 
                                onClick={() => setFormData(prev => ({...prev, paymentMethod: mode}))}
                                className={`text-xs font-bold py-2 rounded-lg border transition-all ${formData.paymentMethod === mode ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <Button 
                className="w-full py-6 text-lg font-bold text-white shadow-xl shadow-blue-500/20 rounded-xl mt-6 cursor-pointer" 
                style={{ backgroundColor: '#3366FF' }} 
                onClick={handleMoneyDonation}
            >
                Donate ₹{formData.amount || '0'} Now
            </Button>
            <p className="text-center text-xs text-slate-400 mt-2 flex items-center justify-center gap-1">
               <CheckCircle2 size={12} className="text-emerald-500"/> Secure SSL • 80G Receipt Generated Instantly
            </p>
          </TabsContent>

          {/* --- IN-KIND TAB --- */}
          <TabsContent value="inkind" className="mt-6 space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <label className="text-sm font-semibold">Item Details</label>
                    <Input name="itemName" value={formData.itemName} onChange={handleInputChange} placeholder="Item Name (e.g. Blankets, Rice)"/>
                    <Input name="quantity" value={formData.quantity} onChange={handleInputChange} placeholder="Quantity (e.g. 50 kg)"/>
                </div>
                <div className="space-y-4">
                    <label className="text-sm font-semibold">Logistics</label>
                    <select className="w-full p-2.5 rounded-md border border-slate-200 text-sm">
                        <option>I will drop off at NGO center</option>
                        <option>Request Pickup (Large Quantity)</option>
                    </select>
                    <Input type="date" className="w-full"/>
                </div>
             </div>
             <Button onClick={handleInKindSubmit} className="w-full bg-teal-600 hover:bg-teal-700 text-white cursor-pointer">Submit In-Kind Offer</Button>
          </TabsContent>

          {/* --- SERVICE TAB --- */}
          <TabsContent value="service" className="mt-6 space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <label className="text-sm font-semibold">Service Type</label>
                    <select name="serviceType" onChange={handleInputChange} className="w-full p-2.5 rounded-md border border-slate-200 text-sm">
                        <option>Teaching / Tutoring</option>
                        <option>Medical Checkup</option>
                        <option>Elderly Care</option>
                        <option>Administrative Help</option>
                    </select>
                </div>
                <div className="space-y-4">
                    <label className="text-sm font-semibold">Availability</label>
                    <Input name="hours" value={formData.hours} onChange={handleInputChange} placeholder="Hours per week"/>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-sm"><input type="checkbox"/> Weekends</label>
                        <label className="flex items-center gap-2 text-sm"><input type="checkbox"/> Weekdays</label>
                    </div>
                </div>
             </div>
             <Button onClick={handleServiceSubmit} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer">Register as Volunteer</Button>
          </TabsContent>

        </Tabs>
      </GlassCard>
    </div>
  );
}

// Helper Icon Component
function TargetIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
    )
}