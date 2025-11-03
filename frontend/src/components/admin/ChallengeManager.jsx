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
        <h2 className="text-2xl font-bold text-gray-900">Challenge Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Challenge
        </button>
      </div>

      {/* Challenge Form */}
      {showForm && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">
            {selectedChallenge ? 'Edit Challenge' : 'Create New Challenge'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="Basic SQL Injection"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty *
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                >
                  {difficulties.map(diff => (
                    <option key={diff} value={diff}>{diff}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Points *
                </label>
                <input
                  type="number"
                  name="points"
                  value={formData.points}
                  onChange={handleInputChange}
                  min="0"
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Database Schema *
                </label>
                <input
                  type="text"
                  name="databaseSchema"
                  value={formData.databaseSchema}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="level1"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="3"
                className="input-field"
                placeholder="Describe the challenge objectives..."
              />
            </div>

            {/* Hints */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Hints
                </label>
                <button
                  type="button"
                  onClick={handleAddHint}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  + Add Hint
                </button>
              </div>
              <div className="space-y-2">
                {formData.hints.map((hint, index) => (
                  <div key={index} className="flex gap-2 items-start p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={hint.text}
                        onChange={(e) => handleUpdateHint(index, 'text', e.target.value)}
                        placeholder="Hint text"
                        className="input-field mb-2"
                      />
                      <input
                        type="number"
                        value={hint.pointDeduction}
                        onChange={(e) => handleUpdateHint(index, 'pointDeduction', parseInt(e.target.value))}
                        placeholder="Point deduction"
                        className="input-field"
                        min="0"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveHint(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Solution */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Solution Queries (one per line)
              </label>
              <textarea
                value={formData.solution.queries.join('\n')}
                onChange={(e) => handleArrayInputChange('solution', 'queries', e.target.value)}
                rows="3"
                className="input-field"
                placeholder="admin' OR '1'='1'--&#10;admin' OR 1=1--"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Solution Explanation
              </label>
              <textarea
                value={formData.solution.explanation}
                onChange={(e) => handleNestedInputChange('solution', 'explanation', e.target.value)}
                rows="2"
                className="input-field"
                placeholder="Explain how the solution works..."
              />
            </div>

            {/* Educational Content */}
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Educational Content</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Theory
                  </label>
                  <textarea
                    value={formData.educationalContent.theory}
                    onChange={(e) => handleNestedInputChange('educationalContent', 'theory', e.target.value)}
                    rows="3"
                    className="input-field"
                    placeholder="Explain the theoretical background..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Examples (one per line)
                  </label>
                  <textarea
                    value={formData.educationalContent.examples.join('\n')}
                    onChange={(e) => handleArrayInputChange('educationalContent', 'examples', e.target.value)}
                    rows="3"
                    className="input-field"
                    placeholder="' OR '1'='1'--&#10;admin'--"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prevention Techniques
                  </label>
                  <textarea
                    value={formData.educationalContent.prevention}
                    onChange={(e) => handleNestedInputChange('educationalContent', 'prevention', e.target.value)}
                    rows="3"
                    className="input-field"
                    placeholder="Explain how to prevent this type of attack..."
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                {selectedChallenge ? 'Update Challenge' : 'Create Challenge'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Challenges List */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Existing Challenges</h3>
        <div className="space-y-3">
          {challenges.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No challenges yet. Create your first challenge!</p>
          ) : (
            challenges.map(challenge => (
              <div key={challenge._id} className="border rounded-lg p-4 hover:border-primary-300 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{challenge.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded ${
                        challenge.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                        challenge.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        challenge.difficulty === 'hard' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {challenge.difficulty}
                      </span>
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        Level {challenge.level}
                      </span>
                      <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                        {challenge.points} pts
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Category: {challenge.category}</span>
                      <span>Created: {formatDate(challenge.createdAt)}</span>
                      <span>Attempts: {challenge.completionRate?.attempts || 0}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(challenge)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      title="Edit"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(challenge._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
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