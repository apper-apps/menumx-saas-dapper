const mockCodigos = [
  {
    Id: 1,
    nombre: 'Menú Principal - 25 Ene 2024',
    tipo: 'menu',
    url: 'https://menumx.com/mi-restaurante',
    imagen: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzAwMCIvPgogIDxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIxNjAiIGZpbGw9IiNmZmYiLz4KICA8dGV4dCB4PSIxMDAiIHk9IjEwNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMDAwIj5RUiBDb2RlPC90ZXh0Pgo8L3N2Zz4K',
    fechaCreacion: new Date('2024-01-25T10:00:00'),
    escaneos: 45,
    vistas: 128
  },
  {
    Id: 2,
    nombre: 'Código para Mesa 5',
    tipo: 'menu',
    url: 'https://menumx.com/mi-restaurante?mesa=5',
    imagen: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzAwMCIvPgogIDxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIxNjAiIGZpbGw9IiNmZmYiLz4KICA8dGV4dCB4PSIxMDAiIHk9Ijk1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMwMDAiPlFSIENvZGU8L3RleHQ+CiAgPHRleHQgeD0iMTAwIiB5PSIxMTUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzAwMCI+TWVzYSA1PC90ZXh0Pgo8L3N2Zz4K',
    fechaCreacion: new Date('2024-01-20T15:30:00'),
    escaneos: 12,
    vistas: 34
  },
  {
    Id: 3,
    nombre: 'Reseñas y Opiniones',
    tipo: 'reviews',
    url: 'https://menumx.com/mi-restaurante/reviews',
    imagen: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzAwMCIvPgogIDxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIxNjAiIGZpbGw9IiNmZmYiLz4KICA8dGV4dCB4PSIxMDAiIHk9Ijk1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMwMDAiPlFSIENvZGU8L3RleHQ+CiAgPHRleHQgeD0iMTAwIiB5PSIxMTUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzAwMCI+UmVzZcOxYXM8L3RleHQ+Cjwvc3ZnPgo=',
    fechaCreacion: new Date('2024-01-18T12:00:00'),
    escaneos: 28,
    vistas: 67
  }
]

const qrService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 400))
    return [...mockCodigos]
  },

  async getById(Id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const codigo = mockCodigos.find(c => c.Id === Id)
    if (!codigo) throw new Error('Código QR no encontrado')
    return { ...codigo }
  },

  async generar(qrData) {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const newCodigo = {
      ...qrData,
      Id: Math.max(...mockCodigos.map(c => c.Id), 0) + 1,
      imagen: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzAwMCIvPgogIDxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIxNjAiIGZpbGw9IiNmZmYiLz4KICA8dGV4dCB4PSIxMDAiIHk9IjEwNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMDAwIj5RUiBDb2RlPC90ZXh0Pgo8L3N2Zz4K',
      fechaCreacion: new Date(),
      escaneos: 0,
      vistas: 0
    }
    
    mockCodigos.unshift(newCodigo)
    return { ...newCodigo }
  },

  async descargar(Id, formato) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const codigo = mockCodigos.find(c => c.Id === Id)
    if (!codigo) throw new Error('Código QR no encontrado')
    
    // Simular descarga de archivo
    const content = `Código QR descargado en formato ${formato.toUpperCase()}`
    const blob = new Blob([content], { type: `application/${formato}` })
    
    return blob
  },

  async delete(Id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = mockCodigos.findIndex(c => c.Id === Id)
    if (index === -1) throw new Error('Código QR no encontrado')
    
    const deleted = mockCodigos.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default qrService