import { useEffect, useState } from "react";
// 🟢 Ensure these imports match your file structure
import { Homepage } from "./components/homepage";
import { DonorLogin } from "./components/donor-login";
import { DonorDashboardView } from "./components/donor-dashboard-view";
import { DonorHistoryView } from "./components/donor-history-view";
import { InKindTrackerView } from "./components/inkind-tracker-view";
import { Button } from "./components/ui/button";
import { Users, ArrowLeft, LayoutDashboard, History, Package } from "lucide-react";

type AppMode = "home" | "donor-login" | "donor-dashboard";
type DonorView = "dashboard" | "history" | "inkind-tracker";

export default function App() {
  const [appMode, setAppMode] = useState<AppMode>("home");
  const [donorView, setDonorView] = useState<DonorView>("dashboard");

  // 🟢 NEW: Check for existing session on page load
  useEffect(() => {
    const user = localStorage.getItem("userName");
    if (user) {
      setAppMode("donor-dashboard");
    }
  }, []);

  // 🟢 NEW: Handle Logout (Clear session + go home)
  const handleLogout = () => {
    localStorage.removeItem("userName");
    setAppMode("home");
  };

  // Public Homepage
  if (appMode === "home") {
    return <Homepage onGetStarted={() => setAppMode("donor-login")} />;
  }

  // Donor Login
  if (appMode === "donor-login") {
    return (
      <div style={{ backgroundColor: '#F6FAFF' }} className="min-h-screen relative">
        <div className="absolute top-6 left-6 z-10">
          <Button 
            variant="ghost" 
            onClick={() => setAppMode("home")}
            className="gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>
        <DonorLogin onLogin={() => setAppMode("donor-dashboard")} />
      </div>
    );
  }

  // Donor Dashboard
  if (appMode === "donor-dashboard") {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F6FAFF' }}>
        {/* Header */}
        <div className="border-b border-white/20 backdrop-blur-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}>
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#14B8A6' }}>
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-gray-900">GlassBox 45</h1>
                <p className="text-sm text-gray-500">Donor Portal</p>
              </div>
            </div>
            {/* 🟢 UPDATED: Logout Button now calls handleLogout */}
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="gap-2 cursor-pointer hover:text-red-600 hover:bg-red-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar Navigation */}
          <div className="w-64 min-h-[calc(100vh-73px)] border-r border-white/20 backdrop-blur-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}>
            <div className="p-6">
              <div className="mb-6 px-4">
                 <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</p>
              </div>
              <nav className="space-y-1">
                <button
                  onClick={() => setDonorView("dashboard")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                    donorView === "dashboard"
                      ? "text-white shadow-sm"
                      : "text-gray-700 hover:bg-white/40"
                  }`}
                  style={donorView === "dashboard" ? { backgroundColor: '#3366FF' } : {}}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span className="text-sm font-medium">Dashboard</span>
                </button>

                <button
                  onClick={() => setDonorView("history")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                    donorView === "history"
                      ? "text-white shadow-sm"
                      : "text-gray-700 hover:bg-white/40"
                  }`}
                  style={donorView === "history" ? { backgroundColor: '#3366FF' } : {}}
                >
                  <History className="w-5 h-5" />
                  <span className="text-sm font-medium">Donation History</span>
                </button>

                <button
                  onClick={() => setDonorView("inkind-tracker")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                    donorView === "inkind-tracker"
                      ? "text-white shadow-sm"
                      : "text-gray-700 hover:bg-white/40"
                  }`}
                  style={donorView === "inkind-tracker" ? { backgroundColor: '#3366FF' } : {}}
                >
                  <Package className="w-5 h-5" />
                  <span className="text-sm font-medium">In-Kind Tracker</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8 max-w-7xl">
            {donorView === "dashboard" && <DonorDashboardView />}
            {donorView === "history" && <DonorHistoryView />}
            {donorView === "inkind-tracker" && <InKindTrackerView />}
          </div>
        </div>
      </div>
    );
  }

  return null;
}