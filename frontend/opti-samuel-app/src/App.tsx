import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Login } from './components/Login';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';
import React from 'react';

import './App.css';
import { ConsultorioPanel } from './components/ConsultorioPanel.tsx';
import { RecepcionPanel } from './components/RecepcionPanel.tsx';
import { AdminPanel } from './components/AdminPanel.tsx';
import { Children } from 'react';

const RoleRoute = ({children,allowedRoles}: {children:React.ReactNode,allowedRoles: string[]}) => {
    const userRole = localStorage.getItem('role');

    if(!allowedRoles.includes(userRole||'')){
      return <Navigate to="/" replace/>
    }
    return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta Publica */}
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas y segmentadas por rol */}
          {/* Admin  */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                  <RoleRoute allowedRoles={['Admin','superadmin']}>
                  <AdminPanel/>
                  </RoleRoute>
              </ProtectedRoute>
            } 
          />
          {/* Recepcionista */}
          <Route
          path="/recepcion"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['recepcionista','superadmin']}>
                <RecepcionPanel/>
              </RoleRoute>
            </ProtectedRoute>
          }
          />

          {/* Optometrista */}
          <Route
            path="/consultorio"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['optometrista','superadmin']}>
                  <ConsultorioPanel/>

                </RoleRoute>
              </ProtectedRoute>
            }
            />

          {/* Ruta de redirección inteligente al entrar a "/" */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomeRedirect/>
              </ProtectedRoute>
            }
            />

          {/* Si escribes cualquier otra cosa, te devuelve al inicio */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

const HomeRedirect = () => {
  const role = localStorage.getItem('role');
  if (role === 'superadmin' || role === 'Admin') return <Navigate to="/admin" />;
  if (role === 'recepcionista') return <Navigate to="/recepcion" />;
  if (role === 'optometrista') return <Navigate to="/consultorio" />;
  return <Navigate to="/login" />;
}

export default App;