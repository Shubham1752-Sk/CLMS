'use client'

import React, { useEffect, useState } from 'react'
import Image from "next/image"; // Optional if you're using images
import { getLibraryCardDetails } from '@/actions/userActions';

const CardDetails = ({ params }: {
  params: any
}) => {
  const [user, setUser] = useState<any>()
  const [libraryCard, setLibraryCard] = useState<any>()

  const { cardId } = params;
  // console.log(cardId)

  // fetch the Details of card and user using the cardId
  useEffect(() => {
    const fetchLibraryCardDetails = async () => {
      try {
        // Replace with your actual API endpoint or Prisma action to fetch library card details
        const response = await getLibraryCardDetails(cardId)
        console.log(response)
        // const data = await response.json();

        if (response) {
          setLibraryCard(response.libraryCard); // Assuming libraryCard is returned in the response
          setUser(response.user); // Assuming user is returned in the response
        }
      } catch (error) {
        console.error("Error fetching library card details:", error);
      }
    };

    fetchLibraryCardDetails();
  }, [])

  return (
    <div className='w-screen h-screen overflow-hidden flex flex-col flex-wrap gap-10 justify-center items-center'>
      <p className='font-bold text-3xl'>Welcome to AGC Central Library</p>
      <div className="w-full bg-gray-100 p-6 rounded-lg shadow-lg max-w-lg mx-auto overscroll-y-auto">
        {/* User Information */}
        <div className="flex items-center mb-4">
          <Image
            src={user?.image || "/default-avatar.jpg"} // Fallback avatar
            alt={user?.name || "User Avatar"}
            width={60}
            height={60}
            className="rounded-full"
          />
          <div className="ml-4">
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>

        {/* Library Card Information */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Library Card Details</h3>
          <p><strong>Card Number:</strong> {libraryCard?.id}</p>
          <p><strong>Issue Limit:</strong> {libraryCard?.issueLimit} books</p>
          <p><strong>Books Issued:</strong> {libraryCard?.issuedBooks?.length} / {libraryCard?.issueLimit}</p>
        </div>

        {/* Books Issued */}
        <div>
          <h4 className="text-lg font-semibold">Books Issued</h4>
          {libraryCard?.issuedBooks?.length > 0 ? (
            <ul className="list-disc pl-6">
              {libraryCard?.issuedBooks?.map((book: any) => (
                <li key={book?.id} className="text-gray-700">
                  <strong>Title:</strong> {book?.Book?.title} <br />
                  <strong>Author:</strong> {book?.Book?.author} <br />
                  <strong>Status:</strong> {book?.status === "issued" ? "Issued" : "Available"}
                </li>
              ))}
            </ul>
          ) : (
            <p>No books issued yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CardDetails
