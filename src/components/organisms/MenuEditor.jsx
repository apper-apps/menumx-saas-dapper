import React, { useState } from 'react'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import { toast } from 'react-toastify'

const MenuEditor = ({ menu, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: menu?.nombre || '',
    descripcion: menu?.descripcion || '',
    activo: menu?.activo ?? true,
    categorias: menu?.categorias || []
  })
  
  const [nuevaCategoria, setNuevaCategoria] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.nombre.trim()) {
      toast.error('El nombre del menú es requerido')
      return
    }
    onSave(formData)
  }

  const agregarCategoria = () => {
    if (nuevaCategoria.trim() && !formData.categorias.includes(nuevaCategoria.trim())) {
      setFormData(prev => ({
        ...prev,
        categorias: [...prev.categorias, nuevaCategoria.trim()]
      }))
      setNuevaCategoria('')
    }
  }

  const eliminarCategoria = (categoria) => {
    setFormData(prev => ({
      ...prev,
      categorias: prev.categorias.filter(c => c !== categoria)
    }))
  }

  return (
    <div className="bg-white rounded-xl card-shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 font-display">
          {menu ? 'Editar Menú' : 'Crear Nuevo Menú'}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <ApperIcon name="X" className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Nombre del Menú"
          value={formData.nombre}
          onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
          placeholder="Ej: Menú Principal"
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
            placeholder="Descripción del menú..."
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="activo"
            checked={formData.activo}
            onChange={(e) => setFormData(prev => ({ ...prev, activo: e.target.checked }))}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="activo" className="ml-2 block text-sm text-gray-900">
            Menú activo
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categorías
          </label>
          <div className="flex space-x-2 mb-3">
            <Input
              value={nuevaCategoria}
              onChange={(e) => setNuevaCategoria(e.target.value)}
              placeholder="Nueva categoría"
            />
            <Button
              type="button"
              onClick={agregarCategoria}
              icon="Plus"
              disabled={!nuevaCategoria.trim()}
            >
              Agregar
            </Button>
          </div>
          
          <div className="space-y-2">
            {formData.categorias.map((categoria, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span className="font-medium text-gray-900">{categoria}</span>
                <button
                  type="button"
                  onClick={() => eliminarCategoria(categoria)}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200"
                >
                  <ApperIcon name="Trash2" className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <Button type="submit" icon="Save" className="flex-1">
            {menu ? 'Actualizar Menú' : 'Crear Menú'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}

export default MenuEditor