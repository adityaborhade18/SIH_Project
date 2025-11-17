import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const CivicIssueSystem = () => {
  const navigate = useNavigate();
  
  // Enhanced civic issues data
  const civicIssues = [
    {
      id: 1,
      title: "Road Maintenance",
      description: "Report potholes, road damage, and traffic hazards for safer commutes",
      image: "https://images.unsplash.com/photo-1542224566-6e85f2eaf2e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      icon: "🛣️",
      color: "from-orange-500 to-red-500"
    },
    {
      id: 2,
      title: "Public Sanitation",
      description: "Report garbage accumulation, blocked drains, and sanitation concerns",
      image: "https://images.unsplash.com/photo-1558640476-437a2e9b7a69?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      icon: "🧹",
      color: "from-green-500 to-teal-500"
    },
    {
      id: 3,
      title: "Street Lighting",
      description: "Report malfunctioning street lights and poorly lit areas for public safety",
      image: "https://images.unsplash.com/photo-1516937941344-00b4e0337589?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      icon: "💡",
      color: "from-yellow-500 to-amber-500"
    },  
    {
      id: 4,
      title: "Public Parks",
      description: "Report maintenance issues with parks, playgrounds, and green spaces",
      image: "https://images.unsplash.com/photo-1573164713714-d95e436ab994?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      icon: "🌳",
      color: "from-emerald-500 to-green-600"
    },
    {
      id: 5,
      title: "Water Supply",
      description: "Report water leakage, contamination, and supply disruptions",
      image: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      icon: "💧",
      color: "from-blue-500 to-cyan-500"
    }
  ];

  const stats = [
    { number: "10K+", label: "Issues Resolved" },
    { number: "50+", label: "Active Communities" },
    { number: "24h", label: "Average Response Time" },
    { number: "95%", label: "Satisfaction Rate" }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  const handleNextSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % civicIssues.length);
      setIsTransitioning(false);
    }, 500);
  };

  const handlePrevSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + civicIssues.length) % civicIssues.length);
      setIsTransitioning(false);
    }, 500);
  };

  const goToSlide = (index) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Enhanced Header */}
      

      {/* Enhanced Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          {civicIssues.map((issue, index) => (
            <div
              key={issue.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
              }`}
            >
              <div
                className="w-full h-full bg-cover bg-center transform scale-105"
                style={{ backgroundImage: `url(${issue.image})` }}
              ></div>
              <div className={`absolute inset-0 bg-gradient-to-r ${issue.color} bg-opacity-80`}></div>
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white max-w-6xl mx-auto px-6">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <span className="text-sm font-medium">Connecting Communities, Resolving Issues</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Your Voice
            <span className="block bg-gradient-to-r from-yellow-300 to-green-300 bg-clip-text text-transparent">
              Matters Here
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            CivicConnect bridges the gap between citizens and local authorities, 
            making community improvement collaborative and efficient.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button onClick={()=>navigate('/report-issue')} className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:shadow-2xl transition-all transform hover:scale-105">
              Report an Issue Now
            </button>
            <button className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all">
              Learn More
            </button>
          </div>
        </div>

        {/* Enhanced Slide Controls */}
        <button
          onClick={handlePrevSlide}
          className="absolute left-6 z-10 p-4 rounded-2xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all hover:scale-110"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={handleNextSlide}
          className="absolute right-6 z-10 p-4 rounded-2xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all hover:scale-110"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Enhanced Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex space-x-3">
          {civicIssues.map((issue, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full backdrop-blur-sm transition-all ${
                index === currentSlide ? 'bg-white text-gray-900' : 'bg-white/20 text-white'
              }`}
            >
              <span className="text-lg">{issue.icon}</span>
              <span className={`font-medium transition-all ${
                index === currentSlide ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'
              }`}>
                {issue.title}
              </span>
            </button>
          ))}
        </div>
      </section>


     

      {/* Enhanced How It Works Section */}
<section id="how-it-works" className="py-20 bg-gradient-to-br from-gray-50 to-white">
  <div className="container mx-auto px-6">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">
        Efficient Issue Resolution Workflow
      </h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        Leveraging technology to streamline community problem-solving with accountability and transparency at every stage
      </p>
    </div>

    <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
      {[
        {
          icon: "📍",
          title: "Pinpoint Location",
          description: "Use our interactive map to precisely mark issue locations with GPS accuracy"
        },
        {
          icon: "📸",
          title: "Visual Documentation",
          description: "Upload photos and detailed descriptions for clear communication"
        },
        {
          icon: "🚀",
          title: "Smart Distribution",
          description: "AI-powered system routes issues to appropriate municipal departments"
        },
        {
          icon: "📈",
          title: "Progress Monitoring",
          description: "Track resolution status with real-time updates and timelines"
        }
      ].map((feature, index) => (
        <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
            <span className="text-2xl">{feature.icon}</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 text-center mb-4">
            {feature.title}
          </h3>
          <p className="text-gray-600 text-center leading-relaxed">
            {feature.description}
          </p>
        </div>
      ))}
    </div>

  
  </div>
</section>
    

     
    </div>
  );
};

export default CivicIssueSystem;