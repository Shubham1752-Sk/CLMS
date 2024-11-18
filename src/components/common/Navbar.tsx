'use client'
import Image from 'next/image'
import React from 'react'
import { auth } from '@/auth'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import useAppContext from '@/contexts'

function AvatarButton() {
    return (
        <button 
            className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white shadow-md transition-all hover:bg-white/20 hover:shadow-lg"
            onClick={()=>window.location.href="/login"}
        >
            <UserIcon />
            <span>Sign In</span>
        </button>
    )
}

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
        "Books": "/search-books",
    }

    const {user} = useAppContext();
    // console.log(user)
    // const AvatarImg = await fetch(`https://api.dicebear.com/9.x/initials/svg?seed=${session?.user?.name}`)
    return (
        <div className='w-screen h-fit px-4 py-2 bg-blue-600 text-white text-lg flex justify-between items-center'>
            <div>
                <Image
                    src={`/images/header.png`}
                    alt="logo"
                    width={200}
                    height={150}
                />
            </div>
            <div className="flex gap-4 ">
                {/* Map over navLinks and pass key-value pairs */}
                {
                    Object.entries(navLinks).map(([linkName, url]) => (
                        <p
                            onClick={() => window.location.href = url}
                            key={linkName}
                            className="text-white hover:scale-110 hover:underline-offset-1 transition-all duration-75 hover:cursor-pointer"
                        >{linkName}</p>
                    ))
                }
            </div>

            <div>
                <AvatarButton />
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
