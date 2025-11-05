import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllChallenges } from '../../api/challenges'
import ChallengeCard from '../../components/challenges/ChallengeCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'
import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

function Challenges() {
  const navigate = useNavigate()
  const [challenges, setChallenges] = useState([])
  const [filteredChallenges, setFilteredChallenges] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    level: '',
    category: '',
    difficulty: ''
  })

  useEffect(() => {
    fetchChallenges()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [filters, challenges])

  const fetchChallenges = async () => {
    setIsLoading(true)
    try {
      const response = await getAllChallenges()
      if (response.success) {
        setChallenges(response.challenges || [])
      } else {
        toast.error('Failed to load challenges')
      }
    } catch (error) {
      console.error('Error fetching challenges:', error)
      toast.error('Error loading challenges')
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...challenges]

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(challenge =>
        challenge.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        challenge.description.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    // Level filter
    if (filters.level) {
      filtered = filtered.filter(challenge => challenge.level === parseInt(filters.level))
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(challenge => challenge.category === filters.category)
    }

    // Difficulty filter
    if (filters.difficulty) {
      filtered = filtered.filter(challenge => challenge.difficulty === filters.difficulty)
    }

    setFilteredChallenges(filtered)
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      level: '',
      category: '',
      difficulty: ''
    })
  }

  const categories = [
    { value: 'basic-bypass', label: 'Basic Bypass' },
    { value: 'union-based', label: 'Union-Based' },
    { value: 'boolean-blind', label: 'Boolean Blind' },
    { value: 'time-based', label: 'Time-Based' },
    { value: 'error-based', label: 'Error-Based' },
    { value: 'advanced', label: 'Advanced' }
  ]

  const difficulties = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
    { value: 'expert', label: 'Expert' }
  ]

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
            SQL Injection Challenges
          </h1>
          <p className="text-lg text-gray-400">
            Practice SQL injection techniques in a safe environment. Complete challenges to earn points and climb the leaderboard!
          </p>
        </div>

        {/* Filters */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl mb-6">
          <div className="flex items-center mb-4">
            <FunnelIcon className="h-5 w-5 text-cyan-400 mr-2" />
            <h2 className="text-lg font-semibold text-white">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search challenges..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
              />
            </div>

            {/* Level */}
            <select
              value={filters.level}
              onChange={(e) => handleFilterChange('level', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
            >
              <option value="">All Levels</option>
              {[1, 2, 3, 4, 5].map(level => (
                <option key={level} value={level}>Level {level}</option>
              ))}
            </select>

            {/* Category */}
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all duration-200"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>

            {/* Difficulty */}
            <select
              value={filters.difficulty}
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
            >
              <option value="">All Difficulties</option>
              {difficulties.map(diff => (
                <option key={diff.value} value={diff.value}>{diff.label}</option>
              ))}
            </select>
          </div>

          {/* Active Filters */}
          {(filters.search || filters.level || filters.category || filters.difficulty) && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Showing <span className="text-cyan-400 font-semibold">{filteredChallenges.length}</span> of <span className="text-white font-semibold">{challenges.length}</span> challenges
              </div>
              <button
                onClick={clearFilters}
                className="text-sm text-pink-400 hover:text-pink-300 font-medium transition-colors duration-200 hover:drop-shadow-[0_0_8px_rgba(244,114,182,0.5)]"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Challenge Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 rounded-xl p-6 border border-blue-700/50 shadow-lg hover:border-cyan-500 transition-all duration-300 hover:shadow-cyan-500/20 transform hover:-translate-y-1">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">{challenges.length}</div>
              <div className="text-sm text-cyan-400 font-semibold">Total Challenges</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-xl p-6 border border-green-700/50 shadow-lg hover:border-green-500 transition-all duration-300 hover:shadow-green-500/20 transform hover:-translate-y-1">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {challenges.filter(c => c.difficulty === 'easy').length}
              </div>
              <div className="text-sm text-green-400 font-semibold">Easy</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 rounded-xl p-6 border border-yellow-700/50 shadow-lg hover:border-yellow-500 transition-all duration-300 hover:shadow-yellow-500/20 transform hover:-translate-y-1">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {challenges.filter(c => c.difficulty === 'medium').length}
              </div>
              <div className="text-sm text-yellow-400 font-semibold">Medium</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-900/40 to-rose-900/40 rounded-xl p-6 border border-red-700/50 shadow-lg hover:border-red-500 transition-all duration-300 hover:shadow-red-500/20 transform hover:-translate-y-1">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {challenges.filter(c => c.difficulty === 'hard' || c.difficulty === 'expert').length}
              </div>
              <div className="text-sm text-red-400 font-semibold">Hard+</div>
            </div>
          </div>
        </div>

        {/* Challenges Grid */}
        {filteredChallenges.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-12 border border-gray-700 text-center shadow-xl">
            <p className="text-gray-400 text-lg">
              {challenges.length === 0 
                ? 'No challenges available yet. Check back soon!' 
                : 'No challenges match your filters. Try adjusting your search criteria.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map(challenge => (
              <ChallengeCard
                key={challenge._id}
                challenge={challenge}
                onClick={() => navigate(`/challenges/${challenge._id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Challenges