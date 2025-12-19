import { useState } from "react";
import { GlassCard } from "./glass-card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Mail, Phone, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

// 🟢 NEW IMPORT — added safely
//import { supabase } from "../lib/supabase";
import { supabase } from "../../lib/supabase";

interface DonorLoginProps {
  onLogin: () => void;
}

export function DonorLogin({ onLogin }: DonorLoginProps) {
  const [step, setStep] = useState<"login" | "otp" | "kyc">("login");

  // 🟢 NEW STATE — added safely
  const [email, setEmail] = useState("");

  // 🟢 NEW FUNCTION — added safely
  const handleSendOTP = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: "http://localhost:5173",
      },
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Check your email for the login link!");
      setStep("otp");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#3366FF' }}>
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-gray-900 mb-2">GlassBox 45</h1>
          <p className="text-gray-500">Donor Portal - Transparent Giving</p>
        </div>

        <GlassCard>
          {step === "login" && (
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="phone">Phone</TabsTrigger>
              </TabsList>
              
              <TabsContent value="email" className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input 
                      type="email" 
                      placeholder="donor@example.com" 
                      className="pl-10"
                      // 🟢 added safely
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <Button 
                  className="w-full text-white" 
                  style={{ backgroundColor: '#3366FF' }}
                  // 🟢 replaced only onClick handler safely
                  onClick={handleSendOTP}
                >
                  Send OTP
                </Button>
              </TabsContent>

              <TabsContent value="phone" className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input 
                      type="tel" 
                      placeholder="+91 98765 43210" 
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button 
                  className="w-full text-white" 
                  style={{ backgroundColor: '#3366FF' }}
                  onClick={() => setStep("otp")}
                >
                  Send OTP
                </Button>
              </TabsContent>
            </Tabs>
          )}

          {step === "otp" && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-gray-900 mb-2">Enter OTP</h3>
                <p className="text-sm text-gray-500">We sent a code to your email/phone</p>
              </div>
              <div className="flex gap-3 justify-center">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Input 
                    key={i}
                    type="text" 
                    maxLength={1}
                    className="w-12 h-12 text-center"
                  />
                ))}
              </div>
              <Button 
                className="w-full text-white" 
                style={{ backgroundColor: '#3366FF' }}
                onClick={() => setStep("kyc")}
              >
                Verify OTP
              </Button>
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => setStep("login")}
              >
                Back to Login
              </Button>
            </div>
          )}

          {step === "kyc" && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-gray-900 mb-2">Complete KYC</h3>
                <p className="text-sm text-gray-500">For tax receipts and compliance</p>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Full Name</label>
                <Input placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">PAN Number</label>
                <Input placeholder="ABCDE1234F" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Address</label>
                <Input placeholder="123 Main Street, City" />
              </div>
              <Button 
                className="w-full text-white" 
                style={{ backgroundColor: '#22C55E' }}
                onClick={onLogin}
              >
                Complete Registration
              </Button>
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={onLogin}
              >
                Skip for now
              </Button>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By continuing, you agree to our Terms & Privacy Policy
            </p>
          </div>
        </GlassCard>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help? <span className="text-blue-600 cursor-pointer">Contact Support</span>
          </p>
        </div>
      </div>
    </div>
  );
}
