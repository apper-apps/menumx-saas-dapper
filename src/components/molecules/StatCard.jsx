import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const StatCard = ({ title, value, icon, change, changeType = 'neutral', loading = false }) => {
  const changeColors = {
    positive: 'text-green-600 bg-green-100',
    negative: 'text-red-600 bg-red-100',
    neutral: 'text-gray-600 bg-gray-100'
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl card-shadow animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-xl card-shadow hover:card-shadow-lg transition-all duration-200 transform hover:scale-102">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className="flex items-baseline">
            <p className="text-2xl font-bold text-gray-900 gradient-text font-display">
              {value}
            </p>
          </div>
          {change && (
            <div className="flex items-center mt-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${changeColors[changeType]}`}>
                <ApperIcon 
                  name={changeType === 'positive' ? 'TrendingUp' : changeType === 'negative' ? 'TrendingDown' : 'Minus'} 
                  className="w-3 h-3 mr-1" 
                />
                {change}
              </span>
            </div>
          )}
        </div>
        <div className="ml-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <ApperIcon name={icon} className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatCard