"use client";
import { generateLibraryCard } from "@/actions/userActions";
import React, { useEffect, useState, forwardRef } from "react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";

// Component definition - renamed to "LibraryCard"
const LibraryCard = forwardRef(({ user }: { user: any }, ref) => {
  const [cardData, setCardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        const res = await generateLibraryCard(user?.id);
        setCardData(res?.data);
      } catch (error) {
        console.error("Error fetching card data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCardData();
  }, [user]);

  return (
    <div ref={ref} className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-lg mx-auto">
      {loading ? (
        <p>Loading card data...</p>
      ) : (
        <>
          {/* User Information */}
          <div className="flex items-center mb-4">
            <Image
              src={user?.image || "/default-avatar.jpg"}
              alt={user?.name || "User Avatar"}
              width={60}
              height={60}
              className="rounded-full"
            />
            <div className="ml-4">
              <h2 className="text-2xl font-bold">{user?.name || "Unknown User"}</h2>
              <p className="text-gray-600">{user?.email || "No Email Provided"}</p>
              <p className="text-gray-600">{user?.role || "Role Unspecified"}</p>
            </div>
          </div>

          {/* Library Card Information */}
          <div className="mb-4 flex items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold">Library Card Details</h3>
              <p>
                <strong>Card Number:</strong> {cardData?.id || "N/A"}
              </p>
              <p>
                <strong>User Name:</strong> {user?.name || "Unknown User"}
              </p>
              <p>
                <strong>User Role:</strong> {user?.role || "Role Unspecified"}
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <QRCodeSVG
                value={`https://yourdomain.com/librarycard-details/${cardData?.id}`} 
                size={100}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"H"}
              />
              <p className="text-[9px]">Scan this QR code for more details</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

LibraryCard.displayName = "LibraryCard"; // Necessary for forwardRef

export default LibraryCard;
