"use client";

import {
  FaLock,
  FaMapMarkerAlt,
  FaComments,
  FaGavel,
  FaUser,
  FaChartLine,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import "@/app/(root)/_styles/feature-cards.css"; // Make sure to create this file

const features = [
  {
    title: "Anonymous Reporting",
    icon: <FaLock size={28} />,
    description:
      "Report incidents without revealing your identity, promoting safety and trust.",
    background: "/image2.jpg",
    color: "from-blue-500/80",
  },
  {
    title: "Geo Crime Mapping",
    icon: <FaMapMarkerAlt size={28} />,
    description:
      "Visualize reported issues on an interactive map to identify high-risk zones.",
    background: "/image3.jpg",
    color: "from-green-400/80",
  },
  {
    title: "Live Community Chat",
    icon: <FaComments size={28} />,
    description:
      "Stay updated and connected with your community through real-time discussions.",
    background: "/image4.jpg",
    color: "from-purple-400/80",
  },
  {
    title: "Book a Lawyer",
    icon: <FaGavel size={28} />,
    description:
      "Easily book verified lawyers for immediate legal support in your area.",
    background: "/image5.jpg",
    color: "from-red-400/80",
  },
  {
    title: "Available Communites",
    icon: <FaUser size={28} />,
    description:
      "Explore active communities in your area and connect with those making a difference.",
    background: "/image7.jpg",
    color: "from-yellow-400/80",
  },
  {
    title: "Crime Analytics",
    icon: <FaChartLine size={28} />,
    description:
      "Uncover crime trends with powerful data analytics and numerical insights.",
    background: "/image6.jpg",
    color: "from-blue-900/80",
  },
];

const FeatureCards = () => {
  const [isClient, setIsClient] = useState(false);

  // Use this to ensure animations only run on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section className="bg-black py-20 px-6 relative">
      <div className="absolute top-50 left-0 w-50 h-50 bg-blue-400 rounded-full blur-[100px]"></div>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-16 text-center opacity-100 transition-opacity duration-700 ease-in-out">
          Empowering Communities Through Technology
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`feature-card relative h-96 rounded-xl overflow-hidden shadow-xl group hover:-translate-y-2 transition-all duration-500 ease-out ${
                isClient ? "animate-fadeInUp" : ""
              }`}
              style={{
                animationDelay: `${index * 0.2}s`,
              }}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 z-0 scale-105 group-hover:scale-110 transition-transform duration-1000 ease-out"
                style={{
                  backgroundImage: `url(${feature.background})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />

              {/* Gradient Overlay with unique color per card */}
              <div
                className={`absolute inset-0 bg-gradient-to-t ${feature.color} to-black/90 opacity-80 group-hover:opacity-75 transition-opacity duration-500`}
              />

              {/* Icon with Animation */}
              <div
                className={`feature-icon absolute top-6 right-6 text-white z-10 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 ${
                  isClient ? "animate-iconIn" : ""
                }`}
                style={{
                  animationDelay: `${index * 0.2 + 0.3}s`,
                }}
              >
                {feature.icon}
              </div>

              {/* Content */}
              <div
                className={`feature-content absolute inset-0 flex flex-col justify-end p-8 z-10 ${
                  isClient ? "animate-contentIn" : ""
                }`}
                style={{
                  animationDelay: `${index * 0.2 + 0.5}s`,
                }}
              >
                {/* Title with animated underline */}
                <div className="relative">
                  <h3
                    className={`feature-title text-2xl font-semibold text-white mb-3 ${
                      isClient ? "animate-slideInRight" : ""
                    }`}
                    style={{
                      animationDelay: `${index * 0.2 + 0.7}s`,
                    }}
                  >
                    {feature.title}
                  </h3>
                  <div
                    className={`feature-underline h-1 bg-white ${
                      isClient ? "animate-expandWidth" : ""
                    }`}
                    style={{
                      animationDelay: `${index * 0.2 + 0.9}s`,
                    }}
                  />
                </div>

                {/* Description with word animation */}
                <p
                  className={`feature-description text-gray-100 mt-4 font-light leading-relaxed ${
                    isClient ? "animate-fadeIn" : ""
                  }`}
                  style={{
                    animationDelay: `${index * 0.2 + 1.1}s`,
                  }}
                >
                  {feature.description}
                </p>

                {/* Learn More Button */}
                <div
                  className={`feature-button mt-6 ${
                    isClient ? "animate-fadeIn" : ""
                  }`}
                  style={{
                    animationDelay: `${index * 0.2 + 1.3}s`,
                  }}
                >
                  <button className="text-white text-sm border-b border-white/50 pb-1 hover:border-white transition-all hover:translate-x-1">
                    Learn more
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
