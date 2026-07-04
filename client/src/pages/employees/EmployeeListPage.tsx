import React, { useState } from "react";
import { useHRMS } from "../../hooks/useHRMS.ts";
import { EmployeeFilters } from "../../components/employees/EmployeeFilters.tsx";
import { EmployeeTable } from "../../components/employees/EmployeeTable.tsx";
import { EmployeeForm } from "../../components/employees/EmployeeForm.tsx";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card.tsx";
import { Button } from "../../components/ui/Button.tsx";
import { Breadcrumb } from "../../components/layout/Breadcrumb.tsx";
import { Modal } from "../../components/ui/Modal.tsx";
import { UserPlus, UserX, Mail, Phone, Briefcase, DollarSign, Tag, CheckCircle } from "lucide-react";
import { Employee } from "../../types/index.ts";

interface EmployeeListPageProps {
  onViewEmployeeDetails?: (emp: Employee) => void;
}

export const EmployeeListPage: React.FC<EmployeeListPageProps> = ({ onViewEmployeeDetails }) => {
  const { employees, addEmployee, updateEmployee, deactivateEmployee } = useHRMS();
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("ALL");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.designation.toLowerCase().includes(search.toLowerCase());
    const matchesDept = department === "ALL" || emp.department === department;
    return matchesSearch && matchesDept;
  });

  const handleDeactivate = async (emp: Employee) => {
    if (window.confirm(`Are you sure you want to change the status of ${emp.name}?`)) {
      await deactivateEmployee(emp.id);
      setSelectedEmployee(null);
    }
  };

  const handleViewDetails = (emp: Employee) => {
    if (onViewEmployeeDetails) {
      onViewEmployeeDetails(emp);
    } else {
      setSelectedEmployee(emp);
      setIsEditing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={["Core Menu", "Staff Directory"]} />

      <div className="flex justify-between items-center gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 font-display">Staff Directory</h2>
          <p className="text-xs text-slate-450">Manage corporate staff profiles, assignments, and base salaries.</p>
        </div>
        {!showAddForm && (
          <Button onClick={() => setShowAddForm(true)} className="bg-[#0F172A] hover:bg-slate-800 text-white font-semibold">
            <UserPlus className="w-4 h-4 mr-2" /> Add Staff Record
          </Button>
        )}
      </div>

      {showAddForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Create Employee Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <EmployeeForm
              onSubmit={async (values) => {
                await addEmployee(values);
                setShowAddForm(false);
              }}
              onCancel={() => setShowAddForm(false)}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <EmployeeFilters
              search={search}
              setSearch={setSearch}
              department={department}
              setDepartment={setDepartment}
            />
            <div className="border border-slate-100 rounded-xl overflow-hidden mt-4">
              <EmployeeTable
                employees={filteredEmployees}
                onViewDetails={handleViewDetails}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Employee Details & Editing Modal */}
      <Modal
        isOpen={selectedEmployee !== null}
        onClose={() => {
          setSelectedEmployee(null);
          setIsEditing(false);
        }}
        title={isEditing ? "Edit Corporate Staff File" : "Staff Member Information"}
      >
        {selectedEmployee && (
          <div className="space-y-5 font-sans">
            {isEditing ? (
              <EmployeeForm
                initialValues={selectedEmployee}
                onSubmit={async (values) => {
                  await updateEmployee(selectedEmployee.id, values);
                  setSelectedEmployee(null);
                  setIsEditing(false);
                }}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <div className="space-y-6 text-xs">
                {/* Profile Header */}
                <div className="flex items-center gap-4">
                  <img src={selectedEmployee.avatarUrl} alt={selectedEmployee.name} className="w-16 h-16 rounded-xl object-cover border border-slate-200" referrerPolicy="no-referrer" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 font-display leading-tight">{selectedEmployee.name}</h3>
                    <p className="text-[10px] text-slate-450 mt-1 uppercase font-semibold">{selectedEmployee.department} &middot; {selectedEmployee.designation}</p>
                  </div>
                </div>

                {/* Details Roster */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-50 pt-4">
                  <div className="space-y-1">
                    <span className="block font-bold text-slate-400 uppercase tracking-widest text-[9px] flex items-center gap-1">
                      <Mail className="w-3 h-3" /> Email Address
                    </span>
                    <span className="text-slate-800 font-medium">{selectedEmployee.email}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="block font-bold text-slate-400 uppercase tracking-widest text-[9px] flex items-center gap-1">
                      <Phone className="w-3 h-3" /> Contact Phone
                    </span>
                    <span className="text-slate-800 font-medium">{selectedEmployee.phone || "Not specified"}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="block font-bold text-slate-400 uppercase tracking-widest text-[9px] flex items-center gap-1">
                      <Briefcase className="w-3 h-3" /> Designation / Role
                    </span>
                    <span className="text-slate-800 font-medium">{selectedEmployee.designation}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="block font-bold text-slate-400 uppercase tracking-widest text-[9px] flex items-center gap-1">
                      <DollarSign className="w-3 h-3" /> Monthly Basic Salary
                    </span>
                    <span className="text-slate-800 font-mono font-bold">${selectedEmployee.salary.toLocaleString()}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="block font-bold text-slate-400 uppercase tracking-widest text-[9px] flex items-center gap-1">
                      <Tag className="w-3 h-3" /> Status
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[9px] ${
                      selectedEmployee.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                    }`}>
                      {selectedEmployee.status === "ACTIVE" ? <CheckCircle className="w-2.5 h-2.5" /> : <UserX className="w-2.5 h-2.5" />}
                      {selectedEmployee.status}
                    </span>
                  </div>
                </div>

                {/* Footer Operations */}
                <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                  <Button
                    variant="outline"
                    className="text-rose-600 border-slate-200 hover:bg-rose-50 font-bold"
                    onClick={() => handleDeactivate(selectedEmployee)}
                  >
                    <UserX className="w-3.5 h-3.5 mr-1.5" /> Toggle Active Status
                  </Button>

                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => setSelectedEmployee(null)}>
                      Close
                    </Button>
                    <Button className="bg-[#0F172A] hover:bg-slate-800 text-white font-semibold" onClick={() => setIsEditing(true)}>
                      Modify File
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EmployeeListPage;
