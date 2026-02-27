import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Dashboard = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen section-dark">
      <div className="container py-20">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold text-section-dark-foreground">Dashboard</h1>
          <Button variant="outline" onClick={signOut} className="border-border/20 text-section-dark-foreground gap-2">
            <LogOut size={16} /> Sign Out
          </Button>
        </div>
        <div className="bg-card/5 border border-border/10 rounded-2xl p-8">
          <p className="text-section-dark-foreground">Welcome, <span className="text-primary font-semibold">{user?.email}</span></p>
          <p className="text-muted-foreground mt-2 text-sm">Your full dashboard will be built in Phase 3.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
