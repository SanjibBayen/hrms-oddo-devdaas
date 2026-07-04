import React from "react";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/Button.tsx";
import Card, { CardContent } from "../../components/ui/Card.tsx";

interface ForbiddenPageProps {
  onBackToDashboard?: () => void;
}

export const ForbiddenPage: React.FC<ForbiddenPageProps> = ({ onBackToDashboard }) => {
  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col items-center justify-center p-4">
      <Card className="max-w-md w-full border border-slate-150 shadow-xl p-8 text-center font-sans">
        <CardContent className="space-y-6">
          <div className="inline-flex p-4 bg-rose-50 text-rose-600 rounded-full">
            <ShieldAlert className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <h1 className="text-lg font-bold text-slate-900 font-display tracking-tight uppercase">Access Restricted (403)</h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your security clearance is insufficient to review this directory file or administrative resource. Please contact your system HR representative.
            </p>
          </div>

          <div className="pt-2">
            <Button
              onClick={onBackToDashboard}
              className="w-full bg-[#0F172A] hover:bg-slate-800 text-white font-semibold text-xs"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForbiddenPage;
