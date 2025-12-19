import { useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { GlassCard } from "./glass-card";
import { Button } from "./ui/button";
import { Heart, Shield, TrendingUp, Users, ArrowRight, CheckCircle, Calendar, Package, Clock } from "lucide-react";

interface HomepageProps {
  onGetStarted: () => void;
}

export function Homepage({ onGetStarted }: HomepageProps) {
  

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F6FAFF' }}>
      {/* Header */}
      <header className="border-b border-white/20 backdrop-blur-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#3366FF' }}>
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-gray-900">GlassBox 45</h2>
              <p className="text-xs text-gray-500">Transparent Giving</p>
            </div>
          </div>
          <Button onClick={onGetStarted} style={{ backgroundColor: '#3366FF' }} className="text-white">
            Login / Sign Up
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: '#3366FF' }}>
          <Heart className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-gray-900 mb-4">Donate with Complete Transparency</h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Every rupee tracked. Every impact visible. GlassBox 45 ensures your donations reach where they're needed most,
          with full audit-grade transparency.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button onClick={onGetStarted} size="lg" style={{ backgroundColor: '#3366FF' }} className="text-white">
            Start Donating
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <GlassCard className="text-center">
            <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: 'rgba(51, 102, 255, 0.1)' }}>
              <TrendingUp className="w-6 h-6" style={{ color: '#3366FF' }} />
            </div>
            <h3 className="text-gray-900">₹2.4 Cr+</h3>
            <p className="text-sm text-gray-500 mt-1">Total Donations</p>
          </GlassCard>

          <GlassCard className="text-center">
            <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: 'rgba(20, 184, 166, 0.1)' }}>
              <Users className="w-6 h-6" style={{ color: '#14B8A6' }} />
            </div>
            <h3 className="text-gray-900">5,240</h3>
            <p className="text-sm text-gray-500 mt-1">Active Donors</p>
          </GlassCard>

          <GlassCard className="text-center">
            <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
              <CheckCircle className="w-6 h-6" style={{ color: '#22C55E' }} />
            </div>
            <h3 className="text-gray-900">12,580</h3>
            <p className="text-sm text-gray-500 mt-1">Lives Impacted</p>
          </GlassCard>

          <GlassCard className="text-center">
            <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: 'rgba(51, 102, 255, 0.1)' }}>
              <Shield className="w-6 h-6" style={{ color: '#3366FF' }} />
            </div>
            <h3 className="text-gray-900">100%</h3>
            <p className="text-sm text-gray-500 mt-1">Transparency</p>
          </GlassCard>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-gray-900 mb-3">How GlassBox 45 Works</h2>
          <p className="text-gray-600">Your donation journey, from contribution to impact</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <GlassCard className="text-center">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#3366FF' }}>
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-gray-900 mb-2">1. Donate</h3>
            <p className="text-sm text-gray-600">
              Contribute money, in-kind items, or volunteer services through our secure platform
            </p>
          </GlassCard>

          <GlassCard className="text-center">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#14B8A6' }}>
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-gray-900 mb-2">2. Track</h3>
            <p className="text-sm text-gray-600">
              Follow your donation's journey in real-time with complete transparency and verified vendors
            </p>
          </GlassCard>

          <GlassCard className="text-center">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#22C55E' }}>
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-gray-900 mb-2">3. See Impact</h3>
            <p className="text-sm text-gray-600">
              View detailed reports, download tax receipts, and witness the change you're creating
            </p>
          </GlassCard>
        </div>
      </section>

      {/* Donation Options */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-gray-900 mb-3">Ways to Contribute</h2>
          <p className="text-gray-600">Choose how you'd like to make a difference</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(51, 102, 255, 0.1)' }}>
                <Heart className="w-6 h-6" style={{ color: '#3366FF' }} />
              </div>
              <h3 className="text-gray-900">Money</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Direct financial contributions for education, healthcare, and emergency relief programs
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" style={{ color: '#22C55E' }} />
                80G Tax Benefits
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" style={{ color: '#22C55E' }} />
                Instant Receipts
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" style={{ color: '#22C55E' }} />
                Full Tracking
              </li>
            </ul>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(20, 184, 166, 0.1)' }}>
                <Package className="w-6 h-6" style={{ color: '#14B8A6' }} />
              </div>
              <h3 className="text-gray-900">In-Kind</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Donate items like blankets, uniforms, books, and medical supplies directly to beneficiaries
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" style={{ color: '#22C55E' }} />
                Request Approval
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" style={{ color: '#22C55E' }} />
                Pickup Options
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" style={{ color: '#22C55E' }} />
                Delivery Status
              </li>
            </ul>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
                <Clock className="w-6 h-6" style={{ color: '#22C55E' }} />
              </div>
              <h3 className="text-gray-900">Services</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Volunteer your time and skills for teaching, elderly care, and community development
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" style={{ color: '#22C55E' }} />
                Flexible Hours
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" style={{ color: '#22C55E' }} />
                Skill Matching
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" style={{ color: '#22C55E' }} />
                Impact Reports
              </li>
            </ul>
          </GlassCard>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <GlassCard className="text-center border-2" style={{ borderColor: '#3366FF' }}>
          <div className="py-8">
            <h2 className="text-gray-900 mb-3">Ready to Make a Difference?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of donors who trust GlassBox 45 for transparent, impactful giving
            </p>
            <Button onClick={onGetStarted} size="lg" style={{ backgroundColor: '#3366FF' }} className="text-white">
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </GlassCard>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/20 backdrop-blur-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#3366FF' }}>
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-gray-900">GlassBox 45</h3>
              </div>
              <p className="text-sm text-gray-600">Transparent giving for a better tomorrow</p>
            </div>
            <div>
              <h4 className="text-gray-900 mb-3">About</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Our Mission</a></li>
                <li><a href="#" className="hover:text-blue-600">How It Works</a></li>
                <li><a href="#" className="hover:text-blue-600">Impact Stories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-600">Contact Us</a></li>
                <li><a href="#" className="hover:text-blue-600">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-600">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-600">80G Certificate</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/20 text-center text-sm text-gray-500">
            © 2024 GlassBox 45. All rights reserved. Built for transparency.
          </div>
        </div>
      </footer>
    </div>
  );
}
