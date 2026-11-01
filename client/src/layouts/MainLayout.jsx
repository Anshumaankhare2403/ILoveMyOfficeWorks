import React from 'react';
import { AnimatePresence } from 'framer-motion';
import DesktopTitleBar from './DesktopTitleBar';
import Navbar from './Navbar';
import Footer from './Footer';
import SplashScreen from '../components/common/SplashScreen';
import ThreeCanvas from '../components/common/ThreeCanvas';

/**
 * Main Layout Shell for the ILoveMyOfficeWorks web and desktop client
 */
export default function MainLayout({
  children,
  showSplash,
  onSplashComplete,
  activeTab,
  onTabChange,
  fileCounts = {},
  onShowSplash,
}) {
  return (
    <div className="relative min-h-screen bg-[#FAF8F4] text-[#262D20] flex flex-col selection:bg-[#5B7147] selection:text-white font-sans overflow-x-hidden">
      {/* Desktop Native Title Bar for Electron Windows App */}
      <DesktopTitleBar />

      {/* Splash Screen on Initial Load */}
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onComplete={onSplashComplete} />
        )}
      </AnimatePresence>

      {/* Interactive 3D Ambient Canvas Background */}
      <ThreeCanvas />

      {/* Top Header / Navigation Bar with Section Dropdowns */}
      <Navbar
        activeTab={activeTab}
        onTabChange={onTabChange}
        fileCounts={fileCounts}
        onShowSplash={onShowSplash}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <Footer onShowSplash={onShowSplash} />
    </div>
  );
}
