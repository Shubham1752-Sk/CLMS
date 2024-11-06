'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useAppContext from '@/contexts/index';
import { userRoles } from '@/lib/userRoles';
import { useToast } from "@/hooks/use-toast";
import { addBatch, addDepartment, editBatch, getAllDepartments } from '@/actions/userActions';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DialogClose } from '@radix-ui/react-dialog';
import { CheckIcon, EditIcon } from 'lucide-react';

interface Batch {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  departmentId: string | null;
}

interface Department {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  batch: Batch[] | null;
}

const AddDepartmentPage = () => {
  const { user } = useAppContext();  // Get the current user's info
  const router = useRouter();
  const { toast } = useToast();

  // Form state
  const [departmentName, setDepartmentName] = useState<string>('');
  const [batchName, setBatchName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [newBatchName, setNewBatchName] = useState<string>('');
  const [newDepartmentName, setNewDepartmentName] = useState<string>('');
  const [editDepartmentName, setEditDepartmentName] = useState<boolean>(false);
  const [editBatchName, setEditBatchName] = useState<boolean>(false);
  const [selectedBatch, setSelectedBatch] = useState<string>('')

  // **Hook Fix**: Only allow admins to access this page
  useEffect(() => {
    if (user?.role !== userRoles.ADMIN) {
      router.push('/'); // Redirect to home page if not an admin
    }
  }, [user, router]);

  // **Hook Fix**: Fetch departments once when the component mounts
  useEffect(() => {
    async function fetchDepartments() {
      try {
        const response = await getAllDepartments();
        setDepartments(response.departments);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    }

    fetchDepartments(); // Fetch on mount
  }, []); // Empty dependency array to ensure it only runs once

  // Handle form submission for adding a department
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (departmentName.trim() === '') {
      setError('Department name is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await addDepartment(departmentName);

      if (response) {
        toast({ description: 'Department added successfully!', variant: "default" });
        setDepartments((prev) => [...prev, response]); // Update departments list locally
        setDepartmentName(''); // Reset form
      } else {
        throw new Error('Failed to add department.');
      }
    } catch (error) {
      setError('An error occurred while adding the department. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle adding a batch to a department
  const handleAddBatch = async ({ departmentId, batchName }: { departmentId: string; batchName: string }) => {
    if (!batchName.trim()) return;

    try {
      const response = await addBatch(departmentId, batchName);
      toast({description: 'Batch Added Successfully!!', variant: 'default'});
      // Update the departments state
      setDepartments((prev: Department[]) =>
        prev.map((dept: Department) =>
          dept.id === departmentId
            ? { ...dept, batch: [...(dept.batch || []), response] } // Use an empty array if dept.batch is null or undefined
            : dept
        )
      );

      setBatchName(''); // Clear batch name input
    } catch (error) {
      console.error("Error adding batch:", error);
    }
  };

  const handleEditBatch = async ({ departmentId, batchId, batchName, newBatchName }: {
    departmentId: string;
    batchId: string;
    batchName: string;
    newBatchName: string;
  }) => {
    if (newBatchName === batchName) {
      toast({ description: 'Batch Name not Changed!', variant: "default" });
      setEditBatchName(false);
      setSelectedBatch('');
      return;
    }
    else {
      try {
        console.log("in the edit batch func")
        const response = await editBatch(departmentId, batchId, newBatchName);
        console.log(response)
        toast({description: "Batch updated Successfully", variant: 'default'})
        // Update the departments state
        setDepartments((prev: Department[]) =>
          prev.map((dept: Department) =>
            dept.id === departmentId
              ? { ...dept, batch: [...(dept.batch || []), response] } // Use an empty array if dept.batch is null or undefined
              : dept
          )
        );
        setEditBatchName(false);
        setSelectedBatch('');
      } catch (error) {
        console.error("Error updating batch:", error);
        toast({description: "Error occured while adding batch", variant: 'destructive'})
      }
    }
  }


  return (
    <div className="container mx-auto p-4 sm:p-8">
      <h1 className="text-2xl font-bold mb-4">Add New Department</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="departmentName">Department Name</Label>
          <Input
            id="departmentName"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            placeholder="Enter department name"
            className="mt-1"
            required
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Department'}
        </Button>
      </form>

      <div className="container mx-auto p-4 sm:p-8">
        <h1 className="text-2xl font-bold mb-6">Departments</h1>

        {departments.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr className='w-full  border-r flex justify-start'>
                <th className="w-full border-r px-4 py-2 border-b">Department Name</th>
                <th className="px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((department: Department) => (
                <tr key={department.id} className="border-b">
                  <td className="border-r px-4 py-2">{department.name}</td>
                  <td className="px-4 py-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>Edit</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Department Details</DialogTitle>
                          <DialogClose asChild />
                        </DialogHeader>

                        <div className="w-full flex flex-col gap-2">
                          <Input
                            id="departmentName"
                            value={newDepartmentName}
                            onChange={(e) => setNewDepartmentName(e.target.value)}
                            placeholder="Enter department name"
                            className="mt-1"
                            required
                          />
                          <Button disabled={isSubmitting} onClick={() => setEditDepartmentName(true)}>
                            {isSubmitting ? "Saving Changes..." : "Save Changes"}
                          </Button>

                          <p className="text-lg font-semibold mt-4">Batch Information</p>
                          <form onSubmit={() => handleAddBatch({ departmentId: department.id, batchName })} className="space-y-4">
                            <Label htmlFor="batchName">Batch Name</Label>
                            <Input
                              id="batchName"
                              value={batchName}
                              onChange={(e) => setBatchName(e.target.value)}
                              placeholder="Enter Batch name"
                              className="mt-1"
                              required
                            />
                            <Button type="submit" disabled={isSubmitting}>
                              {isSubmitting ? 'Adding...' : 'Add Batch'}
                            </Button>
                          </form>

                          {department?.batch.length > 0 ? (
                            <ul className='h-20 overflow-auto space-y-2 border-b pb-2'>
                              {department?.batch.map((batch) => (
                                <div key={batch.id} className="w-full flex justify-between items-center space-x-4">
                                  {selectedBatch === batch.id && editBatchName ? (
                                    <Input
                                      id="batchName"
                                      value={newBatchName}
                                      onChange={(e) => setNewBatchName(e.target.value)}
                                      placeholder="Enter Batch name"
                                      className="mt-1"
                                      required
                                    />
                                  ) : (
                                    <li>{batch.name}</li>
                                  )}
                                  {selectedBatch === batch.id && editBatchName ? (
                                    <Button onClick={() => handleEditBatch({ departmentId: department.id, batchId: batch.id, batchName: batch.name, newBatchName: newBatchName })}>
                                      <CheckIcon />
                                    </Button>
                                  ) : (
                                    <button onClick={() => {
                                      setNewBatchName(batch.name);
                                      setEditBatchName(true);
                                      setSelectedBatch(batch.id);
                                    }}>
                                      <EditIcon />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </ul>
                          ) : (
                            <p>No Batches found for this department</p>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Please add a department</p>
        )}
      </div>
    </div>
  );
};

export default AddDepartmentPage;
