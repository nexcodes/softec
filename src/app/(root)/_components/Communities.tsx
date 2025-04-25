"use client";

import { motion } from "framer-motion";
import { FaShieldAlt, FaUsers, FaBullhorn, FaHandshake, FaMapMarkerAlt, FaSearch, FaPlus } from "react-icons/fa";
import { useState } from "react";
import Link from "next/link";

const communityCategories = [
  {
    id: "neighborhood",
    name: "Neighborhood Watch",
    icon: <FaUsers />,
    description: "Join local neighborhood watch groups to coordinate safety efforts"
  },
  {
    id: "emergency",
    name: "Emergency Response",
    icon: <FaShieldAlt />,
    description: "Connect with emergency response teams in your area"
  },
  {
    id: "awareness",
    name: "Safety Awareness",
    icon: <FaBullhorn />,
    description: "Groups focused on education and safety awareness campaigns"
  },
  {
    id: "collaborative",
    name: "Authority Collaboration",
    icon: <FaHandshake />,
    description: "Communities working directly with local authorities"
  }
];

const featuredCommunities = [
  {
    id: 1,
    name: "Karachi Citizens Safety Network",
    category: "neighborhood",
    members: 3245,
    location: "Karachi",
    verified: true,
    image: "/karachi.jpg"
  },
  {
    id: 2,
    name: "Lahore Safety Coalition",
    category: "collaborative",
    members: 2876,
    location: "Lahore",
    verified: true,
    image: "/lahore.jpg"
  },
  {
    id: 3,
    name: "Islamabad Neighborhood Watch",
    category: "neighborhood",
    members: 1982,
    location: "Islamabad",
    verified: true,
    image: "/Islamabad.jpg"
  },
  {
    id: 4,
    name: "Punjab Safety Awareness Group",
    category: "awareness",
    members: 4521,
    location: "Punjab",
    verified: true,
    image: "/punjab.jpg"
  },
  {
    id: 5,
    name: "Sindh Emergency Response Network",
    category: "emergency",
    members: 2130,
    location: "Sindh",
    verified: false,
    image: "/police.jpg"
  },
  {
    id: 6,
    name: "Peshawar Community Safety",
    category: "neighborhood",
    members: 1574,
    location: "Peshawar",
    verified: false,
    image: "/peshawar.jpg"
  }
];

const Communities = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  
  const filteredCommunities = featuredCommunities.filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          community.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || community.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Hero Section */}
      <motion.section 
        className="relative py-20 px-6 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.9)),
              linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)`,
            backgroundSize: "100%, 40px 40px, 40px 40px",
          }}
        />
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            className="flex justify-center mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-3">
              <FaUsers className="text-white text-2xl" />
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-2"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Safety Communities
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-300 mb-8"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            Connect with like-minded citizens committed to creating safer neighborhoods
          </motion.p>
          
          {/* Search Bar */}
          <motion.div
            className="max-w-lg mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search communities by name or location..."
                className="w-full bg-gray-800/50 backdrop-blur-md border border-gray-700 text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Categories Section */}
      <section className="py-12 px-6 bg-gray-900/90">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-2">Community Categories</h2>
            <p className="text-gray-400">Find the right community that matches your safety interests</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <motion.div
              className={`cursor-pointer rounded-lg p-4 border ${activeCategory === 'all' ? 'bg-blue-600/20 border-blue-500' : 'bg-gray-800/50 border-gray-700'} transition-all`}
              onClick={() => setActiveCategory('all')}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-center">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-2 mr-3">
                  <FaUsers className="text-white" />
                </div>
                <span className="font-medium">All Categories</span>
              </div>
            </motion.div>
            
            {communityCategories.map((category, index) => (
              <motion.div
                key={category.id}
                className={`cursor-pointer rounded-lg p-4 border ${activeCategory === category.id ? 'bg-blue-600/20 border-blue-500' : 'bg-gray-800/50 border-gray-700'} transition-all`}
                onClick={() => setActiveCategory(category.id)}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center justify-center">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-2 mr-3">
                    {category.icon}
                  </div>
                  <span className="font-medium">{category.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Communities List */}
      <section className="py-12 px-6 bg-gray-900/80 backdrop-blur-md border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold">
              {activeCategory === "all" 
                ? "Featured Communities" 
                : `${communityCategories.find(c => c.id === activeCategory)?.name || ''} Communities`}
            </h2>
            
            <Link href="/create-community" className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              <FaPlus className="mr-2" />
              Create Community
            </Link>
          </motion.div>
          
          {filteredCommunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCommunities.map((community, index) => (
                <motion.div
                  key={community.id}
                  className="bg-gradient-to-b from-gray-800/80 to-gray-900/90 backdrop-blur-md rounded-xl shadow-xl overflow-hidden border border-gray-700"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    y: -5, 
                    boxShadow: "0 20px 40px -12px rgba(59, 130, 246, 0.2)",
                    transition: { duration: 0.3 } 
                  }}
                >
                  {/* Community Header Image */}
                  <div className="h-40 overflow-hidden relative">
                    <img 
                      src={community.image || "/api/placeholder/400/200"} 
                      alt={community.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
                    
                    {/* Verified Badge if applicable */}
                    {community.verified && (
                      <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
                        <FaShieldAlt className="mr-1" />
                        Verified
                      </div>
                    )}
                    
                    {/* Location Badge */}
                    <div className="absolute bottom-3 left-3 bg-gray-900/80 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
                      <FaMapMarkerAlt className="mr-1" />
                      {community.location}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{community.name}</h3>
                    
                    <div className="flex items-center text-gray-400 text-sm mb-4">
                      <FaUsers className="mr-1" />
                      <span>{community.members.toLocaleString()} members</span>
                    </div>
                    
                    <div className="flex items-center mb-6">
                      <div className="bg-blue-600/20 text-blue-400 text-xs font-medium px-2 py-1 rounded">
                        {communityCategories.find(cat => cat.id === community.category)?.name}
                      </div>
                    </div>
                    
                    <Link 
                      href={`/communities/${community.id}`}
                      className="block text-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      Join Community
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              className="text-center py-16 bg-gray-800/50 rounded-lg border border-gray-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-4 text-gray-400">
                <FaSearch className="text-5xl mx-auto mb-4 opacity-50" />
                <p className="text-xl">No communities found matching your search</p>
                <p className="text-gray-500 mt-2">Try adjusting your search or category filter</p>
              </div>
              <button 
                onClick={() => {setSearchQuery(""); setActiveCategory("all");}} 
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Reset Filters
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-3">
                <FaHandshake className="text-white text-2xl" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold mb-6">Become a Community Leader</h2>
            <p className="text-gray-300 text-lg mb-8">
              Have a passion for safety in your area? Start your own community and invite neighbors,
              friends, and local authorities to join your safety initiative.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/create-community" className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                Create a Community
              </Link>
              <Link href="/community-guidelines" className="inline-block bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-8 rounded-lg transition-colors border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                Read Guidelines
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Communities;