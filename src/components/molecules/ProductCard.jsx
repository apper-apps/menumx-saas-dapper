import React from 'react'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const ProductCard = ({ producto, onEdit, onDelete, onToggleDisponible }) => {
  return (
    <div className="bg-white rounded-xl card-shadow hover:card-shadow-lg transition-all duration-200 overflow-hidden">
      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative">
        {producto.imagen ? (
          <img 
            src={producto.imagen} 
            alt={producto.nombre}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ApperIcon name="ImageIcon" className="w-12 h-12 text-gray-400" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <button
            onClick={() => onToggleDisponible(producto.Id)}
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              producto.disponible 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}
          >
            {producto.disponible ? 'Disponible' : 'No disponible'}
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 font-display">
          {producto.nombre}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {producto.descripcion}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold gradient-text font-display">
            ${producto.precio.toFixed(2)} MXN
          </span>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            icon="Edit"
            onClick={() => onEdit(producto)}
            className="flex-1"
          >
            Editar
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon="Trash2"
            onClick={() => onDelete(producto.Id)}
          >
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard