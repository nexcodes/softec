"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaShieldAlt, FaUserTie, FaComment, FaSearch, FaStar, FaComments } from "react-icons/fa";
import Link from "next/link";

interface Lawyer {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  image: string;
  status: "online" | "offline";
  lastActive?: string;
}

const LawyerPortal = () => {
  const [activeTab, setActiveTab] = useState<"browse" | "register" | "chat">("browse");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<{ id: number; sender: "user" | "lawyer"; text: string; timestamp: string }[]>([]);

  // Sample lawyers data
  const lawyers: Lawyer[] = [
    {
      id: "1",
      name: "Sarah Ahmad",
      specialization: "Criminal Law",
      rating: 4.8,
      image: "/lawyer1.jpg",
      status: "online"
    },
    {
      id: "2",
      name: "Faisal Khan",
      specialization: "Corporate Law",
      rating: 4.5,
      image: "/lawyer2.jpg",
      status: "offline",
      lastActive: "2 hours ago"
    },
    {
      id: "3",
      name: "Amina Malik",
      specialization: "Family Law",
      rating: 4.9,
      image: "/lawyer3.jpg",
      status: "online"
    },
    {
      id: "4",
      name: "Usman Ali",
      specialization: "Property Law",
      rating: 4.6,
      image: "/lawyer4.jpg",
      status: "offline",
      lastActive: "1 day ago"
    },
  ];

  const filteredLawyers = lawyers.filter(lawyer => 
    lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    lawyer.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (message.trim() && selectedLawyer) {
      const newMessage = {
        id: chatMessages.length + 1,
        sender: "user" as const,
        text: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatMessages([...chatMessages, newMessage]);
      setMessage("");
      
      // Simulate lawyer response after a delay
      setTimeout(() => {
        const lawyerResponse = {
          id: chatMessages.length + 2,
          sender: "lawyer" as const,
          text: `Thank you for your message. How can I assist you with your legal matters related to ${selectedLawyer.specialization}?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prev => [...prev, lawyerResponse]);
      }, 2000);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Hero Section */}
      <motion.section 
        className="relative py-16 px-6 overflow-hidden"
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
              <FaUserTie className="text-white text-2xl" />
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-2"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Legal Connect
          </motion.h1>
          
          <motion.p
            className="text-lg md:text-xl text-blue-400 mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Get Professional Legal Advice
          </motion.p>
          
          <motion.p 
            className="text-xl text-gray-300 mb-8"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            Connect with verified lawyers or register as a legal professional
          </motion.p>
        </div>
      </motion.section>

      {/* Tabs */}
      <section className="py-6 px-6 bg-gray-800/80 backdrop-blur-md border-t border-gray-700">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center space-x-4 md:space-x-8">
            <motion.button
              whileHover={{ y: -3 }}
              whileTap={{ y: 0 }}
              className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors ${activeTab === "browse" ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white" : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"}`}
              onClick={() => setActiveTab("browse")}
            >
              <FaSearch /> Browse Lawyers
            </motion.button>
            <motion.button
              whileHover={{ y: -3 }}
              whileTap={{ y: 0 }}
              className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors ${activeTab === "register" ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white" : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"}`}
              onClick={() => setActiveTab("register")}
            >
              <FaUserTie /> Register as Lawyer
            </motion.button>
            <motion.button
              whileHover={{ y: -3 }}
              whileTap={{ y: 0 }}
              className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors ${activeTab === "chat" ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white" : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"}`}
              onClick={() => setActiveTab("chat")}
            >
              <FaComments /> My Chats
            </motion.button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Browse Lawyers Tab */}
          {activeTab === "browse" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-8">
                <div className="flex items-center bg-gray-800 rounded-lg p-2 max-w-xl mx-auto">
                  <FaSearch className="text-gray-400 ml-2 mr-3" />
                  <input
                    type="text"
                    placeholder="Search by name or specialization..."
                    className="bg-transparent w-full text-white border-none focus:outline-none focus:ring-0"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredLawyers.map((lawyer) => (
                  <motion.div
                    key={lawyer.id}
                    className="bg-gradient-to-b from-gray-800/80 to-gray-900/90 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-gray-700"
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    whileHover={{ 
                      y: -10, 
                      boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)",
                      transition: { duration: 0.4 } 
                    }}
                  >
                    {/* Top gradient bar */}
                    <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                    
                    <div className="p-6 flex flex-col items-center text-center">
                      {/* Status indicator */}
                      <div className="relative">
                        <motion.div 
                          className="w-28 h-28 rounded-full mb-6 relative"
                          whileHover={{ scale: 1.05 }}
                        >
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 blur-lg opacity-50"></div>
                          <div className="absolute inset-0 rounded-full overflow-hidden border-2 border-blue-500">
                            <img 
                              src={lawyer.image || "/placeholder-lawyer.jpg"} 
                              alt={lawyer.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </motion.div>
                        
                        <div className={`absolute bottom-6 right-0 w-5 h-5 rounded-full border-2 border-gray-800 ${lawyer.status === "online" ? "bg-green-500" : "bg-gray-500"}`}></div>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-white mb-1">{lawyer.name}</h3>
                      <p className="text-blue-400 font-medium mb-2">{lawyer.specialization}</p>
                      
                      <div className="flex items-center mb-4">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={`${i < Math.floor(lawyer.rating) ? "text-yellow-400" : "text-gray-600"} w-4 h-4`} />
                          ))}
                        </div>
                        <span className="ml-2 text-gray-300 text-sm">{lawyer.rating}</span>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-5">
                        {lawyer.status === "online" ? (
                          <span className="text-green-400">● Online now</span>
                        ) : (
                          <span className="text-gray-400">Last active {lawyer.lastActive}</span>
                        )}
                      </p>
                      
                      <motion.button
                        onClick={() => {
                          setSelectedLawyer(lawyer);
                          setActiveTab("chat");
                          setChatMessages([]);
                        }}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaComment /> Start Chat
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {filteredLawyers.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">No lawyers found matching your search.</p>
                </div>
              )}
            </motion.div>
          )}
          
          {/* Register Tab */}
          {activeTab === "register" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto bg-gradient-to-b from-gray-800/80 to-gray-900/90 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-gray-700 p-8"
            >
              <h2 className="text-2xl font-bold mb-6 text-center">Register as a Legal Professional</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">First Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Last Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
                  <input 
                    type="password" 
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="Create a secure password"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Specialization</label>
                  <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500">
                    <option value="">Select your specialization</option>
                    <option value="criminal">Criminal Law</option>
                    <option value="corporate">Corporate Law</option>
                    <option value="family">Family Law</option>
                    <option value="property">Property Law</option>
                    <option value="civil">Civil Law</option>
                    <option value="tax">Tax Law</option>
                    <option value="immigration">Immigration Law</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Bar Council Registration Number</label>
                  <input 
                    type="text" 
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="Enter your registration number"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Years of Experience</label>
                  <input 
                    type="number" 
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="Enter years of experience"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Profile Picture</label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col w-full h-32 border-2 border-dashed rounded-lg border-gray-600 hover:border-blue-500 hover:bg-gray-800/50 cursor-pointer">
                      <div className="flex flex-col items-center justify-center pt-7">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        <p className="pt-1 text-sm text-gray-400">Upload a profile picture</p>
                      </div>
                      <input type="file" className="opacity-0" />
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input id="terms" type="checkbox" className="h-4 w-4 text-blue-500 rounded border-gray-600 bg-gray-700 focus:ring-blue-500" />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
                    I agree to the <span className="text-blue-400 hover:underline cursor-pointer">Terms and Conditions</span>
                  </label>
                </div>
                
                <motion.button 
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Register as a Lawyer
                </motion.button>
              </div>
            </motion.div>
          )}
          
          {/* Chat Tab */}
          {activeTab === "chat" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {selectedLawyer ? (
                <div className="bg-gradient-to-b from-gray-800/80 to-gray-900/90 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-gray-700">
                  {/* Chat header */}
                  <div className="border-b border-gray-700 p-4 flex items-center">
                    <div className="relative mr-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500">
                        <img 
                          src={selectedLawyer.image || "/placeholder-lawyer.jpg"} 
                          alt={selectedLawyer.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-800 ${selectedLawyer.status === "online" ? "bg-green-500" : "bg-gray-500"}`}></div>
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{selectedLawyer.name}</h3>
                      <p className="text-sm text-blue-400">{selectedLawyer.specialization}</p>
                    </div>
                    <div className="ml-auto">
                      <motion.button
                        className="text-gray-400 hover:text-white"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedLawyer(null)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </motion.button>
                    </div>
                  </div>
                  
                  {/* Chat messages */}
                  <div className="h-96 overflow-y-auto p-4 space-y-4">
                    {chatMessages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="bg-blue-500/20 p-4 rounded-full mb-4">
                          <FaComment className="w-8 h-8 text-blue-400" />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">Start a conversation</h3>
                        <p className="text-gray-400">Send a message to {selectedLawyer.name} to get legal assistance</p>
                      </div>
                    ) : (
                      chatMessages.map((msg) => (
                        <div 
                          key={msg.id} 
                          className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div 
                            className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                              msg.sender === "user" 
                                ? "bg-blue-600 text-white" 
                                : "bg-gray-700 text-white"
                            }`}
                          >
                            <p>{msg.text}</p>
                            <p className={`text-xs mt-1 ${msg.sender === "user" ? "text-blue-200" : "text-gray-400"}`}>
                              {msg.timestamp}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Chat input */}
                  <div className="border-t border-gray-700 p-4">
                    <div className="flex">
                      <input
                        type="text"
                        placeholder="Type your message..."
                        className="flex-1 bg-gray-700 border border-gray-600 rounded-l-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      />
                      <motion.button
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 rounded-r-lg flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSendMessage}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                      </motion.button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-blue-500/20 p-4 rounded-full mb-4">
                    <FaComments className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2">No Active Conversations</h3>
                  <p className="text-gray-400 mb-6">Select a lawyer from the browse tab to start a conversation</p>
                  <motion.button
                    onClick={() => setActiveTab("browse")}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-6 rounded-lg flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaSearch /> Browse Lawyers
                  </motion.button>
                </div>
              )}
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
                <FaShieldAlt className="text-white text-2xl" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold mb-6">Get the Legal Help You Need</h2>
            <p className="text-gray-300 text-lg mb-8">
              Connect with experienced lawyers who can provide expert advice and guidance
              for all your legal matters. Professional help is just a message away.
            </p>
            
            <Link href="/browse" className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900">
              Find a Lawyer Now
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LawyerPortal;