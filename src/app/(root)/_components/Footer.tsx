"use client";
import Link from 'next/link';


import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaShieldAlt } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { FaMapMarkerAlt, FaPhone } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Top wave separator */}
      <div className="text-gray-900 ">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 60" className="w-full">
          <path
            fill="currentColor"
            fillOpacity="1"
            d="M0,64L60,58.7C120,53,240,43,360,48C480,53,600,75,720,80C840,85,960,75,1080,64C1200,53,1320,43,1380,37.3L1440,32L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
          ></path>
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4  pb-8 ">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Column 1: Logo and Description */}
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                <FaShieldAlt className="text-white text-xl" />
              
              </div>
              
              <h3 className="text-xl font-bold">Nigheban.pk</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering communities through technology to create safer, more connected neighborhoods.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          <div>
  <h3 className="font-semibold text-lg mb-4 relative inline-block">
    Quick Links
    <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-blue-500"></span>
  </h3>
  <ul className="space-y-2">
    {[
      { name: "Home", href: "/" },
      { name: "About Us", href: "/about" },
      { name: "Services", href: "/services" },
      { name: "Report an Issue", href: "/report" },
      { name: "Communities", href: "/communities" },
      { name: "Contact", href: "/contact" },
    ].map((item, index) => (
      <li key={index}>
        <Link 
          href={item.href}
          className="text-gray-400 hover:text-white transition-colors duration-300 text-sm flex items-center group"
        >
          <span className="w-0 group-hover:w-2 h-0.5 bg-blue-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
          {item.name}
        </Link>
      </li>
    ))}
  </ul>
</div>

          {/* Column 3: Features */}
          <div>
            <h3 className="font-semibold text-lg mb-4 relative inline-block">
              Features
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-blue-500"></span>
            </h3>
            <ul className="space-y-2">
              {[
                "Anonymous Reporting", 
                "Geo Crime Mapping", 
                "Live Community Chat",
                "Book a Lawyer",
                "Available Communities",
                "Crime Analytics"
              ].map((item, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-white transition-colors duration-300 text-sm flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-blue-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4 relative inline-block">
              Contact Us
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-blue-500"></span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-blue-400 mt-1 mr-3" />
                <span className="text-gray-400 text-sm">
                  123 Safety Street, Secure City, SC 12345
                </span>
              </li>
              <li className="flex items-center">
                <FaPhone className="text-blue-400 mr-3" />
                <span className="text-gray-400 text-sm">
                  +1 (555) 123-4567
                </span>
              </li>
              <li className="flex items-center">
                <IoMdMail className="text-blue-400 mr-3" />
                <span className="text-gray-400 text-sm">
                  info@safecommunity.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h4 className="text-lg font-semibold mb-2">Subscribe to our Newsletter</h4>
              <p className="text-gray-400 text-sm">Stay updated with the latest community safety tips.</p>
            </div>
            <div className="w-full md:w-auto flex flex-col md:flex-row">
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-gray-800 text-white px-4 py-3 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 md:mb-0 w-full"
              />
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-r transition-colors duration-300 w-full md:w-auto">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © {currentYear} Negheban.pk. All rights reserved.
          </p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="#" className="text-gray-500 hover:text-gray-400 text-xs">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-gray-400 text-xs">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-gray-400 text-xs">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;