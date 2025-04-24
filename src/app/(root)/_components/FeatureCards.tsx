"use client";

import { FaLock, FaMapMarkerAlt, FaComments, FaGavel, FaUser, FaChartLine } from "react-icons/fa";

const features = [
  {
    title: "Anonymous Reporting",
    icon: <FaLock size={28} />,
    description: "Report incidents without revealing your identity, promoting safety and trust.",
    background: "/image2.jpg",
    color: "from-blue-500/80"
  },
  {
    title: "Geo Crime Mapping",
    icon: <FaMapMarkerAlt size={28} />,
    description: "Visualize reported issues on an interactive map to identify high-risk zones.",
    background: "/image3.jpg",
    color: "from-green-400/80"
  },
  {
    title: "Live Community Chat",
    icon: <FaComments size={28} />,
    description: "Stay updated and connected with your community through real-time discussions.",
    background: "/image4.jpg",
    color: "from-purple-400/80"
  },
  {
    title: "Book a Lawyer",
    icon: <FaGavel size={28} />,
    description: "Easily book verified lawyers for immediate legal support in your area.",
    background: "/image5.jpg",
    color: "from-red-400/80"
  },
  {
    title: "Available Communites",
    icon: <FaUser size={28} />,
    description: "Explore active communities in your area and connect with those making a difference.",
    background: "/image7.jpg",
    color: "from-yellow-400/80"
  },
  {
    title: "Crime Analytics",
    icon: <FaChartLine size={28} />,
    description: "Uncover crime trends with powerful data analytics and numerical insights.",
    background: "/image6.jpg",
    color: "from-blue-900/80"
  },
];

const FeatureCards = () => {
  return (
    <section className="py-20 px-6 relative">
   
    <div className="absolute top-50 left-0 w-50 h-50 bg-blue-400 rounded-full blur-[100px]"></div>
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-16 text-center opacity-100 transition-opacity duration-700 ease-in-out">
        Empowering Communities Through Technology
        
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative h-96 rounded-xl overflow-hidden shadow-xl opacity-0 translate-y-6 group hover:-translate-y-2 transition-all duration-500 ease-out"
              style={{
                animationName: 'fadeInUp',
                animationDuration: '0.7s',
                animationDelay: `${index * 0.2}s`,
                animationFillMode: 'forwards',
                animationTimingFunction: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
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
                className="absolute top-6 right-6 text-white z-10 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300"
                style={{
                  animationName: 'iconIn',
                  animationDuration: '0.5s',
                  animationDelay: `${index * 0.2 + 0.3}s`,
                  animationFillMode: 'forwards',
                  transform: 'scale(0) rotate(-20deg)'
                }}
              >
                {feature.icon}
              </div>

              {/* Content */}
              <div 
                className="absolute inset-0 flex flex-col justify-end p-8 z-10"
                style={{
                  animationName: 'contentIn',
                  animationDuration: '0.7s',
                  animationDelay: `${index * 0.2 + 0.5}s`,
                  animationFillMode: 'forwards',
                  opacity: 0,
                  transform: 'translateY(20px)'
                }}
              >
                {/* Title with animated underline */}
                <div className="relative">
                  <h3 
                    className="text-2xl font-semibold text-white mb-3"
                    style={{
                      animationName: 'slideInRight',
                      animationDuration: '0.5s',
                      animationDelay: `${index * 0.2 + 0.7}s`,
                      animationFillMode: 'forwards',
                      transform: 'translateX(-20px)'
                    }}
                  >
                    {feature.title}
                  </h3>
                  <div 
                    className="h-1 bg-white w-0"
                    style={{
                      animationName: 'expandWidth',
                      animationDuration: '0.6s',
                      animationDelay: `${index * 0.2 + 0.9}s`,
                      animationFillMode: 'forwards'
                    }}
                  />
                </div>

                {/* Description with word animation */}
                <p 
                  className="text-gray-100 mt-4 font-light leading-relaxed opacity-0"
                  style={{
                    animationName: 'fadeIn',
                    animationDuration: '0.8s',
                    animationDelay: `${index * 0.2 + 1.1}s`,
                    animationFillMode: 'forwards'
                  }}
                >
                  {feature.description}
                </p>

                {/* Learn More Button */}
                <div
                  className="mt-6 opacity-0"
                  style={{
                    animationName: 'fadeIn',
                    animationDuration: '0.6s',
                    animationDelay: `${index * 0.2 + 1.3}s`,
                    animationFillMode: 'forwards'
                  }}
                >
                  <button
                    className="text-white text-sm border-b border-white/50 pb-1 hover:border-white transition-all hover:translate-x-1"
                  >
                    Learn more
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes iconIn {
          to {
            transform: scale(1) rotate(0deg);
          }
        }
        
        @keyframes contentIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInRight {
          to {
            transform: translateX(0);
          }
        }
        
        @keyframes expandWidth {
          to {
            width: 30%;
          }
        }
        
        @keyframes fadeIn {
          to {
            opacity: 0.9;
          }
        }
      `}</style>
    </section>
  );
};

export default FeatureCards;