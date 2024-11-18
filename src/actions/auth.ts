// import { signIn, signOut } from "@/auth"
import { NextRequest, NextResponse } from "next/server";


interface LoginResponse {
    token: string;
    success: boolean;
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      batchId: string;
      departmentId: string;
      image: string;
    };
    message?: string;
  }

export const AddTokenToLocalStorage = (token: string) => {
    try {
        localStorage.setItem("auth_token", token);
        console.log("Token stored in localStorage:", token);
    } catch (error) {
        console.error("Token storage error:", error);
    }
};

export const RemoveTokenFromLocalStorage = () => {
    try {
        localStorage.removeItem("auth_token"); // Clear token
        console.log("User logged out. Token cleared.");
        console.log("Token invalidated.");
    } catch (error) {
        console.error("Token invalidation error:", error);
    }
};

export const login = async (values: {email: string, password: string}): Promise<LoginResponse> => {
    try {
      console.log("Login attempt for:", JSON.stringify(values));
      
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: 'include', // Important for cookie handling
      });
  
      // First check if the response is actually JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response");
      }
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
  
      return data;
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred during login");
    }
  };

function decodeToken(token: string) {
    try {
        // This is a basic implementation. Replace with your preferred JWT library
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(Buffer.from(base64, 'base64').toString());
        return payload;
    } catch (error) {
        console.error("Token decode error:", error);
        return null;
    }
}

async function verifyToken(token: string): Promise<boolean> {
    try {
        // Decode the token to check expiration
        // Note: Replace this with your actual JWT verification logic
        const payload = decodeToken(token);

        if (!payload || !payload.exp) {
            return false;
        }

        // Check if token is expired (with buffer time)
        const currentTime = Date.now();
        const expiryTime = payload.exp * 1000; // Convert to milliseconds

        return currentTime < expiryTime;
    } catch (error) {
        console.error("Token verification error:", error);
        return false;
    }
}

export async function isAuth(request: NextRequest): Promise<boolean> {
    try {
        const token = request.cookies.get('auth_token')?.value;
        // console.log("token: ", token);

        if (!token) {
            return false;
        }

        // Verify token validity
        const isValid = await verifyToken(token);
        
        if (!isValid) {
            const response = NextResponse.json(
                { success: false, message: 'Invalid token' },
                { status: 401 }
            );
            console.log("Token invalid");
            // If token is invalid, trigger logout
            clearAuthCookies(response);
            return false;
        }
        // AddTokenToLocalStorage(token);

        return true;
    } catch (error) {
        console.error("Authentication error:", error);
        return false;
    }
}

export const fetchUserDetails = async ({ token }: { token: string }) => {
    try {
        console.log("Fetching session details...");
        const res = await fetch("/api/get-user-details", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await res.json();
        if (data.success) {
            return data;
        } else {
            console.error("Error fetching user details:", data.message);
        }
    } catch (error) {
        console.error("Error fetching session:", error);
    }
}

export async function clientLogout() {
    try {
      // Call the logout API endpoint
      const response = await fetch('/api/logout', {
        method: 'POST',
        // credentials: 'include', // Important for cookie handling
      });

      console.log("response: ", response);
  
      if (!response.ok) {
        throw new Error('Logout failed');
      }
  
      // Clear local storage
    //   localStorage.removeItem('auth_token');
      
      // Redirect to login page
    //   window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

// export function clearAuthCookies(): NextResponse {
//     const response = NextResponse.next();
    
//     // Clear the auth cookie
//     response.cookies.set('auth_token', '', {
//       maxAge: 0,
//       path: '/',
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'lax'
//     });
  
//     return response;
//   }

  export function clearAuthCookies(response: NextResponse) {
    // Clear the auth cookie with all security options
    response.cookies.set('auth_token', '', {
      maxAge: 0,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
  
    return response;
  }


// export const loginWithCreds = async ({ email, password }: {
//     email: string,
//     password: string
// }) => {
//     try {
//         await signIn("credentials", { email, password, redirectTo: "/" });
//     } catch (error) {
//         if (error instanceof AuthError) {
//             switch (error.type) {
//                 case 'CredentialsSignin':
//                     return {
//                         message: 'Invalid credentials',
//                     }
//                 default:
//                     return {
//                         message: 'Something went wrong.',
//                     }
//             }
//         }
//         throw error;
//     }
//     revalidatePath("/");
// }