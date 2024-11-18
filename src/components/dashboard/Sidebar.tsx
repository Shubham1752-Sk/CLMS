"use client";

import React, { useEffect, useState } from "react";
import {
  HomeIcon,
  PlusIcon,
  BookIcon,
  BookUserIcon,
  SidebarClose,
  SidebarOpenIcon,
  IdCardIcon,
  UserIcon,
  Building,
  FlowerIcon,
  Settings,
  UndoIcon,
  PencilIcon,
  CaptionsOff,
  Ban,
  CalendarOff,
  UserXIcon
} from "lucide-react";
import Link from "next/link";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { userRoles } from "@/lib/userRoles";
import { Button } from "../ui/button";
import { clientLogout } from "@/actions/auth";
import { usePathname, useRouter } from "next/navigation";
import useAppContext from "@/contexts";

const sidebarLinks = [
  {
    label: "Home",
    icon: HomeIcon,
    to: "/",
    role: "COMMON",
  },
  {
    label: "Account",
    icon: UserIcon,
    to: "/dashboard/my-profile",
    role: "COMMON",
  },
  {
    label: "Search Books",
    icon: BookIcon,
    to: "/search-books",
    role: "COMMON",
  },
  {
    label: "Generate Library Card",
    icon: IdCardIcon,
    to: "/dashboard/generate-library-card",
    role: "COMMON",
  },
  {
    label: "Add Data",
    icon: PlusIcon,
    to: "#",
    role: [userRoles.ADMIN, userRoles.MANAGEMENT], // Now an array to hold multiple roles
    children: [
      {
        label: "Add New Book",
        to: "/dashboard/add-book",
        icon: BookIcon,
        role: userRoles.MANAGEMENT,
      },
      {
        label: "Add Genre",
        to: "/dashboard/add-genre",
        icon: FlowerIcon,
        role: userRoles.MANAGEMENT,
      },
      {
        label: "Issue Book",
        to: "/dashboard/issue-book",
        icon: BookUserIcon,
        role: userRoles.MANAGEMENT,
      },
      {
        label: "Add New User",
        to: "/dashboard/add-user",
        icon: UserIcon,
        role: userRoles.ADMIN,
      },
      {
        label: "Add New Department",
        to: "/dashboard/add-department",
        icon: Building,
        role: userRoles.ADMIN,
      },
    ],
  },
  {
    label: "Return Book",
    icon: UndoIcon,
    to: "/dashboard/return-book",
    role: userRoles.MANAGEMENT,
  },
  {
    label: "Edit Books",
    icon: PencilIcon,
    to: "/dashboard/edit-book-data",
    role: userRoles.MANAGEMENT,
  },
  {
    label: "Deactivate Library Cards",
    icon: Ban,
    to: "#",
    role: userRoles.ADMIN,
    children: [
      {
        label: "Deactivate Library Cards",
        icon: CaptionsOff,
        to: "/dashboard/deactivate-library-cards",
        role: userRoles.ADMIN,
      },
      {
        label: "Deactivate Batches",
        icon: CalendarOff,
        to: "/dashboard/deactivate-batch",
        role: userRoles.ADMIN,
      },
    ]
  },
  {
    label: "View Deafulters",
    icon: UserXIcon,
    to: "/dashboard/view-defaulters",
    role: [userRoles.MANAGEMENT, userRoles.ADMIN],
  },
];

const Item = ({
  title,
  to,
  icon: Icon,
  children,
  selected,
  setSelected,
  isCollapsed,
}: {
  title: string;
  to: string;
  icon: JSX.Element | any; // Ensure it's JSX or a valid React component
  children?: any;
  selected: string;
  setSelected: any;
  isCollapsed: boolean;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={to}
            className={`flex h-9 w-9 items-center justify-center rounded-lg hover:scale-110 duration-75 ${selected === title
              ? "bg-white text-blue-700 border-gray-500"
              : "text-gray-300 border-gray-300"
              } border-2 transition-colors`}
            prefetch={false}
            onClick={() => {
              setSelected(title);
            }}
          >
            <div className="flex items-center justify-center">
              {/* Render the icon as JSX */}
              {Icon && <Icon />}{" "}
              {/* Ensure the icon is rendered as a component */}
            </div>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">
          <div className="flex flex-col">
            <p className="font-bold">{title}</p>
            {/* If children exist, render them inside the tooltip */}
            {children && children.length > 0 && (
              <div className="mt-2 flex flex-col gap-2 before:w-2 before:h-2 before:absolute before:left-0 before:-translate-x-1 before:translate-y-10 before:rotate-45 before:bg-black ">
                {children.map(
                  (
                    child: {
                      label: string;
                      to: string;
                      icon: JSX.Element | any; // Make sure it's valid JSX
                    },
                    idx: number
                  ) => (
                    <Link
                      key={idx}
                      href={child.to}
                      className={`flex h-8 w-32 items-center justify-start rounded-lg hover:scale-105 duration-100 bg-gray-100 p-2`}
                      prefetch={false}
                      onClick={() => {
                        setSelected(child.label);
                      }}
                    >
                      <div className="flex items-center text-black">
                        {/* Render the child icon as JSX */}
                        {child.icon && <child.icon className="h-5 w-5" />}
                        <span className="ml-2">{child.label}</span>
                      </div>
                    </Link>
                  )
                )}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const SideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false); // Toggle for sidebar collapse
  const [selected, setSelected] = useState<string>("Account"); // Track selected item
  
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    console.log("logout");
    if (window !== undefined) {
      await clientLogout();
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      router.replace("/login");
    }
  };

  useEffect(() => {
    setSelected(sidebarLinks.find(link => link.to === pathname)?.label as string)
  }, [pathname])

  const { user } = useAppContext();

  // Function to check if the user has the required role
  const hasPermission = (requiredRoles: string[] | string) => {
    if (Array.isArray(requiredRoles)) {
      return requiredRoles.includes(user?.role);
    }
    return requiredRoles === "COMMON" || user?.role === requiredRoles;
  };

  // Filter sidebar links based on user role
  const filteredLinks = sidebarLinks.filter((link) => {
    const hasParentPermission = hasPermission(link.role);
    if (!hasParentPermission) return false;

    // Check if user has permission for child links (if any)
    if (link.children) {
      link.children = link.children.filter((child) =>
        hasPermission(child.role)
      );
    }

    return true;
  });

  // console.log(filteredLinks)

  return (
    <div
      className={` ${isCollapsed ? "w-20" : "w-64"
        } p-2 pl-0 flex flex-col gap-4 transition-all duration-100 ease-linear bg-blue-400`}
    >
      {/* Sidebar Toggle */}
      <div className="flex justify-between items-center cursor-pointer p-2 text-primary-foreground">
        <p
          className={`text-xl text-primary-foreground font-bold ml-2 ${isCollapsed ? "hidden" : "inline"
            }`}
        >
          DASHBOARD
        </p>
        <div
          onClick={() => {
            setIsCollapsed(!isCollapsed);
          }}
          className="cursor-pointer p-2 hover:bg-black hover:bg-opacity-10 hover:scale-110 transition-colors duration-75 rounded-full"
        >
          {isCollapsed ? <SidebarOpenIcon /> : <SidebarClose />}
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-0.5 bg-slate-300" />

      {/* Sidebar Links */}
      <div className="w-full h-full flex flex-col items-center justify-between pb-10">
        <div className="w-fit flex flex-col gap-5">
          {filteredLinks.map((link, index) => (
            <Item
              key={index}
              icon={link.icon}
              to={link.to}
              title={link.label}
              children={link?.children}
              selected={selected}
              setSelected={setSelected}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors text-gray-100 border-2 border-gray-300 hover:text-foreground md:h-8 md:w-8"
                  >
                    <Settings className="h-5 w-5" />
                    {/* <span className="sr-only">Profile</span> */}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.image} alt="@shadcn" />
                        <AvatarFallback>User</AvatarFallback>
                      </Avatar>
                      <div className="grid gap-0.5">
                        <div className="font-medium">{user?.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {user?.email}
                        </div>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/dashboard/my-profile">
                      <p>Profile</p>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/dashboard/settings/update-profile">
                      <p>Settings</p>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleLogout()}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipTrigger>
            <TooltipContent side="right">Profile</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default SideBar;
