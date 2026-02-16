import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap } from "lucide-react";
import { toast } from "sonner";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isForgotPassword) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Password reset email sent! Check your inbox.");
        setIsForgotPassword(false);
      }
      setLoading(false);
      return;
    }
    
    if (isSignUp) {
      const { error } = await signUp(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Account created! Check your email to verify.");
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        navigate("/admin");
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
            <Zap className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-foreground">
            VOLT<span className="text-primary">CHARGE</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isForgotPassword ? "Reset your password" : isSignUp ? "Create admin account" : "Admin Dashboard Login"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@voltcharge.com"
            />
          </div>
          {!isForgotPassword && (
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
              />
            </div>
          )}
          <Button type="submit" variant="electric" className="w-full" disabled={loading}>
            {loading ? "Loading..." : isForgotPassword ? "Send Reset Email" : isSignUp ? "Sign Up" : "Sign In"}
          </Button>
          {!isSignUp && !isForgotPassword && (
            <button
              type="button"
              onClick={() => setIsForgotPassword(true)}
              className="w-full text-sm text-muted-foreground hover:text-primary"
            >
              Forgot password?
            </button>
          )}
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {isForgotPassword ? (
            <button onClick={() => setIsForgotPassword(false)} className="text-primary hover:underline">
              Back to sign in
            </button>
          ) : (
            <>
              {isSignUp ? "Already have an account?" : "Need an account?"}{" "}
              <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary hover:underline">
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </>
          )}
        </p>

        <div className="text-center">
          <a href="/" className="text-sm text-muted-foreground hover:text-primary">
            ← Back to Store
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
