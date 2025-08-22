"use client"

import { useState } from "react"
import Link from "next/link"

export function Navbar() {
  const navItems = ["Home", "Find Jobs", "Find Talents", "About us", "Testimonials"]
  const [hover, setHover] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <nav
        className="
          fixed top-[21px] left-1/2 -translate-x-1/2
          w-[890px] max-w-[calc(100vw-40px)] h-[80px]
          rounded-[122px] border border-[#FCFCFC] bg-white
          shadow-[0_0_20px_rgba(127,127,127,0.15)]
          z-[1000]
          flex items-center justify-between px-4 md:px-6
        "
      >
        {/* Left: Logo */}
        <div className="flex items-center flex-shrink-0">
          <div className="w-12 h-12 grid place-items-center">
            <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
          </div>
        </div>

        {/* Center: Nav items */}
        <div className="hidden lg:flex items-center -ml-4">
          {navItems.map((item) => (
            <Link
              key={item}
              href="#"
              className="
                w-[120px] h-[48px]
                rounded-[12px]
                opacity-100
                px-[5px] py-[5px]
                flex items-center justify-center
                text-gray-900 font-medium text-md
                transition-all duration-200
                hover:translate-x-1 hover:shadow-lg hover:bg-white hover:text-gray-900
                active:translate-x-[2px] active:shadow-md
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50
              "
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Hamburger menu */}
        <div className="lg:hidden flex-1 flex justify-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Right: CTA */}
        <Link
          href="/jobs/create"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className={`
            relative overflow-hidden flex-shrink-0 mr-2
            ${hover ? "w-[130px] h-[40px] translate-x-1 shadow-lg" : "w-[130px] h-[38px]"}
            rounded-[20px]
            bg-gradient-to-b from-[#A128FF] to-[#6100AD]
            text-white font-semibold
            flex items-center justify-center
            transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-opacity-50
          `}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <span
              className={`
                absolute text-[14px] font-medium
                transition-transform duration-250 ease-in-out
                ${hover ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"}
              `}
            >
              Create Jobs
            </span>
            <span
              className={`
                absolute text-[16px] font-medium
                transition-transform duration-250 ease-in-out
                ${hover ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}
              `}
            >
              Login
            </span>
          </div>
        </Link>
      </nav>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-[110px] left-1/2 -translate-x-1/2 w-[calc(100vw-40px)] max-w-[890px] bg-white rounded-2xl border border-[#FCFCFC] shadow-[0_0_20px_rgba(127,127,127,0.15)] z-[999] p-4">
          {navItems.map((item) => (
            <Link
              key={item}
              href="#"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-left px-4 py-3 text-gray-900 font-medium text-sm hover:bg-gray-50 rounded-lg transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
