const mockResenas = [
  {
    Id: 1,
    cliente: 'Ana García',
    calificacion: 5,
    comentario: 'Excelente servicio y comida deliciosa. Los tacos de pastor están increíbles, definitivamente regresaré pronto.',
    fecha: new Date('2024-01-24T19:30:00'),
    respuesta: 'Muchas gracias Ana por tu comentario. Nos alegra saber que disfrutaste tu experiencia con nosotros.'
  },
  {
    Id: 2,
    cliente: 'Carlos Mendoza',
    calificacion: 4,
    comentario: 'Muy buena comida y precios justos. El ambiente es agradable, solo sugiero mejorar un poco los tiempos de entrega.',
    fecha: new Date('2024-01-23T20:15:00'),
    respuesta: ''
  },
  {
    Id: 3,
    cliente: 'María López',
    calificacion: 5,
    comentario: 'Las enchiladas verdes están espectaculares. El sabor casero y la atención al cliente son excelentes.',
    fecha: new Date('2024-01-22T18:45:00'),
    respuesta: 'Gracias María, nos esforzamos por mantener ese sabor casero que tanto nos caracteriza.'
  },
  {
    Id: 4,
    cliente: 'Roberto Silva',
    calificacion: 3,
    comentario: 'La comida está bien, pero creo que podrían mejorar la presentación de los platos. El sabor es bueno.',
    fecha: new Date('2024-01-21T21:00:00'),
    respuesta: ''
  },
  {
    Id: 5,
    cliente: 'Elena Ruiz',
    calificacion: 5,
    comentario: 'Pedí para llevar y todo llegó perfecto. El guacamole fresco y los totopos crujientes. ¡Recomendado al 100%!',
    fecha: new Date('2024-01-20T17:30:00'),
    respuesta: 'Elena, nos da mucho gusto saber que todo llegó en perfecto estado. Gracias por tu recomendación.'
  },
  {
    Id: 6,
    cliente: 'José Martínez',
    calificacion: 4,
    comentario: 'Buena relación calidad-precio. Las porciones son generosas y el sabor auténtico mexicano.',
    fecha: new Date('2024-01-19T16:15:00'),
    respuesta: ''
  },
  {
    Id: 7,
    cliente: 'Laura González',
    calificacion: 2,
    comentario: 'La comida tardó mucho en llegar y cuando llegó estaba fría. Espero puedan mejorar el servicio.',
    fecha: new Date('2024-01-18T19:45:00'),
    respuesta: ''
  },
  {
    Id: 8,
    cliente: 'Diego Ramírez',
    calificacion: 5,
    comentario: 'Simplemente perfecto. Desde el pedido hasta la entrega todo fue excelente. El flan napolitano es mi favorito.',
    fecha: new Date('2024-01-17T20:30:00'),
    respuesta: 'Diego, muchísimas gracias por tus palabras. El flan es una de nuestras especialidades favoritas también.'
  }
]

const resenaService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 400))
    return [...mockResenas]
  },

  async getById(Id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const resena = mockResenas.find(r => r.Id === Id)
    if (!resena) throw new Error('Reseña no encontrada')
    return { ...resena }
  },

  async create(resenaData) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const newResena = {
      ...resenaData,
      Id: Math.max(...mockResenas.map(r => r.Id), 0) + 1,
      fecha: new Date(),
      respuesta: ''
    }
    
    mockResenas.push(newResena)
    return { ...newResena }
  },

  async update(Id, resenaData) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = mockResenas.findIndex(r => r.Id === Id)
    if (index === -1) throw new Error('Reseña no encontrada')
    
    mockResenas[index] = { ...mockResenas[index], ...resenaData }
    return { ...mockResenas[index] }
  },

  async delete(Id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = mockResenas.findIndex(r => r.Id === Id)
    if (index === -1) throw new Error('Reseña no encontrada')
    
    const deleted = mockResenas.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default resenaService