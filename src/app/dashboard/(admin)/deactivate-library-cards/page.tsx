"use client";

import React, { useState, useEffect } from "react";
import { getAllDepartments, deactiveStudentLibraryCard, getStudents } from "@/actions/userActions";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Department {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  batch: Batch[];
}

interface Batch {
  id: string;
  name: string;
}

function DepartmentSelector() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const response = await getAllDepartments();
        setDepartments(response.departments as Department[]);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    }
    fetchDepartments();
  }, []);

  const handleDepartmentSelect = (department: Department) => {
    setSelectedDepartment(department);
    setSelectedBatch(null);
    setStudents([]);
  };

  const handleBatchSelect = async (batch: Batch) => {
    setSelectedBatch(batch);
    const response = await getStudents(batch.id, selectedDepartment?.id || "");
    setStudents(response?.students as any);
  };

  const deactivateLibraryCard = async (studentId: string , departmentId: string, batchId: string) => {
    console.log("Function deactivateLibraryCard called with:", { studentId, departmentId, batchId });
    try {
      const response = await deactiveStudentLibraryCard({ studentId, departmentId, batchId });
  
      console.log("Deactivation Response:", response); // Log after getting a response
  
      if (response?.success) {
        setOpenDialog(false);
        if (!studentId) {
          console.log("Multiple library cards deactivated.");
          setStudents((prevStudents) =>
            prevStudents.map((student) => ({
              ...student,
              libraryCard: student.libraryCard?.active
                ? { ...student.libraryCard, active: false }
                : student.libraryCard,
            }))
          );
        } else {
          console.log("Single library card deactivated.");
          setStudents((prevStudents) =>
            prevStudents.map((student) =>
              student.id === studentId
                ? { ...student, libraryCard: { ...student.libraryCard, active: false } }
                : student
            )
          );
        }
        toast({ description: response.message, variant: "success" });
      } else {
        console.log("Failed to deactivate:", response?.error || "Unknown error");
        toast({ description: response?.error || "An error occurred during deactivation.", variant: "destructive" });
      }
    } catch (error: any) {
      setOpenDialog(false);
      console.error("Error in deactivateLibraryCard:", error.message || error);
      toast({ description: error.message || "Unexpected error occurred.", variant: "destructive" });
    }
  };
   

  return (
    <div className="p-6 bg-gray-100 min-h-screen w-[100%]">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Department and Batch Viewer</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Available Departments</h2>
        <div className="flex flex-wrap gap-4">
          {departments.map((department) => (
            <Button
              key={department.id}
              className="px-4 py-5 bg-yellow-600 hover:bg-yellow-700 hover:scale-105 transition duration-200"
              onClick={() => handleDepartmentSelect(department)}
            >
              {department.name.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      {selectedDepartment && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Batches in {selectedDepartment.name}</h2>
          <div className="flex flex-wrap gap-4">
            {selectedDepartment.batch.map((batch) => (
              <button
                key={batch.id}
                className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200"
                onClick={() => handleBatchSelect(batch)}
              >
                {batch.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedBatch && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="w-full flex gap-4 justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Students in Batch {selectedBatch.name}</h2>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button className="w-fit mb-3 bg-red-600 text-white font-bold">Deactivate All</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will deactivate all library cards for this batch.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpenDialog(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      if (selectedDepartment && selectedBatch) {
                        deactiveStudentLibraryCard({
                          studentId: '',
                          departmentId: selectedDepartment.id,
                          batchId: selectedBatch.id,
                        });
                        setOpenDialog(false);
                      }
                    }}
                  >
                    Yes, I'm sure
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr>
                <th className="py-3 px-4 bg-gray-200 text-gray-700 text-left font-semibold uppercase tracking-wider">
                  Name
                </th>
                <th className="py-3 px-4 bg-gray-200 text-gray-700 text-left font-semibold uppercase tracking-wider">
                  Email
                </th>
                <th className="py-3 px-4 bg-gray-200 text-gray-700 text-left font-semibold uppercase tracking-wider">
                  Library Card Status
                </th>
                <th className="py-3 px-4 bg-gray-200 text-gray-700 text-left font-semibold uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">{student.name}</td>
                  <td className="py-3 px-4">{student.email}</td>
                  <td className="py-3 px-4">{student.libraryCard?.active ? "Active" : "Deactivated"}</td>
                  <td className="py-3 px-4">
                    {student.libraryCard?.active ? (
                      <button
                        className="px-3 py-1 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-200"
                        onClick={() => deactivateLibraryCard(student.id, '', '')}
                      >
                        Deactivate
                      </button>
                    ) : (
                      <span className="text-gray-500">Already Deactivated</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DepartmentSelector;
