'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const FirstPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* navbar */}
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <Link href="/">
          <p className="text-2xl font-bold">CLMS</p>
        </Link>
        <button className="block lg:hidden" onClick={toggleMenu}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>

        {/* Navigation */}
        <nav
          className={`lg:flex lg:items-center lg:space-x-6 ${
            menuOpen ? 'block' : 'hidden'
          }`}
        >
          <Link href="/">
            <p className="block py-2 lg:py-0 text-lg">Home</p>
          </Link>
          <Link href="/about">
            <p className="block py-2 lg:py-0 text-lg">About</p>
          </Link>
          <Link href="/contact">
            <p className="block py-2 lg:py-0 text-lg">Contact</p>
          </Link>
          <Link href="/login">
            <p className="block py-2 lg:py-0 text-lg bg-white text-blue-600 px-4 rounded">
              Login
            </p>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6 flex flex-col lg:flex-row items-center justify-between">
        <section className="text-center lg:text-left lg:w-1/2">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Welcome to the CLMS
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            The College Library Management System is here to streamline your
            access to the library resources. From searching books to managing
            your issued books, everything is now at your fingertips.
          </p>
          <Link href="/login">
            <p className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition">
              Get Started
            </p>
          </Link>
        </section>

        <section className="lg:w-1/2 mt-6 lg:mt-0">
          <Image
            src="/images/library.jpg" // Make sure you have this image in the public folder
            alt="Library Image"
            width={500}
            height={300}
            className="rounded-lg shadow-lg"
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-blue-600 text-white p-4 text-center">
        &copy; {new Date().getFullYear()} College Library Management System. All
        Rights Reserved.
      </footer>
    </div>
  );
};

export default FirstPage;
