import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap } from "lucide-react";
import { toast } from "sonner";

const CustomerAuth = () => {
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
        toast.success("E-mail na obnovenie hesla bol odoslaný! Skontrolujte si schránku.");
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
        toast.success("Účet vytvorený! Skontrolujte si e-mail pre overenie.");
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        navigate("/account");
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <a href="/" className="inline-flex items-center gap-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
              <Zap className="h-8 w-8 text-primary-foreground" />
            </div>
          </a>
          <h1 className="mt-4 font-display text-2xl font-bold text-foreground">
            {isForgotPassword ? "Obnoviť heslo" : isSignUp ? "Vytvoriť účet" : "Vitajte späť"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isForgotPassword
              ? "Zadajte e-mail pre prijatie odkazu na obnovenie"
              : isSignUp
              ? "Zaregistrujte sa pre sledovanie objednávok a ukladanie záložiek"
              : "Prihláste sa do svojho účtu"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="vas@email.com"
            />
          </div>
          {!isForgotPassword && (
            <div>
              <Label htmlFor="password">Heslo</Label>
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
            {loading
              ? "Načítavam..."
              : isForgotPassword
              ? "Odoslať odkaz na obnovenie"
              : isSignUp
              ? "Vytvoriť účet"
              : "Prihlásiť sa"}
          </Button>
          {!isSignUp && !isForgotPassword && (
            <button
              type="button"
              onClick={() => setIsForgotPassword(true)}
              className="w-full text-sm text-muted-foreground hover:text-primary"
            >
              Zabudli ste heslo?
            </button>
          )}
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {isForgotPassword ? (
            <button onClick={() => setIsForgotPassword(false)} className="text-primary hover:underline">
              Späť na prihlásenie
            </button>
          ) : (
            <>
              {isSignUp ? "Už máte účet?" : "Nemáte účet?"}{" "}
              <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary hover:underline">
                {isSignUp ? "Prihlásiť sa" : "Registrovať sa"}
              </button>
            </>
          )}
        </p>

        <div className="text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
            ← Späť do obchodu
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerAuth;
