import React from 'react'

const Card = ({ icon, title, description }) => {
  return (
    <div className="text-center max-w-xs">
      <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-4 text-gray-100">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed text-center">
        {description}
      </p>
    </div>
  )
}

export default Card
