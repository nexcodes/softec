"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaShieldAlt, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaTag, FaCamera, FaEye, FaComment, FaThumbsUp, FaExclamationTriangle, FaUserCircle, FaFilter, FaSearch } from "react-icons/fa";

// Define types for crime reports
type ReportStatus = "pending" | "investigating" | "resolved";

type CrimeReport = {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  date: string;
  time: string;
  image?: string;
  status: ReportStatus;
  authorName: string;
  authorImage?: string;
  comments: number;
  views: number;
  votes: number;
  userVoted: boolean;
};

// Categories for filtering
const categories = [
  "All Categories",
  "Theft",
  "Assault",
  "Suspicious Activity",
  "Vandalism",
  "Burglary",
  "Fraud",
  "Harassment",
  "Traffic Violation",
  "Drug Activity",
  "Other"
];

// Sample data for display
const sampleReports: CrimeReport[] = [
  {
    id: "1",
    title: "Phone Snatching at Liberty Market",
    description: "Two individuals on a motorcycle snatched my phone while I was talking on it near Liberty Market entrance. They were wearing black jackets and helmets. The motorcycle had no number plate.",
    location: "Liberty Market, Lahore",
    category: "Theft",
    date: "2025-04-22",
    time: "18:45",
    image: "/incident1.jpg",
    status: "investigating",
    authorName: "Ahmed Khan",
    authorImage: "/user1.jpg",
    comments: 8,
    views: 124,
    votes: 45,
    userVoted: true
  },
  {
    id: "2",
    title: "Car Break-in at F-10 Markaz Parking",
    description: "My car window was smashed and laptop stolen from the back seat while parked at F-10 Markaz parking area. The incident occurred during evening hours. Security cameras might have captured the incident.",
    location: "F-10 Markaz Parking, Islamabad",
    category: "Burglary",
    date: "2025-04-21",
    time: "20:15",
    image: "/incident2.jpg",
    status: "pending",
    authorName: "Sarah Khan",
    authorImage: "/user2.jpg",
    comments: 12,
    views: 97,
    votes: 28,
    userVoted: false
  },
  {
    id: "3",
    title: "Suspicious Activity Near School",
    description: "A suspicious person was seen taking pictures of children outside the school premises. The individual was driving a white Suzuki Alto with tinted windows. Parents should be cautious during pickup times.",
    location: "Beaconhouse School System, DHA Phase 5, Karachi",
    category: "Suspicious Activity",
    date: "2025-04-20",
    time: "14:30",
    status: "investigating",
    authorName: "Fatima Rizvi",
    authorImage: "/user3.jpg",
    comments: 23,
    views: 245,
    votes: 64,
    userVoted: true
  },
  {
    id: "4",
    title: "ATM Skimming Device Found",
    description: "I noticed a suspicious device attached to the ATM at Habib Bank branch. It appeared to be a card skimmer. I immediately informed the bank security who removed it. Other users should check ATMs carefully.",
    location: "Habib Bank, G-9 Markaz, Islamabad",
    category: "Fraud",
    date: "2025-04-19",
    time: "10:20",
    image: "/incident4.jpg",
    status: "resolved",
    authorName: "Hassan Mehmood",
    authorImage: "/user4.jpg",
    comments: 16,
    views: 189,
    votes: 53,
    userVoted: false
  }
];

const CrimeReportPage = () => {
  const router = useRouter();
  const [reports, setReports] = useState<CrimeReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showReportForm, setShowReportForm] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("newest");

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    category: "Theft",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().split(" ")[0].slice(0, 5),
    image: null as File | null,
  });

  // Load reports on component mount
  useEffect(() => {
    // In a real app, this would be an API call
    setReports(sampleReports);
    setLoading(false);
  }, []);

  // Handle voting on reports
  const handleVote = (id: string) => {
    setReports(prevReports =>
      prevReports.map(report => {
        if (report.id === id) {
          return {
            ...report,
            votes: report.userVoted ? report.votes - 1 : report.votes + 1,
            userVoted: !report.userVoted
          };
        }
        return report;
      })
    );
  };

  // Filter and sort reports
  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === "All Categories" || 
      report.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch(sortBy) {
      case "newest":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "mostVoted":
        return b.votes - a.votes;
      case "mostViewed":
        return b.views - a.views;
      default:
        return 0;
    }
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a new report object
    const newReport: CrimeReport = {
      id: (reports.length + 1).toString(),
      title: formData.title,
      description: formData.description,
      location: formData.location,
      category: formData.category,
      date: formData.date,
      time: formData.time,
      // In a real app, you would upload the image and get a URL
      image: formData.image ? URL.createObjectURL(formData.image) : undefined,
      status: "pending",
      authorName: "You",  // In a real app, this would be the logged-in user
      comments: 0,
      views: 0,
      votes: 0,
      userVoted: false
    };
    
    // Add new report to the list
    setReports(prev => [newReport, ...prev]);
    
    // Reset form and hide it
    setFormData({
      title: "",
      description: "",
      location: "",
      category: "Theft",
      date: new Date().toISOString().split("T")[0],
      time: new Date().toTimeString().split(" ")[0].slice(0, 5),
      image: null,
    });
    setShowReportForm(false);
  };

  // Get status badge color
  const getStatusColor = (status: ReportStatus) => {
    switch(status) {
      case "pending": 
        return "bg-yellow-600";
      case "investigating": 
        return "bg-blue-600";
      case "resolved": 
        return "bg-green-600";
      default: 
        return "bg-gray-600";
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.9)),
              url('/report-hero.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-blue-600 rounded-full">
              <FaShieldAlt className="text-white text-2xl" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Community Crime Reports</h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Report incidents and stay informed about safety concerns in your area. Together, we can create safer communities.
            </p>
            
            <button
              onClick={() => setShowReportForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 rounded-lg transition-colors shadow-lg"
            >
              Report an Incident
            </button>
          </motion.div>
        </div>
      </section>

      {/* Report Form Modal */}
      {showReportForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black bg-opacity-75">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Report an Incident</h2>
              <button 
                className="text-gray-400 hover:text-white"
                onClick={() => setShowReportForm(false)}
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Report Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief title of the incident"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                  placeholder="Please provide details about what happened..."
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Where did this occur?"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {categories.filter(cat => cat !== "All Categories").map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Upload Image (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="image-upload"
                    name="image"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label 
                    htmlFor="image-upload"
                    className="cursor-pointer"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <FaCamera className="text-blue-400 text-3xl mb-2" />
                      <p className="text-gray-400 mb-1">Click to upload an image</p>
                      <p className="text-gray-500 text-sm">PNG, JPG, or JPEG (max. 5MB)</p>
                    </div>
                  </label>
                  {formData.image && (
                    <div className="mt-4">
                      <p className="text-green-400">Image selected: {formData.image.name}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowReportForm(false)}
                  className="text-gray-300 hover:text-white px-6 py-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Reports Section */}
      <section className="py-16 px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-800/50 rounded-xl p-6 mb-8 border border-gray-700">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Search Bar */}
              <div className="flex-grow">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search reports..."
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              
              {/* Filter by Category */}
              <div className="w-full md:w-60">
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              
              {/* Sort By */}
              <div className="w-full md:w-60">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="mostVoted">Most Voted</option>
                  <option value="mostViewed">Most Viewed</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredReports.length > 0 ? (
            <div className="space-y-8">
              {filteredReports.map((report) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg"
                >
                  <div className="p-6">
                    {/* Report Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{report.title}</h3>
                        
                        <div className="flex items-center flex-wrap gap-2">
                          <span className={`${getStatusColor(report.status)} text-white text-xs px-2 py-1 rounded`}>
                            {report.status === "pending" ? "Pending" : 
                             report.status === "investigating" ? "Under Investigation" : 
                             "Resolved"}
                          </span>
                          
                          <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded flex items-center">
                            <FaTag className="mr-1" />
                            {report.category}
                          </span>
                          
                          <span className="text-gray-400 text-xs flex items-center">
                            <FaMapMarkerAlt className="mr-1" />
                            {report.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Report Image */}
                    {report.image && (
                      <div className="mb-4 cursor-pointer" onClick={() => report.image && setSelectedImage(report.image)}>
                        <div className="rounded-lg overflow-hidden border border-gray-700">
                          <img
                            src={report.image}
                            alt={report.title}
                            className="w-full h-64 object-cover"
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Report Description */}
                    <p className="text-gray-300 mb-4">{report.description}</p>
                    
                    {/* Report Footer */}
                    <div className="flex justify-between items-center mt-6">
                      <div className="flex items-center">
                        {report.authorImage ? (
                          <img 
                            src={report.authorImage} 
                            alt={report.authorName}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                        ) : (
                          <FaUserCircle className="w-8 h-8 text-gray-500 mr-2" />
                        )}
                        <span className="text-gray-400 text-sm">
                          {report.authorName}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-gray-400 text-sm space-x-4">
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-1" />
                          {report.date}
                        </div>
                        <div className="flex items-center">
                          <FaClock className="mr-1" />
                          {report.time}
                        </div>
                      </div>
                    </div>
                    
                    {/* Report Actions */}
                    <div className="border-t border-gray-700 mt-4 pt-4 flex justify-between">
                      <div className="flex space-x-6">
                        <button 
                          className={`flex items-center ${report.userVoted ? 'text-blue-400' : 'text-gray-400'} hover:text-blue-400 transition-colors`}
                          onClick={() => handleVote(report.id)}
                        >
                          <FaThumbsUp className="mr-2" />
                          <span>{report.votes}</span>
                        </button>
                        
                        <div className="flex items-center text-gray-400">
                          <FaComment className="mr-2" />
                          <span>{report.comments}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-400">
                          <FaEye className="mr-2" />
                          <span>{report.views}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => router.push(`/report/${report.id}`)}
                        className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-800/30 rounded-xl border border-gray-700">
              <FaExclamationTriangle className="text-yellow-500 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No Reports Found</h3>
              <p className="text-gray-400 mb-6">No incident reports match your search criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All Categories");
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-90"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full">
            <button 
              className="absolute top-0 right-0 -mt-12 -mr-12 text-white text-3xl"
              onClick={() => setSelectedImage(null)}
            >
              &times;
            </button>
            <img
              src={selectedImage}
              alt="Incident Image"
              className="max-w-full max-h-[80vh] mx-auto"
            />
          </div>
        </div>
      )}

      {/* Safety Tips Section */}
      <section className="py-12 px-6 bg-gray-800/50 border-t border-gray-700">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Safety Tips</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <h3 className="text-lg font-semibold mb-3">Reporting Best Practices</h3>
              <ul className="text-gray-300 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  Include specific details like time, location, and descriptions
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  Report incidents as soon as possible while memory is fresh
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  Include photos when available and safe to capture
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <h3 className="text-lg font-semibold mb-3">Personal Safety</h3>
              <ul className="text-gray-300 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  Stay aware of your surroundings, especially at night
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  Keep valuables out of sight in public places
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  Travel in groups when possible in unfamiliar areas
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <h3 className="text-lg font-semibold mb-3">Community Vigilance</h3>
              <ul className="text-gray-300 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  Look out for your neighbors and their property
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  Report suspicious activities to local authorities
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  Join neighborhood watch groups to stay informed
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CrimeReportPage;