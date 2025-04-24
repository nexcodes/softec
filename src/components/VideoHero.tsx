"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// Array of video sources
const videos = [
  "/hero_1.mp4",
  "/hero_2.mp4",
  "/hero_3.mp4",
  "/hero_4.mp4",
  "/hero_5.mp4",
  "/hero_6.mp4",
  "/hero_7.mp4",
  "/hero_8.mp4",
  "/hero_9.mp4",
];

const VideoHero: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const gridItemVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: 0 },
    visible: (custom: number) => ({
      opacity: 1,
      scale: 1,
      rotate: custom % 2 === 0 ? 5 : -5,
      transition: {
        delay: custom * 0.1,
        duration: 0.8,
        ease: "easeInOut",
      },
    }),
    hover: {
      scale: 1.1,
      rotate: 0,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
  };

  return (
    <section className="relative min-h-[90vh] w-full overflow-hidden bg-black">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{
          backgroundImage: "url('/image.jpg')",
        }}
      ></div>

      {/* Header */}
      <header className="bg-transparent text-white p-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Nigheban.pk Logo"
                width={40}
                height={40}
                className="mr-2"
              />
              <span className="text-2xl font-bold">Nigheban.pk</span>
            </Link>
          </div>
          <nav>
            <ul className="flex space-x-10">
              <li><Link href="/" className="hover:text-blue-300 transition-colors">Home</Link></li>
              <li><Link href="/report" className="hover:text-blue-300 transition-colors">Report</Link></li>
              <li><Link href="/report" className="hover:text-blue-300 transition-colors">Consultency</Link></li>
              <li><Link href="/about" className="hover:text-blue-300 transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-blue-300 transition-colors">Contact</Link></li>
              <li><Link href="/report" className="hover:text-blue-300 transition-colors">Explore</Link></li>
              <button className="bg-blue-600 text-white px-2 py-0.5 rounded hover:bg-blue-800 transition-colors border-black">
                <Link href="/login" className="hover:text-gray-200 transition-colors">Log in</Link>
              </button>
            </ul>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-8">
          {/* Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-2/5 text-left text-white z-10"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Safer Communities
              <br />
              <span className="text-gray-400">starts with </span>
              <span className="text-blue-500">You</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-xl mb-8">
              Join us in creating a safer and more secure future. Take action today!
            </p>
            <Link
              href="/report"
              className="inline-block bg-blue-600 text-white font-medium px-6 py-3 rounded hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
          </motion.div>

          {/* Right Side - Only Rendered on Client */}
          {isClient && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="w-full md:w-3/5"
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                {videos.map((videoSrc, index) => (
                  <motion.div
                    key={`${videoSrc}-${index}`}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    variants={gridItemVariants}
                    className="relative overflow-hidden rounded-lg border-2 border-gray-900 hover:border-blue-500 transition duration-300"
                    style={{ aspectRatio: "16/9" }}
                  >
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover opacity-75 hover:opacity-100 transform duration-300"
                    >
                      <source src={videoSrc} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default VideoHero;
