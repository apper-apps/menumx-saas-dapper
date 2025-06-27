import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import Dashboard from '@/components/pages/Dashboard'
import Menus from '@/components/pages/Menus'
import Pedidos from '@/components/pages/Pedidos'
import Resenas from '@/components/pages/Resenas'
import CodigosQR from '@/components/pages/CodigosQR'
import Clientes from '@/components/pages/Clientes'
import Reportes from '@/components/pages/Reportes'
import Configuracion from '@/components/pages/Configuracion'
import MenuPublico from '@/components/pages/MenuPublico'
import Checkout from '@/components/pages/Checkout'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/menu/:subdomain" element={<MenuPublico />} />
          <Route path="/checkout/:subdomain" element={<Checkout />} />
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/menus" element={<Menus />} />
                <Route path="/pedidos" element={<Pedidos />} />
                <Route path="/resenas" element={<Resenas />} />
                <Route path="/codigos-qr" element={<CodigosQR />} />
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/reportes" element={<Reportes />} />
                <Route path="/configuracion" element={<Configuracion />} />
              </Routes>
            </Layout>
          } />
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  )
}

export default App