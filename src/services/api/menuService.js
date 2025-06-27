const mockMenus = [
  {
    Id: 1,
    nombre: 'Menú Principal',
    descripcion: 'Nuestro menú completo con todos los platillos disponibles',
    activo: true,
    categorias: ['Entradas', 'Platos Principales', 'Postres', 'Bebidas'],
    fechaCreacion: new Date('2024-01-15'),
    establecimientoId: 'mi-restaurante'
  },
  {
    Id: 2,
    nombre: 'Menú Ejecutivo',
    descripcion: 'Menú especial para comidas de trabajo',
    activo: false,
    categorias: ['Comidas Ejecutivas', 'Bebidas'],
    fechaCreacion: new Date('2024-02-01'),
    establecimientoId: 'mi-restaurante'
  }
]

const menuService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 400))
    return [...mockMenus]
  },

  async getById(Id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const menu = mockMenus.find(m => m.Id === Id)
    if (!menu) throw new Error('Menú no encontrado')
    return { ...menu }
  },

  async getBySubdomain(subdomain) {
    await new Promise(resolve => setTimeout(resolve, 300))
    // Simular búsqueda por subdominio
    return {
      Id: 1,
      nombre: 'Mi Restaurante',
      subdomain: subdomain,
      activo: true
    }
  },

  async create(menuData) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const newMenu = {
      ...menuData,
      Id: Math.max(...mockMenus.map(m => m.Id), 0) + 1,
      fechaCreacion: new Date(),
      establecimientoId: 'mi-restaurante'
    }
    
    mockMenus.push(newMenu)
    return { ...newMenu }
  },

  async update(Id, menuData) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = mockMenus.findIndex(m => m.Id === Id)
    if (index === -1) throw new Error('Menú no encontrado')
    
    mockMenus[index] = { ...mockMenus[index], ...menuData }
    return { ...mockMenus[index] }
  },

  async delete(Id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = mockMenus.findIndex(m => m.Id === Id)
    if (index === -1) throw new Error('Menú no encontrado')
    
    const deleted = mockMenus.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default menuService