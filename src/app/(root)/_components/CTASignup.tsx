"use client";

import { motion } from "framer-motion";
import { FaUserShield, FaDownload, FaAndroid, FaApple, FaGavel, FaPen } from "react-icons/fa";

const CTASignup = () => {
  return (
    <section className="py-20 bg-black overflow-hidden relative">
      {/* Abstract background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-purple-600 rounded-full blur-[100px]"></div>
      </div>

      {/* Optional decorative pattern */}
      <div className="absolute inset-0 bg-[url('/pattern-grid.svg')] bg-repeat opacity-5"></div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left side - Text content */}
          <motion.div
            className="w-full lg:w-3/5 text-center lg:text-left"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Become A <span className="text-blue-400">Nigheban</span> To
              Make Pakistan Safer
            </h2>

            <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-2xl">
            Report a crime you witnessed or experienced — your voice could save a life.
            </p>

            <div className="flex flex-wrap gap-4 mb-10 justify-center lg:justify-start">
              <motion.div
                className="flex items-center gap-3 border border-white/10 rounded-lg px-5 py-3 bg-white/5 backdrop-blur-sm"
                whileHover={{ scale: 1.03, y: -3 }}
              >
                <FaUserShield size={24} className="text-blue-400" />
                <div className="text-left">
                  <p className="text-white text-sm font-medium">
                    Anonymous Reports
                  </p>
                  <p className="text-xs text-gray-400">Safe & Secure</p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center gap-3 border border-white/10 rounded-lg px-5 py-3 bg-white/5 backdrop-blur-sm"
                whileHover={{ scale: 1.03, y: -3 }}
              >
                <FaUserShield size={24} className="text-purple-400" />
                <div className="text-left">
                  <p className="text-white text-sm font-medium">
                    Real-time Alerts
                  </p>
                  <p className="text-xs text-gray-400">Stay Informed</p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center gap-3 border border-white/10 rounded-lg px-5 py-3 bg-white/5 backdrop-blur-sm"
                whileHover={{ scale: 1.03, y: -3 }}
              >
                <FaUserShield size={24} className="text-green-400" />
                <div className="text-left">
                  <p className="text-white text-sm font-medium">
                    Community Support
                  </p>
                  <p className="text-xs text-gray-400">
                    {"Together We're Stronger"}
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <motion.a
                href="#download-android"
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-4 px-6 rounded-lg font-medium shadow-lg shadow-blue-500/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaPen size={20} />
                <span>Report Crime</span>
              </motion.a>

              <motion.a
                href="#download-ios"
                className="flex items-center gap-2 bg-black border border-white/20 text-white py-4 px-6 rounded-lg font-medium shadow-lg"
                whileHover={{
                  scale: 1.05,
                  borderColor: "rgba(255, 255, 255, 0.4)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                <FaGavel size={20} />
                <span>Book a lawyer</span>
              </motion.a>
            </div>
          </motion.div>

          {/* Right side - App mockup */}
          <motion.div
            className="w-full lg:w-2/5"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              {/* Phone mockup */}
              <div className="relative z-20 mx-auto max-w-xs">
                <div className="bg-black rounded-[3rem] p-3 border border-gray-800 shadow-2xl">
                  
                  <div className="rounded-[2.5rem] overflow-hidden bg-gradient-to-b from-blue-900 to-black aspect-[9/19] relative">
                   
                    <div className="absolute inset-0 flex flex-col">
                      <div className="h-1/5 bg-blue-900 flex items-center justify-center">
                        <div className="w-12 h-1 bg-white rounded-full"></div>
                      </div>
                      <div className="flex-1 flex flex-col p-4">
                        <div className="w-full h-8 bg-white/10 rounded-lg mb-3"></div>
                        <div className="w-3/4 h-8 bg-white/10 rounded-lg mb-6"></div>
                        <div className="flex-1 bg-white/5 rounded-lg"></div>
                      </div>
                      <div className="h-16 bg-black/40 backdrop-blur-sm flex items-center justify-around px-6">
                        <div className="w-10 h-10 rounded-full bg-white/10"></div>
                        <div className="w-10 h-10 rounded-full bg-blue-500"></div>
                        <div className="w-10 h-10 rounded-full bg-white/10"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Download indicator animation */}
                <motion.div
                  className="absolute -top-12 right-0 bg-blue-500 text-white p-3 rounded-full shadow-lg shadow-blue-500/30"
                  animate={{
                    y: [0, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  <FaDownload size={24} />
                </motion.div>
              </div>

              {/* Background glow effect */}
              <div className="absolute top-1/4 left-1/4 w-full h-full bg-blue-500 filter blur-[80px] opacity-30 rounded-full -z-10"></div>
            </div>

            {/* Stats under phone */}
            <motion.div
              className="flex justify-center gap-6 mt-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              viewport={{ once: true }}
            >
             <div className="text-center">
  <p className="text-blue-400 text-3xl font-bold">Report</p>
  <p className="text-gray-400 text-sm">Your identity stays protected</p>
</div>
<div className="text-center">
  <p className="text-purple-400 text-3xl font-bold">Empower</p>
  <p className="text-gray-400 text-sm">Be the voice against injustice</p>
</div>
<div className="text-center">
  <p className="text-green-400 text-3xl font-bold"> Alerts</p>
  <p className="text-gray-400 text-sm">Stay informed. Stay safe.</p>
</div>

            </motion.div>
          </motion.div>
        </div>

        {/* Social proof */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-400 mb-6">
            Trusted by communities across Pakistan
          </p>
          <div className="flex flex-wrap justify-center gap-8 opacity-70">
            {/* Replace with actual city/region icons or names */}
            <p className="text-gray-300">Lahore</p>
            <p className="text-gray-300">Karachi</p>
            <p className="text-gray-300">Islamabad</p>
            <p className="text-gray-300">Peshawar</p>
            <p className="text-gray-300">Quetta</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASignup;
