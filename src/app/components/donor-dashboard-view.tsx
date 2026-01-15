import { useState } from 'react';
import Dropzone from 'react-dropzone';
import { createWorker } from 'tesseract.js';
// 🟢 Ensure these match your UI component paths
import { GlassCard } from "./glass-card"; 
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  DollarSign, Package, Clock, Calendar, Heart, Download,
  CheckCircle, ArrowRight, AlertTriangle, Upload, FileText, Trash2
} from "lucide-react";

// 🟢 HELPER: OCR Intelligence Logic
const extractBillDetails = (text: string) => {
  const cleanText = text.replace(/[₹$]/g, '');
  // Regex to look for "Total", "Amount" followed by a number
  const amountRegex = /(?:total|amount|payable|grand total)[\s:]*?(\d+(?:[.,]\d{1,2})?)/i;
  const amountMatch = cleanText.match(amountRegex);
  // Regex to look for dates
  const dateRegex = /\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/;
  const dateMatch = text.match(dateRegex);

  return {
    amount: amountMatch ? amountMatch[1] : null,
    date: dateMatch ? dateMatch[0] : null
  };
};

export function DonorDashboardView() {
  const [imagePreview, setImagePreview] = useState<string>('');
  const [extractedText, setExtractedText] = useState<string>('');
  const [ocrStatus, setOcrStatus] = useState<string>('');
  const [donationAmount, setDonationAmount] = useState('');
  
  // Dynamic History State
  const [donations, setDonations] = useState([
    { id: 1, date: "2026-01-02", amount: "₹500", status: "Success", receiptId: "001" },
    { id: 2, date: "2026-01-01", amount: "₹1,000", status: "Pending", receiptId: "002" },
    { id: 3, date: "2025-12-30", amount: "₹5,000", status: "Success", receiptId: "003" },
  ]);

  const handleProcessDonation = () => {
    if (!donationAmount) {
      alert("Please enter an amount first!");
      return;
    }
    const newDonation = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      amount: `₹${donationAmount}`,
      status: "Success",
      receiptId: `GEN-${Math.floor(Math.random() * 10000)}`
    };
    const adminDonation = {
  id: crypto.randomUUID(),
  donorName: "Fuzzy",
  amount: Number(donationAmount),
  purpose: "Education", // we’ll improve this later
  type: "Money",
  status: "Pending",
  createdAt: new Date().toISOString()
};
  const existingDonations = JSON.parse(
  localStorage.getItem("demo_donations") || "[]"
);

existingDonations.unshift(adminDonation);

localStorage.setItem(
  "demo_donations",
  JSON.stringify(existingDonations)
);


    setDonations([newDonation, ...donations]);
    downloadReceipt(newDonation.receiptId, newDonation.amount, newDonation.date);
    setDonationAmount('');
    handleRemoveImage();
    alert("Donation successful! Your receipt is downloading.");
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setExtractedText('');
    setOcrStatus('');
  };

  // 🟢 SMART RECEIPT GENERATOR
  const downloadReceipt = (receiptId: string, amount: string, date: string, title = "TAX RECEIPT") => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1240;
    canvas.height = 1754;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Header
    ctx.fillStyle = '#3366FF';
    ctx.fillRect(0, 0, canvas.width, 300);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 80px Helvetica, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title.toUpperCase(), canvas.width / 2, 180);

    ctx.font = 'normal 30px Helvetica, Arial, sans-serif';
    ctx.fillText('GlassBox 45 Foundation', canvas.width / 2, 240);

    // Content
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
    drawRow('Donor Name:', localStorage.getItem('userName') || 'Valued Donor');
    drawRow('Date of Donation:', date);
    drawRow('Donation Amount:', amount);
    drawRow('Payment Mode:', 'Online Transfer');

    // 80G Stamp
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

    // Footer
    const footerY = canvas.height - 150;
    ctx.fillStyle = '#94A3B8';
    ctx.font = 'italic 30px Helvetica, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Thank you for changing lives with GlassBox 45', canvas.width / 2, footerY);

    const link = document.createElement('a');
    link.download = `${title.replace(' ', '_')}_${receiptId}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.9);
    link.click();
  };
  
  return (
    <div className="space-y-6">
      {/* Disaster Mode Banner */}
      <GlassCard className="border-2" style={{ borderColor: '#d97706', backgroundColor: 'rgba(251, 146, 60, 0.1)' }}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-orange-100">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-gray-900 mb-1">Emergency Relief Campaign Active</h3>
            <p className="text-sm text-gray-600 mb-3">
              Flood relief efforts underway in Gujarat. 500 families need immediate assistance.
            </p>
            <Button style={{ backgroundColor: '#d97706' }} className="text-white cursor-pointer">
              Donate to Emergency Relief <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Welcome Header */}
      <GlassCard className="border-2" style={{ borderColor: '#3366FF' }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-900">Welcome back, {localStorage.getItem('userName') || 'Rajesh'}!</h2>
            <p className="text-gray-500 mt-1">Thank you for your continued support</p>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6" style={{ color: '#22C55E' }} />
            <div>
              <p className="text-sm text-gray-500">Total Impact</p>
              <p className="text-gray-900">₹1,25,000</p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Donate Tabs */}
      <GlassCard title="Make a Donation" subtitle="Choose how you'd like to contribute">
        <Tabs defaultValue="money" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="money" className="cursor-pointer">Money</TabsTrigger>
            <TabsTrigger value="inkind" className="cursor-pointer">In-Kind</TabsTrigger>
            <TabsTrigger value="service" className="cursor-pointer">Service</TabsTrigger>
          </TabsList>

          <TabsContent value="money" className="space-y-4 mt-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Amount (₹)</label>
              <Input
                type="number"
                placeholder="5000"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
              />
              {donationAmount && ocrStatus.includes('Found Total') && (
                <p className="text-xs text-green-600 mt-1 font-medium flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Auto-filled from your uploaded bill
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Purpose</label>
              <select className="w-full p-2 rounded-lg border border-gray-200 bg-white cursor-pointer">
                <option>Education</option><option>Healthcare</option><option>General Fund</option>
              </select>
            </div>
            <Button className="w-full text-white cursor-pointer" style={{ backgroundColor: '#3366FF' }} onClick={handleProcessDonation}>
              Donate Now
            </Button>
          </TabsContent>

          {/* In-Kind & Service Tabs (Simplified for brevity) */}
          <TabsContent value="inkind" className="space-y-4 mt-4">
             <div className="p-4 text-center text-gray-500 bg-gray-50 rounded">In-Kind Form Placeholder</div>
          </TabsContent>
          <TabsContent value="service" className="space-y-4 mt-4">
             <div className="p-4 text-center text-gray-500 bg-gray-50 rounded">Service Form Placeholder</div>
          </TabsContent>
        </Tabs>
      </GlassCard>

      {/* OCR Scanner */}
      <GlassCard title="Bill OCR Scanner" subtitle="Upload receipt to extract details">
        <div className="mt-4 space-y-4">
          {!imagePreview ? (
            <Dropzone
              multiple={false}
              accept={{ 'image/*': ['.jpg', '.jpeg', '.png'] }}
              onDrop={async (acceptedFiles) => {
                if (acceptedFiles[0]) {
                  setOcrStatus('Processing...');
                  setExtractedText('');
                  const worker = await createWorker('eng');
                  const { data: { text } } = await worker.recognize(acceptedFiles[0]);
                  await worker.terminate();
                  const details = extractBillDetails(text);
                  setExtractedText(text.trim());
                  setImagePreview(URL.createObjectURL(acceptedFiles[0]));
                  if (details.amount) {
                    setOcrStatus(`Found Total: ₹${details.amount}`);
                    setDonationAmount(details.amount);
                    alert(`Smart Scan Success! Total ₹${details.amount} extracted.`);
                  } else {
                    setOcrStatus('Extracted (No total found)');
                  }
                }
              }}
            >
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <input {...getInputProps()} />
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium text-gray-900">Drop bill image here</p>
                </div>
              )}
            </Dropzone>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              <img src={imagePreview} alt="Bill" className="max-w-full h-48 object-contain rounded-lg border" />
              <div>
                <p className="text-sm font-medium text-gray-700">Status: {ocrStatus}</p>
                <Button variant="outline" size="sm" onClick={handleRemoveImage} className="mt-2 text-red-600 border-red-200">
                  <Trash2 className="w-4 h-4 mr-2" /> Remove
                </Button>
              </div>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}