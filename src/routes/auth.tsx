import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Coffee } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({ meta: [{ title: "Admin Login — Cafein" }] }),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
        toast.success("Account created! Check your email to confirm, then log in.");
        setMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate({ to: "/admin" });
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center px-6 bg-background">
      <div className="w-full max-w-md glass rounded-3xl p-8">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <span className="grid place-items-center w-10 h-10 rounded-full bg-primary text-primary-foreground">
            <Coffee className="w-5 h-5" />
          </span>
          <span className="font-display font-bold text-xl">Cafein<span className="text-primary">.</span></span>
        </Link>

        <h1 className="font-display text-3xl font-bold">
          {mode === "login" ? "Admin Login" : "Create Account"}
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          {mode === "login"
            ? "Sign in to manage your cafe."
            : "First account created becomes the admin."}
        </p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Email</span>
            <input type="email" required value={email} onChange={e=>setEmail(e.target.value)}
              className="mt-2 w-full rounded-2xl bg-input/40 border border-border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/60" />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Password</span>
            <input type="password" required minLength={6} value={password} onChange={e=>setPassword(e.target.value)}
              className="mt-2 w-full rounded-2xl bg-input/40 border border-border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/60" />
          </label>
          <button disabled={busy} type="submit"
            className="w-full rounded-2xl bg-primary text-primary-foreground py-3 font-semibold hover:scale-[1.01] transition-transform disabled:opacity-60">
            {busy ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <button onClick={()=>setMode(mode==="login"?"signup":"login")}
          className="mt-6 text-sm text-muted-foreground hover:text-primary w-full text-center">
          {mode === "login" ? "No account? Create one" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
