"use client";

import React, { useState, useEffect } from "react";
import { getAllDepartments } from "@/actions/userActions";
import { deactiveStudentLibraryCard, GetStudents } from "@/actions/bookActions";

interface department {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  students: any[];
  batch: any[];
}

function DepartmentSelector() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<department>();
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const response = await getAllDepartments();
        setDepartments(response.departments);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    }

    fetchDepartments();
  }, []);

  const handleDepartmentSelect = (department: any) => {
    setSelectedDepartment(department);
    setSelectedBatch(null);
    setStudents([]);
  };

  const handleBatchSelect = async (batch: any) => {
    setSelectedBatch(batch);
    const response = await GetStudents(batch?.id,selectedDepartment?.id);
    console.log(response);
    setStudents(response?.students as any);
  };

  const deactivateLibraryCard = async (studentId: string) => {
    const response = await deactiveStudentLibraryCard(studentId);

    if (response) {
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === studentId
            ? {
                ...student,
                LibraryCard: { ...student.LibraryCard, active: false },
              }
            : student
        )
      );
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen w-[100%]">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Department and Batch Viewer
      </h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Departments
        </h2>
        <div className="flex flex-wrap gap-4">
          {departments.map((department) => (
            <button
              key={department.id}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
              onClick={() => handleDepartmentSelect(department)}
            >
              {department.name}
            </button>
          ))}
        </div>
      </div>

      {selectedDepartment && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Batches in {selectedDepartment.name}
          </h2>
          <div className="flex flex-wrap gap-4">
            {selectedDepartment.batch.map(
              (batch: {
                id: React.Key | null | undefined;
                name:
                  | string
                  | number
                  | bigint
                  | boolean
                  | React.ReactElement<
                      any,
                      string | React.JSXElementConstructor<any>
                    >
                  | Iterable<React.ReactNode>
                  | React.ReactPortal
                  | Promise<React.AwaitedReactNode>
                  | null
                  | undefined;
              }) => (
                <button
                  key={batch.id}
                  className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200"
                  onClick={() => handleBatchSelect(batch)}
                >
                  {batch.name}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {selectedBatch && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Students in Batch {selectedBatch.name}
          </h2>
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
                <tr
                  key={student.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">{student.name}</td>
                  <td className="py-3 px-4">{student.email}</td>
                  <td className="py-3 px-4">
                    {student.LibraryCard?.active ? "Active" : "Deactivated"}
                  </td>
                  <td className="py-3 px-4">
                    {student.LibraryCard?.active ? (
                      <button
                        className="px-3 py-1 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-200"
                        onClick={() => deactivateLibraryCard(student.id)}
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
