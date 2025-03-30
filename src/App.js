import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MainContent from './components/MainContent';

function App() {
  return (
    <Router>
      <div className="d-flex min-vh-100">
        {/* Sidebar */}
        <Sidebar />
        
        <div className="flex-grow-1 d-flex flex-column" style={{ backgroundColor: '#f8f9fa' }}>
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
    </Router>
  );
}
export default App;
