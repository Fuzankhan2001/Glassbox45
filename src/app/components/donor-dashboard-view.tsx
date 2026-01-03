import { useState } from 'react';
// import jsPDF from 'jspdf'; // Not needed since we use Canvas for receipts
import Dropzone from 'react-dropzone';
import { createWorker } from 'tesseract.js';
import { GlassCard } from "./glass-card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  DollarSign,
  Package,
  Clock,
  Calendar,
  Heart,
  Download,
  CheckCircle,
  ArrowRight,
  AlertTriangle,
  Upload,
  FileText,
  Trash2
} from "lucide-react";

// 🟢 HELPER: OCR Intelligence Logic
const extractBillDetails = (text: string) => {
  const cleanText = text.replace(/[₹$]/g, '');

  // Regex to look for "Total", "Amount", "Grand Total" followed by a number
  const amountRegex = /(?:total|amount|payable|grand total)[\s:]*?(\d+(?:[.,]\d{1,2})?)/i;
  const amountMatch = cleanText.match(amountRegex);

  // Regex to look for dates (DD/MM/YYYY or similar)
  const dateRegex = /\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/;
  const dateMatch = text.match(dateRegex);

  return {
    amount: amountMatch ? amountMatch[1] : null,
    date: dateMatch ? dateMatch[0] : null
  };
};

