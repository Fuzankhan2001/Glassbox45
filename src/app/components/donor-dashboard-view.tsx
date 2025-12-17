import { GlassCard } from "./glass-card";
import { 
  DollarSign, 
  Package, 
  Clock, 
  FileText, 
  Calendar, 
  Heart,
  Download,
  CheckCircle,
  ArrowRight,
  AlertTriangle
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function DonorDashboardView() {
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
              shelter, and medical supplies. Every contribution makes a critical difference.
            </p>
            <Button style={{ backgroundColor: '#d97706' }} className="text-white">
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
            <h2 className="text-gray-900">Welcome back, Rajesh!</h2>
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
            <TabsTrigger value="money">Money</TabsTrigger>
            <TabsTrigger value="inkind">In-Kind</TabsTrigger>
            <TabsTrigger value="service">Service</TabsTrigger>
          </TabsList>

          <TabsContent value="money" className="space-y-4 mt-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Amount (₹)</label>
              <Input type="number" placeholder="5000" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Purpose</label>
              <select className="w-full p-2 rounded-lg border border-gray-200 bg-white">
                <option>Education</option>
                <option>Healthcare</option>
                <option>Emergency Relief</option>
                <option>General Fund</option>
              </select>
            </div>
            <Button className="w-full text-white" style={{ backgroundColor: '#3366FF' }}>
              Donate Now
            </Button>
          </TabsContent>

          <TabsContent value="inkind" className="space-y-4 mt-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Item Type</label>
              <select className="w-full p-2 rounded-lg border border-gray-200 bg-white">
                <option>Blankets</option>
                <option>School Uniforms</option>
                <option>Books</option>
                <option>Medical Supplies</option>
                <option>Food Items</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Quantity</label>
              <Input type="number" placeholder="20" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Pickup/Delivery Method</label>
              <select className="w-full p-2 rounded-lg border border-gray-200 bg-white">
                <option>NGO Pickup</option>
                <option>Self Delivery</option>
                <option>Courier Service</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Additional Notes</label>
              <Textarea placeholder="Any special instructions..." rows={3} />
            </div>
            <Button className="w-full text-white" style={{ backgroundColor: '#14B8A6' }}>
              Submit Request
            </Button>
          </TabsContent>

          <TabsContent value="service" className="space-y-4 mt-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Service Type</label>
              <select className="w-full p-2 rounded-lg border border-gray-200 bg-white">
                <option>Teaching</option>
                <option>Elderly Care</option>
                <option>Skill Training</option>
                <option>Administrative Support</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Hours per Week</label>
              <Input type="number" placeholder="10" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Availability</label>
              <Textarea placeholder="Monday-Friday, 5pm-7pm" rows={2} />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Skills/Qualifications</label>
              <Textarea placeholder="Describe your relevant experience..." rows={3} />
            </div>
            <Button className="w-full text-white" style={{ backgroundColor: '#22C55E' }}>
              Submit Application
            </Button>
          </TabsContent>
        </Tabs>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Impact Timeline */}
        <GlassCard title="Your Impact Timeline" subtitle="Track where your donations go">
          <div className="mt-4 space-y-4">
            <div className="relative pl-8 pb-4 border-l-2" style={{ borderColor: '#3366FF' }}>
              <div className="absolute left-0 top-0 w-4 h-4 rounded-full -ml-2" style={{ backgroundColor: '#22C55E' }}></div>
              <div className="bg-white/50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm text-gray-700">Receipt Issued</p>
                  <span className="text-xs text-gray-500">2 days ago</span>
                </div>
                <p className="text-xs text-gray-500">₹5,000 • Education Program</p>
              </div>
            </div>

            <div className="relative pl-8 pb-4 border-l-2" style={{ borderColor: '#3366FF' }}>
              <div className="absolute left-0 top-0 w-4 h-4 rounded-full -ml-2" style={{ backgroundColor: '#22C55E' }}></div>
              <div className="bg-white/50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm text-gray-700">Funds Utilized</p>
                  <span className="text-xs text-gray-500">1 week ago</span>
                </div>
                <p className="text-xs text-gray-500">Books purchased for 25 students</p>
              </div>
            </div>

            <div className="relative pl-8 pb-4 border-l-2" style={{ borderColor: '#3366FF' }}>
              <div className="absolute left-0 top-0 w-4 h-4 rounded-full -ml-2" style={{ backgroundColor: '#14B8A6' }}></div>
              <div className="bg-white/50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm text-gray-700">Vendor Verified</p>
                  <span className="text-xs text-gray-500">2 weeks ago</span>
                </div>
                <p className="text-xs text-gray-500">ABC Book Suppliers - Verified</p>
              </div>
            </div>

            <div className="relative pl-8">
              <div className="absolute left-0 top-0 w-4 h-4 rounded-full -ml-2" style={{ backgroundColor: '#3366FF' }}></div>
              <div className="bg-white/50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm text-gray-700">Donation Received</p>
                  <span className="text-xs text-gray-500">3 weeks ago</span>
                </div>
                <p className="text-xs text-gray-500">₹5,000 via UPI</p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Tax Receipts */}
        <GlassCard title="Tax Receipts" subtitle="Download your 80G certificates">
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/50">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8" style={{ color: '#3366FF' }} />
                <div>
                  <p className="text-sm text-gray-700">Receipt #GB45-2024-0342</p>
                  <p className="text-xs text-gray-500">₹5,000 • March 2024</p>
                </div>
              </div>
              <Button size="sm" variant="ghost">
                <Download className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-white/50">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8" style={{ color: '#14B8A6' }} />
                <div>
                  <p className="text-sm text-gray-700">Receipt #GB45-2024-0298</p>
                  <p className="text-xs text-gray-500">₹10,000 • February 2024</p>
                </div>
              </div>
              <Button size="sm" variant="ghost">
                <Download className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-white/50">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8" style={{ color: '#22C55E' }} />
                <div>
                  <p className="text-sm text-gray-700">Annual Summary 2023-24</p>
                  <p className="text-xs text-gray-500">Total: ₹1,25,000</p>
                </div>
              </div>
              <Button size="sm" variant="ghost">
                <Download className="w-4 h-4" />
              </Button>
            </div>

            <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: 'rgba(51, 102, 255, 0.05)' }}>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5" style={{ color: '#3366FF' }} />
                <div>
                  <p className="text-sm text-gray-700">80G Tax Exemption Available</p>
                  <p className="text-xs text-gray-500 mt-1">All receipts are 80G compliant for tax deductions</p>
                </div>
              </div>
            </div>
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

        <div className="mt-6 p-4 rounded-xl border-2" style={{ borderColor: '#22C55E', backgroundColor: 'rgba(34, 197, 94, 0.05)' }}>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6" style={{ color: '#22C55E' }} />
            <div>
              <h4 className="text-gray-900 mb-1">Special Campaign: Summer Education</h4>
              <p className="text-sm text-gray-600 mb-3">
                Help provide summer learning materials and activities for 500 underprivileged children
              </p>
              <Button size="sm" style={{ backgroundColor: '#22C55E' }} className="text-white">
                Donate to Campaign
              </Button>
            </div>
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
    </div>
  );
}