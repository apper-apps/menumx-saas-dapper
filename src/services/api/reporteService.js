// Reporte Service - Gestión de reportes y análisis
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const reporteService = {
  // Obtener reporte de ventas
  async getReporteVentas(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.fechaInicio) queryParams.append('fechaInicio', params.fechaInicio);
      if (params.fechaFin) queryParams.append('fechaFin', params.fechaFin);
      if (params.periodo) queryParams.append('periodo', params.periodo);
      
      const response = await fetch(`${API_BASE_URL}/reportes/ventas?${queryParams}`, {
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
      console.error('Error al obtener reporte de ventas:', error);
      throw error;
    }
  },

  // Obtener reporte de productos más vendidos
  async getReporteProductos(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.fechaInicio) queryParams.append('fechaInicio', params.fechaInicio);
      if (params.fechaFin) queryParams.append('fechaFin', params.fechaFin);
      if (params.limite) queryParams.append('limite', params.limite);
      
      const response = await fetch(`${API_BASE_URL}/reportes/productos?${queryParams}`, {
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
      console.error('Error al obtener reporte de productos:', error);
      throw error;
    }
  },

  // Obtener reporte de clientes
  async getReporteClientes(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.fechaInicio) queryParams.append('fechaInicio', params.fechaInicio);
      if (params.fechaFin) queryParams.append('fechaFin', params.fechaFin);
      if (params.tipo) queryParams.append('tipo', params.tipo);
      
      const response = await fetch(`${API_BASE_URL}/reportes/clientes?${queryParams}`, {
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
      console.error('Error al obtener reporte de clientes:', error);
      throw error;
    }
  },

  // Obtener métricas del dashboard
  async getMetricasDashboard(periodo = '30d') {
    try {
      const response = await fetch(`${API_BASE_URL}/reportes/metricas?periodo=${periodo}`, {
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
      console.error('Error al obtener métricas:', error);
      throw error;
    }
  },

  // Exportar reporte a PDF
  async exportarReporte(tipo, params = {}) {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('tipo', tipo);
      
      Object.keys(params).forEach(key => {
        if (params[key]) {
          queryParams.append(key, params[key]);
        }
      });
      
      const response = await fetch(`${API_BASE_URL}/reportes/exportar?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('Error al exportar reporte:', error);
      throw error;
    }
  },

  // Obtener análisis de tendencias
  async getAnalisisTendencias(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.periodo) queryParams.append('periodo', params.periodo);
      if (params.categoria) queryParams.append('categoria', params.categoria);
      
      const response = await fetch(`${API_BASE_URL}/reportes/tendencias?${queryParams}`, {
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
      console.error('Error al obtener análisis de tendencias:', error);
      throw error;
    }
  }
};

export default reporteService;