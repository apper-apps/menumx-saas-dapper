const mockProductos = [
  {
    Id: 1,
    nombre: 'Tacos de Pastor',
    descripcion: 'Deliciosos tacos de pastor con piña, cebolla y cilantro. Acompañados de salsa verde y roja.',
    precio: 85.00,
    categoria: 'Platos Principales',
    imagen: 'https://images.unsplash.com/photo-1565299585323-38174c4a6471?w=400',
    disponible: true,
    fechaCreacion: new Date('2024-01-10')
  },
  {
    Id: 2,
    nombre: 'Quesadillas de Queso',
    descripcion: 'Quesadillas tradicionales con queso Oaxaca derretido, servidas con guacamole y crema.',
    precio: 65.00,
    categoria: 'Entradas',
    imagen: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=400',
    disponible: true,
    fechaCreacion: new Date('2024-01-12')
  },
  {
    Id: 3,
    nombre: 'Agua de Horchata',
    descripcion: 'Refrescante agua de horchata tradicional, endulzada naturalmente con canela y vainilla.',
    precio: 25.00,
    categoria: 'Bebidas',
    imagen: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',
    disponible: true,
    fechaCreacion: new Date('2024-01-15')
  },
  {
    Id: 4,
    nombre: 'Enchiladas Verdes',
    descripcion: 'Enchiladas bañadas en salsa verde con pollo deshebrado, queso fresco y crema. Acompañadas de frijoles.',
    precio: 95.00,
    categoria: 'Platos Principales',
    imagen: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c75f?w=400',
    disponible: true,
    fechaCreacion: new Date('2024-01-18')
  },
  {
    Id: 5,
    nombre: 'Guacamole con Totopos',
    descripcion: 'Guacamole fresco preparado al momento con aguacate, jitomate, cebolla y cilantro. Servido con totopos.',
    precio: 55.00,
    categoria: 'Entradas',
    imagen: 'https://images.unsplash.com/photo-1553821173-d5c8e59d1e88?w=400',
    disponible: true,
    fechaCreacion: new Date('2024-01-20')
  },
  {
    Id: 6,
    nombre: 'Flan Napolitano',
    descripcion: 'Postre tradicional mexicano con textura cremosa y caramelo líquido, decorado con cereza.',
    precio: 45.00,
    categoria: 'Postres',
    imagen: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400',
    disponible: false,
    fechaCreacion: new Date('2024-01-22')
  }
]

const productService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 400))
    return [...mockProductos]
  },

  async getById(Id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const producto = mockProductos.find(p => p.Id === Id)
    if (!producto) throw new Error('Producto no encontrado')
    return { ...producto }
  },

  async create(productData) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const newProduct = {
      ...productData,
      Id: Math.max(...mockProductos.map(p => p.Id), 0) + 1,
      fechaCreacion: new Date()
    }
    
    mockProductos.push(newProduct)
    return { ...newProduct }
  },

  async update(Id, productData) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = mockProductos.findIndex(p => p.Id === Id)
    if (index === -1) throw new Error('Producto no encontrado')
    
    mockProductos[index] = { ...mockProductos[index], ...productData }
    return { ...mockProductos[index] }
  },

  async delete(Id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = mockProductos.findIndex(p => p.Id === Id)
    if (index === -1) throw new Error('Producto no encontrado')
    
    const deleted = mockProductos.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default productService