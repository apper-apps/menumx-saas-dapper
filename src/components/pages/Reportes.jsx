import React, { useState, useEffect } from 'react'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import reporteService from '@/services/api/reporteService'
import Chart from 'react-apexcharts'

const Reportes = () => {
  const [reportes, setReportes] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPeriod, setSelectedPeriod] = useState('mes')

  const loadReportes = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await reporteService.getReportes(selectedPeriod)
      setReportes(data)
    } catch (err) {
      setError('Error al cargar los reportes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReportes()
  }, [selectedPeriod])

  if (loading) {
    return <Loading type="dashboard" />
  }

  if (error) {
    return <Error message={error} onRetry={loadReportes} />
  }

  const ventasChartOptions = {
    chart: {
      type: 'area',
      height: 350,
      zoom: { enabled: false },
      toolbar: { show: false }
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    colors: ['#E53E3E', '#38B2AC'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: reportes.ventasPorDia?.labels || [],
      labels: {
        style: { colors: '#6B7280' }
      }
    },
    yaxis: {
      labels: {
        style: { colors: '#6B7280' }
      }
    },
    grid: {
      borderColor: '#E5E7EB'
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right'
    }
  }

  const ventasChartSeries = [
    {
      name: 'Ventas (MXN)',
      data: reportes.ventasPorDia?.valores || []
    }
  ]

  const productosChartOptions = {
    chart: {
      type: 'donut',
      height: 350
    },
    colors: ['#E53E3E', '#38B2AC', '#ED8936', '#48BB78', '#4299E1'],
    labels: reportes.productosMasVendidos?.labels || [],
    legend: {
      position: 'bottom'
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%'
        }
      }
    }
  }

  const productosChartSeries = reportes.productosMasVendidos?.valores || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display mb-2">
            Reportes y Estadísticas
          </h1>
          <p className="text-gray-600">
            Analiza el desempeño de tu establecimiento
          </p>
        </div>
        
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="semana">Última semana</option>
          <option value="mes">Último mes</option>
          <option value="trimestre">Último trimestre</option>
          <option value="año">Último año</option>
        </select>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Ventas Totales</p>
              <p className="text-2xl font-bold gradient-text font-display">
                ${(reportes.ventasTotales || 0).toFixed(2)} MXN
              </p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <ApperIcon name="TrendingUp" className="w-4 h-4 mr-1" />
                +{reportes.crecimientoVentas || 0}% vs período anterior
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="DollarSign" className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Pedidos</p>
              <p className="text-2xl font-bold gradient-text font-display">
                {reportes.totalPedidos || 0}
              </p>
              <p className="text-sm text-blue-600 flex items-center mt-1">
                <ApperIcon name="ShoppingCart" className="w-4 h-4 mr-1" />
                Promedio: {(reportes.promedioTicket || 0).toFixed(2)} MXN
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="ShoppingCart" className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Clientes</p>
              <p className="text-2xl font-bold gradient-text font-display">
                {reportes.clientesActivos || 0}
              </p>
              <p className="text-sm text-accent-600 flex items-center mt-1">
                <ApperIcon name="Users" className="w-4 h-4 mr-1" />
                {reportes.clientesNuevos || 0} nuevos
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Calificación</p>
              <p className="text-2xl font-bold gradient-text font-display">
                {(reportes.calificacionPromedio || 0).toFixed(1)}
              </p>
              <p className="text-sm text-yellow-600 flex items-center mt-1">
                <ApperIcon name="Star" className="w-4 h-4 mr-1" />
                {reportes.totalResenas || 0} reseñas
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Star" className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl card-shadow">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 font-display">
              Tendencia de Ventas
            </h3>
          </div>
          <div className="p-6">
            <Chart
              options={ventasChartOptions}
              series={ventasChartSeries}
              type="area"
              height={350}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl card-shadow">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 font-display">
              Productos Más Vendidos
            </h3>
          </div>
          <div className="p-6">
            <Chart
              options={productosChartOptions}
              series={productosChartSeries}
              type="donut"
              height={350}
            />
          </div>
        </div>
      </div>

      {/* Tablas de datos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl card-shadow">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 font-display">
              Métodos de Pago Más Usados
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {(reportes.metodosPago || []).map((metodo, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                      <ApperIcon name="CreditCard" className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-900">{metodo.nombre}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{metodo.porcentaje}%</div>
                    <div className="text-sm text-gray-500">{metodo.cantidad} usos</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl card-shadow">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 font-display">
              Horarios de Mayor Actividad
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {(reportes.horariosActividad || []).map((horario, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
                      <ApperIcon name="Clock" className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-900">{horario.rango}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{horario.pedidos}</div>
                    <div className="text-sm text-gray-500">pedidos</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reportes