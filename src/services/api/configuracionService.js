// Configuración Service - Gestión de configuraciones del sistema
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const configuracionService = {
  // Obtener todas las configuraciones
  async getConfiguraciones() {
    try {
      const response = await fetch(`${API_BASE_URL}/configuraciones`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener configuraciones:', error);
      throw error;
    }
  },

  // Obtener configuración por clave
  async getConfiguracion(clave) {
    try {
      const response = await fetch(`${API_BASE_URL}/configuraciones/${clave}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener configuración:', error);
      throw error;
    }
  },

  // Actualizar configuración
  async updateConfiguracion(clave, valor) {
    try {
      const response = await fetch(`${API_BASE_URL}/configuraciones/${clave}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({ valor })
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al actualizar configuración:', error);
      throw error;
    }
  },

  // Actualizar múltiples configuraciones
  async updateConfiguraciones(configuraciones) {
    try {
      const response = await fetch(`${API_BASE_URL}/configuraciones/batch`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({ configuraciones })
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al actualizar configuraciones:', error);
      throw error;
    }
  },

  // Obtener configuraciones de la empresa/negocio
  async getConfiguracionEmpresa() {
    try {
      const response = await fetch(`${API_BASE_URL}/configuraciones/empresa`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener configuración de empresa:', error);
      throw error;
    }
  },

  // Actualizar configuraciones de la empresa
  async updateConfiguracionEmpresa(configuracionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/configuraciones/empresa`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(configuracionData)
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al actualizar configuración de empresa:', error);
      throw error;
    }
  },

  // Obtener configuraciones de notificaciones
  async getConfiguracionNotificaciones() {
    try {
      const response = await fetch(`${API_BASE_URL}/configuraciones/notificaciones`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener configuración de notificaciones:', error);
      throw error;
    }
  },

  // Actualizar configuraciones de notificaciones
  async updateConfiguracionNotificaciones(notificacionesData) {
    try {
      const response = await fetch(`${API_BASE_URL}/configuraciones/notificaciones`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(notificacionesData)
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al actualizar configuración de notificaciones:', error);
      throw error;
    }
  },

  // Resetear configuraciones a valores por defecto
  async resetConfiguraciones() {
    try {
      const response = await fetch(`${API_BASE_URL}/configuraciones/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al resetear configuraciones:', error);
      throw error;
    }
  }
};

export default configuracionService;