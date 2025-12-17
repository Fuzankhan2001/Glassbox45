import { GlassCard } from "./glass-card";
import { FileText, Download, DollarSign, Package, Clock, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function DonorHistoryView() {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Donations</p>
              <h2 className="mt-2 text-gray-900">₹1,25,000</h2>
              <p className="text-xs text-gray-500 mt-1">This financial year</p>
            </div>
            <DollarSign className="w-10 h-10 p-2 rounded-xl" style={{ backgroundColor: 'rgba(51, 102, 255, 0.1)', color: '#3366FF' }} />
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Tax Savings</p>
              <h2 className="mt-2 text-gray-900">₹62,500</h2>
              <p className="text-xs text-gray-500 mt-1">80G deductions available</p>
            </div>
            <FileText className="w-10 h-10 p-2 rounded-xl" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22C55E' }} />
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Contributions</p>
              <h2 className="mt-2 text-gray-900">18</h2>
              <p className="text-xs text-gray-500 mt-1">Money, items & service</p>
            </div>
            <Package className="w-10 h-10 p-2 rounded-xl" style={{ backgroundColor: 'rgba(20, 184, 166, 0.1)', color: '#14B8A6' }} />
          </div>
        </GlassCard>
      </div>

      {/* Donation History */}
      <GlassCard title="Donation History" subtitle="All your contributions in one place">
        <Tabs defaultValue="all" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="money">Money</TabsTrigger>
            <TabsTrigger value="inkind">In-Kind</TabsTrigger>
            <TabsTrigger value="service">Service</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3 mt-4">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/50 border border-white/30">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(51, 102, 255, 0.1)' }}>
                <DollarSign className="w-6 h-6" style={{ color: '#3366FF' }} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-gray-900">₹5,000 Donation</h4>
                    <p className="text-sm text-gray-600 mt-1">Education Program • UPI Payment</p>
                  </div>
                  <Badge style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22C55E' }}>
                    Completed
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>March 15, 2024</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    <span>Receipt #GB45-2024-0342</span>
                  </div>
                </div>
                <div className="mt-3">
                  <Button size="sm" variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Download Receipt
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/50 border border-white/30">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(20, 184, 166, 0.1)' }}>
                <Package className="w-6 h-6" style={{ color: '#14B8A6' }} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-gray-900">20 Blankets</h4>
                    <p className="text-sm text-gray-600 mt-1">Winter Relief Drive • NGO Pickup</p>
                  </div>
                  <Badge style={{ backgroundColor: 'rgba(20, 184, 166, 0.1)', color: '#14B8A6' }}>
                    Delivered
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>March 10, 2024</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    <span>Request #IKD-2024-0287</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/50 border border-white/30">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
                <Clock className="w-6 h-6" style={{ color: '#22C55E' }} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-gray-900">20 Hours Teaching Service</h4>
                    <p className="text-sm text-gray-600 mt-1">Math Tutoring • Weekend Program</p>
                  </div>
                  <Badge style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22C55E' }}>
                    In Progress
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Started March 5, 2024</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>12/20 hours completed</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/50 border border-white/30">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(51, 102, 255, 0.1)' }}>
                <DollarSign className="w-6 h-6" style={{ color: '#3366FF' }} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-gray-900">₹10,000 Donation</h4>
                    <p className="text-sm text-gray-600 mt-1">Healthcare Camp • Card Payment</p>
                  </div>
                  <Badge style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22C55E' }}>
                    Completed
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>February 28, 2024</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    <span>Receipt #GB45-2024-0298</span>
                  </div>
                </div>
                <div className="mt-3">
                  <Button size="sm" variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Download Receipt
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="money" className="mt-4">
            <div className="text-center py-12 text-gray-500">
              <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Showing money donations only</p>
            </div>
          </TabsContent>

          <TabsContent value="inkind" className="mt-4">
            <div className="text-center py-12 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Showing in-kind donations only</p>
            </div>
          </TabsContent>

          <TabsContent value="service" className="mt-4">
            <div className="text-center py-12 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Showing service donations only</p>
            </div>
          </TabsContent>
        </Tabs>
      </GlassCard>

      {/* Tax Receipts */}
      <GlassCard title="Tax Receipts & Certificates" subtitle="Download your 80G compliant receipts">
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/50 border border-white/30">
            <div className="flex items-center gap-3">
              <FileText className="w-10 h-10 p-2 rounded-lg" style={{ backgroundColor: 'rgba(51, 102, 255, 0.1)', color: '#3366FF' }} />
              <div>
                <p className="text-sm text-gray-700">Annual Summary FY 2023-24</p>
                <p className="text-xs text-gray-500">Total: ₹1,25,000 • 12 donations</p>
              </div>
            </div>
            <Button size="sm" variant="ghost">
              <Download className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-white/50 border border-white/30">
            <div className="flex items-center gap-3">
              <FileText className="w-10 h-10 p-2 rounded-lg" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22C55E' }} />
              <div>
                <p className="text-sm text-gray-700">80G Certificate</p>
                <p className="text-xs text-gray-500">Valid for tax deductions</p>
              </div>
            </div>
            <Button size="sm" variant="ghost">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
