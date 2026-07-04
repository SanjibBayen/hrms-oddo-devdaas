import React, { useState } from "react";
import { Lock, Mail, ArrowRight, ShieldCheck, Clock } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.ts";
import Button from "../../components/ui/Button.tsx";
import Input from "../../components/ui/Input.tsx";
import Card, { CardContent, CardHeader, CardTitle } from "../../components/ui/Card.tsx";
import Toast from "../../components/ui/Toast.tsx";

interface LoginPageProps {
  onNavigateToSignup?: () => void;
  onNavigateToForgotPassword?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigateToSignup, onNavigateToForgotPassword }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: "", type: "success" as "success" | "error" });

  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ isVisible: true, message, type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      triggerToast("Please enter an email address", "error");
      return;
    }
    setIsLoading(true);
    try {
      await login(email, password || "password");
      triggerToast("Welcome back!", "success");
    } catch (err: any) {
      triggerToast(err.message || "Invalid credentials. Try a pre-seeded account.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setIsLoading(true);
    try {
      await login(demoEmail, "password");
      triggerToast("Success! Logged in as demo user.", "success");
    } catch (err: any) {
      triggerToast("Demo login failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    { name: "Sarah Connor", email: "sarah.admin@enterprise.com", role: "HR Admin", bg: "bg-rose-50 border-rose-150 text-rose-850" },
    { name: "David Miller", email: "david.miller@enterprise.com", role: "Manager", bg: "bg-amber-50 border-amber-150 text-amber-850" },
    { name: "Jane Doe", email: "jane.doe@enterprise.com", role: "Employee", bg: "bg-indigo-50 border-indigo-150 text-indigo-850" },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-slate-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-45 -right-45 w-112 h-112 bg-slate-500/5 rounded-full blur-3xl pointer-events-none" />

      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />

      <div className="w-full max-w-md z-10 flex flex-col gap-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-2.5 text-center">
          <div className="bg-[#0F172A] p-3 rounded-2xl text-white shadow-xl shadow-slate-900/10">
            <Clock className="w-6 h-6" />
          </div>
          <h1 className="font-display font-bold text-xl text-slate-900 tracking-tight leading-tight uppercase">
            HRMS <span className="text-[#0F172A]">ENTERPRISE</span>
          </h1>
          <p className="text-[11px] text-slate-450 font-sans tracking-wide">
            Enterprise-grade Human Resource Management System
          </p>
        </div>

        {/* Credentials Form */}
        <Card className="border border-slate-100 shadow-xl bg-white/90 backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-center w-full">Sign In to Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Corporate Email Address"
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="font-sans text-xs"
              />

              <div className="flex flex-col gap-1">
                <Input
                  label="Password"
                  id="password"
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="font-sans text-xs"
                />
              </div>

              <div className="flex items-center justify-between mt-1 text-[11px]">
                <button
                  type="button"
                  onClick={onNavigateToForgotPassword}
                  className="text-slate-500 hover:text-slate-800 font-medium font-sans cursor-pointer"
                >
                  Forgot your password?
                </button>
                <button
                  type="button"
                  onClick={onNavigateToSignup}
                  className="text-indigo-600 hover:text-indigo-800 font-bold font-sans cursor-pointer"
                >
                  Create an account
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                className="w-full mt-2 font-bold font-display text-xs bg-[#0F172A] hover:bg-slate-800 text-white"
              >
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Quick Select Area */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 justify-center">
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold font-display text-slate-400 uppercase tracking-wider">
              Hackathon Demo Quick-Access
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {demoAccounts.map((acc) => (
              <button
                key={acc.email}
                onClick={() => handleQuickLogin(acc.email)}
                disabled={isLoading}
                className={`flex items-center justify-between p-3.5 rounded-xl border text-left hover:scale-[1.01] active:scale-[0.99] transition-all duration-150 shadow-xs cursor-pointer ${acc.bg}`}
              >
                <div>
                  <h4 className="text-xs font-bold font-display">{acc.name}</h4>
                  <p className="text-[10px] opacity-80 leading-tight">{acc.email}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-wider font-display bg-black/5 px-2 py-0.5 rounded-full">
                    {acc.role}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
