import React, { useState, useEffect } from 'react'
import StatCard from '@/components/molecules/StatCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import dashboardService from '@/services/api/dashboardService'

const Dashboard = () => {
  const [stats, setStats] = useState([])
  const [pedidosRecientes, setPedidosRecientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const statsData = await dashboardService.getStats()
      const pedidosData = await dashboardService.getPedidosRecientes()
      
      setStats(statsData)
      setPedidosRecientes(pedidosData)
    } catch (err) {
      setError('Error al cargar los datos del dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  if (loading) {
    return <Loading type="dashboard" />
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />
  }

  const getEstadoBadge = (estado) => {
    const badges = {
      'pendiente': 'bg-yellow-100 text-yellow-800',
      'confirmado': 'bg-blue-100 text-blue-800',
      'preparando': 'bg-orange-100 text-orange-800',
      'listo': 'bg-green-100 text-green-800',
      'entregado': 'bg-gray-100 text-gray-800',
      'cancelado': 'bg-red-100 text-red-800'
    }
    
    return badges[estado] || 'bg-gray-100 text-gray-800'
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-display mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Resumen de tu establecimiento y actividad reciente
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.titulo}
            value={stat.valor}
            icon={stat.icono}
            change={stat.cambio}
            changeType={stat.tipoCambio}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl card-shadow">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 font-display">
                Pedidos Recientes
              </h3>
              <ApperIcon name="ShoppingCart" className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {pedidosRecientes.map((pedido) => (
                <div key={pedido.Id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                      <ApperIcon name={getEstadoIcon(pedido.estado)} className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Pedido #{pedido.Id}
                      </p>
                      <p className="text-sm text-gray-500">
                        {pedido.cliente} • {pedido.tipoEntrega}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-primary-600">
                      ${pedido.total.toFixed(2)} MXN
                    </p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEstadoBadge(pedido.estado)}`}>
                      {pedido.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl card-shadow">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 font-display">
                Productos Más Vendidos
              </h3>
              <ApperIcon name="TrendingUp" className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {[
                { nombre: 'Tacos de Pastor', ventas: 45, porcentaje: 85 },
                { nombre: 'Quesadillas', ventas: 32, porcentaje: 60 },
                { nombre: 'Burrito de Carne', ventas: 28, porcentaje: 50 },
                { nombre: 'Agua de Horchata', ventas: 22, porcentaje: 40 },
                { nombre: 'Tostadas', ventas: 18, porcentaje: 35 }
              ].map((producto, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{producto.nombre}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${producto.porcentaje}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="ml-4 text-sm font-semibold text-gray-600">
                    {producto.ventas}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard