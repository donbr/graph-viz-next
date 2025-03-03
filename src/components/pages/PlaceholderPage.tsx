'use client'
import React, { useState, useEffect } from 'react';

import Link from 'next/link';

const PlaceholderPage: React.FC = () => {
  const [currentPhrase, setCurrentPhrase] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [bgPosition, setBgPosition] = useState({ x: 0, y: 0 });
  
  const phrases = [
    "This is not the page you are looking for...",
    "But perhaps it's the one you need...",
    "Creating something extraordinary...",
    "Building the next breakthrough...",
    "Innovation starts here..."
  ];

  // Typing effect
  useEffect(() => {
    const typingSpeed = isDeleting ? 30 : 100;
    const timer = setTimeout(() => {
      if (!isDeleting && charIndex < phrases[phraseIndex].length) {
        setCurrentPhrase(prev => prev + phrases[phraseIndex][charIndex]);
        setCharIndex(charIndex + 1);
      } else if (isDeleting && charIndex > 0) {
        setCurrentPhrase(phrases[phraseIndex].substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      } else if (charIndex === phrases[phraseIndex].length) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (charIndex === 0 && isDeleting) {
        setIsDeleting(false);
        setPhraseIndex((phraseIndex + 1) % phrases.length);
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, phraseIndex, phrases]);

  // Cursor blinking effect
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);

    // Add animation styles to document head
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      @keyframes float {
        0% {
          transform: translateY(0) translateX(0);
          opacity: 0;
        }
        10% {
          opacity: 0.3;
        }
        90% {
          opacity: 0.3;
        }
        100% {
          transform: translateY(-1000px) translateX(100px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(styleEl);

    return () => {
      clearInterval(cursorTimer);
      document.head.removeChild(styleEl);
    };
  }, []);

  // Interactive background movement
  const handleMouseMove = (e: React.MouseEvent) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    setBgPosition({ x, y });
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="relative flex flex-col items-center justify-center min-h-screen w-full overflow-hidden py-20 bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700"
      style={{
        backgroundPosition: `${bgPosition.x * 10}% ${bgPosition.y * 10}%`,
        transition: 'background-position 0.2s ease-out'
      }}
    >
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white opacity-30"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 50 + 10}px`,
              height: `${Math.random() * 50 + 10}px`,
              animation: `float ${Math.random() * 10 + 15}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className="z-10 text-center px-4 max-w-2xl backdrop-blur-sm bg-black/20 p-8 rounded-lg shadow-2xl border border-white/20">
        <h1 className="text-5xl font-bold text-white mb-8 animate-pulse">
          404 <span className="text-pink-400">Wormhole</span>
        </h1>
        
        <div className="h-20 flex items-center justify-center mb-8">
          <h2 className="text-2xl font-bold text-white">
            {currentPhrase}
            <span className={`ml-1 ${cursorVisible ? 'opacity-100' : 'opacity-0'} transition-opacity`}>|</span>
          </h2>
        </div>
        
        <div className="space-y-6">
          <p className="text-lg text-gray-200 mb-8">
            While you're here, why not explore something amazing?
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="https://www.anthropic.com/news/claude-3-7-sonnet" 
              className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-500 transition-colors duration-300 shadow-lg transform hover:scale-105 flex items-center justify-center"
            >
              <span className="mr-2">🤖</span> Claude 3.7 Sonnet
            </Link>
            
            <Link 
              to="/" 
              className="bg-pink-600 text-white px-6 py-3 rounded-md hover:bg-pink-500 transition-colors duration-300 shadow-lg transform hover:scale-105 flex items-center justify-center"
            >
              <span className="mr-2">🏠</span> Return Home
            </Link>
          </div>
        </div>
      </div>

      {/* Easter egg - hidden interactive element */}
      <div 
        className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/30 cursor-pointer transition-all duration-300 flex items-center justify-center text-white/50 hover:text-white"
        onClick={() => alert('You found the secret! The universe acknowledges your curiosity.')}
        title="What happens if you click me?"
      >
        ?
      </div>


    </div>
  );
};

export default PlaceholderPage;
