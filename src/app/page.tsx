'use client';

import { clientLogout } from '@/actions/auth';
import useAppContext from '@/contexts';
import { motion } from 'framer-motion'
import { Search, Book, Clock, Calendar, ArrowRight, BookOpen, Users, Star, ChevronRight, Mail } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast';
import { jwtDecode } from 'jwt-decode';
import Image from 'next/image';
import Link from 'next/link'
import Spline from '@splinetool/react-spline';


const FirstPage = () => {

  const [searchQuery, setSearchQuery] = useState('')
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { user, token } = useAppContext();
  const {toast} = useToast();

  const staggerVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Delay between child animations
      },
    },
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const books = [
    {
      id: 1,
      title: 'Design Patterns',
      author: 'Erich Gamma',
      category: 'Computer Science',
      image: '/images/books/design-patterns.jpg',
      rating: 4.5
    },
    {
      id: 2,
      title: 'Clean Code',
      author: 'Robert Martin',
      category: 'Programming',
      image: '/images/books/CleanCode.jpg',
      rating: 4.8
    },
    {
      id: 3,
      title: 'Deep Learning',
      author: 'Ian Goodfellow',
      category: 'AI & ML',
      image: '/images/books/deep-learning.jpg',
      rating: 4.6
    },
  ]

  const events = [
    {
      id: 1,
      title: 'Book Reading Session',
      date: 'March 25, 2024',
      time: '2:00 PM',
      image: '/images/events/reading-session.jpg',
      description: 'Join us for an engaging reading session of classic literature.'
    },
    {
      id: 2,
      title: 'Research Workshop',
      date: 'March 28, 2024',
      time: '3:30 PM',
      image: '/images/events/research-workshop.jpg',
      description: 'Learn advanced research methodologies and paper writing techniques.'
    },
  ]

  const blogs = [
    {
      id: 1,
      title: 'The Future of Digital Libraries',
      author: 'Dr. Binod Kaur',
      date: 'March 15, 2024',
      image: '/images/blogs/digital-library.jpg',
      excerpt: 'Exploring how technology is transforming traditional libraries into digital knowledge hubs.'
    },
    {
      id: 2,
      title: 'Essential Research Tools for Students',
      author: 'Er. Ajay Sharma',
      date: 'March 12, 2024',
      image: '/images/blogs/essentials.jpg',
      excerpt: 'A comprehensive guide to the most effective research tools available in our library.'
    },
    {
      id: 3,
      title: 'Making the Most of Library Resources',
      author: 'Librarian H.S. Sarkaria',
      date: 'March 10, 2024',
      image: '/images/blogs/library-resources.jpg',
      excerpt: 'Tips and tricks to maximize your library experience at AGC Amritsar.'
    }
  ]

  const resources = [
    { title: 'E-Books', count: '25,000+', icon: BookOpen },
    { title: 'Print Books', count: '50,000+', icon: Book },
    { title: 'Active Members', count: '5,000+', icon: Users },
    { title: 'Daily Visitors', count: '500+', icon: Users }
  ]

  const CheckTokenValidity = () =>{
    if (token) {
      // console.log("token: ", token);
      const res = jwtDecode(token);
      if (res.exp > Date.now() / 1000) {
        return true;
      }else {
        return false;
      }
    }
    return false;
  }

  useEffect(() => {
    if (typeof window !== "undefined") {

      if (user && token) {
        const isValidToken = CheckTokenValidity();
        console.log("isValidToken: ", isValidToken);
        if (!isValidToken) {
          clientLogout();
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user");
        }
      }
    }
  }, []);

  const handleSubmit = () =>{
    toast({
      description: `We're currently working on this feature, Stay tuned for more updates`,
      variant: 'default'
    })
    return
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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

      {/* Hero Section with Background Image */}
      <motion.section
        className="relative bg-blue-700 text-white py-24"
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerVariants}
      >
        <div
          className="absolute h-[700px] inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/library.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-blue-700 bg-opacity-70"></div>
        </div>
        <div className="mt-64 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-5xl font-bold mb-6">
              Your Gateway to Knowledge
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Explore our vast collection of academic resources, research materials, and digital content
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Search books, authors, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Quick Stats */}
      <motion.section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20"
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerVariants}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {resources.map((resource, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg text-center"
              whileHover={{ scale: 1.02 }}
              variants={fadeIn}
            >
              <resource.icon className="w-8 h-8 mx-auto text-blue-600 mb-3" />
              <h4 className="font-bold text-xl text-gray-900">{resource.count}</h4>
              <p className="text-gray-600">{resource.title}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Featured Books */}
      <motion.section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerVariants}
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900">Featured Books</h3>
          <Link href="/search-books" className="text-blue-600 hover:text-blue-700 flex items-center">
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map(book => (
            <motion.div
              key={book.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              variants={fadeIn}
            >
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h4 className="text-xl font-semibold mb-2">{book.title}</h4>
                <p className="text-gray-600 mb-2">{book.author}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{book.category}</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{book.rating}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Latest Blog Posts */}
      <motion.section
        className="bg-gray-200 py-16"
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Latest from Our Blog</h3>
            <Link href="#" className="text-blue-600 hover:text-blue-700 flex items-center">
              View All Posts <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map(blog => (
              <motion.article
                key={blog.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
                whileHover={{ scale: 1.02 }}
                variants={fadeIn}
              >
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h4 className="text-xl font-semibold mb-2">{blog.title}</h4>
                  <p className="text-gray-600 mb-4">{blog.excerpt}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{blog.author}</span>
                    <span>{blog.date}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Events & Hours */}
      <motion.section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-8"
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerVariants}
      >
        {/* Events */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Upcoming Events</h3>
            <Link href="#" className="text-blue-600 hover:text-blue-700 flex items-center">
              All Events <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-6">
            {events.map(event => (
              <motion.div
                key={event.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden group"
                whileHover={{ x: 10 }}
                transition={{ duration: 0.2 }}
                variants={fadeIn}
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h4 className="font-semibold text-xl mb-2">{event.title}</h4>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500 group-[hover:bg-blue-400]">
                    <span>{event.date}</span>
                    <span>{event.time}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Hours & Quick Links */}
        <div className="space-y-8 ">
          <div className=" p-6 rounded-lg shadow-sm bg-blue-100">
            <div className="flex items-center mb-4">
              <Clock className="w-6 h-6 text-blue-600 mr-2" />
              <h3 className="text-xl font-semibold">Library Hours</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex justify-between">
                <span>Monday - Friday</span>
                <span className="font-medium">9:00 AM - 5:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span className="font-medium">9:00 AM - 2:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span className="font-medium">Closed</span>
              </li>
            </ul>

          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm ">
            <Spline
              scene="https://prod.spline.design/kXxPCmk8HY4TPFvN/scene.splinecode"
            />
          </div>

          {/* Quick Links */}
          <div className="p-6 rounded-lg shadow-sm bg-blue-100">
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-blue-600 hover:text-blue-700 flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Library Catalog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-600 hover:text-blue-700 flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  E-Resources
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-600 hover:text-blue-700 flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Research Guides
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-600 hover:text-blue-700 flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Book Recommendations
                </Link>
              </li>
            </ul>
          </div>

        </div>

      </motion.section>

      {/* Newsletter Subscription */}
      <motion.section
        className="bg-blue-700 text-white py-16"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-6">
            Stay Updated with Library News
          </h3>
          <p className="text-lg mb-8">
            Subscribe to our newsletter to receive updates on new books, events, and resources at AGC Library.
          </p>
          {submitted ? (
            <div className="text-center">
              <p className="text-lg font-semibold text-green-300">
                Thank you for subscribing!
              </p>
            </div>
          ) : (
            <form
              className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto"
              onSubmit={handleSubmit}
            >
              <div className="relative w-full sm:w-auto flex-grow">
                <Mail className="absolute left-4 top-3 text-gray-400" />
                <input
                  type="email"
                  className="w-full px-12 py-3 rounded-lg border focus:ring-2 focus:ring-blue-300 focus:outline-none text-gray-900"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Contact Info */}
            <div>
              <h4 className="text-white font-semibold text-lg mb-4">Contact Us</h4>
              <address className="not-italic">
                <p>AGC Library</p>
                <p>Majitha Road Bypass</p>
                <p>Amritsar, Punjab</p>
                <p className="mt-2">Phone: +91-183-5069545</p>
                <p>Email: library@agcamritsar.in</p>
              </address>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Services</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Resources</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-white font-semibold text-lg mb-4">Services</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-white transition-colors">Library Catalog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">E-Resources</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Research Help</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Study Rooms</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Printing Services</Link></li>
              </ul>
            </div>

            {/* Hours */}
            <div>
              <h4 className="text-white font-semibold text-lg mb-4">Library Hours</h4>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Mon - Fri:</span>
                  <span>9:00 AM - 5:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Saturday:</span>
                  <span>9:00 AM - 2:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday:</span>
                  <span>Closed</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm">
                © {new Date().getFullYear()} AGC Library. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                <Link href="#" className="hover:text-white transition-colors">Accessibility</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>

  )
};

export default FirstPage;
