import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ message = "Ocurrió un error inesperado", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-white rounded-xl card-shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertTriangle" className="w-8 h-8 text-red-500" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          ¡Ups! Algo salió mal
        </h3>
        
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transform hover:scale-105 transition-all duration-200 font-medium"
          >
            <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
            Intentar de nuevo
          </button>
        )}
      </div>
    </div>
  )
}

export default Error