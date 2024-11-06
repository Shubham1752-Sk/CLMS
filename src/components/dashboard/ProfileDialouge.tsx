'use client';

import React, { useState } from 'react';
import useAppContext from '@/contexts';
import { useRouter } from 'next/navigation';

const ProfileDialouge = () => {
  const { user, setUser } = useAppContext(); // Assuming user state and setter are in context
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false); // Toggle for edit mode
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.Department?.name || '',
    batch: user?.Batch?.name || '',
    batchYear: user?.Batch?.year || '',
    image: user?.image || '/default-avatar.jpg', // Fallback avatar
  });

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Toggle edit mode
  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  // Save user details after editing
  const handleSave = () => {
    setUser({
      ...user,
      name: formData.name,
      email: formData.email,
      Department: { name: formData.department },
      Batch: { name: formData.batch, year: formData.batchYear },
      image: formData.image,
    });
    setIsEditing(false);
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="bg-gray-100 p-6 rounded-lg flex flex-col justify-start shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Profile Details</h2>

        {/* User Avatar */}
        <div className="flex max-sm:flex-col items-center mb-4">
          <img
            src={formData.image}
            alt={user?.name || 'User Avatar'}
            width={60}
            height={60}
            className="rounded-full"
          />
          <div className="ml-4">
            {!isEditing ? (
              <h2 className="text-xl font-bold">{user?.name}</h2>
            ) : (
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            )}
            <p className="text-gray-600">
              {!isEditing ? (
                user?.email
              ) : (
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />
              )}
            </p>
          </div>
        </div>

        {/* Department Information */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Department</h3>
          {!isEditing ? (
            <p>{user?.Department?.name || 'Not Assigned'}</p>
          ) : (
            <input
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          )}
        </div>

        {/* Batch Information */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Batch</h3>
          {!isEditing ? (
            <>
              <p>{user?.Batch?.name || 'Not Assigned'}</p>
              {/* <p>{user?.Batch?.year || 'N/A'}</p> */}
            </>
          ) : (
            <>
              <input
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                className="border p-2 rounded mb-2"
                placeholder="Batch Name"
              />
              {/* <input
                name="batchYear"
                value={formData.batchYear}
                onChange={handleChange}
                className="border p-2 rounded"
                placeholder="Batch Year"
              /> */}
            </>
          )}
        </div>

        {/* Edit / Save Button */}
        <div className="flex justify-between items-center">
          <button
            onClick={()=>router.push('/dashboard/settings/update-profile')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>

          {isEditing && (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileDialouge;
