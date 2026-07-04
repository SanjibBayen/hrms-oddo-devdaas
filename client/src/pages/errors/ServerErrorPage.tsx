import React from "react";
import { AlertOctagon, RefreshCw } from "lucide-react";
import { Button } from "../../components/ui/Button.tsx";
import Card, { CardContent } from "../../components/ui/Card.tsx";

interface ServerErrorPageProps {
  onRetry?: () => void;
}

export const ServerErrorPage: React.FC<ServerErrorPageProps> = ({ onRetry }) => {
  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col items-center justify-center p-4">
      <Card className="max-w-md w-full border border-slate-150 shadow-xl p-8 text-center font-sans">
        <CardContent className="space-y-6">
          <div className="inline-flex p-4 bg-amber-50 text-amber-600 rounded-full">
            <AlertOctagon className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <h1 className="text-lg font-bold text-slate-900 font-display tracking-tight uppercase">System Error (500)</h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              We encountered an unexpected internal synchronization fault while querying the HRMS registry node database.
            </p>
          </div>

          <div className="pt-2">
            <Button
              onClick={onRetry || (() => window.location.reload())}
              className="w-full bg-[#0F172A] hover:bg-slate-800 text-white font-semibold text-xs animate-pulse"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Force Database Sync
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServerErrorPage;