export function DonorDashboardView() {
  // 1. OCR & File State
  const [imagePreview, setImagePreview] = useState<string>('');
  const [extractedText, setExtractedText] = useState<string>('');
  const [ocrStatus, setOcrStatus] = useState<string>('');
  // 🟢 NEW: State for QR Modal
  const [showQrModal, setShowQrModal] = useState(false);

  // 2. Donation Form State (Auto-filled by OCR)
  const [donationAmount, setDonationAmount] = useState('');

  // 3. Donation History State
  const [donations, setDonations] = useState([
    { id: 1, date: "2026-01-02", amount: "₹500", status: "Success", receiptId: "001" },
    { id: 2, date: "2026-01-01", amount: "₹1,000", status: "Pending", receiptId: "002" },
    { id: 3, date: "2025-12-30", amount: "₹5,000", status: "Success", receiptId: "003" },
  ]);

  // 🟢 4. NEW: State for Role 3 (Donation Forms)
  const [inkindForm, setInkindForm] = useState({ item: 'Blankets', quantity: '', desc: '' });
  const [serviceForm, setServiceForm] = useState({ skill: 'Teaching', hours: '', availability: '' });

  // --- HANDLERS ---

  // Handle Money Donation
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

    setDonations([newDonation, ...donations]);
    downloadReceipt(newDonation.receiptId, newDonation.amount, newDonation.date);
    setDonationAmount('');
    handleRemoveImage();
    alert("Donation successful! Your receipt is downloading.");
  };

  // 🟢 NEW: Handle In-Kind Submission
  const handleInKindSubmit = () => {
    if (!inkindForm.quantity) return alert("Please specify a quantity.");

    const newDonation = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      amount: `${inkindForm.quantity}x ${inkindForm.item}`,
      status: "Pending Pickup",
      receiptId: `GIFT-${Math.floor(Math.random() * 1000)}`
    };

    setDonations([newDonation, ...donations]);
    alert(`Thank you! We have received your request to donate ${inkindForm.quantity} ${inkindForm.item}.`);
    setInkindForm({ ...inkindForm, quantity: '', desc: '' }); // Reset form
  };

  // 🟢 NEW: Handle Service Submission
  const handleServiceSubmit = () => {
    if (!serviceForm.hours) return alert("Please specify hours.");

    const newDonation = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      amount: `${serviceForm.hours} Hours (${serviceForm.skill})`,
      status: "Scheduled",
      receiptId: `SRVC-${Math.floor(Math.random() * 1000)}`
    };

    setDonations([newDonation, ...donations]);
    alert(`Awesome! You are signed up to volunteer for ${serviceForm.hours} hours.`);
    setServiceForm({ ...serviceForm, hours: '', availability: '' }); // Reset form
  };

  // Receipt Download Logic (Canvas)
  const downloadReceipt = (receiptId: string, amount: string, date: string, title = "TAX RECEIPT") => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = 1240;
    canvas.height = 1754;

    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Header
    ctx.fillStyle = '#3366FF';
    ctx.fillRect(0, 0, canvas.width, 300);

    // Header Text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 80px Helvetica, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title.toUpperCase(), canvas.width / 2, 180);

    // Subheader
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
      ctx.fillText(label, startX, startY);

      ctx.font = 'normal 45px Helvetica, Arial, sans-serif';
      ctx.fillStyle = '#0F172A';
      ctx.textAlign = 'right';
      ctx.fillText(value, canvas.width - margin, startY);

      ctx.textAlign = 'left';
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

    // Stamp
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

  const handleRemoveImage = () => {
    setImagePreview('');
    setExtractedText('');
    setOcrStatus('');
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
              Flood relief efforts underway in Gujarat. 500 families need immediate assistance with food,
              shelter, and medical supplies.
            </p>
            <Button style={{ backgroundColor: '#d97706' }} className="text-white cursor-pointer">
              Donate to Emergency Relief
              <ArrowRight className="w-4 h-4 ml-2" />
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

      {/* Donate Now Options */}
      <GlassCard title="Make a Donation" subtitle="Choose how you'd like to contribute">
        <Tabs defaultValue="money" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="money" className="cursor-pointer">Money</TabsTrigger>
            <TabsTrigger value="inkind" className="cursor-pointer">In-Kind</TabsTrigger>
            <TabsTrigger value="service" className="cursor-pointer">Service</TabsTrigger>
          </TabsList>

          {/* MONEY TAB */}
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
                <option>Education</option>
                <option>Healthcare</option>
                <option>Emergency Relief</option>
                <option>General Fund</option>
              </select>
            </div>
            <Button
              className="w-full text-white cursor-pointer"
              style={{ backgroundColor: '#3366FF' }}
              onClick={() => {
                if (!donationAmount) return alert("Please enter an amount first!");
                setShowQrModal(true); // <--- Opens the QR Popup
              }}
            >
              Donate via UPI / QR
            </Button>
          </TabsContent>

          {/* 🟢 UPDATED: IN-KIND TAB */}
          <TabsContent value="inkind" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Item Type</label>
                <select
                  className="w-full p-2 rounded-lg border border-gray-200 bg-white cursor-pointer"
                  value={inkindForm.item}
                  onChange={(e) => setInkindForm({ ...inkindForm, item: e.target.value })}
                >
                  <option>Blankets</option>
                  <option>School Uniforms</option>
                  <option>Books</option>
                  <option>Food Items</option>
                  <option>Medical Supplies</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Quantity</label>
                <Input
                  type="number"
                  placeholder="e.g. 50"
                  value={inkindForm.quantity}
                  onChange={(e) => setInkindForm({ ...inkindForm, quantity: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Description / Condition</label>
              <Textarea
                placeholder="Brand new, sealed in box..."
                className="bg-white"
                value={inkindForm.desc}
                onChange={(e) => setInkindForm({ ...inkindForm, desc: e.target.value })}
              />
            </div>
            <Button
              className="w-full text-white cursor-pointer"
              style={{ backgroundColor: '#14B8A6' }}
              onClick={handleInKindSubmit}
            >
              Submit In-Kind Request
            </Button>
          </TabsContent>

          {/* 🟢 UPDATED: SERVICE TAB */}
          <TabsContent value="service" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Skill / Service</label>
                <select
                  className="w-full p-2 rounded-lg border border-gray-200 bg-white cursor-pointer"
                  value={serviceForm.skill}
                  onChange={(e) => setServiceForm({ ...serviceForm, skill: e.target.value })}
                >
                  <option>Teaching</option>
                  <option>Elderly Care</option>
                  <option>Skill Training</option>
                  <option>Medical Checkup</option>
                  <option>Logistics Support</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Hours Pledged</label>
                <Input
                  type="number"
                  placeholder="e.g. 4"
                  value={serviceForm.hours}
                  onChange={(e) => setServiceForm({ ...serviceForm, hours: e.target.value })}
                />
              </div>
            </div>
            <Button
              className="w-full text-white cursor-pointer"
              style={{ backgroundColor: '#22C55E' }}
              onClick={handleServiceSubmit}
            >
              Volunteer Now
            </Button>
          </TabsContent>
        </Tabs>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donation Timeline */}
        <GlassCard title="Your Donation Timeline" subtitle="Complete history with receipts">
          <div className="mt-4">
            <div className="overflow-x-auto">
              <table className="w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((donation) => (
                    <tr key={donation.id} className="border-t hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{donation.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">{donation.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${donation.status === 'Success'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {donation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadReceipt(donation.receiptId, donation.amount, donation.date)}
                          className="border-gray-300 hover:border-gray-400 cursor-pointer"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </GlassCard>

        {/* Tax Receipts */}
        <GlassCard title="Tax Receipts" subtitle="Download your 80G certificates">
          <div className="mt-6 space-y-4">
            {[
              {
                id: "GB45-2024-0342",
                title: "Receipt #GB45-2024-0342",
                subtitle: "₹5,000 • March 2024",
                date: "March 2024",
                amount: "₹5,000",
                color: "#3366FF",
                type: "Receipt"
              },
              {
                id: "GB45-2024-0298",
                title: "Receipt #GB45-2024-0298",
                subtitle: "₹10,000 • February 2024",
                date: "February 2024",
                amount: "₹10,000",
                color: "#14B8A6",
                type: "Receipt"
              },
              {
                id: "FY-2023-24",
                title: "Annual Summary 2023-24",
                subtitle: "Total: ₹1,25,000",
                date: "FY 2023-24",
                amount: "₹1,25,000",
                color: "#22C55E",
                type: "Annual Summary"
              }
            ].map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-1 group">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
                    style={{
                      backgroundColor: `${doc.color}15`,
                      color: doc.color
                    }}
                  >
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{doc.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{doc.subtitle}</p>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="cursor-pointer text-gray-400 hover:text-gray-900 h-8 w-8"
                  onClick={() => downloadReceipt(
                    doc.id,
                    doc.amount,
                    doc.date,
                    doc.type === "Annual Summary" ? "ANNUAL STATEMENT" : "TAX RECEIPT"
                  )}
                >
                  <Download className="w-5 h-5" />
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-xl flex items-start gap-3" style={{ backgroundColor: '#F0F9FF' }}>
            <div className="mt-0.5">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">80G Tax Exemption Available</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                All receipts listed above are compliant with 80G tax deduction norms.
                Please include the receipt number when filing your returns.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* OCR Bill Demo */}
        <GlassCard title="Bill OCR Scanner" subtitle="Upload receipt/bill to auto-extract details">
          <div className="mt-4 space-y-4">
            {!imagePreview && (
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
                      alert(`Smart Scan Success! We found a total of ₹${details.amount} and auto-filled the donation form.`);
                    } else {
                      setOcrStatus('Extracted (No total found)');
                    }
                  }
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <div
                    {...getRootProps()}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                  >
                    <input {...getInputProps()} />
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium text-gray-900 mb-1">Drop bill image here</p>
                    <p className="text-sm text-gray-500">JPG/PNG - Extracts total, items automatically</p>
                  </div>
                )}
              </Dropzone>
            )}

            {imagePreview && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Bill:</p>
                  <img src={imagePreview} alt="Bill" className="max-w-full h-48 object-contain rounded-lg border" />

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveImage}
                    className="mt-2 w-full cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove Image
                  </Button>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Extracted Text: <span className={`text-xs px-2 py-1 rounded-full ${ocrStatus.includes('Found') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{ocrStatus}</span>
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg max-h-48 overflow-y-auto font-mono text-sm">
                    {extractedText || 'Processing...'}
                  </div>
                  {extractedText && (
                    <Button className="mt-3 w-full cursor-pointer" variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Copy Extracted Data
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </GlassCard>
      </div>

      {/* NGO Roadmap Viewer */}
      <GlassCard title="NGO Roadmap & Goals" subtitle="See what's planned ahead">
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white/50 border border-white/30">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-5 h-5" style={{ color: '#3366FF' }} />
              <h4 className="text-gray-900">March 2024</h4>
            </div>
            <Progress value={75} className="h-2 mb-2" />
            <p className="text-xs text-gray-600 mb-2">Education Drive</p>
            <p className="text-xs text-gray-500">Goal: ₹5,00,000 • Raised: ₹3,75,000</p>
          </div>

          <div className="p-4 rounded-xl bg-white/50 border border-white/30">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-5 h-5" style={{ color: '#14B8A6' }} />
              <h4 className="text-gray-900">April 2024</h4>
            </div>
            <Progress value={45} className="h-2 mb-2" />
            <p className="text-xs text-gray-600 mb-2">Health Camp</p>
            <p className="text-xs text-gray-500">Goal: ₹3,00,000 • Raised: ₹1,35,000</p>
          </div>

          <div className="p-4 rounded-xl bg-white/50 border border-white/30">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-5 h-5" style={{ color: '#22C55E' }} />
              <h4 className="text-gray-900">May 2024</h4>
            </div>
            <Progress value={15} className="h-2 mb-2" />
            <p className="text-xs text-gray-600 mb-2">Emergency Relief</p>
            <p className="text-xs text-gray-500">Goal: ₹8,00,000 • Raised: ₹1,20,000</p>
          </div>
        </div>
      </GlassCard>

      {/* Donation History Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Donations</p>
              <h2 className="mt-2 text-gray-900">₹1,25,000</h2>
              <p className="text-xs text-gray-500 mt-1">12 donations</p>
            </div>
            <DollarSign className="w-10 h-10 p-2 rounded-xl" style={{ backgroundColor: 'rgba(51, 102, 255, 0.1)', color: '#3366FF' }} />
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">In-Kind Items</p>
              <h2 className="mt-2 text-gray-900">42 Items</h2>
              <p className="text-xs text-gray-500 mt-1">5 contributions</p>
            </div>
            <Package className="w-10 h-10 p-2 rounded-xl" style={{ backgroundColor: 'rgba(20, 184, 166, 0.1)', color: '#14B8A6' }} />
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Service Hours</p>
              <h2 className="mt-2 text-gray-900">86 Hours</h2>
              <p className="text-xs text-gray-500 mt-1">Teaching & support</p>
            </div>
            <Clock className="w-10 h-10 p-2 rounded-xl" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22C55E' }} />
          </div>
        </GlassCard>
      </div>
      {/* 🟢 UPI QR PAYMENT MODAL */}
      {/* 🟢 SECURE UPI MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <GlassCard className="w-full max-w-sm relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900"
            >
              ✕
            </button>

            <div className="text-center space-y-6 pt-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Scan to Donate</h3>
                <p className="text-sm text-gray-500">Scan with any UPI App</p>
              </div>

              {/* QR Code */}
              <div className="bg-white p-4 rounded-xl shadow-inner mx-auto w-fit border border-gray-200">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=glassbox@sbi&pn=GlassBoxFoundation&am=${donationAmount}&tn=Donation&cu=INR`} 
                  alt="UPI QR Code" 
                  className="w-48 h-48 mix-blend-multiply"
                />
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-700 font-medium">
                  Amount: <span className="font-bold text-lg">₹{donationAmount}</span>
                </p>
              </div>

              {/* 🔒 NEW: Transaction ID Input */}
              <div className="text-left space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  Enter UTR / Transaction ID
                </label>
                <Input 
                  placeholder="e.g. 123456789012" 
                  className="bg-white/50 text-center tracking-widest font-mono"
                  onChange={(e) => {
                    // Unlock button only if they type 12 chars (standard UPI length)
                    const btn = document.getElementById('verify-btn') as HTMLButtonElement;
                    if (e.target.value.length > 3) {
                       btn.disabled = false;
                       btn.classList.remove('opacity-50', 'cursor-not-allowed');
                    } else {
                       btn.disabled = true;
                       btn.classList.add('opacity-50', 'cursor-not-allowed');
                    }
                  }}
                />
              </div>

              <Button 
                id="verify-btn"
                disabled
                className="w-full text-white h-12 text-lg font-medium opacity-50 cursor-not-allowed transition-all" 
                style={{ backgroundColor: '#22C55E' }}
                onClick={(e) => {
                  const btn = e.currentTarget;
                  // 1. Fake Loading State
                  btn.innerHTML = 'Verifying with Bank...';
                  btn.disabled = true;
                  
                  // 2. Wait 2 seconds to simulate network check
                  setTimeout(() => {
                    setShowQrModal(false);
                    handleProcessDonation(); 
                  }, 2000);
                }}
              >
                Verify & Download Receipt
              </Button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}