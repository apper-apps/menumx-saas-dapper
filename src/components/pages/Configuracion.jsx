import React, { useState, useEffect } from 'react'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import configuracionService from '@/services/api/configuracionService'
import { toast } from 'react-toastify'

const Configuracion = () => {
  const [config, setConfig] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  const loadConfiguracion = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await configuracionService.getConfiguracion()
      setConfig(data)
    } catch (err) {
      setError('Error al cargar la configuración')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadConfiguracion()
  }, [])

  const handleSave = async (seccion, datos) => {
    try {
      setSaving(true)
      
      const updatedConfig = await configuracionService.updateConfiguracion(seccion, datos)
      setConfig(prev => ({ ...prev, [seccion]: updatedConfig[seccion] }))
      
      toast.success('Configuración guardada exitosamente')
    } catch (err) {
      toast.error('Error al guardar la configuración')
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'general', label: 'General', icon: 'Settings' },
    { id: 'pagos', label: 'Métodos de Pago', icon: 'CreditCard' },
    { id: 'dominio', label: 'Dominio', icon: 'Globe' },
    { id: 'notificaciones', label: 'Notificaciones', icon: 'Bell' }
  ]

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadConfiguracion} />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-display mb-2">
          Configuración
        </h1>
        <p className="text-gray-600">
          Administra las configuraciones de tu establecimiento
        </p>
      </div>

      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ApperIcon name={tab.icon} className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl card-shadow">
        {activeTab === 'general' && (
          <GeneralTab config={config.general || {}} onSave={(data) => handleSave('general', data)} saving={saving} />
        )}
        {activeTab === 'pagos' && (
          <PagosTab config={config.pagos || {}} onSave={(data) => handleSave('pagos', data)} saving={saving} />
        )}
        {activeTab === 'dominio' && (
          <DominioTab config={config.dominio || {}} onSave={(data) => handleSave('dominio', data)} saving={saving} />
        )}
        {activeTab === 'notificaciones' && (
          <NotificacionesTab config={config.notificaciones || {}} onSave={(data) => handleSave('notificaciones', data)} saving={saving} />
        )}
      </div>
    </div>
  )
}

const GeneralTab = ({ config, onSave, saving }) => {
  const [formData, setFormData] = useState({
    nombreEstablecimiento: config.nombreEstablecimiento || '',
    tipoEstablecimiento: config.tipoEstablecimiento || 'restaurante',
    telefono: config.telefono || '',
    email: config.email || '',
    direccion: config.direccion || '',
    horarios: config.horarios || {
      lunes: { abierto: true, apertura: '09:00', cierre: '22:00' },
      martes: { abierto: true, apertura: '09:00', cierre: '22:00' },
      miercoles: { abierto: true, apertura: '09:00', cierre: '22:00' },
      jueves: { abierto: true, apertura: '09:00', cierre: '22:00' },
      viernes: { abierto: true, apertura: '09:00', cierre: '23:00' },
      sabado: { abierto: true, apertura: '09:00', cierre: '23:00' },
      domingo: { abierto: false, apertura: '09:00', cierre: '22:00' }
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  const dias = [
    { key: 'lunes', label: 'Lunes' },
    { key: 'martes', label: 'Martes' },
    { key: 'miercoles', label: 'Miércoles' },
    { key: 'jueves', label: 'Jueves' },
    { key: 'viernes', label: 'Viernes' },
    { key: 'sabado', label: 'Sábado' },
    { key: 'domingo', label: 'Domingo' }
  ]

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Nombre del Establecimiento"
            value={formData.nombreEstablecimiento}
            onChange={(e) => setFormData(prev => ({ ...prev, nombreEstablecimiento: e.target.value }))}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Establecimiento
            </label>
            <select
              value={formData.tipoEstablecimiento}
              onChange={(e) => setFormData(prev => ({ ...prev, tipoEstablecimiento: e.target.value }))}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="restaurante">Restaurante</option>
              <option value="cafeteria">Cafetería</option>
              <option value="food-truck">Food Truck</option>
              <option value="panaderia">Panadería</option>
              <option value="bar">Bar</option>
              <option value="otro">Otro</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Teléfono"
            type="tel"
            value={formData.telefono}
            onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dirección
          </label>
          <textarea
            value={formData.direccion}
            onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
            rows={3}
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="Dirección completa del establecimiento"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 font-display mb-4">
            Horarios de Atención
          </h3>
          <div className="space-y-4">
            {dias.map((dia) => (
              <div key={dia.key} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-20">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.horarios[dia.key]?.abierto || false}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        horarios: {
                          ...prev.horarios,
                          [dia.key]: {
                            ...prev.horarios[dia.key],
                            abierto: e.target.checked
                          }
                        }
                      }))}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium">{dia.label}</span>
                  </label>
                </div>
                
                {formData.horarios[dia.key]?.abierto && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="time"
                      value={formData.horarios[dia.key]?.apertura || '09:00'}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        horarios: {
                          ...prev.horarios,
                          [dia.key]: {
                            ...prev.horarios[dia.key],
                            apertura: e.target.value
                          }
                        }
                      }))}
                      className="px-3 py-1 border border-gray-300 rounded text-sm"
                    />
                    <span className="text-gray-500">a</span>
                    <input
                      type="time"
                      value={formData.horarios[dia.key]?.cierre || '22:00'}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        horarios: {
                          ...prev.horarios,
                          [dia.key]: {
                            ...prev.horarios[dia.key],
                            cierre: e.target.value
                          }
                        }
                      }))}
                      className="px-3 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" loading={saving} icon="Save">
          Guardar Configuración General
        </Button>
      </form>
    </div>
  )
}

