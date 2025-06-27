const mockPedidos = [
  {
    Id: 1,
    cliente: {
      nombre: 'Ana García Martínez',
      telefono: '+52 55 1234 5678',
      email: 'ana.garcia@email.com'
    },
    items: [
      { Id: 1, nombre: 'Tacos de Pastor', precio: 85.00, cantidad: 2 },
      { Id: 3, nombre: 'Agua de Horchata', precio: 25.00, cantidad: 1 }
    ],
    total: 195.00,
    tipoEntrega: 'delivery',
    direccion: 'Av. Insurgentes Sur 1234, Col. Del Valle, CDMX',
    metodoPago: 'efectivo',
    estado: 'preparando',
    fecha: new Date('2024-01-25T14:30:00'),
    notas: 'Sin cebolla en los tacos, por favor'
  },
  {
    Id: 2,
    cliente: {
      nombre: 'Carlos Mendoza López',
      telefono: '+52 55 9876 5432',
      email: 'carlos.mendoza@email.com'
    },
    items: [
      { Id: 4, nombre: 'Enchiladas Verdes', precio: 95.00, cantidad: 1 },
      { Id: 5, nombre: 'Guacamole con Totopos', precio: 55.00, cantidad: 1 }
    ],
    total: 150.00,
    tipoEntrega: 'pickup',
    metodoPago: 'paypal',
    estado: 'listo',
    fecha: new Date('2024-01-25T13:45:00'),
    notas: ''
  },
  {
    Id: 3,
    cliente: {
      nombre: 'María Elena López',
      telefono: '+52 55 5555 1111',
      email: 'maria.lopez@email.com'
    },
    items: [
      { Id: 1, nombre: 'Tacos de Pastor', precio: 85.00, cantidad: 3 },
      { Id: 2, nombre: 'Quesadillas de Queso', precio: 65.00, cantidad: 2 }
    ],
    total: 385.00,
    tipoEntrega: 'dine-in',
    metodoPago: 'stripe',
    estado: 'confirmado',
    fecha: new Date('2024-01-25T12:15:00'),
    notas: 'Mesa para 4 personas'
  },
  {
    Id: 4,
    cliente: {
      nombre: 'Roberto Silva Hernández',
      telefono: '+52 55 7777 8888',
      email: 'roberto.silva@email.com'
    },
    items: [
      { Id: 2, nombre: 'Quesadillas de Queso', precio: 65.00, cantidad: 1 },
      { Id: 3, nombre: 'Agua de Horchata', precio: 25.00, cantidad: 2 }
    ],
    total: 115.00,
    tipoEntrega: 'delivery',
    direccion: 'Calle Reforma 567, Col. Centro, CDMX',
    metodoPago: 'mercadopago',
    estado: 'entregado',
    fecha: new Date('2024-01-25T11:30:00'),
    notas: 'Dejar en recepción del edificio'
  },
  {
    Id: 5,
    cliente: {
      nombre: 'Elena Ruiz Morales',
      telefono: '+52 55 3333 4444',
      email: 'elena.ruiz@email.com'
    },
    items: [
      { Id: 4, nombre: 'Enchiladas Verdes', precio: 95.00, cantidad: 2 },
      { Id: 5, nombre: 'Guacamole con Totopos', precio: 55.00, cantidad: 1 },
      { Id: 6, nombre: 'Flan Napolitano', precio: 45.00, cantidad: 2 }
    ],
    total: 335.00,
    tipoEntrega: 'pickup',
    metodoPago: 'oxxo',
    estado: 'pendiente',
    fecha: new Date('2024-01-25T10:45:00'),
    notas: 'Llamar 10 minutos antes'
  }
]

const pedidoService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 400))
    return [...mockPedidos]
  },

  async getById(Id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const pedido = mockPedidos.find(p => p.Id === Id)
    if (!pedido) throw new Error('Pedido no encontrado')
    return { ...pedido }
  },

  async create(pedidoData) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const newPedido = {
      ...pedidoData,
      Id: Math.max(...mockPedidos.map(p => p.Id), 0) + 1,
      fecha: new Date(),
      estado: 'pendiente'
    }
    
    mockPedidos.push(newPedido)
    return { ...newPedido }
  },

  async update(Id, pedidoData) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = mockPedidos.findIndex(p => p.Id === Id)
    if (index === -1) throw new Error('Pedido no encontrado')
    
    mockPedidos[index] = { ...mockPedidos[index], ...pedidoData }
    return { ...mockPedidos[index] }
  },

  async delete(Id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = mockPedidos.findIndex(p => p.Id === Id)
    if (index === -1) throw new Error('Pedido no encontrado')
    
    const deleted = mockPedidos.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default pedidoService