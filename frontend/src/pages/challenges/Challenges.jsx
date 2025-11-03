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
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">SQL Injection Challenges</h1>
          <p className="mt-2 text-gray-600">
            Practice SQL injection techniques in a safe environment. Complete challenges to earn points and climb the leaderboard!
          </p>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex items-center mb-4">
            <FunnelIcon className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search challenges..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input-field pl-10"
              />
            </div>

            {/* Level */}
            <select
              value={filters.level}
              onChange={(e) => handleFilterChange('level', e.target.value)}
              className="input-field"
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
              className="input-field"
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
              className="input-field"
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
              <div className="text-sm text-gray-600">
                Showing {filteredChallenges.length} of {challenges.length} challenges
              </div>
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Challenge Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="card bg-blue-50 border-blue-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-900">{challenges.length}</div>
              <div className="text-sm text-blue-700 mt-1">Total Challenges</div>
            </div>
          </div>
          <div className="card bg-green-50 border-green-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-900">
                {challenges.filter(c => c.difficulty === 'easy').length}
              </div>
              <div className="text-sm text-green-700 mt-1">Easy</div>
            </div>
          </div>
          <div className="card bg-yellow-50 border-yellow-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-900">
                {challenges.filter(c => c.difficulty === 'medium').length}
              </div>
              <div className="text-sm text-yellow-700 mt-1">Medium</div>
            </div>
          </div>
          <div className="card bg-red-50 border-red-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-900">
                {challenges.filter(c => c.difficulty === 'hard' || c.difficulty === 'expert').length}
              </div>
              <div className="text-sm text-red-700 mt-1">Hard+</div>
            </div>
          </div>
        </div>

        {/* Challenges Grid */}
        {filteredChallenges.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 text-lg">
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