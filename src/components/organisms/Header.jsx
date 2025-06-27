import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const Header = ({ title, subtitle }) => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-100 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
            <ApperIcon name="Bell" className="w-6 h-6" />
            <span className="absolute top-0 right-0 block h-2 w-2 bg-primary-500 rounded-full"></span>
          </button>
          
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header