const PagosTab = ({ config, onSave, saving }) => {
  const [formData, setFormData] = useState({
    paypal: { activo: config.paypal?.activo || false, clientId: config.paypal?.clientId || '' },
    stripe: { activo: config.stripe?.activo || false, publicKey: config.stripe?.publicKey || '' },
    mercadoPago: { activo: config.mercadoPago?.activo || false, publicKey: config.mercadoPago?.publicKey || '' },
    oxxoPay: { activo: config.oxxoPay?.activo || false },
    efectivo: { activo: config.efectivo?.activo !== false }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <ApperIcon name="DollarSign" className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-medium text-gray-900">Pago en Efectivo</h3>
                <p className="text-sm text-gray-500">Permitir pagos en efectivo al momento de la entrega</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.efectivo.activo}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  efectivo: { ...prev.efectivo, activo: e.target.checked }
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <ApperIcon name="CreditCard" className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-medium text-gray-900">PayPal</h3>
                  <p className="text-sm text-gray-500">Pagos seguros con PayPal</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.paypal.activo}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    paypal: { ...prev.paypal, activo: e.target.checked }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            {formData.paypal.activo && (
              <Input
                label="Client ID de PayPal"
                value={formData.paypal.clientId}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  paypal: { ...prev.paypal, clientId: e.target.value }
                }))}
                placeholder="Tu Client ID de PayPal"
              />
            )}
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <ApperIcon name="CreditCard" className="w-6 h-6 text-purple-600" />
                <div>
                  <h3 className="font-medium text-gray-900">Stripe</h3>
                  <p className="text-sm text-gray-500">Procesamiento de tarjetas con Stripe</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.stripe.activo}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    stripe: { ...prev.stripe, activo: e.target.checked }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            {formData.stripe.activo && (
              <Input
                label="Public Key de Stripe"
                value={formData.stripe.publicKey}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  stripe: { ...prev.stripe, publicKey: e.target.value }
                }))}
                placeholder="pk_test_..."
              />
            )}
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <ApperIcon name="CreditCard" className="w-6 h-6 text-cyan-600" />
                <div>
                  <h3 className="font-medium text-gray-900">MercadoPago</h3>
                  <p className="text-sm text-gray-500">Pagos en línea para México</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.mercadoPago.activo}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    mercadoPago: { ...prev.mercadoPago, activo: e.target.checked }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            {formData.mercadoPago.activo && (
              <Input
                label="Public Key de MercadoPago"
                value={formData.mercadoPago.publicKey}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  mercadoPago: { ...prev.mercadoPago, publicKey: e.target.value }
                }))}
                placeholder="TEST-..."
              />
            )}
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <ApperIcon name="Store" className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="font-medium text-gray-900">OXXO Pay</h3>
                <p className="text-sm text-gray-500">Pagos en tiendas OXXO</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.oxxoPay.activo}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  oxxoPay: { ...prev.oxxoPay, activo: e.target.checked }
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>

        <Button type="submit" loading={saving} icon="Save">
          Guardar Configuración de Pagos
        </Button>
      </form>
    </div>
  )
}

