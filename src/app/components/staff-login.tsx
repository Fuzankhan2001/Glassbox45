import { useState } from "react";
import { Button } from "./ui/button";
import { Shield } from "lucide-react";
import { GlassCard } from "./glass-card";

type StaffLoginProps = {
  onSuccess: () => void;
  onBack: () => void;
};

export default function StaffLogin({ onSuccess, onBack }: StaffLoginProps) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (userId === "Glass_box" && password === "CR7") {
      onSuccess();
    } else {
      setError("Invalid staff credentials");
    }
  };

  return (
    <div className="min-h-screen bg-[#F6FAFF] flex items-center justify-center">
      <GlassCard className="w-full max-w-md p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#3366FF] rounded-xl flex items-center justify-center text-white">
            <Shield size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Staff Login</h2>
            <p className="text-sm text-slate-500">Admin Access Only</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3366FF]/40"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />

          <input
            type="password"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3366FF]/40"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="text-sm text-red-500 font-medium">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1">
              Login
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1"
            >
              Back
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
