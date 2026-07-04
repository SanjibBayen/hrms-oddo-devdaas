import React, { useState } from "react";
import { Button } from "../ui/Button.tsx";
import { Input } from "../ui/Input.tsx";

export const SecuritySettings: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4 font-sans text-xs">
      {success && (
        <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
          Security password updated successfully!
        </div>
      )}
      <div>
        <label className="block font-bold text-slate-400 uppercase tracking-widest mb-1.5">Current Password</label>
        <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
      </div>
      <div>
        <label className="block font-bold text-slate-400 uppercase tracking-widest mb-1.5">New Password</label>
        <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
      </div>
      <div>
        <label className="block font-bold text-slate-400 uppercase tracking-widest mb-1.5">Confirm New Password</label>
        <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
      </div>
      <Button type="submit" className="bg-[#0F172A] hover:bg-slate-800 text-white font-semibold">
        Update Credentials
      </Button>
    </form>
  );
};

export default SecuritySettings;
