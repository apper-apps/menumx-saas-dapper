import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'

const Sidebar = () => {
  const location = useLocation()
  
  const menuItems = [
    { path: '/', icon: 'BarChart3', label: 'Dashboard' },
    { path: '/menus', icon: 'Menu', label: 'Menús' },
    { path: '/pedidos', icon: 'ShoppingCart', label: 'Pedidos' },
    { path: '/resenas', icon: 'Star', label: 'Reseñas' },
    { path: '/codigos-qr', icon: 'QrCode', label: 'Códigos QR' },
    { path: '/clientes', icon: 'Users', label: 'Clientes' },
    { path: '/reportes', icon: 'TrendingUp', label: 'Reportes' },
    { path: '/configuracion', icon: 'Settings', label: 'Configuración' }
  ]

  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 shadow-lg z-40">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="ChefHat" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text font-display">MenuMX</h1>
            <p className="text-xs text-gray-500">Plataforma SaaS</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || 
                          (item.path === '/' && location.pathname === '/dashboard')
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <ApperIcon name={item.icon} className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          )
        })}
      </nav>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
        <div className="bg-gradient-to-r from-accent-50 to-accent-100 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
              <ApperIcon name="Store" className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Mi Restaurante</p>
              <p className="text-xs text-gray-500">Administrador</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar