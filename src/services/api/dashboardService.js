const dashboardService = {
  async getStats() {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return [
      {
        titulo: 'Ventas del Día',
        valor: '$2,847.50 MXN',
        icono: 'DollarSign',
        cambio: '+12.5%',
        tipoCambio: 'positive'
      },
      {
        titulo: 'Pedidos Hoy',
        valor: '24',
        icono: 'ShoppingCart',
        cambio: '+8.2%',
        tipoCambio: 'positive'
      },
      {
        titulo: 'Clientes Activos',
        valor: '156',
        icono: 'Users',
        cambio: '+15.3%',
        tipoCambio: 'positive'
      },
      {
        titulo: 'Reseñas Promedio',
        valor: '4.8',
        icono: 'Star',
        cambio: '+0.2',
        tipoCambio: 'positive'
      }
    ]
  },

  async getPedidosRecientes() {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return [
      {
        Id: 1,
        cliente: 'Ana García',
        total: 275.50,
        estado: 'preparando',
        tipoEntrega: 'delivery',
        fecha: new Date()
      },
      {
        Id: 2,
        cliente: 'Carlos Mendoza',
        total: 180.00,
        estado: 'listo',
        tipoEntrega: 'pickup',
        fecha: new Date(Date.now() - 30 * 60 * 1000)
      },
      {
        Id: 3,
        cliente: 'María López',
        total: 320.75,
        estado: 'confirmado',
        tipoEntrega: 'dine-in',
        fecha: new Date(Date.now() - 45 * 60 * 1000)
      },
      {
        Id: 4,
        cliente: 'Roberto Silva',
        total: 95.00,
        estado: 'entregado',
        tipoEntrega: 'delivery',
        fecha: new Date(Date.now() - 60 * 60 * 1000)
      },
      {
        Id: 5,
        cliente: 'Elena Ruiz',
        total: 450.25,
        estado: 'pendiente',
        tipoEntrega: 'pickup',
        fecha: new Date(Date.now() - 90 * 60 * 1000)
      }
    ]
  }
}

export default dashboardService