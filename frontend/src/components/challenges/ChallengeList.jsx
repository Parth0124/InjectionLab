import React from 'react'
import ChallengeCard from './ChallengeCard'

function ChallengeList({ challenges, onChallengeClick }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {challenges.map((challenge) => (
        <ChallengeCard
          key={challenge._id}
          challenge={challenge}
          onClick={onChallengeClick}
        />
      ))}
    </div>
  )
}

export default ChallengeList