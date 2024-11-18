// components/DefaultersList.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { getDefaulters, getAllDepartments } from '@/actions/userActions';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'

interface Defaulter {
  id: string;
  bookTitle: string;
  userName: string;
  dueDate: Date;
  departmentId: string;
}

interface Department {
  id: string;
  name: string;
}

export default function DefaultersList() {
  const [defaulters, setDefaulters] = useState<Defaulter[]>([]);
  const [filteredDefaulters, setFilteredDefaulters] = useState<Defaulter[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<Department>({ id: "", name: "" });

  useEffect(() => {
    async function fetchData() {
      const defaulterResponse = await getDefaulters();
      console.log(defaulterResponse);
      if (defaulterResponse.success) setDefaulters(defaulterResponse.data as Defaulter[]);

      // Fetch departments from a separate API if needed
      const deptResponse = await getAllDepartments();
      setDepartments(deptResponse.departments);
    }
    fetchData();
  }, []);

  // Filter defaulters based on selected department
  useEffect(() => {
    if (selectedDepartment.id.trim() !== "") {
      setFilteredDefaulters(defaulters.filter(d => d.departmentId === selectedDepartment.id));
    } else {
      setFilteredDefaulters(defaulters);
    }
  }, [selectedDepartment, defaulters]);

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    
    // Add header image at the top-left corner
    doc.addImage('/images/header.png', 'PNG', 10, 10, 50, 30);
    
    // Position the text below the image
    const textPositionY = 50; // Adjust Y coordinate to position text below image
    doc.text(
      `Defaulter List ${selectedDepartment?.name ? selectedDepartment.name : ""}`,
      80,
      textPositionY - 25
    );
  
    // Add the table below the title text
    autoTable(doc, {
      startY: textPositionY, // Adjust startY to position table below the text
      head: [["Name", "Book Title", "Due Date"]],
      body: filteredDefaulters.map(defaulter => [
        defaulter.userName,
        defaulter.bookTitle,
        new Date(defaulter.dueDate).toLocaleDateString(),
      ]),
    });
  
    // Save the PDF
    doc.save(`Defaulter_List_${selectedDepartment?.name ? selectedDepartment.name.replaceAll(" ", "_") : ""}`);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Defaulter List</h1>

      <div className="mb-6 flex items-center gap-4">
        <Button
          className="px-4 py-5 bg-green-600 hover:bg-green-700 hover:scale-105 transition duration-200"
          onClick={() => setSelectedDepartment({ id: "", name: "" })}
        >
          All
        </Button>
        {departments.map((department) => (
          <Button
            key={department.id}
            className="px-4 py-5 bg-yellow-600 hover:bg-yellow-700 hover:scale-105 transition duration-200"
            onClick={() => setSelectedDepartment(department)}
          >
            {department.name.toUpperCase()}
          </Button>
        ))}
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Book Title</th>
            <th className="border border-gray-300 p-2">Due Date</th>
          </tr>
        </thead>
        <tbody className='max-h-[65vh] overflow-y-scroll'>
          {filteredDefaulters.map((defaulter) => (
            <tr key={defaulter.id} className="hover:bg-gray-100">
              <td className="border border-gray-300 p-2">{defaulter.userName}</td>
              <td className="border border-gray-300 p-2">{defaulter.bookTitle}</td>
              <td className="border border-gray-300 p-2">
                {new Date(defaulter.dueDate).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="w-full text-end border border-gray-300 p-2">
              <Button
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
                onClick={handleDownloadPdf}
              >
                Download PDF
              </Button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
