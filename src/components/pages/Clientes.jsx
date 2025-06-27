import React, { useState, useEffect } from 'react'
import SearchBar from '@/components/molecules/SearchBar'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import clienteService from '@/services/api/clienteService'

const Clientes = () => {
  const [clientes, setClientes] = useState([])
  const [filteredClientes, setFilteredClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCliente, setSelectedCliente] = useState(null)

  const loadClientes = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await clienteService.getAll()
      setClientes(data)
    } catch (err) {
      setError('Error al cargar los clientes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClientes()
  }, [])

  useEffect(() => {
    let filtered = clientes

    if (searchTerm) {
      filtered = filtered.filter(cliente =>
        cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.telefono.includes(searchTerm)
      )
    }

    // Ordenar por fecha de registro más reciente
    filtered.sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro))

    setFilteredClientes(filtered)
  }, [clientes, searchTerm])

  const getNivelFidelidad = (puntos) => {
    if (puntos >= 1000) return { nivel: 'VIP', color: 'primary', icon: 'Crown' }
    if (puntos >= 500) return { nivel: 'Gold', color: 'warning', icon: 'Award' }
    if (puntos >= 200) return { nivel: 'Silver', color: 'secondary', icon: 'Medal' }
    return { nivel: 'Bronze', color: 'accent', icon: 'Star' }
  }

  if (loading) {
    return <Loading type="table" />
  }

  if (error) {
    return <Error message={error} onRetry={loadClientes} />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-display mb-2">
          Gestión de Clientes
        </h1>
        <p className="text-gray-600">
          Administra tu base de clientes y programa de fidelidad
        </p>
      </div>

      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Clientes</p>
              <p className="text-2xl font-bold gradient-text font-display">
                {clientes.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Clientes VIP</p>
              <p className="text-2xl font-bold gradient-text font-display">
                {clientes.filter(c => c.puntosFidelidad >= 1000).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Crown" className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Clientes Activos</p>
              <p className="text-2xl font-bold gradient-text font-display">
                {clientes.filter(c => c.activo).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="UserCheck" className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Nuevos (Este mes)</p>
              <p className="text-2xl font-bold gradient-text font-display">
                {clientes.filter(c => {
                  const fechaRegistro = new Date(c.fechaRegistro)
                  const mesActual = new Date()
                  return fechaRegistro.getMonth() === mesActual.getMonth() && 
                         fechaRegistro.getFullYear() === mesActual.getFullYear()
                }).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="UserPlus" className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl card-shadow">
        <div className="p-6 border-b border-gray-100">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar clientes por nombre, email o teléfono..."
          />
        </div>

        <div className="p-6">
          {filteredClientes.length === 0 ? (
            <Empty
              icon="Users"
              title="No hay clientes"
              description="Los clientes registrados aparecerán aquí"
            />
          ) : (
            <div className="space-y-4">
              {filteredClientes.map((cliente) => {
                const fidelidad = getNivelFidelidad(cliente.puntosFidelidad)
                
                return (
                  <div key={cliente.Id} className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
                          <ApperIcon name="User" className="w-6 h-6 text-white" />
                        </div>
                        
                        <div>
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900 font-display">
                              {cliente.nombre}
                            </h3>
                            <Badge variant={fidelidad.color}>
                              <ApperIcon name={fidelidad.icon} className="w-3 h-3 mr-1" />
                              {fidelidad.nivel}
                            </Badge>
                            {!cliente.activo && (
                              <Badge variant="danger">Inactivo</Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <ApperIcon name="Mail" className="w-4 h-4 mr-1" />
                              {cliente.email}
                            </span>
                            <span className="flex items-center">
                              <ApperIcon name="Phone" className="w-4 h-4 mr-1" />
                              {cliente.telefono}
                            </span>
                            <span className="flex items-center">
                              <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                              Registrado: {new Date(cliente.fechaRegistro).toLocaleDateString('es-MX')}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold gradient-text font-display mb-1">
                          {cliente.puntosFidelidad}
                        </div>
                        <p className="text-sm text-gray-500">puntos</p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <ApperIcon name="ShoppingCart" className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">Pedidos</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">
                          {cliente.totalPedidos || 0}
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <ApperIcon name="DollarSign" className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">Total gastado</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">
                          ${(cliente.totalGastado || 0).toFixed(2)} MXN
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <ApperIcon name="Heart" className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">Última visita</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">
                          {cliente.ultimaVisita ? 
                            new Date(cliente.ultimaVisita).toLocaleDateString('es-MX') : 
                            'Nunca'
                          }
                        </p>
                      </div>
                    </div>

                    {cliente.direccion && (
                      <div className="mt-4 flex items-center text-sm text-gray-600">
                        <ApperIcon name="MapPin" className="w-4 h-4 mr-2" />
                        <span>{cliente.direccion}</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Clientes