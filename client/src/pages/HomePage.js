

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const CivicIssueSystem = () => {
  const navigate = useNavigate();
  // Civic issues data with images and descriptions
  const civicIssues = [
    {
      id: 1,
      title: "Road Maintenance",
      description: "Report potholes, road damage, and traffic hazards",
      image: "https://images.unsplash.com/flagged/photo-1572213426852-0e4ed8f41ff6?q=80&w=874&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      id: 2,
      title: "Public Sanitation",
      description: "Report garbage accumulation, blocked drains, and sanitation issues",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIW5n1WDGdiX_X3GMG7fm3oie70ojNaSd6ww&s"
    },
    {
      id: 3,
      title: "Street Lighting",
      description: "Report malfunctioning street lights and dark areas",
      image: "https://media.istockphoto.com/id/929942316/photo/old-highway-with-holes-and-snow-landscape-road-potholes-in-cloudy-winter-weather-concept.webp?a=1&b=1&s=612x612&w=0&k=20&c=MSPEPn_sV1Sr0zUtj5XzUNSeN5D4J8mc42xoWI01MgE="
    },  
    {
      id: 4,
      title: "Public Parks",
      description: "Report issues with public parks, playgrounds, and green spaces",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfChcPTW8stZT3PQm3_RQf-u4GZ8cm1mcfFQ&s"
    },
    {
      id: 5,
      title: "Water Supply",
      description: "Report water leakage, contamination, and supply issues",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsPLIoth3skIGorO0EncnEySNGEe84PAIunQ&s"
    }
  ];

  // State for current slide and animation
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      handleNextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  // Handle next slide with smooth transition
  const handleNextSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % civicIssues.length);
      setIsTransitioning(false);
    }, 500);
  };

  // Handle previous slide
  const handlePrevSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + civicIssues.length) % civicIssues.length);
      setIsTransitioning(false);
    }, 500);
  };

  // Go to specific slide
  const goToSlide = (index) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}


      {/* Hero Section with Slideshow */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Slideshow */}
        <div className="absolute inset-0 z-0">
          {civicIssues.map((issue, index) => (
            <div
              key={issue.id}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
            >
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${issue.image})` }}
              ></div>
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>
          ))}
        </div>

        {/* Slideshow Content */}
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up">
            Make Your Community Better
          </h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in-up animation-delay-200">
            {civicIssues[currentSlide].description}
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in-up animation-delay-400">
            
            
          </div>
        </div>

        {/* Slideshow Controls */}
        <button
          onClick={handlePrevSlide}
          className="absolute left-4 z-10 p-3 rounded-full bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={handleNextSlide}
          className="absolute right-4 z-10 p-3 rounded-full bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
          {civicIssues.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
            ></button>
          ))}
        </div>
      </section>

     

   

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Reporting an issue"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-1/2 md:pl-12">
              <div className="space-y-8">
                <div className="flex">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Report an Issue</h3>
                    <p className="text-gray-600">Take a photo, add a description, and pin the location on our map.</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Issue Verification</h3>
                    <p className="text-gray-600">Our team verifies the issue and assigns it to the relevant department.</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
                    <p className="text-gray-600">Monitor the resolution process and receive updates on your issue.</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-yellow-600 font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Issue Resolved</h3>
                    <p className="text-gray-600">Get notified when your issue is resolved and confirm the solution.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



    </div>
  );
};

export default CivicIssueSystem;