import React, { useState } from 'react';
import { FaFacebookF, FaTwitter, FaYoutube, FaSearch, FaTimes, FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const navLinks = [
  { name: 'Headlines', path: '/headlines' },
  { name: 'Breaking', path: '/breaking' },
  { name: 'Entertainment', path: '/entertainment' },
  { name: 'Business', path: '/business' },
  { name: 'World', path: '/world' },
  { name: 'Programs', path: '/programs' },
  { name: 'Contact Us', path: '/contact-us' },
  { name: 'Live Cricket', path: '/live-cricket-score' },
  { name: 'Live TV', path: '/live-tv' },
  { name: 'Admin login', path: '/admin/login' }
];

const Header = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <header className="bg-[#dd3333] text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-[1300px] mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <img
            className="h-16"
            src="https://abbtakk.tv/wp-content/uploads/2023/06/abbtakknew1.png"
            alt="AbbTakk"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 font-semibold">
          {navLinks.map((link, idx) => (
            <Link key={idx} to={link.path} className="hover:text-black transition">
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Icons */}
        <div className="flex items-center space-x-4">
          <a href="https://www.facebook.com/AbbTakkTWM" target="_blank" rel="noopener noreferrer">
            <FaFacebookF className="hover:text-blue-500 cursor-pointer" />
          </a>
          <a href="https://x.com/AbbTakk" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="hover:text-blue-400 cursor-pointer" />
          </a>
          <a href="https://www.youtube.com/@Abbtak" target="_blank" rel="noopener noreferrer">
            <FaYoutube className="hover:text-red-600 cursor-pointer" />
          </a>
          <FaSearch
            className="hover:text-gray-300 cursor-pointer"
            onClick={() => setShowSearch(!showSearch)}
          />
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            {mobileMenu ? (
              <FaTimes className="text-xl cursor-pointer" onClick={() => setMobileMenu(false)} />
            ) : (
              <FaBars className="text-xl cursor-pointer" onClick={() => setMobileMenu(true)} />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="md:hidden px-4 pb-4 bg-[#c72f2f]">
          <nav className="flex flex-col space-y-3 font-semibold">
            {navLinks.map((link, idx) => (
              <Link
                key={idx}
                to={link.path}
                className="hover:text-black transition"
                onClick={() => setMobileMenu(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Search Bar */}
      {showSearch && (
        <div className="bg-[#222] px-4 py-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search news..."
              className="w-full bg-[#111] text-white p-2 rounded-md outline-none"
            />
            <FaTimes
              className="absolute right-3 top-3 text-white cursor-pointer"
              onClick={() => setShowSearch(false)}
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
