import React, { useState, useEffect } from 'react'
import SearchBar from '@/components/molecules/SearchBar'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import pedidoService from '@/services/api/pedidoService'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([])
  const [filteredPedidos, setFilteredPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState('all')
  const [selectedPedido, setSelectedPedido] = useState(null)

  const loadPedidos = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await pedidoService.getAll()
      setPedidos(data)
    } catch (err) {
      setError('Error al cargar los pedidos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPedidos()
  }, [])

  useEffect(() => {
    let filtered = pedidos

    if (searchTerm) {
      filtered = filtered.filter(pedido =>
        pedido.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.Id.toString().includes(searchTerm)
      )
    }

    if (filterEstado !== 'all') {
      filtered = filtered.filter(pedido => pedido.estado === filterEstado)
    }

    // Ordenar por fecha más reciente
    filtered.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))

    setFilteredPedidos(filtered)
  }, [pedidos, searchTerm, filterEstado])

  const handleUpdateEstado = async (pedidoId, nuevoEstado) => {
    try {
      const pedido = pedidos.find(p => p.Id === pedidoId)
      const updatedPedido = await pedidoService.update(pedidoId, {
        ...pedido,
        estado: nuevoEstado
      })
      
      setPedidos(prev => prev.map(p => p.Id === pedidoId ? updatedPedido : p))
      toast.success(`Pedido actualizado a ${nuevoEstado}`)
    } catch (err) {
      toast.error('Error al actualizar el pedido')
    }
  }

  const getEstadoBadge = (estado) => {
    const badges = {
      'pendiente': { variant: 'warning', text: 'Pendiente' },
      'confirmado': { variant: 'primary', text: 'Confirmado' },
      'preparando': { variant: 'secondary', text: 'Preparando' },
      'listo': { variant: 'success', text: 'Listo' },
      'entregado': { variant: 'secondary', text: 'Entregado' },
      'cancelado': { variant: 'danger', text: 'Cancelado' }
    }
    
    return badges[estado] || { variant: 'secondary', text: estado }
  }

  const getEstadoIcon = (estado) => {
    const icons = {
      'pendiente': 'Clock',
      'confirmado': 'CheckCircle',
      'preparando': 'ChefHat',
      'listo': 'Check',
      'entregado': 'Truck',
      'cancelado': 'X'
    }
    
    return icons[estado] || 'Circle'
  }

  const getTipoEntregaIcon = (tipo) => {
    const icons = {
      'delivery': 'Truck',
      'pickup': 'Store',
      'dine-in': 'Utensils'
    }
    
    return icons[tipo] || 'Package'
  }

  const estados = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'pendiente', label: 'Pendientes' },
    { value: 'confirmado', label: 'Confirmados' },
    { value: 'preparando', label: 'Preparando' },
    { value: 'listo', label: 'Listos' },
    { value: 'entregado', label: 'Entregados' },
    { value: 'cancelado', label: 'Cancelados' }
  ]

  if (loading) {
    return <Loading type="table" />
  }

  if (error) {
    return <Error message={error} onRetry={loadPedidos} />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-display mb-2">
          Gestión de Pedidos
        </h1>
        <p className="text-gray-600">
          Administra y actualiza el estado de los pedidos
        </p>
      </div>

      <div className="bg-white rounded-xl card-shadow">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar por cliente o número de pedido..."
              className="flex-1"
            />
            
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
              {estados.map((estado) => (
                <option key={estado.value} value={estado.value}>
                  {estado.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-6">
          {filteredPedidos.length === 0 ? (
            <Empty
              icon="ShoppingCart"
              title="No hay pedidos"
              description="Los pedidos aparecerán aquí cuando los clientes realicen compras"
            />
          ) : (
            <div className="space-y-4">
              {filteredPedidos.map((pedido) => {
                const badgeData = getEstadoBadge(pedido.estado)
                
                return (
                  <div key={pedido.Id} className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                          <ApperIcon name={getEstadoIcon(pedido.estado)} className="w-6 h-6 text-white" />
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 font-display">
                            Pedido #{pedido.Id}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center">
                              <ApperIcon name="User" className="w-4 h-4 mr-1" />
                              {pedido.cliente.nombre}
                            </span>
                            <span className="flex items-center">
                              <ApperIcon name={getTipoEntregaIcon(pedido.tipoEntrega)} className="w-4 h-4 mr-1" />
                              {pedido.tipoEntrega === 'delivery' ? 'Entrega a domicilio' : 
                               pedido.tipoEntrega === 'pickup' ? 'Recoger en tienda' : 'Comer en sitio'}
                            </span>
                            <span className="flex items-center">
                              <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                              {format(new Date(pedido.fecha), 'dd MMM yyyy, HH:mm', { locale: es })}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold gradient-text font-display mb-2">
                          ${pedido.total.toFixed(2)} MXN
                        </div>
                        <Badge variant={badgeData.variant}>
                          {badgeData.text}
                        </Badge>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Productos:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {pedido.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                            <span>{item.cantidad}x {item.nombre}</span>
                            <span className="font-medium">${(item.precio * item.cantidad).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {pedido.cliente.telefono && (
                      <div className="mb-4 flex items-center text-sm text-gray-600">
                        <ApperIcon name="Phone" className="w-4 h-4 mr-2" />
                        <span>{pedido.cliente.telefono}</span>
                      </div>
                    )}

                    {pedido.direccion && (
                      <div className="mb-4 flex items-center text-sm text-gray-600">
                        <ApperIcon name="MapPin" className="w-4 h-4 mr-2" />
                        <span>{pedido.direccion}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {pedido.estado === 'pendiente' && (
                        <>
                          <Button
                            size="sm"
                            icon="CheckCircle"
                            onClick={() => handleUpdateEstado(pedido.Id, 'confirmado')}
                          >
                            Confirmar
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            icon="X"
                            onClick={() => handleUpdateEstado(pedido.Id, 'cancelado')}
                          >
                            Cancelar
                          </Button>
                        </>
                      )}
                      
                      {pedido.estado === 'confirmado' && (
                        <Button
                          size="sm"
                          variant="secondary"
                          icon="ChefHat"
                          onClick={() => handleUpdateEstado(pedido.Id, 'preparando')}
                        >
                          Iniciar Preparación
                        </Button>
                      )}
                      
                      {pedido.estado === 'preparando' && (
                        <Button
                          size="sm"
                          variant="secondary"
                          icon="Check"
                          onClick={() => handleUpdateEstado(pedido.Id, 'listo')}
                        >
                          Marcar como Listo
                        </Button>
                      )}
                      
                      {pedido.estado === 'listo' && (
                        <Button
                          size="sm"
                          icon="Truck"
                          onClick={() => handleUpdateEstado(pedido.Id, 'entregado')}
                        >
                          Marcar como Entregado
                        </Button>
                      )}
                    </div>
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

export default Pedidos