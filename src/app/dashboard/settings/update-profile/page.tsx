'use client';

import React, { useEffect, useState } from 'react';
import { updateUserProfile, getAllBatches, getAllDepartments } from '@/actions/userActions'; // Import the server action
import useAppContext from '@/contexts';
import { useToast } from "@/hooks/use-toast";

interface UpdateProfileProps {
    user: {
        id: string;
        name?: string;
        email?: string;
        departmentId?: string;
        batchId?: string;
        image?: string;
    };
}

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

const UpdateProfile: React.FC<UpdateProfileProps> = () => {

    const { user } = useAppContext();
    const { toast } = useToast();
    // console.log(user);
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [departmentId, setDepartmentId] = useState<string>('');
    const [batchId, setBatchId] = useState<string>('');
    const [image, setImage] = useState<string>('');
    const [departments, setDepartments] = useState<Department[]>([]);
    const [batches, setBatches] = useState<Batch[]>([]);
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        if (user) {
            // console.log(user)
            setName(user.name);
            setEmail(user.email);
            setDepartmentId(user.departmentId);
            setBatchId(user.batchId);
            if (!user?.image)
                setImage(`https://api.dicebear.com/9.x/initials/svg?seed=${user?.name}`);

            console.log(user?.image)
        }
    }, [user])

    const fetchDepartments = async () => {
        const response = await getAllDepartments();
        if (response.success === true)
            setDepartments(response.departments);
    };

    const fetchBatches = async () => {
        const response = await getAllBatches();
        if (response.success === true)
            setBatches(response.batches);
    };

    // Fetch departments and batches when the component mounts
    useEffect(() => {
        if (user) {
            fetchDepartments();
            fetchBatches();
        }
    }, [user]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            console.log(user?.id)
            const result = await updateUserProfile({
                userId: user?.id,
                name,
                email,
                departmentId,
                batchId,
                image,
            });

            if (result.success) {
                toast({ description: 'Profile updated successfully!', variant: 'success' });
            } else {
                toast({ description: 'Failed to update profile.', variant: 'destructive' });
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage('An error occurred while updating the profile.');
        }
    };

    return (
        <div className="w-full mx-auto p-4 border rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Update Profile</h2>

            {message && <p className="text-center mb-4 text-green-600">{message}</p>}

            <form onSubmit={handleUpdateProfile}>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                        type="text"
                        value={user?.name ? user.name : name}
                        disabled={ user?.name ? true : false}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border rounded-md p-2"
                        placeholder="Enter your name"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                        type="email"
                        value={user?.email ? user.email : email}
                        disabled={ user?.email ? true : false}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border rounded-md p-2"
                        placeholder="Enter your email"
                    />
                </div>

                {/* Department Select Dropdown */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Department</label>
                    <select
                        value={departmentId}
                        disabled={ user?.departmentId ? true : false}
                        onChange={(e) => setDepartmentId(e.target.value)}
                        className="w-full border rounded-md p-2"
                    >
                        <option value="">Select Department</option>
                        {departments.map((department: { id: string; name: string }) => (
                            <option key={department.id} value={department.id} >
                                {department.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Batch Select Dropdown */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Batch</label>
                    <select
                        value={batchId}
                        disabled={ user?.batchId ? true : false}
                        onChange={(e) => setBatchId(e.target.value)}
                        className="w-full border rounded-md p-2"
                    >
                        <option value="">Select Batch</option>
                        {batches.map((batch: { id: string; name: string }) => (
                            <option key={batch.id} value={batch.id}>
                                {batch.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Profile Image URL</label>
                    <input
                        type="text"
                        disabled={true}
                        value={user?.image ? user.image : image}
                        onChange={(e) => setImage(e.target.value)}
                        className="w-full border rounded-md p-2"
                        placeholder="Enter image URL"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                >
                    Update Profile
                </button>
            </form>
        </div>
    );
};

export default UpdateProfile;