const DominioTab = ({ config, onSave, saving }) => {
  const [formData, setFormData] = useState({
    subdomain: config.subdomain || 'mi-restaurante',
    customDomain: config.customDomain || '',
    useCustomDomain: config.useCustomDomain || false
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  const menuUrl = formData.useCustomDomain && formData.customDomain 
    ? `https://${formData.customDomain}`
    : `https://menumx.com/${formData.subdomain}`

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-100 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Globe" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 font-display mb-2">
                Tu menú estará disponible en:
              </h3>
              <p className="text-xl font-mono bg-white px-4 py-2 rounded-lg border">
                {menuUrl}
              </p>
            </div>
          </div>
        </div>

        <div>
          <Input
            label="Subdominio en MenuMX"
            value={formData.subdomain}
            onChange={(e) => setFormData(prev => ({ ...prev, subdomain: e.target.value }))}
            placeholder="mi-restaurante"
            icon="Globe"
          />
          <p className="text-sm text-gray-500 mt-1">
            Tu menú estará disponible en: https://menumx.com/{formData.subdomain}
          </p>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 font-display">
                Dominio Personalizado
              </h3>
              <p className="text-sm text-gray-500">
                Usa tu propio dominio para el menú (requiere configuración DNS)
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.useCustomDomain}
                onChange={(e) => setFormData(prev => ({ ...prev, useCustomDomain: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          {formData.useCustomDomain && (
            <div className="space-y-4">
              <Input
                label="Tu Dominio"
                value={formData.customDomain}
                onChange={(e) => setFormData(prev => ({ ...prev, customDomain: e.target.value }))}
                placeholder="ejemplo.com"
                icon="Globe"
              />
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <ApperIcon name="AlertTriangle" className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800">Configuración DNS requerida</p>
                    <p className="text-yellow-700 mt-1">
                      Necesitarás crear un registro CNAME en tu proveedor de DNS que apunte a menumx.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <Button type="submit" loading={saving} icon="Save">
          Guardar Configuración de Dominio
        </Button>
      </form>
    </div>
  )
}

const NotificacionesTab = ({ config, onSave, saving }) => {
  const [formData, setFormData] = useState({
    emailNuevosPedidos: config.emailNuevosPedidos !== false,
    emailNuevasResenas: config.emailNuevasResenas !== false,
    smsNuevosPedidos: config.smsNuevosPedidos || false,
    webhookUrl: config.webhookUrl || ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <ApperIcon name="Mail" className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-medium text-gray-900">Email - Nuevos Pedidos</h3>
                <p className="text-sm text-gray-500">Recibir notificación por email cuando llegue un nuevo pedido</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.emailNuevosPedidos}
                onChange={(e) => setFormData(prev => ({ ...prev, emailNuevosPedidos: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <ApperIcon name="Star" className="w-6 h-6 text-yellow-600" />
              <div>
                <h3 className="font-medium text-gray-900">Email - Nuevas Reseñas</h3>
                <p className="text-sm text-gray-500">Recibir notificación por email cuando llegue una nueva reseña</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.emailNuevasResenas}
                onChange={(e) => setFormData(prev => ({ ...prev, emailNuevasResenas: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <ApperIcon name="MessageSquare" className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-medium text-gray-900">SMS - Nuevos Pedidos</h3>
                <p className="text-sm text-gray-500">Recibir SMS cuando llegue un nuevo pedido (requiere plan premium)</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.smsNuevosPedidos}
                onChange={(e) => setFormData(prev => ({ ...prev, smsNuevosPedidos: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>

        <div>
          <Input
            label="Webhook URL (Opcional)"
            value={formData.webhookUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, webhookUrl: e.target.value }))}
            placeholder="https://tu-sistema.com/webhook"
            icon="Link"
          />
          <p className="text-sm text-gray-500 mt-1">
            URL para recibir notificaciones automáticas de eventos (nuevos pedidos, reseñas, etc.)
          </p>
        </div>

        <Button type="submit" loading={saving} icon="Save">
          Guardar Configuración de Notificaciones
        </Button>
      </form>
    </div>
  )
}

export default Configuracion