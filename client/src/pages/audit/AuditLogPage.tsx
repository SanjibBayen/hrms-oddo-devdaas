import React, { useState } from "react";
import { useHRMS } from "../../hooks/useHRMS.ts";
import { AuditFilters } from "../../components/audit/AuditFilters.tsx";
import { AuditLogTable } from "../../components/audit/AuditLogTable.tsx";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card.tsx";
import { Breadcrumb } from "../../components/layout/Breadcrumb.tsx";

export const AuditLogPage: React.FC = () => {
  const { auditLogs } = useHRMS();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch = log.userName.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "ALL" || log.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <Breadcrumb items={["Administration", "System Audit"]} />
      <Card>
        <CardHeader>
          <CardTitle>Enterprise Security Audit Trail</CardTitle>
        </CardHeader>
        <CardContent>
          <AuditFilters
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
          />
          <div className="border border-slate-100 rounded-xl overflow-hidden mt-4">
            <AuditLogTable logs={filteredLogs} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogPage;
