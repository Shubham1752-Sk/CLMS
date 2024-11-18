"use client"

import { createContext, useState, useContext, useEffect } from "react";
import { fetchUserDetails } from "@/actions/auth";
// import jwt_decode from "jwt-decode";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string;
    departmentId?: string;
    batchId?: string;
}

interface AppContextType {
    user: User | null;
    token: string | null;
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    logout: () => void;
    // getUserDetails: () => Promise<void>;
}

const getInitialToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem("auth_token");
    }
    return null;
};

const getInitialUser = () => {
    if (typeof window !== 'undefined') {
        return JSON.parse(localStorage.getItem("user"));
    }
    return null;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppWrapper({ children }: {
    children: React.ReactNode
}) {
    const [user, setUser] = useState<User | null>(getInitialUser());
    const [token, setToken] = useState<string | null>(getInitialToken());

    // Function to fetch user details
    const getUserDetails = async () => {
        if (!token) return;

        fetchUserDetails({ token })
        .then(data => {
          
          if (data.success) {
            console.log("data: ", data);
            setUser(data.user);
          } else {
            console.error(data.message || 'Failed to fetch user details');
          }
        })
        .catch(error => {
        //   if (!isSubscribed) return;
          if (error.name === 'AbortError') return;
          
          console.error("Error fetching session:", error);
          console.error('Failed to fetch user details');
        })
        .finally(() => {
        //   if (isSubscribed) {
        //     setLoading(false);
        //   }
        });
    };

    // Effect to fetch user details when token changes
    useEffect(() => {
        if (token) {
            // getUserDetails();
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            localStorage.setItem("auth_token", token);
        } else {
            localStorage.removeItem("auth_token");
        }
    }, [token]);

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("auth_token");
    };

    return (
        <AppContext.Provider value={{
            user,
            token,
            setUser,
            setToken,
            logout,
            // getUserDetails
        }}>
            {children}
        </AppContext.Provider>
    );
}

export default function useAppContext() {
    const context = useContext(AppContext);
    
    if (context === undefined) {
        throw new Error("useAppContext must be used within an AppWrapper");
    }
    
    return context;
}