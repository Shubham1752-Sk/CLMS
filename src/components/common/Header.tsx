import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

const Header = () => {
    return (
        <header className="bg-white shadow">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex justify-between gap-4 items-center">
                    <div className='flex items-center gap-5'>
                        <Image
                            src={`/images/header.png`}
                            alt="logo"
                            width={200}
                            height={150}
                        />
                        <motion.h1
                            className="text-3xl font-bold text-gray-900"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            AGC Library
                        </motion.h1>
                    </div>
                    <div className="hidden md:flex space-x-8">
                        <Link href="/" className="text-blue-600 font-semibold">Home</Link>
                        <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
                        <a href="#" className="text-gray-600 hover:text-gray-900">Services</a>
                        <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Header
