'use client'

import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { auth } from '@/auth'



const AvatarButton = async () => {

    const session = await auth()
    const AvatarImg = await fetch(`https://api.dicebear.com/9.x/initials/svg?seed=${session?.user?.name}`)
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage src={session?.user?.image || AvatarImg} />
                    {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                    <AvatarFallback>AvatarImg</AvatarFallback>
                </Avatar>
                {/* Open */}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}

export default AvatarButton
