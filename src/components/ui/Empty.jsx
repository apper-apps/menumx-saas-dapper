import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  icon = "Package", 
  title = "No hay datos disponibles", 
  description = "Aún no se han agregado elementos", 
  actionText,
  onAction 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-white rounded-xl card-shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} className="w-10 h-10 text-gray-400" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-3 font-display">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          {description}
        </p>
        
        {actionText && onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transform hover:scale-105 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
          >
            <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
            {actionText}
          </button>
        )}
      </div>
    </div>
  )
}

export default Empty