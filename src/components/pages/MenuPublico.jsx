import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Button from '@/components/atoms/Button'
import SearchBar from '@/components/molecules/SearchBar'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import CartSidebar from '@/components/organisms/CartSidebar'
import ApperIcon from '@/components/ApperIcon'
import menuService from '@/services/api/menuService'
import productService from '@/services/api/productService'
import { toast } from 'react-toastify'

const MenuPublico = () => {
  const { subdomain } = useParams()
  const [menu, setMenu] = useState(null)
  const [productos, setProductos] = useState([])
  const [filteredProductos, setFilteredProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)

  const loadMenu = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Simular carga del menú público por subdominio
      const [menuData, productosData] = await Promise.all([
        menuService.getBySubdomain(subdomain),
        productService.getAll()
      ])
      
      setMenu(menuData)
      setProductos(productosData.filter(p => p.disponible))
    } catch (err) {
      setError('Error al cargar el menú')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMenu()
  }, [subdomain])

  useEffect(() => {
    let filtered = productos

    if (searchTerm) {
      filtered = filtered.filter(producto =>
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(producto => producto.categoria === selectedCategory)
    }

    setFilteredProductos(filtered)
  }, [productos, searchTerm, selectedCategory])

  const addToCart = (producto) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.Id === producto.Id)
      if (existingItem) {
        return prev.map(item =>
          item.Id === producto.Id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      }
      return [...prev, { ...producto, cantidad: 1 }]
    })
    toast.success(`${producto.nombre} agregado al carrito`)
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart(prev =>
      prev.map(item =>
        item.Id === productId ? { ...item, cantidad: newQuantity } : item
      )
    )
  }

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.Id !== productId))
  }

  const getAllCategorias = () => {
    const categorias = new Set()
    productos.forEach(producto => {
      if (producto.categoria) {
        categorias.add(producto.categoria)
      }
    })
    return Array.from(categorias)
  }

  const totalItems = cart.reduce((sum, item) => sum + item.cantidad, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Loading type="grid" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Error message={error} onRetry={loadMenu} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="ChefHat" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text font-display">
                  {menu?.nombre || 'Mi Restaurante'}
                </h1>
                <p className="text-xs text-gray-500">Menú Digital</p>
              </div>
            </div>

            <button
              onClick={() => setShowCart(true)}
              className="relative flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg"
            >
              <ApperIcon name="ShoppingCart" className="w-5 h-5" />
              <span className="font-medium">Carrito</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar productos..."
              className="flex-1"
            />
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
              <option value="all">Todas las categorías</option>
              {getAllCategorias().map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProductos.length === 0 ? (
          <Empty
            icon="Package"
            title="No hay productos disponibles"
            description="Lo sentimos, no encontramos productos que coincidan con tu búsqueda"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProductos.map((producto) => (
              <div key={producto.Id} className="bg-white rounded-xl card-shadow hover:card-shadow-lg transition-all duration-200 overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200">
                  {producto.imagen ? (
                    <img 
                      src={producto.imagen} 
                      alt={producto.nombre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ApperIcon name="ImageIcon" className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="mb-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {producto.categoria}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2 font-display">
                    {producto.nombre}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {producto.descripcion}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold gradient-text font-display">
                      ${producto.precio.toFixed(2)} MXN
                    </span>
                    
                    <Button
                      size="sm"
                      icon="Plus"
                      onClick={() => addToCart(producto)}
                    >
                      Agregar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
      />

      {/* Floating Cart Button - Mobile */}
      {totalItems > 0 && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 lg:hidden"
        >
          <div className="flex items-center space-x-2">
            <ApperIcon name="ShoppingCart" className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
              {totalItems}
            </span>
          </div>
        </button>
      )}
    </div>
  )
}

export default MenuPublico