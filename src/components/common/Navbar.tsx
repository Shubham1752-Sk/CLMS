'use client'
import Image from 'next/image'
import React from 'react'
import logo from "../../../public/images/logo.jpeg"
import Navlink from './navlink'
import { auth } from '@/auth'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

function UserIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    )
}

const Navbar = async () => {
    const navLinks = {
        "Home": "/",
        "About": "/about",
        "Contact": "/contact",
        "Books": "/books-search",
    }

    const session = await auth();
    const AvatarImg = await fetch(`https://api.dicebear.com/9.x/initials/svg?seed=${session?.user?.name}`)
    return (
        <div className='w-screen h-fit p-4 py-2 bg-gray-500 text-white text-lg flex items-center justify-between sm:justify-center sm:gap-4'>
            <div>
                <Image
                    src={logo}
                    alt="logo"
                    width={40}
                    height={40}
                />
            </div>
            <div className="flex gap-4">
                {/* Map over navLinks and pass key-value pairs */}
                {
                    Object.entries(navLinks).map(([linkName, url]) => (
                        <Navlink key={linkName} link={linkName} url={url} />
                    ))
                }
            </div>

            <div>
                {/* <AvatarButton /> */}
                {/* <DropdownMenu>
                    <DropdownMenuTrigger>
                        open
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                        <DropdownMenuItem>Team</DropdownMenuItem>
                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu> */}

                
            </div>
        </div>
    )
}

export default Navbar
