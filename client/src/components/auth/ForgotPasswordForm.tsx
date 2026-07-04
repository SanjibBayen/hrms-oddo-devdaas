import React, { useState } from "react";
import { Button } from "../ui/Button.tsx";
import { Input } from "../ui/Input.tsx";

export const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSuccess(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-sans">
      {success ? (
        <div className="p-3.5 bg-emerald-50 text-emerald-700 text-xs rounded-xl border border-emerald-150">
          Password reset instructions have been sent to your email.
        </div>
      ) : (
        <>
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
            />
          </div>
          <Button type="submit" className="w-full bg-[#0F172A] hover:bg-slate-800 text-white text-xs py-2">
            Send Reset Instructions
          </Button>
        </>
      )}
    </form>
  );
};

export default ForgotPasswordForm;
