import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'
import { toast } from 'react-toastify'

const Checkout = () => {
  const { subdomain } = useParams()
  const navigate = useNavigate()
  
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  const [orderData, setOrderData] = useState({
    tipoEntrega: 'delivery',
    cliente: {
      nombre: '',
      telefono: '',
      email: ''
    },
    direccion: '',
    metodoPago: 'efectivo',
    notas: ''
  })

  // Mock cart data - in real app this would come from context or props
  const mockCart = [
    { Id: 1, nombre: 'Tacos de Pastor', precio: 85.00, cantidad: 2 },
    { Id: 2, nombre: 'Agua de Horchata', precio: 25.00, cantidad: 1 }
  ]

  const total = mockCart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)

  const handleInputChange = (field, value) => {
    if (field === 'tipoEntrega') {
      setOrderData(prev => ({ ...prev, tipoEntrega: value }))
    } else if (field.startsWith('cliente.')) {
      const clienteField = field.split('.')[1]
      setOrderData(prev => ({
        ...prev,
        cliente: { ...prev.cliente, [clienteField]: value }
      }))
    } else {
      setOrderData(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleNextStep = () => {
    if (step === 1) {
      if (!orderData.cliente.nombre || !orderData.cliente.telefono) {
        toast.error('Por favor completa los datos del cliente')
        return
      }
      if (orderData.tipoEntrega === 'delivery' && !orderData.direccion) {
        toast.error('Por favor ingresa la dirección de entrega')
        return
      }
    }
    
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmitOrder = async () => {
    try {
      setLoading(true)
      
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('¡Pedido realizado con éxito!')
      
      // Redirect to success page or back to menu
      setTimeout(() => {
        navigate(`/menu/${subdomain}`)
      }, 1500)
      
    } catch (err) {
      toast.error('Error al procesar el pedido')
    } finally {
      setLoading(false)
    }
  }

  const tiposEntrega = [
    { value: 'delivery', label: 'Entrega a domicilio', icon: 'Truck', description: 'Recibe tu pedido en tu dirección' },
    { value: 'pickup', label: 'Recoger en tienda', icon: 'Store', description: 'Recoge tu pedido en nuestro establecimiento' },
    { value: 'dine-in', label: 'Comer en el lugar', icon: 'Utensils', description: 'Disfruta tu comida en nuestras instalaciones' }
  ]

  const metodosPago = [
    { value: 'efectivo', label: 'Efectivo', icon: 'DollarSign', description: 'Pago en efectivo al momento de la entrega' },
    { value: 'paypal', label: 'PayPal', icon: 'CreditCard', description: 'Pago seguro con PayPal' },
    { value: 'stripe', label: 'Tarjeta de Crédito/Débito', icon: 'CreditCard', description: 'Visa, MasterCard, American Express' },
    { value: 'mercadopago', label: 'MercadoPago', icon: 'CreditCard', description: 'Plataforma de pagos de México' },
    { value: 'oxxo', label: 'OXXO Pay', icon: 'Store', description: 'Paga en cualquier tienda OXXO' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate(`/menu/${subdomain}`)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <ApperIcon name="ArrowLeft" className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold gradient-text font-display">
                  Finalizar Pedido
                </h1>
                <p className="text-xs text-gray-500">Paso {step} de 3</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold gradient-text font-display">
                ${total.toFixed(2)} MXN
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {stepNumber}
                </div>
                <div className={`ml-2 text-sm font-medium ${
                  step >= stepNumber ? 'text-primary-600' : 'text-gray-500'
                }`}>
                  {stepNumber === 1 && 'Datos'}
                  {stepNumber === 2 && 'Pago'}
                  {stepNumber === 3 && 'Confirmar'}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 h-0.5 ml-4 ${
                    step > stepNumber ? 'bg-primary-500' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl card-shadow p-6">
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 font-display">
                    Información del Pedido
                  </h2>

                  {/* Tipo de Entrega */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Tipo de Entrega
                    </label>
                    <div className="space-y-3">
                      {tiposEntrega.map((tipo) => (
                        <label
                          key={tipo.value}
                          className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                            orderData.tipoEntrega === tipo.value
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            value={tipo.value}
                            checked={orderData.tipoEntrega === tipo.value}
                            onChange={(e) => handleInputChange('tipoEntrega', e.target.value)}
                            className="sr-only"
                          />
                          <div className="flex items-center space-x-3 flex-1">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              orderData.tipoEntrega === tipo.value
                                ? 'bg-primary-500 text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              <ApperIcon name={tipo.icon} className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{tipo.label}</div>
                              <div className="text-sm text-gray-500">{tipo.description}</div>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Datos del Cliente */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Nombre Completo"
                      value={orderData.cliente.nombre}
                      onChange={(e) => handleInputChange('cliente.nombre', e.target.value)}
                      required
                    />
                    <Input
                      label="Teléfono"
                      value={orderData.cliente.telefono}
                      onChange={(e) => handleInputChange('cliente.telefono', e.target.value)}
                      required
                    />
                  </div>

                  <Input
                    label="Email (Opcional)"
                    type="email"
                    value={orderData.cliente.email}
                    onChange={(e) => handleInputChange('cliente.email', e.target.value)}
                  />

                  {orderData.tipoEntrega === 'delivery' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dirección de Entrega
                      </label>
                      <textarea
                        value={orderData.direccion}
                        onChange={(e) => handleInputChange('direccion', e.target.value)}
                        rows={3}
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        placeholder="Calle, número, colonia, código postal..."
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notas Especiales (Opcional)
                    </label>
                    <textarea
                      value={orderData.notas}
                      onChange={(e) => handleInputChange('notas', e.target.value)}
                      rows={3}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="Instrucciones especiales para tu pedido..."
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 font-display">
                    Método de Pago
                  </h2>

                  <div className="space-y-3">
                    {metodosPago.map((metodo) => (
                      <label
                        key={metodo.value}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          orderData.metodoPago === metodo.value
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          value={metodo.value}
                          checked={orderData.metodoPago === metodo.value}
                          onChange={(e) => handleInputChange('metodoPago', e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex items-center space-x-3 flex-1">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            orderData.metodoPago === metodo.value
                              ? 'bg-primary-500 text-white'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            <ApperIcon name={metodo.icon} className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{metodo.label}</div>
                            <div className="text-sm text-gray-500">{metodo.description}</div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 font-display">
                    Confirmar Pedido
                  </h2>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Datos del Cliente</h3>
                    <p><strong>Nombre:</strong> {orderData.cliente.nombre}</p>
                    <p><strong>Teléfono:</strong> {orderData.cliente.telefono}</p>
                    {orderData.cliente.email && <p><strong>Email:</strong> {orderData.cliente.email}</p>}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Entrega</h3>
                    <p><strong>Tipo:</strong> {tiposEntrega.find(t => t.value === orderData.tipoEntrega)?.label}</p>
                    {orderData.direccion && <p><strong>Dirección:</strong> {orderData.direccion}</p>}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Método de Pago</h3>
                    <p>{metodosPago.find(m => m.value === orderData.metodoPago)?.label}</p>
                  </div>

                  {orderData.notas && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">Notas Especiales</h3>
                      <p>{orderData.notas}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handlePreviousStep}
                  disabled={step === 1}
                  icon="ArrowLeft"
                >
                  Anterior
                </Button>

                {step < 3 ? (
                  <Button
                    onClick={handleNextStep}
                    icon="ArrowRight"
                    iconPosition="right"
                  >
                    Siguiente
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmitOrder}
                    loading={loading}
                    icon="Check"
                  >
                    Confirmar Pedido
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl card-shadow p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 font-display mb-4">
                Resumen del Pedido
              </h3>

              <div className="space-y-3 mb-4">
                {mockCart.map((item) => (
                  <div key={item.Id} className="flex justify-between">
                    <div>
                      <span className="font-medium text-gray-900">{item.nombre}</span>
                      <span className="text-gray-500 ml-2">x{item.cantidad}</span>
                    </div>
                    <span className="font-medium text-gray-900">
                      ${(item.precio * item.cantidad).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold gradient-text font-display">
                    ${total.toFixed(2)} MXN
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout