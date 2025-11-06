import React, { useState } from 'react'
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline'
import { formatDate } from '../../utils/helpers'
import LoadingSpinner from '../common/LoadingSpinner'

function ChallengeManager({ challenges, isLoading, onCreateChallenge, onUpdateChallenge, onDeleteChallenge }) {
  const [selectedChallenge, setSelectedChallenge] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: 1,
    category: 'basic-bypass',
    difficulty: 'easy',
    points: 100,
    databaseSchema: 'level1',
    hints: [],
    solution: {
      queries: [],
      explanation: ''
    },
    educationalContent: {
      theory: '',
      examples: [],
      prevention: ''
    }
  })

  const categories = [
    'basic-bypass',
    'information-disclosure',
    
    'union-based',
    'boolean-blind',
    'time-based',
    'error-based',
    'advanced'
  ]

  const difficulties = ['easy', 'medium', 'hard', 'expert']

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleNestedInputChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }))
  }

  const handleArrayInputChange = (parent, field, value) => {
    const arrayValue = value.split('\n').filter(item => item.trim() !== '')
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: arrayValue
      }
    }))
  }

  const handleAddHint = () => {
    setFormData(prev => ({
      ...prev,
      hints: [
        ...prev.hints,
        {
          order: prev.hints.length + 1,
          text: '',
          pointDeduction: 10
        }
      ]
    }))
  }

  const handleUpdateHint = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      hints: prev.hints.map((hint, i) => 
        i === index ? { ...hint, [field]: value } : hint
      )
    }))
  }

  const handleRemoveHint = (index) => {
    setFormData(prev => ({
      ...prev,
      hints: prev.hints.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (selectedChallenge) {
      await onUpdateChallenge(selectedChallenge._id, formData)
    } else {
      await onCreateChallenge(formData)
    }
    resetForm()
  }

  const resetForm = () => {
    setSelectedChallenge(null)
    setShowForm(false)
    setFormData({
      title: '',
      description: '',
      level: 1,
      category: 'basic-bypass',
      difficulty: 'easy',
      points: 100,
      databaseSchema: 'level1',
      hints: [],
      solution: {
        queries: [],
        explanation: ''
      },
      educationalContent: {
        theory: '',
        examples: [],
        prevention: ''
      }
    })
  }

  const handleEdit = (challenge) => {
    setSelectedChallenge(challenge)
    setFormData({
      title: challenge.title,
      description: challenge.description,
      level: challenge.level,
      category: challenge.category,
      difficulty: challenge.difficulty,
      points: challenge.points,
      databaseSchema: challenge.databaseSchema,
      hints: challenge.hints || [],
      solution: challenge.solution || { queries: [], explanation: '' },
      educationalContent: challenge.educationalContent || { theory: '', examples: [], prevention: '' }
    })
    setShowForm(true)
  }

  const handleDelete = async (challengeId) => {
    if (window.confirm('Are you sure you want to delete this challenge?')) {
      await onDeleteChallenge(challengeId)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Challenge Management
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-cyan-500/50 flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Challenge
        </button>
      </div>

      {/* Challenge Form */}
      {showForm && (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl">
          <h3 className="text-2xl font-bold mb-6 text-white">
            {selectedChallenge ? 'Edit Challenge' : 'Create New Challenge'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
                  placeholder="Basic SQL Injection"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Level *
                </label>
                <input
                  type="number"
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                  required
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Difficulty *
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
                >
                  {difficulties.map(diff => (
                    <option key={diff} value={diff}>{diff}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Points *
                </label>
                <input
                  type="number"
                  name="points"
                  value={formData.points}
                  onChange={handleInputChange}
                  min="0"
                  required
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Database Schema *
                </label>
                <input
                  type="text"
                  name="databaseSchema"
                  value={formData.databaseSchema}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
                  placeholder="level1"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="3"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
                placeholder="Describe the challenge objectives..."
              />
            </div>

            {/* Hints */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-semibold text-gray-300">
                  Hints
                </label>
                <button
                  type="button"
                  onClick={handleAddHint}
                  className="text-sm text-cyan-400 hover:text-cyan-300 font-semibold transition-colors duration-200"
                >
                  + Add Hint
                </button>
              </div>
              <div className="space-y-3">
                {formData.hints.map((hint, index) => (
                  <div key={index} className="flex gap-3 items-start p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={hint.text}
                        onChange={(e) => handleUpdateHint(index, 'text', e.target.value)}
                        placeholder="Hint text"
                        className="w-full px-4 py-2 bg-gray-950 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
                      />
                      <input
                        type="number"
                        value={hint.pointDeduction}
                        onChange={(e) => handleUpdateHint(index, 'pointDeduction', parseInt(e.target.value))}
                        placeholder="Point deduction"
                        className="w-full px-4 py-2 bg-gray-950 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
                        min="0"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveHint(index)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded transition-all duration-200"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Solution */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Solution Queries (one per line)
              </label>
              <textarea
                value={formData.solution.queries.join('\n')}
                onChange={(e) => handleArrayInputChange('solution', 'queries', e.target.value)}
                rows="3"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 font-mono text-sm"
                placeholder="admin' OR '1'='1'--&#10;admin' OR 1=1--"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Solution Explanation
              </label>
              <textarea
                value={formData.solution.explanation}
                onChange={(e) => handleNestedInputChange('solution', 'explanation', e.target.value)}
                rows="2"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
                placeholder="Explain how the solution works..."
              />
            </div>

            {/* Educational Content */}
            <div className="border-t border-gray-700 pt-6">
              <h4 className="font-bold text-lg text-white mb-4">Educational Content</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Theory
                  </label>
                  <textarea
                    value={formData.educationalContent.theory}
                    onChange={(e) => handleNestedInputChange('educationalContent', 'theory', e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
                    placeholder="Explain the theoretical background..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Examples (one per line)
                  </label>
                  <textarea
                    value={formData.educationalContent.examples.join('\n')}
                    onChange={(e) => handleArrayInputChange('educationalContent', 'examples', e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 font-mono text-sm"
                    placeholder="' OR '1'='1'--&#10;admin'--"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Prevention Techniques
                  </label>
                  <textarea
                    value={formData.educationalContent.prevention}
                    onChange={(e) => handleNestedInputChange('educationalContent', 'prevention', e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
                    placeholder="Explain how to prevent this type of attack..."
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-700">
              <button
                type="button"
                onClick={resetForm}
                className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:from-gray-600 hover:to-gray-700 transform hover:scale-105 transition-all duration-200 border border-gray-600 shadow-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-cyan-500/50"
              >
                {selectedChallenge ? 'Update Challenge' : 'Create Challenge'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Challenges List */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl">
        <h3 className="text-2xl font-bold mb-6 text-white">Existing Challenges</h3>
        <div className="space-y-4">
          {challenges.length === 0 ? (
            <p className="text-center text-gray-400 py-12">No challenges yet. Create your first challenge!</p>
          ) : (
            challenges.map(challenge => (
              <div key={challenge._id} className="border border-gray-700 rounded-xl p-5 hover:border-cyan-500 transition-all duration-200 bg-gray-800/30 hover:bg-gray-800/50 group">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-3 mb-3">
                      <h4 className="font-bold text-white text-lg group-hover:text-cyan-400 transition-colors">{challenge.title}</h4>
                      <span className={`px-3 py-1 text-xs rounded-full font-bold shadow-lg ${
                        challenge.difficulty === 'easy' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-500/30' :
                        challenge.difficulty === 'medium' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-yellow-500/30' :
                        challenge.difficulty === 'hard' ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-orange-500/30' :
                        'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-red-500/30'
                      }`}>
                        {challenge.difficulty}
                      </span>
                      <span className="px-3 py-1 text-xs bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-bold shadow-lg shadow-cyan-500/30">
                        Level {challenge.level}
                      </span>
                      <span className="px-3 py-1 text-xs bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full font-bold shadow-lg shadow-purple-500/30">
                        {challenge.points} pts
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-3 leading-relaxed">{challenge.description}</p>
                    <div className="flex items-center flex-wrap gap-4 text-xs text-gray-500">
                      <span className="text-gray-400">Category: <span className="text-cyan-400 font-semibold">{challenge.category}</span></span>
                      <span className="text-gray-400">Created: <span className="text-purple-400 font-semibold">{formatDate(challenge.createdAt)}</span></span>
                      <span className="text-gray-400">Attempts: <span className="text-pink-400 font-semibold">{challenge.completionRate?.attempts || 0}</span></span>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(challenge)}
                      className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 rounded-lg transition-all duration-200"
                      title="Edit"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(challenge._id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-all duration-200"
                      title="Delete"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default ChallengeManager