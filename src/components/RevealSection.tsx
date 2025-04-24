"use client";

import { motion } from "framer-motion";
import { FaLock, FaMapMarkerAlt, FaComments } from "react-icons/fa";

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1.05,
    transition: {
      delay: i * 0.2,
      duration: 0.8,
      ease: "easeOut",
    },
  }),
};

const RevealSection = () => {
  const cards = [
    {
      title: "Anonymous Reporting",
      icon: <FaLock size={30} />,
      description: "Report incidents without revealing your identity, promoting safety and trust.",
    },
    {
      title: "Geo Crime Mapping",
      icon: <FaMapMarkerAlt size={30} />,
      description: "Visualize reported issues on an interactive map to identify high-risk zones.",
    },
    {
      title: "Live Community Chat",
      icon: <FaComments size={30} />,
      description: "Stay updated and connected with your community through real-time discussions.",
    },
  ];

  return (
    <section className="py-20 px-6 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <motion.h2
          className="text-4xl font-bold text-gray-00 dark:text-white mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
        >
          How Our Platform Empowers Communities
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 relative z-10">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              className="bg-white bg-opacity-90 backdrop-blur-md p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105"
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ amount: 0.3 }}
              custom={i}
            >
              <div className="mb-6 text-black">{card.icon}</div>
              <h3 className="text-2xl font-semibold text-black mb-3">{card.title}</h3>
              <p className="text-gray-700">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RevealSection;
