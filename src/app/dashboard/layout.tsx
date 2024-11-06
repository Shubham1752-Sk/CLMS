'use client'

import Sidebar from "@/components/dashboard/Sidebar";
import React, { useEffect, useState } from 'react'
import useAppContext from '@/contexts'
import { getUserByEmail } from '@/actions/userActions'
import { Toaster } from "@/components/ui/toaster";
import Loader from "@/components/common/Loader";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const { user, setUser } = useAppContext();
    const [session, setSession] = useState<any>(null);


    // Fetch session data from the API route
    useEffect(() => {
        const fetchSession = async () => {
            const res = await fetch("/api/session");
            const data = await res.json();
            setSession(data.session);

            if (data.session?.user?.email) {
                const userRes = await getUserByEmail(data?.session?.user?.email);
                setUser(userRes);
            }
        };

        fetchSession();
    }, [setUser]);

    console.log("layout: " ,user);
    if(!user){
        return <Loader />
    }
    return (

        <div className="w-full h-screen flex">
            <Toaster />
            <Sidebar  />
            {children}
        </div>

    );
}