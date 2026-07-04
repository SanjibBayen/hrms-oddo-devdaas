import React, { useState } from "react";
import { Mail, ArrowLeft, Clock, ShieldCheck, User, Briefcase, Eye } from "lucide-react";
import Button from "../../components/ui/Button.tsx";
import Input from "../../components/ui/Input.tsx";
import Card, { CardContent, CardHeader, CardTitle } from "../../components/ui/Card.tsx";
import Toast from "../../components/ui/Toast.tsx";

interface SignupPageProps {
  onNavigateToLogin?: () => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onNavigateToLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [designation, setDesignation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: "", type: "success" as "success" | "error" });

  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ isVisible: true, message, type });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      triggerToast("Please complete all required fields", "error");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      triggerToast("Profile created! Pre-seeded auth matches your credentials.", "success");
      setTimeout(() => {
        if (onNavigateToLogin) onNavigateToLogin();
      }, 1500);
    }, 1200);
  };

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
          <CardHeader className="pb-1">
            <CardTitle className="text-center w-full">Create Employee Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              <Input
                label="Full Name"
                id="name"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="font-sans text-xs"
              />

              <Input
                label="Corporate Email Address"
                id="email"
                type="email"
                placeholder="jane.doe@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="font-sans text-xs"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-sans">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-slate-400 focus:outline-hidden transition-all duration-200"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Human Resources">HR</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
                <Input
                  label="Designation / Role"
                  id="designation"
                  placeholder="Software Engineer"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="font-sans text-xs"
                />
              </div>

              <Input
                label="Security Password"
                id="password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="font-sans text-xs"
              />

              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                className="w-full mt-2 font-bold font-display text-xs bg-[#0F172A] hover:bg-slate-800 text-white"
              >
                Register & Sign In
              </Button>

              <button
                type="button"
                onClick={onNavigateToLogin}
                className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-800 font-bold font-sans mt-2 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Already registered? Sign In
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
