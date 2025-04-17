import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MainContent from './components/MainContent';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="d-flex min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
                  {/* Sidebar */}
                  <Sidebar />
                  
                  <div className="flex-grow-1 d-flex flex-column" >
                    {/* Header */}
                    <Header />
                    
                    {/* Main Content */}
                    <div className="flex-grow-1 d-flex flex-column">
                      <Routes>
                        <Route path="/" element={<MainContent />} />
                        <Route path="/nodes" element={<MainContent />} />
                        <Route path="/pods" element={<MainContent />} />
                        <Route path="/history" element={<MainContent />} />
                        <Route path="/settings" element={<MainContent />} />
                        <Route path="/logout" element={<MainContent />} />
                      </Routes>
                    </div>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
