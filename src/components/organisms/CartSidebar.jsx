import React from 'react'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const CartSidebar = ({ isOpen, onClose, cart, updateQuantity, removeFromCart }) => {
  const navigate = useNavigate()
  
  const total = cart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)

  const handleCheckout = () => {
    navigate('/checkout/mi-restaurante')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 font-display">
              Tu Pedido
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ApperIcon name="ShoppingCart" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Tu carrito está vacío</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.Id} className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
                      {item.imagen ? (
                        <img 
                          src={item.imagen} 
                          alt={item.nombre}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ApperIcon name="ImageIcon" className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.nombre}</h3>
                      <p className="text-primary-600 font-semibold">
                        ${item.precio.toFixed(2)} MXN
                      </p>
                      
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() => updateQuantity(item.Id, item.cantidad - 1)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <ApperIcon name="Minus" className="w-4 h-4" />
                        </button>
                        <span className="mx-3 font-medium">{item.cantidad}</span>
                        <button
                          onClick={() => updateQuantity(item.Id, item.cantidad + 1)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <ApperIcon name="Plus" className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.Id)}
                      className="p-2 text-red-400 hover:text-red-600 transition-colors duration-200"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-2xl font-bold gradient-text font-display">
                  ${total.toFixed(2)} MXN
                </span>
              </div>
              
              <Button
                fullWidth
                icon="CreditCard"
                onClick={handleCheckout}
              >
                Proceder al Pago
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CartSidebar