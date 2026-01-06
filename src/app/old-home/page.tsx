'use client'

import React from 'react'
import Link from 'next/link'
import { Toaster } from 'react-hot-toast'
import HeroSection from '@/components/landing/HeroSection'
import NewSection from '@/components/landing/NewSection'
import CTASection from '@/components/landing/CTASection'
import Footer from '@/components/landing/Footer'
import Navbar from '@/components/landing/Navbar'

export default function OldLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-right" />
      <Navbar />
      <main className="pt-16">

                <HeroSection />
                <NewSection />
                <CTASection />
      </main>
      <Footer />
    </div>
  )
}










