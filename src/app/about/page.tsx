"use client";

import { motion } from 'framer-motion'
import { Book, Users, Award, Building, ArrowRight, GraduationCap, Clock } from 'lucide-react'
import Link from 'next/link'

export default function About() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const stats = [
    {
      icon: Book,
      count: "50,000+",
      label: "Books & Resources"
    },
    {
      icon: Users,
      count: "5,000+",
      label: "Active Members"
    },
    {
      icon: Clock,
      count: "14",
      label: "Hours Daily Service"
    },
    {
      icon: GraduationCap,
      count: "1892",
      label: "Established"
    }
  ]

  const facilities = [
    {
      title: "Reading Halls",
      description: "Spacious air-conditioned reading halls with modern furniture for comfortable studying."
    },
    {
      title: "Digital Section",
      description: "Access to online journals, e-books, and digital resources through dedicated computer terminals."
    },
    {
      title: "Reference Section",
      description: "Extensive collection of reference books, encyclopedias, and research materials."
    },
    {
      title: "Periodical Section",
      description: "Current journals, magazines, and newspapers in multiple languages."
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <Link href="/">
              <motion.h1
                className="text-3xl font-bold text-gray-900 cursor-pointer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                AGC Library
              </motion.h1>
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link href="/about" className="text-blue-600 font-semibold">About</Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">Services</Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">Contact</Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <motion.section
        className="relative bg-blue-700 text-white py-24"
        initial="initial"
        animate="animate"
        variants={fadeIn}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4">About Our Library</h2>
          <p className="text-xl text-blue-100 max-w-2xl">
            Established in 1892, the AGC Library has been a cornerstone of academic excellence at Amritsar Group of Colleges.
            We provide a conducive environment for learning, research, and intellectual growth.
          </p>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        initial="initial"
        animate="animate"
        variants={fadeIn}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="w-fit text-center hover:bg-blue-500 hover:bg-opacity-20 rounded-md hover:scale-110  transition-all duration-75 hover:cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <stat.icon className="w-8 h-8 mx-auto text-blue-600 mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.count}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Mission Section */}
      <motion.section
        className="bg-white py-16"
        initial="initial"
        animate="animate"
        variants={fadeIn}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 rounded-xl bg-blue-600 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-3xl font-bold mb-6">Our Mission</h3>
            <p className="text-xl leading-relaxed animate-pulse">
              To support the educational mission of AGC Amritsar by providing comprehensive resources
              and services that enhance learning, teaching, and research. We strive to create an
              inclusive environment that promotes intellectual discovery, critical thinking, and
              lifelong learning.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Facilities Section */}
      <motion.section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        initial="initial"
        animate="animate"
        variants={fadeIn}
      >
        <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Facilities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {facilities.map((facility, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow hover:bg-blue-600 hover:bg-opacity-50 hover:scale-110 duration-75 hover:text-white"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <h4 className="text-xl font-semibold mb-4">{facility.title}</h4>
              <p className="text-gray-600">{facility.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Library Rules & Timing Section */}
      <motion.section
        className="bg-gray-100 py-16"
        initial="initial"
        animate="animate"
        variants={fadeIn}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Library Rules */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Library Rules</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-1" />
                  <p className="text-gray-600">Maintain silence and discipline within the library premises</p>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-1" />
                  <p className="text-gray-600">Library cards are non-transferable</p>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-1" />
                  <p className="text-gray-600">Books must be returned within the stipulated time period</p>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-1" />
                  <p className="text-gray-600">No eatables are allowed inside the library</p>
                </li>
              </ul>
            </div>

            {/* Library Timing */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Library Hours</h3>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <ul className="space-y-4">
                  <li className="flex justify-between items-center">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="font-semibold">9:00 AM - 5:00 PM</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-gray-600">Saturday</span>
                    <span className="font-semibold">9:00 AM - 2:00 PM</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-gray-600">Sunday</span>
                    <span className="font-semibold">Closed</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        className="bg-white py-16"
        initial="initial"
        animate="animate"
        variants={fadeIn}
      >
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className='flex max-sm:flex-col gap-4 justify-center items-center'>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h3>
            <p className="text-gray-600 mb-4">Have questions? We're here to help!</p>
          </div>
          <p className="text-gray-600">
            Amritsar Group of Colleges<br />
            Majitha Road Bypass<br />
            Amritsar, Punjab<br />
            Phone: +91-183-5069545
          </p>
        </div>
      </motion.section>
    </div>
  )
}