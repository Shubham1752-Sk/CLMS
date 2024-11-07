"use client";
import React, { useRef, useEffect, useState, forwardRef, MutableRefObject } from "react";
import useAppContext from "@/contexts";
import { generateLibraryCard } from "@/actions/userActions";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Define types for user and card data
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
}

interface CardData {
  id: string;
}

interface LibraryCardProps {
  user: any;
  cardData: any;
}

// LibraryCard component with types
const LibraryCard = forwardRef<HTMLDivElement, LibraryCardProps>(({ user, cardData }, ref) => (
  <div ref={ref} className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-lg mx-auto">
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
  </div>
));

LibraryCard.displayName = "LibraryCard";

const GenerateLibraryCard: React.FC = () => {
  const { user } = useAppContext() as { user: User };
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardData, setCardData] = useState<CardData | null|any>(null);
  const [loading, setLoading] = useState<boolean>(true);

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

  const downloadCardAsPDF = async () => {
    const cardElement = cardRef.current;
    console.log("Downloading started");

    if (cardElement) {
      try {
        const canvas = await html2canvas(cardElement);
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save("Library_Card.pdf");
        console.log("Download complete");

      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    }
  };

  return (
    <div className="w-full h-full text-center px-2 py-2 flex flex-col justify-center">
      <p className="fixed top-2 mx-auto text-center font-bold text-2xl">
        Generate Library Card
      </p>
      {loading ? (
        <p>Loading card data...</p>
      ) : (
        <LibraryCard ref={cardRef} user={user} cardData={cardData} />
      )}
      <button
        onClick={downloadCardAsPDF}
        className="mt-4 w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
      >
        Download Library Card as PDF
      </button>
    </div>
  );
};

export default GenerateLibraryCard;
