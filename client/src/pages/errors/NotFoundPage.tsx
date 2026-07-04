import React from "react";
import { HelpCircle, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/Button.tsx";
import Card, { CardContent } from "../../components/ui/Card.tsx";

interface NotFoundPageProps {
  onBackToDashboard?: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onBackToDashboard }) => {
  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col items-center justify-center p-4">
      <Card className="max-w-md w-full border border-slate-150 shadow-xl p-8 text-center font-sans">
        <CardContent className="space-y-6">
          <div className="inline-flex p-4 bg-slate-55 bg-slate-100 text-slate-600 rounded-full">
            <HelpCircle className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <h1 className="text-lg font-bold text-slate-900 font-display tracking-tight uppercase">File Not Found (404)</h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              We were unable to locate the requested URL parameters or corporate workspace directory.
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

export default NotFoundPage;
