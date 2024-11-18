"use client";

import { useEffect, useState } from "react";
import useAppContext from "@/contexts";
import Loader from "@/components/common/Loader";
import { fetchUserDetails } from "@/actions/auth";

interface UserDataFetcherProps {
  children: React.ReactNode;
}

export function UserDataFetcher({ children }: UserDataFetcherProps) {
  const { user, setUser, token } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (!token) {
      window.location.href = "/";
      return;
    }

    // Only fetch if we don't have user data
    if (!user) {
      console.log("user not found - going to fetch");
      
      fetchUserDetails({ token })
        .then(response => {
          console.log("response: ", response);
          // Check if component is still mounted before updating state
          if (isMounted) {
            if (response.success) {
              console.log(response.user);
              localStorage.setItem("user", JSON.stringify(response.user));
              // Update user state synchronously
              // setUser(response.user);
            } else {
              setError(response.message || 'Failed to fetch user details');
            }
          }
        })
        .catch(err => {
          if (isMounted) {
            console.error("Error fetching session:", err);
            setError('Failed to fetch user details');
          }
        })
        .finally(() => {
          if (isMounted) {
            setLoading(false);
          }
        });
    } else {
      setLoading(false);
    }

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [token, user, setUser]); // Add all dependencies
  
  if (loading) {
    return <Loader />;
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {error || 'User not found or unauthorized'}
          </h2>
          <p className="text-gray-600">
            Please try logging in again or contact support if the problem persists.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}