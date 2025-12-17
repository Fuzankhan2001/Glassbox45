import { GlassCard } from "./glass-card";
import { Package, CheckCircle, Clock, Truck, XCircle, AlertCircle } from "lucide-react";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

export function InKindTrackerView() {
  return (
    <div className="space-y-6">
      <GlassCard title="In-Kind Donation Tracker" subtitle="Track the status of your item donations">
        <div className="mt-6 space-y-4">
          {/* Active Donation */}
          <div className="p-6 rounded-2xl border-2 bg-white/50" style={{ borderColor: '#14B8A6' }}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(20, 184, 166, 0.1)' }}>
                  <Package className="w-6 h-6" style={{ color: '#14B8A6' }} />
                </div>
                <div>
                  <h4 className="text-gray-900">20 Blankets</h4>
                  <p className="text-sm text-gray-600">Winter Relief Drive</p>
                </div>
              </div>
              <Badge style={{ backgroundColor: 'rgba(20, 184, 166, 0.1)', color: '#14B8A6' }}>
                In Transit
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Progress</span>
                <span className="text-sm text-gray-600">75% Complete</span>
              </div>
              <Progress value={75} className="h-2" />

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#22C55E' }}>
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs text-gray-700 text-center">Request Approved</p>
                  <p className="text-xs text-gray-500">Mar 10, 2024</p>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#22C55E' }}>
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs text-gray-700 text-center">Items Picked Up</p>
                  <p className="text-xs text-gray-500">Mar 12, 2024</p>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#14B8A6' }}>
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs text-gray-700 text-center">In Transit</p>
                  <p className="text-xs text-gray-500">Current Status</p>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center border-2" style={{ borderColor: '#22C55E' }}>
                    <CheckCircle className="w-5 h-5" style={{ color: '#22C55E' }} />
                  </div>
                  <p className="text-xs text-gray-700 text-center">Delivered</p>
                  <p className="text-xs text-gray-500">Pending</p>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: 'rgba(20, 184, 166, 0.05)' }}>
                <p className="text-sm text-gray-700">Expected delivery by March 18, 2024</p>
                <p className="text-xs text-gray-500 mt-1">Will be distributed to 20 families in rural Maharashtra</p>
              </div>
            </div>
          </div>

          {/* Pending Approval */}
          <div className="p-6 rounded-2xl border bg-white/50 border-white/30">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(51, 102, 255, 0.1)' }}>
                  <Package className="w-6 h-6" style={{ color: '#3366FF' }} />
                </div>
                <div>
                  <h4 className="text-gray-900">50 School Uniforms</h4>
                  <p className="text-sm text-gray-600">Education Program</p>
                </div>
              </div>
              <Badge style={{ backgroundColor: 'rgba(51, 102, 255, 0.1)', color: '#3366FF' }}>
                Pending Review
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Submitted on March 14, 2024</span>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(51, 102, 255, 0.05)' }}>
                <p className="text-sm text-gray-700">Your request is being reviewed by our team</p>
                <p className="text-xs text-gray-500 mt-1">You'll receive an update within 2-3 business days</p>
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="p-6 rounded-2xl border bg-white/50 border-white/30">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
                  <CheckCircle className="w-6 h-6" style={{ color: '#22C55E' }} />
                </div>
                <div>
                  <h4 className="text-gray-900">100 Books</h4>
                  <p className="text-sm text-gray-600">Library Development</p>
                </div>
              </div>
              <Badge style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22C55E' }}>
                Delivered
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4" style={{ color: '#22C55E' }} />
                <span>Delivered on February 25, 2024</span>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(34, 197, 94, 0.05)' }}>
                <p className="text-sm text-gray-700">Impact: Books distributed to 3 rural schools</p>
                <p className="text-xs text-gray-500 mt-1">Benefitting 150+ students in their education journey</p>
              </div>
            </div>
          </div>

          {/* Rejected */}
          <div className="p-6 rounded-2xl border bg-white/50 border-white/30">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-red-50">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h4 className="text-gray-900">30 Winter Jackets</h4>
                  <p className="text-sm text-gray-600">Winter Clothing Drive</p>
                </div>
              </div>
              <Badge className="bg-red-100 text-red-600">
                Not Approved
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-red-600">
                <XCircle className="w-4 h-4" />
                <span>Reviewed on March 1, 2024</span>
              </div>
              <div className="p-3 rounded-lg bg-red-50">
                <p className="text-sm text-gray-700">Reason: Not aligned with current program needs</p>
                <p className="text-xs text-gray-600 mt-1">
                  Thank you for your generous offer. Our current programs are focused on education materials. 
                  We'll keep you updated on future clothing drives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Info Card */}
      <GlassCard>
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 mt-0.5" style={{ color: '#3366FF' }} />
          <div>
            <h4 className="text-gray-900 mb-2">How In-Kind Donations Work</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Submit your donation request with item details and quantity</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Our team reviews the request against current program needs (2-3 days)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>If approved, we coordinate pickup or delivery based on your preference</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Track your items as they reach beneficiaries and create impact</span>
              </li>
            </ul>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
