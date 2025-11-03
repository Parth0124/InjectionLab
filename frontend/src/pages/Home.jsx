import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheckIcon, ChartBarIcon, CodeBracketIcon } from '@heroicons/react/24/outline'

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
        {/* Animated background effect */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-60"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Master SQL Injection Defense
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300">
              Learn, Practice, and Master SQL Injection techniques in a safe environment
            </p>
            <div className="flex justify-center space-x-4">
              <Link 
                to="/register" 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-cyan-500/50"
              >
                Get Started
              </Link>
              <Link 
                to="/login" 
                className="border-2 border-cyan-500 text-cyan-400 px-8 py-3 rounded-lg font-semibold hover:bg-cyan-500 hover:text-white transform hover:scale-105 transition-all"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4 text-white">Why InjectionLab?</h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            The ultimate platform for cybersecurity professionals and enthusiasts
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl text-center border border-gray-700 hover:border-cyan-500 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-lg inline-block mb-4">
                <ShieldCheckIcon className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Safe Environment</h3>
              <p className="text-gray-400 leading-relaxed">
                Practice SQL injection techniques without any risk to real systems
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl text-center border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-lg inline-block mb-4">
                <CodeBracketIcon className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Real-World Scenarios</h3>
              <p className="text-gray-400 leading-relaxed">
                Learn through practical challenges that simulate actual vulnerabilities
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl text-center border border-gray-700 hover:border-pink-500 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/20 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-3 rounded-lg inline-block mb-4">
                <ChartBarIcon className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Track Progress</h3>
              <p className="text-gray-400 leading-relaxed">
                Monitor your learning journey with detailed analytics and achievements
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home