import React from "react";
import { Employee } from "../../types/index.ts";
import { Card, CardContent } from "../ui/Card.tsx";
import { Mail, Phone, MapPin, Briefcase } from "lucide-react";

interface ProfileCardProps {
  user: Employee;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  return (
    <Card className="max-w-xl">
      <CardContent className="p-6 font-sans space-y-6">
        <div className="flex items-center gap-4">
          <img src={user.avatarUrl} alt={user.name} className="w-16 h-16 rounded-xl object-cover border border-slate-200" referrerPolicy="no-referrer" />
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">{user.name}</h3>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
              <Briefcase className="w-3.5 h-3.5" />
              {user.designation} &middot; {user.department}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="space-y-1.5">
            <span className="block font-bold text-slate-400 uppercase tracking-widest text-[9px]">Contact Email</span>
            <span className="flex items-center gap-2 text-slate-700 font-medium"><Mail className="w-3.5 h-3.5 text-slate-400" /> {user.email}</span>
          </div>
          <div className="space-y-1.5">
            <span className="block font-bold text-slate-400 uppercase tracking-widest text-[9px]">Phone</span>
            <span className="flex items-center gap-2 text-slate-700 font-medium"><Phone className="w-3.5 h-3.5 text-slate-400" /> {user.phone}</span>
          </div>
          <div className="space-y-1.5">
            <span className="block font-bold text-slate-400 uppercase tracking-widest text-[9px]">Location</span>
            <span className="flex items-center gap-2 text-slate-700 font-medium"><MapPin className="w-3.5 h-3.5 text-slate-400" /> HQ Offices</span>
          </div>
          <div className="space-y-1.5">
            <span className="block font-bold text-slate-400 uppercase tracking-widest text-[9px]">Base Salary Rate</span>
            <span className="flex items-center gap-2 text-slate-700 font-mono font-bold">${user.salary.toLocaleString()}/mo</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
