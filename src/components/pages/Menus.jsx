import React, { useState, useEffect } from 'react'
import Button from '@/components/atoms/Button'
import SearchBar from '@/components/molecules/SearchBar'
import ProductCard from '@/components/molecules/ProductCard'
import MenuEditor from '@/components/organisms/MenuEditor'
import ProductModal from '@/components/organisms/ProductModal'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import menuService from '@/services/api/menuService'
import productService from '@/services/api/productService'
import { toast } from 'react-toastify'

const Menus = () => {
  const [menus, setMenus] = useState([])
  const [productos, setProductos] = useState([])
  const [filteredProductos, setFilteredProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMenu, setSelectedMenu] = useState(null)
  const [showMenuEditor, setShowMenuEditor] = useState(false)
  const [showProductModal, setShowProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [menusData, productosData] = await Promise.all([
        menuService.getAll(),
        productService.getAll()
      ])
      
      setMenus(menusData)
      setProductos(productosData)
      
      if (menusData.length > 0 && !selectedMenu) {
        setSelectedMenu(menusData[0])
      }
    } catch (err) {
      setError('Error al cargar los menús y productos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

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

  const handleSaveMenu = async (menuData) => {
    try {
      let savedMenu
      if (selectedMenu?.Id) {
        savedMenu = await menuService.update(selectedMenu.Id, menuData)
        setMenus(prev => prev.map(m => m.Id === selectedMenu.Id ? savedMenu : m))
        toast.success('Menú actualizado exitosamente')
      } else {
        savedMenu = await menuService.create(menuData)
        setMenus(prev => [...prev, savedMenu])
        toast.success('Menú creado exitosamente')
      }
      
      setShowMenuEditor(false)
      setSelectedMenu(savedMenu)
    } catch (err) {
      toast.error('Error al guardar el menú')
    }
  }

  const handleSaveProduct = async (productData) => {
    try {
      let savedProduct
      if (editingProduct) {
        savedProduct = await productService.update(editingProduct.Id, productData)
        setProductos(prev => prev.map(p => p.Id === editingProduct.Id ? savedProduct : p))
        toast.success('Producto actualizado exitosamente')
      } else {
        savedProduct = await productService.create(productData)
        setProductos(prev => [...prev, savedProduct])
        toast.success('Producto creado exitosamente')
      }
      
      setShowProductModal(false)
      setEditingProduct(null)
    } catch (err) {
      toast.error('Error al guardar el producto')
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await productService.delete(productId)
        setProductos(prev => prev.filter(p => p.Id !== productId))
        toast.success('Producto eliminado exitosamente')
      } catch (err) {
        toast.error('Error al eliminar el producto')
      }
    }
  }

  const handleToggleDisponible = async (productId) => {
    try {
      const producto = productos.find(p => p.Id === productId)
      const updatedProduct = await productService.update(productId, {
        ...producto,
        disponible: !producto.disponible
      })
      
      setProductos(prev => prev.map(p => p.Id === productId ? updatedProduct : p))
      toast.success(`Producto ${updatedProduct.disponible ? 'habilitado' : 'deshabilitado'}`)
    } catch (err) {
      toast.error('Error al actualizar el producto')
    }
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

  if (loading) {
    return <Loading type="grid" />
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display mb-2">
            Gestión de Menús
          </h1>
          <p className="text-gray-600">
            Administra tus menús, categorías y productos
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button
            icon="Plus"
            onClick={() => {
              setEditingProduct(null)
              setShowProductModal(true)
            }}
          >
            Nuevo Producto
          </Button>
          <Button
            variant="secondary"
            icon="Menu"
            onClick={() => {
              setSelectedMenu(null)
              setShowMenuEditor(true)
            }}
          >
            Nuevo Menú
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl card-shadow">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 font-display">Menús</h3>
            </div>
            <div className="p-4 space-y-2">
              {menus.length === 0 ? (
                <div className="text-center py-8">
                  <ApperIcon name="Menu" className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No hay menús</p>
                </div>
              ) : (
                menus.map((menu) => (
                  <button
                    key={menu.Id}
                    onClick={() => setSelectedMenu(menu)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      selectedMenu?.Id === menu.Id
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{menu.nombre}</span>
                      <div className="flex items-center space-x-2">
                        {menu.activo && (
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedMenu(menu)
                            setShowMenuEditor(true)
                          }}
                          className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
                        >
                          <ApperIcon name="Edit" className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl card-shadow">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 font-display">
                  Productos
                  {selectedMenu && (
                    <span className="ml-2 text-primary-600">
                      - {selectedMenu.nombre}
                    </span>
                  )}
                </h3>
              </div>
              
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
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
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
            
            <div className="p-6">
              {filteredProductos.length === 0 ? (
                <Empty
                  icon="Package"
                  title="No hay productos"
                  description="Agrega productos a tu menú para que los clientes puedan realizar pedidos"
                  actionText="Agregar Producto"
                  onAction={() => {
                    setEditingProduct(null)
                    setShowProductModal(true)
                  }}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProductos.map((producto) => (
                    <ProductCard
                      key={producto.Id}
                      producto={producto}
                      onEdit={(producto) => {
                        setEditingProduct(producto)
                        setShowProductModal(true)
                      }}
                      onDelete={handleDeleteProduct}
                      onToggleDisponible={handleToggleDisponible}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showMenuEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <MenuEditor
            menu={selectedMenu}
            onSave={handleSaveMenu}
            onCancel={() => {
              setShowMenuEditor(false)
              setSelectedMenu(null)
            }}
          />
        </div>
      )}

      <ProductModal
        isOpen={showProductModal}
        onClose={() => {
          setShowProductModal(false)
          setEditingProduct(null)
        }}
        producto={editingProduct}
        categorias={getAllCategorias()}
        onSave={handleSaveProduct}
      />
    </div>
  )
}

export default Menus