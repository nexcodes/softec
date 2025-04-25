"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

const logos = [
  { id: 1, src: "/logo1.png", alt: "Punjab Police" },
  { id: 2, src: "/logo2.png", alt: "FIA Cyber Crime" },
  { id: 3, src: "/logo3.png", alt: "HRCP" },
  { id: 4, src: "/logo4.png", alt: "Rescue 1122" },
  { id: 5, src: "/logo5.png", alt: "Aurat Foundation" },
  { id: 6, src: "/logo6.png", alt: "Shehri CBE" },
  { id: 7, src: "/logo7.png", alt: "CyberSafe Pakistan" },
  { id: 8, src: "/logo8.png", alt: "Law Society" },
  { id: 9, src: "/logo9.png", alt: "Community Watch Lahore" },
  { id: 10, src: "/logo10.png", alt: "Supreme Court" },
];

const allLogos = [...logos, ...logos];

const LogoCarousel = () => {
  const carouselRef = useRef(null);

  return (
    <section className="py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-white mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Partnered with Trusted Institutions
        </motion.h2>

        {/* Top Scroll Row */}
        <div className="relative mb-12" ref={carouselRef}>
          <motion.div
            className="flex gap-2 items-center"
            animate={{ x: ["0%", "-100%"] }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {allLogos.map((logo, index) => (
              <motion.div
                key={`top-${logo.id}-${index}`}
                className="flex-shrink-0 h-32 w-48 rounded-xl relative flex items-center justify-center p-4"
                whileHover={{
                  y: -6,
                  scale: 1.05,
                }}
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  fill
                  className="max-h-full max-w-full object-contain bg-transparent"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom Scroll Row (Reverse Direction) */}

        <div className="relative">
          <motion.div
            className="flex gap-2 items-center"
            animate={{ x: ["-100%", "0%"] }}
            transition={{
              duration: 50,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {allLogos.map((logo, index) => (
              <motion.div
                key={`bottom-${logo.id}-${index}`}
                className="flex-shrink-0 h-32 w-48 rounded-xl relative  flex items-center justify-center p-4"
                whileHover={{
                  y: -6,
                  scale: 1.05,
                }}
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  fill
                  className="max-h-full max-w-full object-contain 
"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.p
          className="text-gray-400 text-center mt-16 text-base max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Building a safer Pakistan with the help of leading institutions and
          legal support communities.
        </motion.p>
      </div>
    </section>
  );
};

export default LogoCarousel;