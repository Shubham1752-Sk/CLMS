'use client'
import { generateLibraryCard } from '@/actions/userActions'
// import useAppContext from '@/contexts'
import React, { useEffect, useState, forwardRef } from 'react'
import Image from 'next/image'
import { QRCodeSVG } from "qrcode.react"; // Import the QRCodeSVG component

const cardData = ({ user }: {
    user: any
}) => {
    // const { user } = useAppContext()
    // console.log(user)
    const [cardData, setCardData] = useState<any>();

    // fetch the library card
    useEffect(() => {
        const fetchcardData = async () => {
            try {
                // console.log("user ID ", user?.id)
                const res = await generateLibraryCard(user?.id);
                // console.log(res)
                // console.log(res.data.cardData)
                setCardData(res?.data);
            } catch (error) {
                console.error(error);
            }
        }

        fetchcardData()
    }, [user])

    // console.log(cardData)
    return (
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-lg mx-auto">
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
                    <p className="text-gray-600">{user?.role}</p>
                </div>
            </div>

            {/* Library Card Information */}
            <div className="mb-4 flex items-center gap-4">
                <div>
                    <h3 className="text-lg font-semibold">Library Card Details</h3>
                    <p><strong>Card Number:</strong> {cardData?.id}</p>
                    <p><strong>User Name:</strong> {user?.name}</p>
                    <p><strong>User Role:</strong> {user?.role}</p>
                </div>
                <div className=" flex flex-col items-center gap-2">
                    {/* <h4 className="text-lg font-semibold mb-2">Library Card QR Code</h4> */}
                    <QRCodeSVG
                        value={`http://localhost:3000/librarycard-details/${cardData?.id}`} // Convert the data to JSON string for the QR code
                        size={100} // QR code size
                        bgColor={"#ffffff"} // Background color of the QR code
                        fgColor={"#000000"} // Foreground color of the QR code
                        level={"H"} // Error correction level: L, M, Q, H (H is the highest level)
                    />
                    <p className='text-[9px]'>Scan this qrcode for more details</p>
                </div>
            </div>
        </div>
    );

};

export default cardData
