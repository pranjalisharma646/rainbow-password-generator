import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { LogOut, Sparkles } from "lucide-react";
import { toast } from "sonner";
import RainbowBackground from "@/components/RainbowBackground";
import PasswordGenerator from "@/components/PasswordGenerator";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  if (loading) {
    return (
      <RainbowBackground>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-primary-foreground text-xl">Loading...</div>
        </div>
      </RainbowBackground>
    );
  }

  if (!user) {
    return (
      <RainbowBackground>
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="text-center mb-8 space-y-4">
            <div className="inline-flex items-center justify-center">
              <Sparkles className="h-16 w-16 text-primary-foreground" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground drop-shadow-lg">
              Rainbow Password
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-md mx-auto">
              Generate secure, colorful passwords with style
            </p>
          </div>
          <Button
            onClick={() => navigate("/auth")}
            size="lg"
            className="h-14 px-8 text-lg font-semibold bg-primary-foreground text-foreground hover:bg-primary-foreground/90 shadow-lg"
          >
            Get Started
          </Button>
        </div>
      </RainbowBackground>
    );
  }

  return (
    <RainbowBackground>
      <div className="min-h-screen p-4">
        {/* Header */}
        <header className="max-w-4xl mx-auto py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary-foreground" />
            <span className="text-xl font-bold text-primary-foreground">Rainbow Password</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-primary-foreground/80 hidden sm:block">
              {user.email}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto py-8 md:py-16">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground drop-shadow-lg mb-4">
              Password Generator
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Create strong, secure passwords in seconds
            </p>
          </div>
          
          <PasswordGenerator />
        </main>
      </div>
    </RainbowBackground>
  );
};

export default Index;
