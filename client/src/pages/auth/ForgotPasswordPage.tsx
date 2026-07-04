import React, { useState } from "react";
import { Mail, ArrowLeft, CheckCircle, Clock } from "lucide-react";
import Button from "../../components/ui/Button.tsx";
import Input from "../../components/ui/Input.tsx";
import Card, { CardContent, CardHeader, CardTitle } from "../../components/ui/Card.tsx";

interface ForgotPasswordPageProps {
  onNavigateToLogin?: () => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigateToLogin }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-slate-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-45 -right-45 w-112 h-112 bg-slate-500/5 rounded-full blur-3xl pointer-events-none" />

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

        {/* Form Container */}
        <Card className="border border-slate-100 shadow-xl bg-white/90 backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-center w-full">Reset Corporate Password</CardTitle>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="text-center py-6 space-y-4">
                <div className="inline-flex p-3 bg-emerald-50 rounded-full text-emerald-600 mb-2">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Reset Email Dispatched</h3>
                <p className="text-xs text-slate-500 font-sans leading-relaxed max-w-sm mx-auto">
                  If the account exists in the HR register, we've sent instructions to <strong className="text-slate-800 font-semibold">{email}</strong> to reset your security credentials.
                </p>
                <div className="pt-4">
                  <Button
                    onClick={onNavigateToLogin}
                    variant="outline"
                    className="w-full text-xs font-bold border-slate-200"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-2" /> Back to Sign In
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <p className="text-xs text-slate-500 font-sans mb-1 text-center">
                  Provide your company email address below and we'll dispatch an active password recovery linkage.
                </p>

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

                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                  className="w-full mt-2 font-bold font-display text-xs bg-[#0F172A] hover:bg-slate-800 text-white"
                >
                  Request Reset Instructions
                </Button>

                <button
                  type="button"
                  onClick={onNavigateToLogin}
                  className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-800 font-bold font-sans mt-2 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Return to Sign In
                </button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
