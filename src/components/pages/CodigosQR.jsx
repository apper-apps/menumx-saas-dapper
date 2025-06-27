import React, { useState, useEffect } from 'react'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import qrService from '@/services/api/qrService'
import { toast } from 'react-toastify'

const CodigosQR = () => {
  const [codigos, setCodigos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [generando, setGenerando] = useState(false)

  const loadCodigos = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await qrService.getAll()
      setCodigos(data)
    } catch (err) {
      setError('Error al cargar los códigos QR')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCodigos()
  }, [])

  const handleGenerarQR = async () => {
    try {
      setGenerando(true)
      
      const nuevoQR = await qrService.generar({
        tipo: 'menu',
        url: 'https://menumx.com/mi-restaurante',
        nombre: 'Menú Principal - ' + new Date().toLocaleDateString('es-MX')
      })
      
      setCodigos(prev => [nuevoQR, ...prev])
      toast.success('Código QR generado exitosamente')
    } catch (err) {
      toast.error('Error al generar el código QR')
    } finally {
      setGenerando(false)
    }
  }

  const handleDescargar = async (codigoId, formato = 'png') => {
    try {
      const blob = await qrService.descargar(codigoId, formato)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `qr-codigo-${codigoId}.${formato}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success(`Código QR descargado en formato ${formato.toUpperCase()}`)
    } catch (err) {
      toast.error('Error al descargar el código QR')
    }
  }

  const handleEliminar = async (codigoId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este código QR?')) {
      try {
        await qrService.delete(codigoId)
        setCodigos(prev => prev.filter(c => c.Id !== codigoId))
        toast.success('Código QR eliminado exitosamente')
      } catch (err) {
        toast.error('Error al eliminar el código QR')
      }
    }
}

  const handleCopyUrl = async (url) => {
    try {
      // Check if navigator.clipboard is available (modern browsers)
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url)
        toast.success('URL copiada al portapapeles')
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea')
        textArea.value = url
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        
        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)
        
        if (successful) {
          toast.success('URL copiada al portapapeles')
        } else {
          throw new Error('Comando de copia no soportado')
        }
      }
    } catch (err) {
      console.error('Error al copiar URL:', err)
      toast.error('No se pudo copiar la URL. Intenta seleccionar y copiar manualmente.')
    }
  }
  if (loading) {
    return <Loading type="grid" />
  }

  if (error) {
    return <Error message={error} onRetry={loadCodigos} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display mb-2">
            Códigos QR
          </h1>
          <p className="text-gray-600">
            Genera códigos QR para tu menú y páginas de reseñas
          </p>
        </div>
        
        <Button
          icon="QrCode"
          onClick={handleGenerarQR}
          loading={generando}
        >
          Generar Nuevo QR
        </Button>
      </div>

      {/* Información sobre códigos QR */}
      <div className="bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-100 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <ApperIcon name="Info" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 font-display mb-2">
              ¿Cómo usar los códigos QR?
            </h3>
            <ul className="text-gray-700 space-y-1 text-sm">
              <li>• Coloca los códigos QR en mesas, entrada o material promocional</li>
              <li>• Los clientes pueden escanear para ver tu menú digital</li>
              <li>• Acceso directo a tu sistema de pedidos y reseñas</li>
              <li>• Descarga en diferentes formatos para imprimir</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl card-shadow">
        <div className="p-6">
          {codigos.length === 0 ? (
            <Empty
              icon="QrCode"
              title="No hay códigos QR"
              description="Genera tu primer código QR para compartir tu menú digital con los clientes"
              actionText="Generar Código QR"
              onAction={handleGenerarQR}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {codigos.map((codigo) => (
                <div key={codigo.Id} className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors duration-200">
                  <div className="text-center mb-4">
                    <div className="w-48 h-48 mx-auto bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center mb-4">
                      {codigo.imagen ? (
                        <img 
                          src={codigo.imagen} 
                          alt="Código QR"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-32 h-32 bg-gray-800 rounded-lg flex items-center justify-center">
                          <ApperIcon name="QrCode" className="w-16 h-16 text-white" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-center mb-4">
                    <h3 className="font-semibold text-gray-900 font-display mb-1">
                      {codigo.nombre}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      Creado: {new Date(codigo.fechaCreacion).toLocaleDateString('es-MX')}
                    </p>
                    <p className="text-xs text-gray-400 break-all">
                      {codigo.url}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        icon="Download"
                        onClick={() => handleDescargar(codigo.Id, 'png')}
                        className="flex-1"
                      >
                        PNG
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        icon="Download"
                        onClick={() => handleDescargar(codigo.Id, 'svg')}
                        className="flex-1"
                      >
                        SVG
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        icon="Download"
                        onClick={() => handleDescargar(codigo.Id, 'pdf')}
                        className="flex-1"
                      >
                        PDF
                      </Button>
                    </div>
                    
<div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"  
                        icon="Copy"
                        onClick={() => handleCopyUrl(codigo.url)}
                        className="flex-1"
                      >
                        Copiar URL
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        icon="Trash2"
                        onClick={() => handleEliminar(codigo.Id)}
                      >
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Escaneos: {codigo.escaneos || 0}</span>
                      <span className="flex items-center">
                        <ApperIcon name="Eye" className="w-3 h-3 mr-1" />
                        {codigo.vistas || 0} visitas
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CodigosQR