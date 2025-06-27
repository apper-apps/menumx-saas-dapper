import React, { useState, useEffect } from 'react'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import resenaService from '@/services/api/resenaService'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const Resenas = () => {
  const [resenas, setResenas] = useState([])
  const [filteredResenas, setFilteredResenas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCalificacion, setFilterCalificacion] = useState('all')
  const [respondiendo, setRespondiendo] = useState(null)
  const [respuesta, setRespuesta] = useState('')

  const loadResenas = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await resenaService.getAll()
      setResenas(data)
    } catch (err) {
      setError('Error al cargar las reseñas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadResenas()
  }, [])

  useEffect(() => {
    let filtered = resenas

    if (searchTerm) {
      filtered = filtered.filter(resena =>
        resena.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resena.comentario.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterCalificacion !== 'all') {
      filtered = filtered.filter(resena => resena.calificacion === parseInt(filterCalificacion))
    }

    // Ordenar por fecha más reciente
    filtered.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))

    setFilteredResenas(filtered)
  }, [resenas, searchTerm, filterCalificacion])

  const handleResponder = async (resenaId) => {
    if (!respuesta.trim()) {
      toast.error('La respuesta no puede estar vacía')
      return
    }

    try {
      const resena = resenas.find(r => r.Id === resenaId)
      const updatedResena = await resenaService.update(resenaId, {
        ...resena,
        respuesta: respuesta.trim()
      })
      
      setResenas(prev => prev.map(r => r.Id === resenaId ? updatedResena : r))
      setRespondiendo(null)
      setRespuesta('')
      toast.success('Respuesta enviada exitosamente')
    } catch (err) {
      toast.error('Error al enviar la respuesta')
    }
  }

  const renderStars = (calificacion) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <ApperIcon
            key={star}
            name={star <= calificacion ? 'Star' : 'Star'}
            className={`w-4 h-4 ${
              star <= calificacion ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const getPromedioCalificaciones = () => {
    if (resenas.length === 0) return 0
    const suma = resenas.reduce((total, resena) => total + resena.calificacion, 0)
    return (suma / resenas.length).toFixed(1)
  }

  const getDistribucionCalificaciones = () => {
    const distribucion = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    resenas.forEach(resena => {
      distribucion[resena.calificacion]++
    })
    return distribucion
  }

  if (loading) {
    return <Loading type="table" />
  }

  if (error) {
    return <Error message={error} onRetry={loadResenas} />
  }

  const distribucion = getDistribucionCalificaciones()
  const promedio = getPromedioCalificaciones()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-display mb-2">
          Reseñas y Opiniones
        </h1>
        <p className="text-gray-600">
          Gestiona las reseñas de tus clientes y responde a sus comentarios
        </p>
      </div>

      {/* Estadísticas de reseñas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl card-shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 font-display">
              Calificación Promedio
            </h3>
            <ApperIcon name="Star" className="w-6 h-6 text-yellow-400" />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-4xl font-bold gradient-text font-display">
              {promedio}
            </div>
            <div>
              {renderStars(Math.round(parseFloat(promedio)))}
              <p className="text-sm text-gray-600 mt-1">
                Basado en {resenas.length} reseñas
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl card-shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 font-display mb-4">
            Distribución de Calificaciones
          </h3>
          
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center space-x-3">
                <span className="text-sm font-medium w-6">{star}</span>
                <ApperIcon name="Star" className="w-4 h-4 text-yellow-400" />
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: resenas.length > 0 ? `${(distribucion[star] / resenas.length) * 100}%` : '0%'
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-8">
                  {distribucion[star]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl card-shadow">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar reseñas por cliente o comentario..."
              className="flex-1"
            />
            
            <select
              value={filterCalificacion}
              onChange={(e) => setFilterCalificacion(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">Todas las calificaciones</option>
              <option value="5">5 estrellas</option>
              <option value="4">4 estrellas</option>
              <option value="3">3 estrellas</option>
              <option value="2">2 estrellas</option>
              <option value="1">1 estrella</option>
            </select>
          </div>
        </div>

        <div className="p-6">
          {filteredResenas.length === 0 ? (
            <Empty
              icon="Star"
              title="No hay reseñas"
              description="Las reseñas de tus clientes aparecerán aquí"
            />
          ) : (
            <div className="space-y-6">
              {filteredResenas.map((resena) => (
                <div key={resena.Id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
                        <ApperIcon name="User" className="w-6 h-6 text-white" />
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-900 font-display">
                          {resena.cliente}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          {renderStars(resena.calificacion)}
                          <span className="text-sm text-gray-500">
                            {format(new Date(resena.fecha), 'dd MMM yyyy', { locale: es })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {resena.comentario}
                  </p>

                  {resena.respuesta ? (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <ApperIcon name="MessageSquare" className="w-4 h-4 text-primary-500" />
                        <span className="text-sm font-medium text-primary-600">
                          Respuesta del establecimiento
                        </span>
                      </div>
                      <p className="text-gray-700">{resena.respuesta}</p>
                    </div>
                  ) : (
                    <div>
                      {respondiendo === resena.Id ? (
                        <div className="space-y-3">
                          <textarea
                            value={respuesta}
                            onChange={(e) => setRespuesta(e.target.value)}
                            rows={3}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-colors duration-200"
                            placeholder="Escribe tu respuesta..."
                          />
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              icon="Send"
                              onClick={() => handleResponder(resena.Id)}
                            >
                              Enviar Respuesta
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setRespondiendo(null)
                                setRespuesta('')
                              }}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          icon="MessageSquare"
                          onClick={() => setRespondiendo(resena.Id)}
                        >
                          Responder
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Resenas