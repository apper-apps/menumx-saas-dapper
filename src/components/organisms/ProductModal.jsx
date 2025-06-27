import React, { useState } from 'react'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import { toast } from 'react-toastify'

const ProductModal = ({ isOpen, onClose, producto, categorias = [], onSave }) => {
  const [formData, setFormData] = useState({
    nombre: producto?.nombre || '',
    descripcion: producto?.descripcion || '',
    precio: producto?.precio || '',
    categoria: producto?.categoria || '',
    imagen: producto?.imagen || '',
    disponible: producto?.disponible ?? true
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.nombre.trim()) {
      toast.error('El nombre del producto es requerido')
      return
    }
    
    if (!formData.precio || formData.precio <= 0) {
      toast.error('El precio debe ser mayor a 0')
      return
    }
    
    if (!formData.categoria) {
      toast.error('Selecciona una categoría')
      return
    }

    const productoData = {
      ...formData,
      precio: parseFloat(formData.precio),
      Id: producto?.Id
    }
    
    onSave(productoData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl card-shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 font-display">
              {producto ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nombre del Producto"
              value={formData.nombre}
              onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
              placeholder="Ej: Tacos de Pastor"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                rows={3}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-colors duration-200"
                placeholder="Descripción del producto..."
              />
            </div>

            <Input
              label="Precio (MXN)"
              type="number"
              step="0.01"
              min="0"
              value={formData.precio}
              onChange={(e) => setFormData(prev => ({ ...prev, precio: e.target.value }))}
              placeholder="0.00"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                value={formData.categoria}
                onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value }))}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-colors duration-200"
                required
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map((categoria, index) => (
                  <option key={index} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="URL de Imagen"
              type="url"
              value={formData.imagen}
              onChange={(e) => setFormData(prev => ({ ...prev, imagen: e.target.value }))}
              placeholder="https://ejemplo.com/imagen.jpg"
            />

            <div className="flex items-center">
              <input
                type="checkbox"
                id="disponible"
                checked={formData.disponible}
                onChange={(e) => setFormData(prev => ({ ...prev, disponible: e.target.checked }))}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="disponible" className="ml-2 block text-sm text-gray-900">
                Producto disponible
              </label>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button type="submit" icon="Save" className="flex-1">
                {producto ? 'Actualizar' : 'Crear Producto'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProductModal