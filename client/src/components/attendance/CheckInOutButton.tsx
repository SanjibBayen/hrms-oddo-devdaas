import React from "react";
import { Button } from "../ui/Button.tsx";
import { Clock } from "lucide-react";

interface CheckInOutButtonProps {
  isCheckedIn: boolean;
  onCheckIn: (notes?: string) => void;
  onCheckOut: () => void;
  isLoading?: boolean;
}

export const CheckInOutButton: React.FC<CheckInOutButtonProps> = ({ isCheckedIn, onCheckIn, onCheckOut, isLoading = false }) => {
  return (
    <Button
      variant={isCheckedIn ? "outline" : "primary"}
      size="lg"
      className={`w-full font-display font-semibold transition-all duration-300 ${
        isCheckedIn ? "border-rose-200 text-rose-600 hover:bg-rose-50" : "bg-[#0F172A] hover:bg-slate-800 text-white shadow-md shadow-slate-900/10"
      }`}
      onClick={() => isCheckedIn ? onCheckOut() : onCheckIn()}
      disabled={isLoading}
    >
      <Clock className="w-4 h-4 mr-2" />
      {isLoading ? "Processing..." : isCheckedIn ? "Clock Out (End Shift)" : "Clock In (Start Shift)"}
    </Button>
  );
};

export default CheckInOutButton;
