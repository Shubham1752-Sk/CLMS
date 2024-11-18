// "use client"
import Sidebar from "@/components/dashboard/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { UserDataFetcher } from "@/components/dashboard/UserDataFetcher";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <UserDataFetcher>
      {/* hii */}
      <div className="w-full h-screen flex">
        <Toaster />
        <Sidebar />
        <div className="w-full">{children}</div>
      </div>
    </UserDataFetcher>
  );
}