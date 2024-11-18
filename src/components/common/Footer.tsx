import React from 'react'
import Link from 'next/link'

const Footer = () => {
  return (
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
  )
}

export default Footer
