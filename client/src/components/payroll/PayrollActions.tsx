import React, { useState } from "react";
import { Button } from "../ui/Button.tsx";
import { Calculator, Download, FileSpreadsheet, RefreshCw } from "lucide-react";

interface PayrollActionsProps {
  onCalculate?: (month: string) => Promise<void>;
  onExportCSV?: () => void;
  isLoading?: boolean;
}

export const PayrollActions: React.FC<PayrollActionsProps> = ({
  onCalculate,
  onExportCSV,
  isLoading = false,
}) => {
  const [selectedMonth, setSelectedMonth] = useState("July 2026");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRun = async () => {
    if (!onCalculate) return;
    setIsProcessing(true);
    try {
      await onCalculate(selectedMonth);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 font-sans space-y-4">
      <div>
        <h4 className="text-xs font-bold text-slate-900 font-display">Operational Toolkit</h4>
        <p className="text-[10px] text-slate-400">Initiate automated calculations or download audited salary ledgers.</p>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            disabled={isProcessing || isLoading}
            className="flex-1 px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-xs font-semibold font-display text-slate-800 focus:outline-hidden"
          >
            <option value="July 2026">July 2026</option>
            <option value="August 2026">August 2026</option>
            <option value="September 2026">September 2026</option>
          </select>

          <Button
            onClick={handleRun}
            disabled={isProcessing || isLoading}
            className="bg-[#0F172A] hover:bg-slate-850 text-white font-semibold text-xs py-1.5 h-9"
          >
            <Calculator className="w-3.5 h-3.5 mr-1.5" />
            Calculate
          </Button>
        </div>

        <div className="flex gap-2 pt-1">
          <Button
            onClick={onExportCSV}
            variant="outline"
            className="flex-1 h-8 text-[11px] font-semibold border-slate-200 text-slate-700"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-emerald-600" /> Export Ledger
          </Button>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="h-8 w-8 p-0 border-slate-200 text-slate-500"
            title="Refresh Database Node"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PayrollActions;
