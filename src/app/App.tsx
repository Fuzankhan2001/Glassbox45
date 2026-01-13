import { useEffect, useState } from "react";
import { Homepage } from "./components/homepage";
import AdminDashboardView from './components/admin-dashboard-view';
import { DonorLogin } from "./components/donor-login";
import { DonorDashboardView } from "./components/donor-dashboard-view";
import { DonorHistoryView } from "./components/donor-history-view";
import { InKindTrackerView } from "./components/inkind-tracker-view";
import { Button } from "./components/ui/button";
import { Users, ArrowLeft, LayoutDashboard, History, Package, LogOut } from "lucide-react";

type AppMode = "home" | "donor-login" | "donor-dashboard" | "admin-dashboard";
type DonorView = "dashboard" | "history" | "inkind-tracker";

export default function App() {
  const [appMode, setAppMode] = useState<AppMode>("home");
  const [donorView, setDonorView] = useState<DonorView>("dashboard");

  // Check for existing donor session
  useEffect(() => {
    const user = localStorage.getItem("userName");
    if (user) {
      setAppMode("donor-dashboard");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userName");
    setAppMode("home");
  };

  // ------------------------------------------------------------------
  // 1. ADMIN DASHBOARD ROUTE (Directly from Homepage "Staff Login")
  // ------------------------------------------------------------------
  if (appMode === "admin-dashboard") {
     return (
        <div className="relative">
           {/* Admin Logout Button (Floating Top Right) */}
           <div className="fixed top-4 right-4 z-50">
              <Button 
                onClick={() => setAppMode("home")}
                className="bg-white border border-red-100 text-red-600 hover:bg-red-50 shadow-md gap-2 cursor-pointer"
              >
                <LogOut size={16}/> Exit Admin
              </Button>
           </div>
           <AdminDashboardView />
        </div>
     );
  }

  // ------------------------------------------------------------------
  // 2. HOMEPAGE ROUTE
  // ------------------------------------------------------------------
  if (appMode === "home") {
    return (
      <Homepage 
        onGetStarted={() => setAppMode("donor-login")} // Go to Donor Login
        onAdminLogin={() => setAppMode("admin-dashboard")} // Go to Admin Dashboard
      />
    );
  }

  // ------------------------------------------------------------------
  // 3. DONOR LOGIN ROUTE
  // ------------------------------------------------------------------
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

  // ------------------------------------------------------------------
  // 4. DONOR DASHBOARD ROUTE
  // ------------------------------------------------------------------
  if (appMode === "donor-dashboard") {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F6FAFF' }}>
        
        {/* Header */}
        <div className="border-b border-white/20 backdrop-blur-sm bg-white/60 sticky top-0 z-40">
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#14B8A6]">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-gray-900 font-bold">GlassBox 45</h1>
                <p className="text-xs text-gray-500">Donor Portal</p>
              </div>
            </div>
            
            <Button variant="ghost" onClick={handleLogout} className="gap-2 cursor-pointer hover:text-red-600 hover:bg-red-50 text-slate-500">
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 min-h-[calc(100vh-73px)] border-r border-white/20 backdrop-blur-sm bg-white/60 hidden md:block">
            <div className="p-6">
              <div className="mb-6 px-4">
                 <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</p>
              </div>
              <nav className="space-y-1">
                <button
                  onClick={() => setDonorView("dashboard")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${donorView === "dashboard" ? "bg-[#3366FF] text-white shadow-sm" : "text-gray-700 hover:bg-white/40"}`}
                >
                  <LayoutDashboard className="w-5 h-5" /> <span className="text-sm font-medium">Dashboard</span>
                </button>

                <button
                  onClick={() => setDonorView("history")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${donorView === "history" ? "bg-[#3366FF] text-white shadow-sm" : "text-gray-700 hover:bg-white/40"}`}
                >
                  <History className="w-5 h-5" /> <span className="text-sm font-medium">Donation History</span>
                </button>

                <button
                  onClick={() => setDonorView("inkind-tracker")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${donorView === "inkind-tracker" ? "bg-[#3366FF] text-white shadow-sm" : "text-gray-700 hover:bg-white/40"}`}
                >
                  <Package className="w-5 h-5" /> <span className="text-sm font-medium">In-Kind Tracker</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
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