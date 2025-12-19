import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { DonorDashboardView } from "./components/donor-dashboard-view";

export default function DashboardPage() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        window.location.href = "/";
      }
    });
  }, []);

  return <DonorDashboardView />;
}
